<script lang="ts" module>
    import type { CarouselAutoplayOptions, CarouselProps } from './carousel.types.js'

    export type Props<T = unknown> = CarouselProps<T>
</script>

<script lang="ts" generics="T = unknown">
    import useEmblaCarousel from 'embla-carousel-svelte'
    import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
    import Autoplay from 'embla-carousel-autoplay'
    import Fade from 'embla-carousel-fade'
    import ClassNames from 'embla-carousel-class-names'
    import { untrack } from 'svelte'
    import { carouselVariants, carouselDefaults } from './carousel.variants.js'
    import { getComponentConfig } from '../config.js'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('carousel', carouselDefaults)

    let {
        ref = $bindable(null),
        api = $bindable<EmblaCarouselType | undefined>(),
        items,
        index = $bindable(0),
        onIndexChange,
        onSettle,
        slidesToShow = 1,
        loop = false,
        align = 'start',
        orientation = 'horizontal',
        draggable = true,
        dragFree = false,
        slidesToScroll = 1,
        autoplay = false,
        fade = false,
        classNames = false,
        breakpoints,
        plugins: extraPlugins,
        options: optionsOverride,
        arrows = true,
        dots = true,
        prevIcon,
        nextIcon,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        variant = config.defaultVariants.variant,
        class: className,
        ui,
        slide: slideSnippet,
        dot: dotSnippet,
        prevSlot,
        nextSlot,
        children
    }: Props<T> = $props()

    let selectedIndex = $state(0)
    let scrollSnaps = $state<number[]>([])
    let canScrollPrev = $state(false)
    let canScrollNext = $state(false)

    const resolvedPrevIcon = $derived(
        prevIcon ?? (orientation === 'vertical' ? 'lucide:chevron-up' : 'lucide:chevron-left')
    )
    const resolvedNextIcon = $derived(
        nextIcon ?? (orientation === 'vertical' ? 'lucide:chevron-down' : 'lucide:chevron-right')
    )

    function buildAutoplay(opts: CarouselAutoplayOptions) {
        return Autoplay({
            delay: opts.delay ?? 4000,
            stopOnInteraction: opts.stopOnInteraction ?? false,
            stopOnMouseEnter: opts.stopOnMouseEnter ?? true,
            stopOnFocusIn: opts.stopOnFocusIn ?? true,
            stopOnLastSnap: opts.stopOnLastSnap ?? false,
            playOnInit: opts.playOnInit ?? true
        })
    }

    const plugins = $derived.by<EmblaPluginType[]>(() => {
        const list: EmblaPluginType[] = []
        if (autoplay) list.push(buildAutoplay(typeof autoplay === 'object' ? autoplay : {}))
        if (fade) list.push(Fade())
        if (classNames) list.push(ClassNames())
        if (extraPlugins) list.push(...extraPlugins)
        return list
    })

    const emblaOptions = $derived.by<EmblaOptionsType>(() => ({
        loop,
        align,
        axis: orientation === 'vertical' ? 'y' : 'x',
        watchDrag: draggable,
        dragFree,
        slidesToScroll,
        breakpoints,
        ...optionsOverride
    }))

    const dotIndices = $derived(scrollSnaps.map((_, i) => i))

    function classListHas(cls: unknown, re: RegExp): boolean {
        if (typeof cls === 'string') return re.test(cls)
        if (Array.isArray(cls)) return cls.some((c) => classListHas(c, re))
        return false
    }

    const userOverridesBasis = $derived(classListHas(ui?.slide, /\bbasis-/))
    const containerStyle = $derived(
        orientation === 'vertical'
            ? 'display: flex; flex-direction: column; touch-action: pan-x;'
            : 'display: flex; flex-direction: row; touch-action: pan-y;'
    )
    const slideStyle = $derived.by(() => {
        if (userOverridesBasis) return undefined
        const minDim = orientation === 'vertical' ? 'min-height' : 'min-width'
        return `flex: 0 0 calc(100% / ${slidesToShow}); ${minDim}: 0;`
    })

    const variantSlots = $derived(carouselVariants({ orientation, size, color, variant }))
    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        viewport: variantSlots.viewport({ class: [config.slots.viewport, ui?.viewport] }),
        container: variantSlots.container({ class: [config.slots.container, ui?.container] }),
        slide: variantSlots.slide({ class: [config.slots.slide, ui?.slide] }),
        arrow: variantSlots.arrow({ class: [config.slots.arrow, ui?.arrow] }),
        arrowPrev: variantSlots.arrowPrev({ class: [config.slots.arrowPrev, ui?.arrowPrev] }),
        arrowNext: variantSlots.arrowNext({ class: [config.slots.arrowNext, ui?.arrowNext] }),
        dots: variantSlots.dots({ class: [config.slots.dots, ui?.dots] }),
        dot: variantSlots.dot({ class: [config.slots.dot, ui?.dot] })
    })

    function syncFromApi(embla: EmblaCarouselType) {
        const newIndex = embla.selectedScrollSnap()
        selectedIndex = newIndex
        scrollSnaps = embla.scrollSnapList()
        canScrollPrev = embla.canScrollPrev()
        canScrollNext = embla.canScrollNext()
        if (newIndex !== index) {
            index = newIndex
            onIndexChange?.(newIndex)
        }
    }

    function handleEmblaInit(event: CustomEvent<EmblaCarouselType>) {
        const embla = event.detail
        api = embla
        syncFromApi(embla)
        embla.on('select', () => syncFromApi(embla))
        embla.on('reInit', () => syncFromApi(embla))
        if (onSettle) embla.on('settle', () => onSettle(embla))
    }

    $effect(() => {
        if (!api) return
        const desired = index
        if (desired !== untrack(() => selectedIndex)) {
            api.scrollTo(desired)
        }
    })

    function scrollPrev() {
        if (!api) return
        api.scrollPrev()
        syncFromApi(api)
    }

    function scrollNext() {
        if (!api) return
        api.scrollNext()
        syncFromApi(api)
    }

    function scrollTo(i: number) {
        if (!api) return
        api.scrollTo(i)
        syncFromApi(api)
    }
</script>

{#snippet defaultPrev()}
    <Button
        {color}
        {size}
        {variant}
        icon={resolvedPrevIcon}
        square
        disabled={!canScrollPrev}
        aria-label="Previous slide"
        class={[classes.arrow, classes.arrowPrev]}
        onclick={scrollPrev}
    />
{/snippet}

{#snippet defaultNext()}
    <Button
        {color}
        {size}
        {variant}
        icon={resolvedNextIcon}
        square
        disabled={!canScrollNext}
        aria-label="Next slide"
        class={[classes.arrow, classes.arrowNext]}
        onclick={scrollNext}
    />
{/snippet}

{#snippet defaultDot(i: number, selected: boolean)}
    <button
        type="button"
        class={classes.dot}
        data-selected={selected ? '' : undefined}
        aria-label={`Go to slide ${i + 1}`}
        aria-current={selected ? 'true' : undefined}
        onclick={() => scrollTo(i)}
    ></button>
{/snippet}

<div
    bind:this={ref}
    class={classes.root}
    data-orientation={orientation}
    style:--sv-slides={slidesToShow}
>
    <div
        class={classes.viewport}
        use:useEmblaCarousel={{ options: emblaOptions, plugins }}
        onemblaInit={handleEmblaInit}
    >
        <div class={classes.container} style={containerStyle}>
            {#if items}
                {#each items as item, i (i)}
                    <div class={classes.slide} style={slideStyle} data-index={i}>
                        {#if slideSnippet}
                            {@render slideSnippet({
                                item,
                                index: i,
                                selected: i === selectedIndex
                            })}
                        {:else}
                            {String(item)}
                        {/if}
                    </div>
                {/each}
            {:else if children}
                {@render children()}
            {/if}
        </div>
    </div>

    {#if arrows}
        {#if prevSlot}
            {@render prevSlot({ canScroll: canScrollPrev, scroll: scrollPrev })}
        {:else}
            {@render defaultPrev()}
        {/if}
        {#if nextSlot}
            {@render nextSlot({ canScroll: canScrollNext, scroll: scrollNext })}
        {:else}
            {@render defaultNext()}
        {/if}
    {/if}

    {#if dots && scrollSnaps.length > 1}
        <div class={classes.dots} role="tablist">
            {#each dotIndices as i (i)}
                {#if dotSnippet}
                    {@render dotSnippet({
                        index: i,
                        selected: i === selectedIndex,
                        select: () => scrollTo(i)
                    })}
                {:else}
                    {@render defaultDot(i, i === selectedIndex)}
                {/if}
            {/each}
        </div>
    {/if}
</div>
