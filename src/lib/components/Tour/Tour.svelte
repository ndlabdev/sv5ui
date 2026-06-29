<script lang="ts" module>
    import type { TourProps } from './tour.types.js'

    export type Props = TourProps

    let uidCounter = 0
</script>

<script lang="ts">
    import { untrack } from 'svelte'
    import { Portal } from 'bits-ui'
    import { computePosition, autoUpdate, offset, flip, shift, arrow } from '@floating-ui/dom'
    import type { Placement } from '@floating-ui/dom'
    import { tourVariants, tourDefaults } from './tour.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { useTour } from '../../hooks/useTour/index.js'
    import { useFocusTrap } from '../../hooks/useFocusTrap/index.js'
    import { useEventListener } from '../../hooks/useEventListener/index.js'
    import { useMediaQuery } from '../../hooks/useMediaQuery/index.js'
    import type { TourController, TourStep, TourStepSlotProps } from './tour.types.js'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('tour', tourDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        steps,
        controller,
        api = $bindable(),
        defaultStep = 0,
        onOpenChange,
        onStepChange,
        onStart,
        onComplete,
        onSkip,
        placement = 'bottom',
        sideOffset = 12,
        spotlight = true,
        spotlightPadding = 8,
        spotlightRadius = 8,
        spotlightInteractable = false,
        scrollIntoView = true,
        waitForTarget = 2000,
        dismissible = false,
        arrow: showArrow = true,
        prevLabel = 'Back',
        nextLabel = 'Next',
        doneLabel = 'Done',
        skipLabel = 'Skip',
        showProgress = true,
        showSkip = true,
        size = 'md',
        transition = config.defaultVariants.transition ?? true,
        portal = true,
        class: className,
        ui,
        header: headerSlot,
        footer: footerSlot,
        content: contentSlot,
        ...restProps
    }: Props = $props()

    const ctrl: TourController =
        untrack(() => controller) ??
        useTour({
            get steps() {
                return steps
            },
            get defaultStep() {
                return defaultStep
            },
            get onStart() {
                return onStart
            },
            get onComplete() {
                return onComplete
            },
            get onSkip() {
                return onSkip
            },
            get onStepChange() {
                return onStepChange
            }
        })

    $effect(() => {
        api = ctrl
    })

    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
    const animate = $derived(transition && !reduceMotion.matches)

    const active = $derived(ctrl.isActive)
    const index = $derived(ctrl.currentIndex)
    const step = $derived<TourStep | undefined>(index >= 0 ? steps[index] : undefined)

    const uid = `sv5ui-tour-${++uidCounter}`
    const titleId = `${uid}-title`
    const descId = `${uid}-desc`

    let panelEl = $state<HTMLElement | null>(null)
    let arrowEl = $state<HTMLElement | null>(null)
    let targetEl = $state<HTMLElement | null>(null)
    let rect = $state<{ x: number; y: number; width: number; height: number } | null>(null)
    let panelPos = $state<{ x: number; y: number }>({ x: 0, y: 0 })
    let arrowPos = $state<{ x?: number; y?: number }>({})
    let resolvedPlacement = $state<Placement>(untrack(() => placement))
    let ready = $state(false)

    const side = $derived(resolvedPlacement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left')

    const stepPadding = $derived(step?.spotlightPadding ?? spotlightPadding)
    const stepRadius = $derived(step?.spotlightRadius ?? spotlightRadius)
    const stepInteractable = $derived(step?.spotlightInteractable ?? spotlightInteractable)
    const showSpotlight = $derived(spotlight && !step?.disableSpotlight && !!targetEl && !!rect)
    const isDialog = $derived(!step?.target || !targetEl)

    const variantSlots = $derived(tourVariants({ size, transition: animate }))
    const classes = $derived({
        overlay: variantSlots.overlay({ class: [config.slots.overlay, ui?.overlay] }),
        spotlight: variantSlots.spotlight({ class: [config.slots.spotlight, ui?.spotlight] }),
        panel: variantSlots.panel({
            class: [config.slots.panel, ui?.panel, className, step?.class]
        }),
        arrow: variantSlots.arrow({ class: [config.slots.arrow, ui?.arrow] }),
        header: variantSlots.header({ class: [config.slots.header, ui?.header] }),
        title: variantSlots.title({ class: [config.slots.title, ui?.title] }),
        description: variantSlots.description({
            class: [config.slots.description, ui?.description]
        }),
        body: variantSlots.body({ class: [config.slots.body, ui?.body] }),
        footer: variantSlots.footer({ class: [config.slots.footer, ui?.footer] }),
        progress: variantSlots.progress({ class: [config.slots.progress, ui?.progress] }),
        nav: variantSlots.nav({ class: [config.slots.nav, ui?.nav] }),
        skipButton: variantSlots.skipButton({ class: [config.slots.skipButton, ui?.skipButton] }),
        closeButton: variantSlots.closeButton({
            class: [config.slots.closeButton, ui?.closeButton]
        })
    })

    function normalizeWait(value: boolean | number | undefined): number {
        if (value === undefined)
            return typeof waitForTarget === 'number' ? waitForTarget : waitForTarget ? 2000 : 0
        if (value === true) return 2000
        if (value === false) return 0
        return value
    }

    async function resolveTarget(
        target: TourStep['target'],
        waitMs: number
    ): Promise<HTMLElement | null> {
        if (target === null || target === undefined) return null
        if (target instanceof HTMLElement) return target
        const get =
            typeof target === 'function'
                ? target
                : () => document.querySelector<HTMLElement>(target)
        const first = get()
        if (first || waitMs <= 0) return first
        return new Promise((resolve) => {
            const start = performance.now()
            const tick = () => {
                const el = get()
                if (el) return resolve(el)
                if (performance.now() - start >= waitMs) return resolve(null)
                requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
        })
    }

    const effectivePlacement = $derived(step?.placement ?? placement)
    const effectiveOffset = $derived((step?.sideOffset ?? sideOffset) + (showArrow ? 6 : 0))

    async function position() {
        if (!targetEl || !panelEl) return
        const middleware = [
            offset(effectiveOffset),
            flip({ padding: 8, fallbackAxisSideDirection: 'start' }),
            shift({ padding: 8 })
        ]
        if (showArrow && arrowEl) middleware.push(arrow({ element: arrowEl, padding: 8 }))

        const result = await computePosition(targetEl, panelEl, {
            strategy: 'fixed',
            placement: effectivePlacement,
            middleware
        })
        panelPos = { x: result.x, y: result.y }
        resolvedPlacement = result.placement
        arrowPos = result.middlewareData.arrow ?? {}
        const r = targetEl.getBoundingClientRect()
        rect = { x: r.left, y: r.top, width: r.width, height: r.height }
        ready = true
    }

    $effect(() => {
        if (!active || !step) {
            ready = false
            targetEl = null
            rect = null
            return
        }
        const current = step
        void index
        let cancelled = false
        let stopAuto: (() => void) | undefined
        ready = false
        untrack(() => {
            ;(async () => {
                await current.onEnter?.()
                if (cancelled) return
                const el = await resolveTarget(current.target, normalizeWait(current.waitForTarget))
                if (cancelled) return
                targetEl = el

                const scroll = current.scrollIntoView ?? scrollIntoView
                if (el && scroll) {
                    const opts: ScrollIntoViewOptions =
                        typeof scroll === 'object'
                            ? scroll
                            : { behavior: 'smooth', block: 'center' }
                    el.scrollIntoView(opts)
                }

                if (el && panelEl) {
                    stopAuto = autoUpdate(el, panelEl, position)
                } else {
                    rect = null
                    ready = true
                }
            })()
        })

        return () => {
            cancelled = true
            stopAuto?.()
        }
    })

    useFocusTrap(() => panelEl, { active: () => active && ready })

    let busy = $state(false)

    async function runGuard(guard?: () => boolean | Promise<boolean>): Promise<boolean> {
        if (!guard) return true
        busy = true
        try {
            return await guard()
        } finally {
            busy = false
        }
    }

    async function handleNext() {
        if (busy) return
        if (!(await runGuard(step?.onBeforeNext))) return
        ctrl.next()
    }

    async function handlePrev() {
        if (busy) return
        if (!(await runGuard(step?.onBeforePrev))) return
        ctrl.prev()
    }

    function handleStop() {
        ctrl.stop()
    }

    function isInteractiveTarget(el: Element | null): boolean {
        const tag = el?.tagName
        return tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'TEXTAREA'
    }

    useEventListener(
        () => (active ? document : null),
        'keydown',
        (event: KeyboardEvent) => {
            const advance =
                event.key === 'ArrowRight' ||
                (event.key === 'Enter' && !isInteractiveTarget(document.activeElement))
            if (advance) {
                event.preventDefault()
                handleNext()
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault()
                handlePrev()
            } else if (event.key === 'Escape' && dismissible) {
                handleStop()
            }
        }
    )

    let prevActive = false
    $effect(() => {
        if (active !== prevActive) {
            prevActive = active
            onOpenChange?.(active)
        }
    })

    const slotProps = $derived<TourStepSlotProps>({
        step: step as TourStep,
        index,
        number: index + 1,
        total: steps.length,
        isFirst: ctrl.isFirst,
        isLast: ctrl.isLast,
        controller: ctrl,
        next: handleNext,
        prev: handlePrev,
        stop: handleStop
    })

    const showPrevButton = $derived(step?.showPrev ?? !ctrl.isFirst)
    const showSkipButton = $derived((step?.showSkip ?? showSkip) && !ctrl.isLast)
    const nextButtonLabel = $derived(step?.nextLabel ?? (ctrl.isLast ? doneLabel : nextLabel))
    const prevButtonLabel = $derived(step?.prevLabel ?? prevLabel)

    const staticSide = $derived(
        ({ top: 'bottom', right: 'left', bottom: 'top', left: 'right' } as const)[side]
    )

    const arrowBorder = $derived(
        (
            {
                top: 'border-b border-r',
                bottom: 'border-t border-l',
                left: 'border-t border-r',
                right: 'border-b border-l'
            } as const
        )[side]
    )

    const arrowStyle = $derived.by(() => {
        const parts = [`${staticSide}: -6px`]
        if (arrowPos.x !== undefined) parts.push(`left: ${arrowPos.x}px`)
        if (arrowPos.y !== undefined) parts.push(`top: ${arrowPos.y}px`)
        return parts.join('; ')
    })

    const dotIndices = $derived(steps.map((_, i) => i))
</script>

{#snippet defaultHeader(p: TourStepSlotProps)}
    <div class={classes.header}>
        <div class="min-w-0">
            {#if p.step.title}
                <p id={titleId} class={classes.title}>{p.step.title}</p>
            {/if}
        </div>
        {#if dismissible}
            <Button
                class={classes.closeButton}
                size="xs"
                variant="ghost"
                color="surface"
                square
                icon={icons.close}
                aria-label="Close tour"
                onclick={handleStop}
            />
        {/if}
    </div>
{/snippet}

{#snippet defaultBody(p: TourStepSlotProps)}
    <div class={classes.body}>
        {#if p.step.content}
            {@render p.step.content(p)}
        {:else if p.step.description}
            <p id={descId}>{p.step.description}</p>
        {/if}
    </div>
{/snippet}

{#snippet defaultFooter()}
    <div class={classes.footer}>
        {#if showProgress}
            <div class={classes.progress}>
                {#each dotIndices as i (i)}
                    <span
                        class={variantSlots.progressDot({
                            active: i === index,
                            class: [config.slots.progressDot, ui?.progressDot]
                        })}
                    ></span>
                {/each}
            </div>
        {:else}
            <span></span>
        {/if}

        <div class={classes.nav}>
            {#if showSkipButton}
                <Button
                    class={classes.skipButton}
                    size="sm"
                    variant="ghost"
                    color="surface"
                    label={skipLabel}
                    onclick={handleStop}
                />
            {/if}
            {#if showPrevButton}
                <Button
                    class={variantSlots.prevButton({
                        class: [config.slots.prevButton, ui?.prevButton]
                    })}
                    size="sm"
                    variant="soft"
                    color="surface"
                    label={prevButtonLabel}
                    disabled={busy}
                    onclick={handlePrev}
                />
            {/if}
            <Button
                class={variantSlots.nextButton({
                    class: [config.slots.nextButton, ui?.nextButton]
                })}
                size="sm"
                variant="solid"
                color="primary"
                label={nextButtonLabel}
                loading={busy}
                onclick={handleNext}
            />
        </div>
    </div>
{/snippet}

{#snippet tourPanel()}
    {#if active && step}
        {#if showSpotlight}
            {#if !stepInteractable}
                <div
                    class={classes.overlay}
                    onclick={dismissible ? handleStop : undefined}
                    role="presentation"
                ></div>
            {/if}
            <div
                class={classes.spotlight}
                style:width="{(rect?.width ?? 0) + stepPadding * 2}px"
                style:height="{(rect?.height ?? 0) + stepPadding * 2}px"
                style:border-radius="{stepRadius}px"
                style:transform="translate({(rect?.x ?? 0) - stepPadding}px, {(rect?.y ?? 0) -
                    stepPadding}px)"
            ></div>
        {:else}
            <div
                class={classes.overlay}
                style:background-color="rgba(0,0,0,0.5)"
                onclick={dismissible ? handleStop : undefined}
                role="presentation"
            ></div>
        {/if}

        <div
            bind:this={panelEl}
            class={classes.panel}
            role="dialog"
            aria-modal="false"
            aria-labelledby={step.title ? titleId : undefined}
            aria-describedby={step.description ? descId : undefined}
            data-state={ready ? 'open' : 'closed'}
            style:position="fixed"
            style:left={isDialog ? '50%' : `${panelPos.x}px`}
            style:top={isDialog ? '50%' : `${panelPos.y}px`}
            style:transform={isDialog ? 'translate(-50%, -50%)' : undefined}
            style:opacity={ready ? undefined : '0'}
            {...restProps}
        >
            {#if showArrow && !isDialog}
                <div
                    bind:this={arrowEl}
                    class="absolute size-3 rotate-45 {arrowBorder} {classes.arrow}"
                    style={arrowStyle}
                ></div>
            {/if}

            <div class="sr-only" aria-live="polite">
                Step {index + 1} of {steps.length}
            </div>

            {#if contentSlot}
                {@render contentSlot(slotProps)}
            {:else}
                {#if headerSlot}
                    {@render headerSlot(slotProps)}
                {:else}
                    {@render defaultHeader(slotProps)}
                {/if}

                {@render defaultBody(slotProps)}

                {#if footerSlot}
                    {@render footerSlot(slotProps)}
                {:else}
                    {@render defaultFooter()}
                {/if}
            {/if}
        </div>
    {/if}
{/snippet}

{#if portal}
    <Portal>
        {@render tourPanel()}
    </Portal>
{:else}
    {@render tourPanel()}
{/if}
