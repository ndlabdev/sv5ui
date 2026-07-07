import type {
    TourController,
    TourPersistOptions,
    TourStep,
    UseTourOptions
} from '../../components/Tour/tour.types.js'

type ResolvedPersist = Required<TourPersistOptions>

function normalizePersist(persist: UseTourOptions['persist']): ResolvedPersist | null {
    if (!persist) return null
    const opts = persist === true ? {} : persist
    return { key: opts.key ?? 'sv5ui-tour', storage: opts.storage ?? 'local' }
}

/**
 * Headless controller for the {@link import('../../components/Tour/tour.types.js').TourProps Tour}
 * component. Pure reactive state — no `$effect` — so it is safe to create
 * conditionally and renders nothing on the server.
 *
 * Drive the tour through the returned {@link TourController}, and pass it to
 * `<Tour controller={tour} />`. Persistence (when enabled) keeps an in-progress
 * tour alive across reloads and SPA navigations, which is what makes multi-page
 * tours possible.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useTour, Tour } from 'sv5ui'
 *   import { goto } from '$app/navigation'
 *
 *   const tour = useTour({
 *     steps,
 *     persist: true,
 *     onStepChange: (i) => { if (steps[i].route) goto(steps[i].route) }
 *   })
 * </script>
 *
 * <Button onclick={() => tour.start()}>Start</Button>
 * <Tour {steps} controller={tour} />
 * ```
 */
export function useTour(options: UseTourOptions): TourController {
    const defaultStep = options.defaultStep ?? 0
    const persist = normalizePersist(options.persist)

    let open = $state(false)
    let index = $state(defaultStep)
    let completed = false

    function getSteps(): TourStep[] {
        return options.steps
    }

    function clamp(i: number): number {
        const last = getSteps().length - 1
        if (last < 0) return 0
        return Math.max(0, Math.min(i, last))
    }

    function resolveIndex(step: number | string): number {
        if (typeof step === 'number') return clamp(step)
        const found = getSteps().findIndex((s) => s.id === step)
        return found >= 0 ? found : index
    }

    function nextEnabled(from: number, dir: 1 | -1): number | null {
        const steps = getSteps()
        let i = from + dir
        while (i >= 0 && i < steps.length) {
            if (!steps[i]?.disabled) return i
            i += dir
        }
        return null
    }

    function firstEnabled(from: number): number {
        if (!getSteps()[from]?.disabled) return from
        return nextEnabled(from, 1) ?? nextEnabled(from, -1) ?? from
    }

    function persistSave() {
        if (!persist || typeof window === 'undefined') return
        try {
            const store = persist.storage === 'session' ? sessionStorage : localStorage
            if (open) {
                store.setItem(persist.key, JSON.stringify({ open: true, index }))
            } else {
                store.removeItem(persist.key)
            }
        } catch {
            void 0
        }
    }

    if (persist && typeof window !== 'undefined') {
        try {
            const store = persist.storage === 'session' ? sessionStorage : localStorage
            const raw = store.getItem(persist.key)
            if (raw) {
                const parsed = JSON.parse(raw) as { open?: boolean; index?: number }
                if (parsed?.open) {
                    open = true
                    index = clamp(parsed.index ?? defaultStep)
                }
            }
        } catch {
            void 0
        }
    }

    function changeIndex(target: number) {
        const prev = index
        index = target
        persistSave()
        if (target !== prev) options.onStepChange?.(target, prev)
    }

    function start(step?: number | string) {
        const base = step !== undefined ? resolveIndex(step) : clamp(index)
        const target = firstEnabled(base)
        completed = false
        const prev = open ? index : -1
        index = target
        if (!open) {
            open = true
            persistSave()
            options.onStart?.()
        } else {
            persistSave()
        }
        if (target !== prev) options.onStepChange?.(target, prev)
    }

    function stop() {
        if (!open) return
        const at = index
        open = false
        persistSave()
        if (!completed) options.onSkip?.(at)
    }

    function next() {
        if (!open) return
        const ni = nextEnabled(index, 1)
        if (ni === null) {
            completed = true
            options.onComplete?.()
            open = false
            persistSave()
            return
        }
        changeIndex(ni)
    }

    function prev() {
        if (!open) return
        const pi = nextEnabled(index, -1)
        if (pi === null) return
        changeIndex(pi)
    }

    function goTo(step: number | string) {
        if (!open) {
            start(step)
            return
        }
        changeIndex(firstEnabled(resolveIndex(step)))
    }

    return {
        start,
        stop,
        next,
        prev,
        goTo,
        get isActive() {
            return open
        },
        get currentIndex() {
            return open ? index : -1
        },
        get totalSteps() {
            return getSteps().length
        },
        get hasPrev() {
            return open && nextEnabled(index, -1) !== null
        },
        get hasNext() {
            return open && nextEnabled(index, 1) !== null
        },
        get isFirst() {
            return nextEnabled(index, -1) === null
        },
        get isLast() {
            return nextEnabled(index, 1) === null
        },
        get currentStepData() {
            return open ? getSteps()[index] : undefined
        }
    }
}
