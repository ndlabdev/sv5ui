import { describe, expect, it } from 'vitest'
import {
    clamp,
    collapsePane,
    defaultSizes,
    expandPane,
    isCollapsed,
    clampLayout,
    paneIds,
    parseStoredLayout,
    reconcileSizes,
    resetPair,
    normalizeSizes,
    resizeAt,
    resolveConstraints,
    setPaneSize,
    sizesEqual,
    toPercent,
    type PaneConstraint
} from './resizable.utils.js'

const open = (overrides: Partial<PaneConstraint> = {}): PaneConstraint => ({
    min: 0,
    max: 100,
    collapsible: false,
    collapsedSize: 0,
    locked: false,
    ...overrides
})

const total = (sizes: number[]) => sizes.reduce((sum, size) => sum + size, 0)

describe('resizable constraints', () => {
    it('clamps values into range', () => {
        expect(clamp(120, 0, 100)).toBe(100)
        expect(clamp(-5, 0, 100)).toBe(0)
    })

    it('converts pixel constraints against the container', () => {
        expect(toPercent('200px', 800)).toBe(25)
        expect(toPercent(30, 800)).toBe(30)
        expect(toPercent(undefined, 800)).toBeNull()
    })

    it('falls back when the container has no size yet', () => {
        expect(toPercent('200px', 0)).toBeNull()
    })

    it('resolves defaults for an unconstrained pane', () => {
        expect(resolveConstraints([{}], 800)[0]).toEqual({
            min: 0,
            max: 100,
            collapsible: false,
            collapsedSize: 0,
            locked: false
        })
    })

    it('keeps the collapsed size at or below the minimum', () => {
        const [constraint] = resolveConstraints(
            [{ minSize: 10, collapsible: true, collapsedSize: 25 }],
            800
        )

        expect(constraint.collapsedSize).toBe(10)
    })

    it('never lets the maximum fall below the minimum', () => {
        const [constraint] = resolveConstraints([{ minSize: 40, maxSize: 20 }], 800)

        expect(constraint.max).toBe(40)
    })
})

describe('resizable sizing', () => {
    it('spreads the remaining space across panes without a default', () => {
        expect(defaultSizes([{ defaultSize: 50 }, {}, {}])).toEqual([50, 25, 25])
    })

    it('normalizes sizes that do not add up to 100', () => {
        expect(normalizeSizes([1, 1])).toEqual([50, 50])
        expect(total(normalizeSizes([30, 30, 30]))).toBeCloseTo(100)
    })

    it('accepts a stored layout that still matches the pane ids', () => {
        expect(parseStoredLayout({ ids: ['a', 'b'], sizes: [40, 60] }, ['a', 'b'])).toEqual([
            40, 60
        ])
    })

    it('rejects a stored layout from a different set of panes', () => {
        expect(parseStoredLayout({ ids: ['a', 'b'], sizes: [40, 60] }, ['a', 'c'])).toBeNull()
        expect(parseStoredLayout({ ids: ['a'], sizes: [100] }, ['a', 'b'])).toBeNull()
    })

    it('rejects stored sizes that are not a usable layout', () => {
        expect(parseStoredLayout({ ids: ['a', 'b'], sizes: [40, 40] }, ['a', 'b'])).toBeNull()
        expect(
            parseStoredLayout({ ids: ['a', 'b'], sizes: [Number.NaN, 100] }, ['a', 'b'])
        ).toBeNull()
        expect(parseStoredLayout({ ids: ['a', 'b'] }, ['a', 'b'])).toBeNull()
        expect(parseStoredLayout([40, 60], ['a', 'b'])).toBeNull()
        expect(parseStoredLayout(null, ['a', 'b'])).toBeNull()
    })

    it('reads the pane ids in order', () => {
        expect(paneIds([{ id: 'a' }, { id: 'b' }])).toEqual(['a', 'b'])
    })

    it('compares layouts within a tolerance', () => {
        expect(sizesEqual([50, 50], [50.005, 49.995])).toBe(true)
        expect(sizesEqual([50, 50], [60, 40])).toBe(false)
    })
})

describe('resizable dragging', () => {
    const constraints = [open(), open()]

    it('moves space from one pane to its neighbour', () => {
        expect(resizeAt([50, 50], 0, 10, constraints)).toEqual([60, 40])
    })

    it('moves space back when dragging the other way', () => {
        expect(resizeAt([50, 50], 0, -10, constraints)).toEqual([40, 60])
    })

    it('keeps the total at 100', () => {
        expect(total(resizeAt([50, 50], 0, 33, constraints))).toBeCloseTo(100)
        expect(total(resizeAt([20, 30, 50], 1, -12, [open(), open(), open()]))).toBeCloseTo(100)
    })

    it('stops at the neighbour minimum', () => {
        const next = resizeAt([50, 50], 0, 40, [open(), open({ min: 20 })])

        expect(next).toEqual([80, 20])
    })

    it('stops at the maximum of the growing pane', () => {
        const next = resizeAt([50, 50], 0, 40, [open({ max: 70 }), open()])

        expect(next).toEqual([70, 30])
    })

    it('cascades into the next pane once the neighbour is at its minimum', () => {
        const next = resizeAt([20, 30, 50], 0, 40, [open(), open({ min: 10 }), open({ min: 10 })])

        expect(next[1]).toBe(10)
        expect(next[2]).toBeCloseTo(30)
        expect(next[0]).toBeCloseTo(60)
    })

    it('cascades backwards when dragging towards the start', () => {
        const next = resizeAt([30, 30, 40], 1, -40, [open({ min: 10 }), open({ min: 10 }), open()])

        expect(next[1]).toBe(10)
        expect(next[0]).toBeCloseTo(10)
        expect(next[2]).toBeCloseTo(80)
    })

    it('ignores a drag on a handle that does not exist', () => {
        expect(resizeAt([50, 50], 1, 10, constraints)).toEqual([50, 50])
        expect(resizeAt([50, 50], 0, 0, constraints)).toEqual([50, 50])
    })
})

describe('resizable collapsing', () => {
    const collapsible = [open(), open({ min: 20, collapsible: true })]

    it('collapses a neighbour dragged well past its minimum', () => {
        const next = resizeAt([50, 50], 0, 45, collapsible)

        expect(next[1]).toBe(0)
        expect(next[0]).toBe(100)
    })

    it('holds at the minimum for a small overshoot', () => {
        const next = resizeAt([50, 50], 0, 35, collapsible)

        expect(next[1]).toBe(20)
    })

    it('does not collapse a pane that is not collapsible', () => {
        const next = resizeAt([50, 50], 0, 45, [open(), open({ min: 20 })])

        expect(next[1]).toBe(20)
    })

    it('expands a collapsed pane once the drag passes halfway', () => {
        const next = resizeAt([100, 0], 0, -15, collapsible)

        expect(next[1]).toBe(20)
    })

    it('keeps a collapsed pane collapsed for a small drag', () => {
        const next = resizeAt([100, 0], 0, -5, collapsible)

        expect(next[1]).toBe(0)
    })

    it('reports the collapsed state', () => {
        expect(isCollapsed(0, collapsible[1])).toBe(true)
        expect(isCollapsed(20, collapsible[1])).toBe(false)
        expect(isCollapsed(0, open())).toBe(false)
    })
})

describe('resizable api helpers', () => {
    const constraints = [open(), open({ min: 20, collapsible: true }), open()]

    it('sets one pane to an exact size', () => {
        const next = setPaneSize([40, 30, 30], 0, 60, constraints)

        expect(next[0]).toBeCloseTo(60)
        expect(total(next)).toBeCloseTo(100)
    })

    it('sets the size of the last pane', () => {
        const next = setPaneSize([40, 30, 30], 2, 50, constraints)

        expect(next[2]).toBeCloseTo(50)
        expect(total(next)).toBeCloseTo(100)
    })

    it('collapses and expands a pane through the helpers', () => {
        const collapsed = collapsePane([40, 30, 30], 1, constraints)

        expect(collapsed[1]).toBe(0)
        expect(total(collapsed)).toBeCloseTo(100)

        const expanded = expandPane(collapsed, 1, constraints, 30)

        expect(expanded[1]).toBeCloseTo(30)
        expect(total(expanded)).toBeCloseTo(100)
    })

    it('refuses to collapse a pane that is not collapsible', () => {
        expect(collapsePane([40, 30, 30], 0, constraints)).toEqual([40, 30, 30])
    })
})

describe('resizable reconciliation', () => {
    it('keeps the sizes of panes that are still there', () => {
        const next = reconcileSizes(['a', 'b'], [30, 70], [{ id: 'a' }, { id: 'b' }])

        expect(next).toEqual([30, 70])
    })

    it('gives a new pane its default and rescales the rest', () => {
        const next = reconcileSizes(
            ['a', 'b'],
            [30, 70],
            [{ id: 'a' }, { id: 'b' }, { id: 'c', defaultSize: 25 }]
        )

        expect(total(next)).toBeCloseTo(100)
        expect(next[2]).toBeCloseTo(20, 0)
        expect(next[0]).toBeLessThan(30)
    })

    it('spreads the space of a removed pane over the survivors', () => {
        const next = reconcileSizes(['a', 'b', 'c'], [20, 30, 50], [{ id: 'a' }, { id: 'c' }])

        expect(total(next)).toBeCloseTo(100)
        expect(next[0] / next[1]).toBeCloseTo(20 / 50, 1)
    })

    it('falls back to an even share for a new pane without a default', () => {
        const next = reconcileSizes([], [], [{ id: 'a' }, { id: 'b' }])

        expect(next).toEqual([50, 50])
    })
})

describe('resizable clamping', () => {
    it('leaves a valid layout untouched', () => {
        expect(clampLayout([50, 50], [open(), open()])).toEqual([50, 50])
    })

    it('pulls a pane back up to a minimum that grew', () => {
        const next = clampLayout([10, 90], [open({ min: 30 }), open()])

        expect(next[0]).toBeCloseTo(30)
        expect(total(next)).toBeCloseTo(100)
    })

    it('pushes a pane back down to a maximum that shrank', () => {
        const next = clampLayout([80, 20], [open({ max: 50 }), open()])

        expect(next[0]).toBeCloseTo(50)
        expect(total(next)).toBeCloseTo(100)
    })

    it('leaves a collapsed pane collapsed', () => {
        const next = clampLayout([0, 100], [open({ min: 30, collapsible: true }), open()])

        expect(next[0]).toBe(0)
        expect(next[1]).toBe(100)
    })
})

describe('resizable pair reset', () => {
    const constraints = [open(), open(), open()]

    it('restores the split of the pair without touching the others', () => {
        const next = resetPair([70, 10, 20], 0, [30, 50, 20], constraints)

        expect(next[0]).toBeCloseTo(30)
        expect(next[1]).toBeCloseTo(50)
        expect(next[2]).toBe(20)
    })

    it('respects the constraints of both panes in the pair', () => {
        const next = resetPair([70, 30], 0, [10, 90], [open({ min: 40 }), open()])

        expect(next[0]).toBeCloseTo(40)
        expect(next[1]).toBeCloseTo(60)
    })

    it('never lets the second pane fall below its minimum', () => {
        const next = resetPair([20, 80], 0, [90, 10], [open(), open({ min: 30 })])

        expect(next[1]).toBeCloseTo(30)
        expect(next[0]).toBeCloseTo(70)
    })

    it('ignores a handle index outside the group', () => {
        expect(resetPair([50, 50], 1, [50, 50], constraints)).toEqual([50, 50])
    })
})

describe('resizable locking', () => {
    it('refuses a drag on a handle next to a locked pane', () => {
        const locked = [open(), open({ locked: true }), open()]

        expect(resizeAt([30, 40, 30], 0, 20, locked)).toEqual([30, 40, 30])
        expect(resizeAt([30, 40, 30], 1, -20, locked)).toEqual([30, 40, 30])
    })

    it('never takes space from a locked pane when a drag cascades', () => {
        const locked = [open(), open(), open({ locked: true }), open()]
        const next = resizeAt([25, 25, 25, 25], 0, 40, locked)

        expect(next[2]).toBe(25)
        expect(next[1]).toBeCloseTo(0)
        expect(next[3]).toBeCloseTo(10)
        expect(total(next)).toBeCloseTo(100)
    })

    it('leaves a locked pane out of a clamp pass', () => {
        const next = clampLayout([10, 90], [open({ min: 30, locked: true }), open()])

        expect(next[0]).toBe(10)
    })
})
