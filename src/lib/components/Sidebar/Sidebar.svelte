<script lang="ts" module>
    import type { SidebarProps } from './sidebar.types.js'

    export type Props = SidebarProps
</script>

<script lang="ts">
    import type { SidebarApi, SidebarState } from './sidebar.types.js'
    import type { ButtonProps } from '../Button/button.types.js'
    import type { NavigationMenuItem } from '../NavigationMenu/navigation-menu.types.js'
    import { sidebarVariants, sidebarDefaults } from './sidebar.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { page } from '$app/state'
    import Button from '../Button/Button.svelte'
    import Slideover from '../Slideover/Slideover.svelte'
    import Drawer from '../Drawer/Drawer.svelte'
    import NavigationMenu from '../NavigationMenu/NavigationMenu.svelte'
    import { useMediaQuery } from '../../hooks/useMediaQuery/index.js'

    const config = getComponentConfig('sidebar', sidebarDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        as = 'aside',
        variant = config.defaultVariants.variant ?? 'sidebar',
        side = config.defaultVariants.side ?? 'left',
        collapsible = 'icon',
        breakpoint = config.defaultVariants.breakpoint ?? 'lg',
        api = $bindable(),
        collapsed = $bindable(false),
        open = $bindable(false),
        mode = 'slideover',
        title,
        description,
        close = false,
        closeIcon,
        rail = false,
        transition = true,
        onCollapse,
        onOpenChange,
        items,
        menu,
        width = 256,
        collapsedWidth = 64,
        persist = false,
        autoClose = true,
        toggle = false,
        ui,
        class: className,
        header: headerSlot,
        titleSlot,
        descriptionSlot,
        actions,
        closeSlot,
        footer: footerSlot,
        children,
        item: itemSlot,
        toggleSlot,
        railSlot,
        ...restProps
    }: Props = $props()

    const BREAKPOINT_PX = { sm: 640, md: 768, lg: 1024, xl: 1280 }

    const collapsedValue = $derived(collapsed)
    const openValue = $derived(open)
    const activeBreakpoint = $derived(breakpoint)

    const media = useMediaQuery(() => `(max-width: ${BREAKPOINT_PX[activeBreakpoint] - 0.02}px)`)

    const offcanvasHidden = $derived(collapsible === 'offcanvas' && collapsedValue)

    const classes = $derived.by(() => {
        const slots = sidebarVariants({
            variant,
            side,
            breakpoint: activeBreakpoint,
            transition
        })
        const c = config.slots
        const u = ui ?? {}
        return {
            root: slots.root({
                class: [c.root, className, u.root, offcanvasHidden && 'border-0! m-0! shadow-none!']
            }),
            header: slots.header({ class: [c.header, u.header] }),
            headerContent: slots.headerContent({ class: [c.headerContent, u.headerContent] }),
            title: slots.title({ class: [c.title, u.title] }),
            description: slots.description({ class: [c.description, u.description] }),
            headerActions: slots.headerActions({ class: [c.headerActions, u.headerActions] }),
            content: slots.content({ class: [c.content, u.content] }),
            footer: slots.footer({ class: [c.footer, u.footer] }),
            toggle: slots.toggle({ class: [c.toggle, u.toggle] }),
            rail: slots.rail({ class: [c.rail, u.rail] }),
            railHandle: slots.railHandle({ class: [c.railHandle, u.railHandle] })
        }
    })

    const canCollapse = $derived(collapsible !== 'none')
    const isCollapsed = $derived(canCollapse && collapsedValue)
    const isRail = $derived(collapsible === 'icon' && collapsedValue)

    const currentWidth = $derived.by(() => {
        if (!isCollapsed) return width
        return collapsible === 'icon' ? collapsedWidth : 0
    })

    const rootStyle = $derived(
        [
            `--ui-sidebar-width:${width}px`,
            `--ui-sidebar-width-collapsed:${collapsedWidth}px`,
            `width:${currentWidth}px`,
            isCollapsed && collapsible === 'offcanvas' ? 'overflow:hidden' : '',
            restProps.style
        ]
            .filter(Boolean)
            .join(';')
    )

    const showToggleBtn = $derived(toggle !== false && canCollapse)
    const userToggle: ButtonProps = $derived(typeof toggle === 'object' ? toggle : {})

    const toggleIcon = $derived.by(() => {
        const expand = collapsedValue
        if (side === 'left') return expand ? icons.chevronsRight : icons.chevronsLeft
        return expand ? icons.chevronsLeft : icons.chevronsRight
    })

    const toggleProps: ButtonProps = $derived({
        color: 'secondary',
        variant: 'ghost',
        block: true,
        icon: toggleIcon,
        'aria-label': collapsedValue ? 'Expand sidebar' : 'Collapse sidebar',
        'aria-expanded': !collapsedValue,
        ...userToggle
    })

    const showClose = $derived(close !== false && canCollapse)
    const userClose: ButtonProps = $derived(typeof close === 'object' ? close : {})
    const closeProps: ButtonProps = $derived({
        color: 'secondary',
        variant: 'ghost',
        size: 'sm',
        icon: closeIcon ?? (side === 'left' ? icons.chevronsLeft : icons.chevronsRight),
        'aria-label': 'Collapse sidebar',
        ...userClose
    })

    const hasHeading = $derived(
        !!(
            headerSlot ||
            title ||
            titleSlot ||
            description ||
            descriptionSlot ||
            actions ||
            closeSlot
        )
    )

    const hasCollapsedHeading = $derived(!!(headerSlot || titleSlot || descriptionSlot))

    const railEnabled = $derived(rail && canCollapse)

    const storageKey = $derived.by(() => {
        if (!persist) return null
        if (persist === true) return 'sidebar'
        return persist.key ?? 'sidebar'
    })

    function stateOf(collapsedView: boolean): SidebarState {
        return collapsedView ? 'collapsed' : 'expanded'
    }

    function stripLabels(list: NavigationMenuItem[]) {
        return list.filter((entry) => entry.type !== 'label')
    }

    const railItems = $derived.by(() => {
        if (!items) return items
        if (Array.isArray(items[0])) {
            return (items as NavigationMenuItem[][]).map(stripLabels)
        }
        return stripLabels(items as NavigationMenuItem[])
    })

    function visibleItems(collapsedView: boolean) {
        return collapsedView ? railItems : items
    }

    function setCollapsed(value: boolean) {
        collapsed = value
        onCollapse?.(value)
    }

    function setOpen(value: boolean) {
        open = value
        onOpenChange?.(value)
    }

    function handleToggle(event: MouseEvent & { currentTarget: EventTarget & HTMLElement }) {
        userToggle.onclick?.(event)
        if (!event.defaultPrevented) {
            setCollapsed(!collapsedValue)
        }
    }

    const apiInstance: SidebarApi = {
        get collapsed() {
            return collapsed
        },
        get open() {
            return open
        },
        get below() {
            return media.matches
        },
        get state() {
            return collapsed ? 'collapsed' : 'expanded'
        },
        toggle() {
            if (media.matches) setOpen(!open)
            else setCollapsed(!collapsed)
        },
        expand() {
            if (media.matches) setOpen(true)
            else setCollapsed(false)
        },
        collapse() {
            if (media.matches) setOpen(false)
            else setCollapsed(true)
        }
    }

    api = apiInstance

    let hydrated = false
    $effect(() => {
        const key = storageKey
        const value = collapsedValue
        if (typeof localStorage === 'undefined' || !key) return
        if (!hydrated) {
            hydrated = true
            const stored = localStorage.getItem(key)
            if (stored !== null && (stored === '1') !== value) {
                setCollapsed(stored === '1')
            }
            return
        }
        localStorage.setItem(key, value ? '1' : '0')
    })

    let previousPath = page.url.pathname
    $effect(() => {
        const path = page.url.pathname
        if (path !== previousPath) {
            previousPath = path
            if (autoClose) {
                setOpen(false)
            }
        }
    })
</script>

{#snippet headerArea(collapsedView: boolean, chrome: boolean)}
    {#if collapsedView ? hasCollapsedHeading : hasHeading || (chrome && showClose)}
        <div class={classes.header}>
            {#if headerSlot}
                {@render headerSlot({ collapsed: collapsedView, state: stateOf(collapsedView) })}
            {:else}
                <div class={classes.headerContent}>
                    {#if titleSlot}
                        {@render titleSlot({ collapsed: collapsedView })}
                    {:else if title && !collapsedView}
                        <span class={classes.title}>{title}</span>
                    {/if}
                    {#if !collapsedView}
                        {#if descriptionSlot}
                            {@render descriptionSlot({ collapsed: collapsedView })}
                        {:else if description}
                            <span class={classes.description}>{description}</span>
                        {/if}
                    {/if}
                </div>
                {#if !collapsedView && (actions || (chrome && showClose))}
                    <div class={classes.headerActions}>
                        {@render actions?.({ collapsed: collapsedView })}
                        {#if chrome && showClose}
                            {#if closeSlot}
                                {@render closeSlot({ collapsed: collapsedView })}
                            {:else}
                                <Button {...closeProps} onclick={() => setCollapsed(true)} />
                            {/if}
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
    {/if}
{/snippet}

{#snippet inner(collapsedView: boolean, chrome: boolean)}
    {@render headerArea(collapsedView, chrome)}

    <div class={classes.content}>
        {#if items}
            <NavigationMenu
                orientation="vertical"
                collapsed={collapsedView}
                items={visibleItems(collapsedView)}
                item={itemSlot}
                tooltip={true}
                popover={true}
                {...menu}
            />
        {/if}
        {@render children?.({ collapsed: collapsedView, state: stateOf(collapsedView) })}
    </div>

    {#if footerSlot || (chrome && showToggleBtn)}
        <div class={classes.footer}>
            {@render footerSlot?.({ collapsed: collapsedView, state: stateOf(collapsedView) })}
            {#if chrome && showToggleBtn}
                {#if toggleSlot}
                    {@render toggleSlot({ collapsed: collapsedView })}
                {:else}
                    <Button
                        {...toggleProps}
                        onclick={handleToggle}
                        class={[classes.toggle, toggleProps.class]}
                    />
                {/if}
            {/if}
        </div>
    {/if}
{/snippet}

<svelte:element
    this={as}
    bind:this={ref}
    {...restProps}
    class={classes.root}
    style={rootStyle}
    data-variant={variant}
    data-side={side}
    data-collapsible={collapsible}
    data-collapsed={isCollapsed}
    inert={offcanvasHidden || undefined}
    aria-hidden={offcanvasHidden || undefined}
>
    {@render inner(isRail, true)}

    {#if railEnabled}
        {#if railSlot}
            {@render railSlot({ collapsed: isRail })}
        {:else}
            <button
                type="button"
                aria-label={collapsedValue ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsedValue}
                onclick={() => setCollapsed(!collapsedValue)}
                class={classes.rail}
            >
                <span class={classes.railHandle}></span>
            </button>
        {/if}
    {/if}
</svelte:element>

{#if mode === 'slideover'}
    <Slideover
        open={openValue}
        onOpenChange={setOpen}
        {side}
        title="Navigation"
        size="sm"
        overlay
        ui={{ content: 'bg-surface text-on-surface', body: 'p-0' }}
    >
        {#snippet content()}
            <div class="flex h-full w-full flex-col">
                {@render inner(false, false)}
            </div>
        {/snippet}
    </Slideover>
{:else}
    <Drawer
        open={openValue}
        onOpenChange={setOpen}
        direction={side}
        title="Navigation"
        overlay
        handle={false}
        ui={{ content: 'bg-surface text-on-surface' }}
    >
        {#snippet content()}
            <div class="flex h-full max-w-[85vw] flex-col" style={`width:${width}px`}>
                {@render inner(false, false)}
            </div>
        {/snippet}
    </Drawer>
{/if}
