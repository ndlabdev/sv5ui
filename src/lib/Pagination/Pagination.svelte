<script lang="ts" module>
    import type { PaginationProps } from './pagination.types.js'

    export type Props = PaginationProps
</script>

<script lang="ts">
    import { Pagination } from 'bits-ui'
    import { untrack } from 'svelte'
    import {
        paginationVariants,
        paginationDefaults,
        activeVariantColorClasses
    } from './pagination.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import ButtonComponent from '../Button/Button.svelte'

    const config = getComponentConfig('pagination', paginationDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        page = $bindable(),
        defaultPage = 1,
        total = 0,
        itemsPerPage = 10,
        siblingCount = 1,
        showEdges = false,
        showControls = true,
        disabled = false,
        onPageChange,
        size = config.defaultVariants.size ?? 'md',
        variant = config.defaultVariants.variant ?? 'ghost',
        color = config.defaultVariants.color ?? 'surface',
        activeColor = config.defaultVariants.activeColor ?? 'primary',
        activeVariant = config.defaultVariants.activeVariant ?? 'solid',
        firstIcon = icons.chevronsLeft,
        prevIcon = icons.chevronLeft,
        nextIcon = icons.chevronRight,
        lastIcon = icons.chevronsRight,
        ellipsisIcon = icons.ellipsis,
        ui,
        class: className,
        firstSlot,
        prevSlot,
        nextSlot,
        lastSlot,
        ellipsisSlot,
        itemSlot
    }: Props = $props()

    if (page === undefined) {
        page = untrack(() => defaultPage)
    }

    const totalPages = $derived(Math.max(1, Math.ceil(total / itemsPerPage)))
    const isFirstPage = $derived(page === 1)
    const isLastPage = $derived(page === totalPages)
    const prevDisabled = $derived(disabled || isFirstPage)
    const nextDisabled = $derived(disabled || isLastPage)

    const variantSlots = $derived(paginationVariants({ size, disabled }))
    const activeCls = $derived(
        activeVariantColorClasses[activeVariant]?.[activeColor] ?? activeVariantColorClasses.solid.primary
    )
    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className] }),
        list: variantSlots.list({ class: [config.slots.list, ui?.list] }),
        item: variantSlots.item({ class: [config.slots.item, activeCls, ui?.item] }),
        ellipsis: variantSlots.ellipsis({ class: [config.slots.ellipsis, ui?.ellipsis] }),
        ellipsisIcon: variantSlots.ellipsisIcon({
            class: [config.slots.ellipsisIcon, ui?.ellipsisIcon]
        }),
        first: variantSlots.first({ class: [config.slots.first, ui?.first] }),
        prev: variantSlots.prev({ class: [config.slots.prev, ui?.prev] }),
        next: variantSlots.next({ class: [config.slots.next, ui?.next] }),
        last: variantSlots.last({ class: [config.slots.last, ui?.last] })
    })

    function handlePageChange(newPage: number) {
        page = newPage
        onPageChange?.(newPage)
    }

    function goToFirst() {
        if (!isFirstPage) handlePageChange(1)
    }

    function goToLast() {
        if (!isLastPage) handlePageChange(totalPages)
    }
</script>

<Pagination.Root
    bind:ref
    count={total}
    perPage={itemsPerPage}
    {siblingCount}
    {page}
    onPageChange={handlePageChange}
    class={classes.root}
>
    {#snippet children({ pages })}
        <div class={classes.list}>
            {#if showEdges}
                {#if firstSlot}
                    <ButtonComponent
                        {variant}
                        {color}
                        square
                        {size}
                        class={classes.first}
                        disabled={prevDisabled}
                        aria-label="First page"
                        onclick={goToFirst}
                    >
                        {@render firstSlot({ page: page!, disabled: prevDisabled })}
                    </ButtonComponent>
                {:else}
                    <ButtonComponent
                        {variant}
                        {color}
                        square
                        {size}
                        icon={firstIcon}
                        class={classes.first}
                        disabled={prevDisabled}
                        aria-label="First page"
                        onclick={goToFirst}
                    />
                {/if}
            {/if}

            {#if showControls}
                <Pagination.PrevButton disabled={prevDisabled}>
                    {#snippet child({ props })}
                        {#if prevSlot}
                            <ButtonComponent
                                {...props}
                                {variant}
                                {color}
                                square
                                {size}
                                class={classes.prev}
                            >
                                {@render prevSlot({ page: page!, disabled: prevDisabled })}
                            </ButtonComponent>
                        {:else}
                            <ButtonComponent
                                {...props}
                                {variant}
                                {color}
                                square
                                {size}
                                icon={prevIcon}
                                class={classes.prev}
                            />
                        {/if}
                    {/snippet}
                </Pagination.PrevButton>
            {/if}

            {#each pages as pageItem (pageItem.key)}
                {#if pageItem.type === 'ellipsis'}
                    <span class={classes.ellipsis}>
                        {#if ellipsisSlot}
                            {@render ellipsisSlot()}
                        {:else}
                            <Icon name={ellipsisIcon} class={classes.ellipsisIcon} />
                        {/if}
                    </span>
                {:else}
                    <Pagination.Page page={pageItem} class={classes.item} {disabled}>
                        {#if itemSlot}
                            {@render itemSlot({
                                page: pageItem.value,
                                selected: page === pageItem.value
                            })}
                        {:else}
                            {pageItem.value}
                        {/if}
                    </Pagination.Page>
                {/if}
            {/each}

            {#if showControls}
                <Pagination.NextButton disabled={nextDisabled}>
                    {#snippet child({ props })}
                        {#if nextSlot}
                            <ButtonComponent
                                {...props}
                                {variant}
                                {color}
                                square
                                {size}
                                class={classes.next}
                            >
                                {@render nextSlot({ page: page!, disabled: nextDisabled })}
                            </ButtonComponent>
                        {:else}
                            <ButtonComponent
                                {...props}
                                {variant}
                                {color}
                                square
                                {size}
                                icon={nextIcon}
                                class={classes.next}
                            />
                        {/if}
                    {/snippet}
                </Pagination.NextButton>
            {/if}

            {#if showEdges}
                {#if lastSlot}
                    <ButtonComponent
                        {variant}
                        {color}
                        square
                        {size}
                        class={classes.last}
                        disabled={nextDisabled}
                        aria-label="Last page"
                        onclick={goToLast}
                    >
                        {@render lastSlot({ page: page!, disabled: nextDisabled })}
                    </ButtonComponent>
                {:else}
                    <ButtonComponent
                        {variant}
                        {color}
                        square
                        {size}
                        icon={lastIcon}
                        class={classes.last}
                        disabled={nextDisabled}
                        aria-label="Last page"
                        onclick={goToLast}
                    />
                {/if}
            {/if}
        </div>
    {/snippet}
</Pagination.Root>
