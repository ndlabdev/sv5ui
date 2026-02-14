<script lang="ts" module>
    import type { PaginationProps } from './pagination.types.js'

    export type Props = PaginationProps
</script>

<script lang="ts">
    import { Pagination } from 'bits-ui'
    import { untrack } from 'svelte'
    import { paginationVariants, paginationDefaults } from './pagination.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import ButtonComponent from '../Button/Button.svelte'

    const config = getComponentConfig('pagination', paginationDefaults)

    let {
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
        activeColor = config.defaultVariants.activeColor ?? 'primary',
        firstIcon = 'lucide:chevrons-left',
        prevIcon = 'lucide:chevron-left',
        nextIcon = 'lucide:chevron-right',
        lastIcon = 'lucide:chevrons-right',
        ellipsisIcon = 'lucide:ellipsis',
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

    const variantSlots = $derived(paginationVariants({ size, activeColor, disabled }))

    function resolveSlot(slot: keyof typeof variantSlots, extra?: unknown) {
        const configSlot = config.slots[slot as keyof typeof config.slots]
        const uiSlot = ui?.[slot as keyof typeof ui]
        return (variantSlots[slot] as (opts: { class: unknown[] }) => string)({
            class: [configSlot, extra, uiSlot]
        })
    }

    const baseClasses = $derived.by(() => ({
        root: resolveSlot('root', className),
        list: resolveSlot('list'),
        item: resolveSlot('item'),
        ellipsis: resolveSlot('ellipsis'),
        ellipsisIcon: resolveSlot('ellipsisIcon')
    }))

    const controlClasses = $derived.by(() =>
        showControls
            ? {
                  prev: resolveSlot('prev'),
                  next: resolveSlot('next'),
                  prevIcon: resolveSlot('prevIcon'),
                  nextIcon: resolveSlot('nextIcon')
              }
            : null
    )

    const edgeClasses = $derived.by(() =>
        showEdges
            ? {
                  first: resolveSlot('first'),
                  last: resolveSlot('last'),
                  firstIcon: resolveSlot('firstIcon'),
                  lastIcon: resolveSlot('lastIcon')
              }
            : null
    )

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
    count={total}
    perPage={itemsPerPage}
    {siblingCount}
    {page}
    onPageChange={handlePageChange}
    class={baseClasses.root}
>
    {#snippet children({ pages })}
        <div class={baseClasses.list}>
            {#if edgeClasses}
                <ButtonComponent
                    variant="ghost"
                    color="surface"
                    square
                    class={edgeClasses.first}
                    disabled={prevDisabled}
                    aria-label="First page"
                    onclick={goToFirst}
                >
                    {#if firstSlot}
                        {@render firstSlot({ page: page!, disabled: prevDisabled })}
                    {:else}
                        <Icon name={firstIcon} class={edgeClasses.firstIcon} />
                    {/if}
                </ButtonComponent>
            {/if}

            {#if controlClasses}
                <Pagination.PrevButton class={controlClasses.prev} disabled={prevDisabled}>
                    {#if prevSlot}
                        {@render prevSlot({ page: page!, disabled: prevDisabled })}
                    {:else}
                        <Icon name={prevIcon} class={controlClasses.prevIcon} />
                    {/if}
                </Pagination.PrevButton>
            {/if}

            {#each pages as pageItem (pageItem.key)}
                {#if pageItem.type === 'ellipsis'}
                    <span class={baseClasses.ellipsis}>
                        {#if ellipsisSlot}
                            {@render ellipsisSlot()}
                        {:else}
                            <Icon name={ellipsisIcon} class={baseClasses.ellipsisIcon} />
                        {/if}
                    </span>
                {:else}
                    <Pagination.Page page={pageItem} class={baseClasses.item} {disabled}>
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

            {#if controlClasses}
                <Pagination.NextButton class={controlClasses.next} disabled={nextDisabled}>
                    {#if nextSlot}
                        {@render nextSlot({ page: page!, disabled: nextDisabled })}
                    {:else}
                        <Icon name={nextIcon} class={controlClasses.nextIcon} />
                    {/if}
                </Pagination.NextButton>
            {/if}

            {#if edgeClasses}
                <ButtonComponent
                    variant="ghost"
                    color="surface"
                    square
                    class={edgeClasses.last}
                    disabled={nextDisabled}
                    aria-label="Last page"
                    onclick={goToLast}
                >
                    {#if lastSlot}
                        {@render lastSlot({ page: page!, disabled: nextDisabled })}
                    {:else}
                        <Icon name={lastIcon} class={edgeClasses.lastIcon} />
                    {/if}
                </ButtonComponent>
            {/if}
        </div>
    {/snippet}
</Pagination.Root>
