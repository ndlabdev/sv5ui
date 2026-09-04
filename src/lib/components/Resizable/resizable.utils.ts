export interface PaneConstraint {
    min: number
    max: number
    collapsible: boolean
    collapsedSize: number
    locked: boolean
}

export interface PaneConstraintInput {
    minSize?: number | string
    maxSize?: number | string
    collapsible?: boolean
    collapsedSize?: number
    defaultSize?: number
    resizable?: boolean
}

const EPSILON = 0.01

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

export function toPercent(
    value: number | string | undefined,
    containerSize: number
): number | null {
    if (value === undefined) return null
    if (typeof value === 'number') return value

    const pixels = Number.parseFloat(value)
    if (!Number.isFinite(pixels) || containerSize <= 0) return null

    return (pixels / containerSize) * 100
}

export function resolveConstraints(
    panes: PaneConstraintInput[],
    containerSize: number
): PaneConstraint[] {
    return panes.map((pane) => {
        const collapsedSize = Math.max(0, pane.collapsedSize ?? 0)
        const min = clamp(toPercent(pane.minSize, containerSize) ?? 0, 0, 100)
        const max = clamp(toPercent(pane.maxSize, containerSize) ?? 100, min, 100)

        return {
            min,
            max,
            collapsible: pane.collapsible === true,
            collapsedSize: Math.min(collapsedSize, min),
            locked: pane.resizable === false
        }
    })
}

export function normalizeSizes(sizes: number[]): number[] {
    const total = sizes.reduce((sum, size) => sum + size, 0)
    if (total <= 0) return sizes.map(() => 100 / Math.max(1, sizes.length))

    return sizes.map((size) => (size / total) * 100)
}

export function defaultSizes(panes: PaneConstraintInput[]): number[] {
    const declared = panes.reduce((sum, pane) => sum + (pane.defaultSize ?? 0), 0)
    const missing = panes.filter((pane) => pane.defaultSize === undefined).length
    const rest = missing > 0 ? Math.max(0, 100 - declared) / missing : 0

    return normalizeSizes(panes.map((pane) => pane.defaultSize ?? rest))
}

export interface StoredLayout {
    ids: string[]
    sizes: number[]
}

function isSizeList(value: unknown, count: number): value is number[] {
    if (!Array.isArray(value) || value.length !== count) return false
    if (!value.every((size) => typeof size === 'number' && Number.isFinite(size) && size >= 0)) {
        return false
    }

    return Math.abs(value.reduce((sum, size) => sum + size, 0) - 100) < 1
}

export function parseStoredLayout(value: unknown, ids: string[]): number[] | null {
    if (typeof value !== 'object' || value === null) return null

    const layout = value as Partial<StoredLayout>
    if (!Array.isArray(layout.ids) || layout.ids.length !== ids.length) return null
    if (!layout.ids.every((id, index) => id === ids[index])) return null
    if (!isSizeList(layout.sizes, ids.length)) return null

    return layout.sizes
}

export function reconcileSizes(
    previousIds: string[],
    previousSizes: number[],
    panes: (PaneConstraintInput & { id: string })[]
): number[] {
    const previous = new Map(previousIds.map((id, index) => [id, previousSizes[index]]))
    const fallback = 100 / Math.max(1, panes.length)

    return normalizeSizes(
        panes.map((pane) => previous.get(pane.id) ?? pane.defaultSize ?? fallback)
    )
}

export function clampLayout(sizes: number[], constraints: PaneConstraint[]): number[] {
    const next = sizes.map((size, index) => {
        const constraint = constraints[index]
        if (isCollapsed(size, constraint) || constraint.locked) return size

        return clamp(size, constraint.min, constraint.max)
    })

    const movable = next
        .map((size, index) => index)
        .filter(
            (index) => !isCollapsed(next[index], constraints[index]) && !constraints[index].locked
        )
    const residue = 100 - next.reduce((sum, size) => sum + size, 0)
    if (Math.abs(residue) <= EPSILON) return next

    if (residue > 0) giveTo(next, movable, residue, constraints)
    else takeFrom(next, movable, -residue, constraints)

    return next
}

export function isCollapsed(size: number, constraint: PaneConstraint): boolean {
    return constraint.collapsible && size <= constraint.collapsedSize + EPSILON
}

function shrinkOrder(sizes: number[], index: number, delta: number): number[] {
    const order: number[] = []
    if (delta > 0) for (let i = index + 1; i < sizes.length; i += 1) order.push(i)
    else for (let i = index; i >= 0; i -= 1) order.push(i)

    return order
}

function takeFrom(
    sizes: number[],
    order: number[],
    budget: number,
    constraints: PaneConstraint[]
): number {
    let remaining = budget
    let taken = 0

    for (const index of order) {
        if (remaining <= EPSILON) break
        if (constraints[index].locked) continue

        const available = Math.max(0, sizes[index] - constraints[index].min)
        const used = Math.min(available, remaining)
        sizes[index] -= used
        remaining -= used
        taken += used
    }

    return taken
}

function giveTo(
    sizes: number[],
    order: number[],
    budget: number,
    constraints: PaneConstraint[]
): number {
    let remaining = budget
    let given = 0

    for (const index of order) {
        if (remaining <= EPSILON) break
        if (constraints[index].locked) continue

        const room = Math.max(0, constraints[index].max - sizes[index])
        const used = Math.min(room, remaining)
        sizes[index] += used
        remaining -= used
        given += used
    }

    return given
}

function tryCollapse(
    sizes: number[],
    index: number | undefined,
    constraints: PaneConstraint[],
    leftover: number
): number {
    if (index === undefined) return 0

    const constraint = constraints[index]
    const gap = constraint.min - constraint.collapsedSize
    if (!constraint.collapsible || gap <= 0) return 0
    if (sizes[index] > constraint.min + EPSILON) return 0
    if (leftover < gap / 2) return 0

    sizes[index] = constraint.collapsedSize

    return gap
}

function requestedGrowth(current: number, delta: number, constraint: PaneConstraint): number {
    const amount = Math.abs(delta)
    const gap = constraint.min - current
    if (!isCollapsed(current, constraint) || gap <= 0) return amount
    if (amount < gap / 2) return 0

    return Math.max(amount, gap)
}

function settleGrow(
    sizes: number[],
    grow: number,
    constraint: PaneConstraint,
    donor: number | undefined
) {
    const size = sizes[grow]
    if (size >= constraint.min - EPSILON || size <= constraint.collapsedSize + EPSILON) return
    if (donor === undefined) return

    sizes[donor] += size - constraint.collapsedSize
    sizes[grow] = constraint.collapsedSize
}

export function resizeAt(
    sizes: number[],
    index: number,
    delta: number,
    constraints: PaneConstraint[]
): number[] {
    if (index < 0 || index >= sizes.length - 1 || delta === 0) return [...sizes]
    if (constraints[index].locked || constraints[index + 1].locked) return [...sizes]

    const next = [...sizes]
    const grow = delta > 0 ? index : index + 1
    const order = shrinkOrder(next, index, delta)
    const constraint = constraints[grow]
    const wanted = requestedGrowth(next[grow], delta, constraint)
    const budget = Math.min(wanted, Math.max(0, constraint.max - next[grow]))
    if (budget <= 0) return next

    const taken = takeFrom(next, order, budget, constraints)
    const collapsed = tryCollapse(next, order[0], constraints, budget - taken)

    next[grow] += taken + collapsed
    settleGrow(next, grow, constraint, order[0])

    return next
}

export function setPaneSize(
    sizes: number[],
    index: number,
    size: number,
    constraints: PaneConstraint[]
): number[] {
    const target = clamp(size, 0, 100)
    const diff = target - sizes[index]
    if (Math.abs(diff) < EPSILON) return [...sizes]
    if (index === sizes.length - 1) return resizeAt(sizes, index - 1, -diff, constraints)

    return resizeAt(sizes, index, diff, constraints)
}

export function collapsePane(
    sizes: number[],
    index: number,
    constraints: PaneConstraint[]
): number[] {
    const constraint = constraints[index]
    const next = [...sizes]
    if (!constraint.collapsible) return next

    const freed = next[index] - constraint.collapsedSize
    if (freed <= EPSILON) return next

    const neighbour = index === next.length - 1 ? index - 1 : index + 1
    next[index] = constraint.collapsedSize
    next[neighbour] += freed

    return next
}

export function expandPane(
    sizes: number[],
    index: number,
    constraints: PaneConstraint[],
    previous?: number
): number[] {
    const constraint = constraints[index]
    const next = [...sizes]
    const target = Math.max(previous ?? constraint.min, constraint.min)
    const needed = target - next[index]
    if (needed <= EPSILON) return next

    const order = shrinkOrder(
        next,
        index === next.length - 1 ? index - 1 : index,
        index === next.length - 1 ? -1 : 1
    )
    next[index] += takeFrom(
        next,
        order.filter((candidate) => candidate !== index),
        needed,
        constraints
    )

    return next
}

export function resetPair(
    sizes: number[],
    index: number,
    defaults: number[],
    constraints: PaneConstraint[]
): number[] {
    if (index < 0 || index >= sizes.length - 1) return [...sizes]

    const next = [...sizes]
    const pairTotal = next[index] + next[index + 1]
    const first = clamp(
        defaults[index],
        constraints[index].min,
        Math.min(constraints[index].max, pairTotal - constraints[index + 1].min)
    )

    next[index] = first
    next[index + 1] = pairTotal - first

    return next
}

export function paneIds(panes: { id: string }[]): string[] {
    return panes.map((pane) => pane.id)
}

export function sizesEqual(a: number[], b: number[], tolerance = EPSILON): boolean {
    if (a.length !== b.length) return false

    return a.every((size, index) => Math.abs(size - b[index]) <= tolerance)
}
