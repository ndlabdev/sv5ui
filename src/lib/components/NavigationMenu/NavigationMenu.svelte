<script lang="ts" module>
    import type { NavigationMenuProps } from './navigation-menu.types.js'

    export type Props = NavigationMenuProps
</script>

<script lang="ts">
    import { NavigationMenu as Bits } from 'bits-ui'
    import { tick, untrack } from 'svelte'
    import { SvelteSet } from 'svelte/reactivity'
    import { slide } from 'svelte/transition'
    import { page } from '$app/state'
    import { useResizeObserver } from '../../hooks/useResizeObserver/index.js'
    import { navigationMenuVariants, navigationMenuDefaults } from './navigation-menu.variants.js'
    import type { NavigationMenuItem, NavigationMenuChildItem } from './navigation-menu.types.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Link from '../Link/Link.svelte'
    import Badge from '../Badge/Badge.svelte'
    import Chip from '../Chip/Chip.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import Tooltip from '../Tooltip/Tooltip.svelte'
    import Popover from '../Popover/Popover.svelte'
    import Drawer from '../Drawer/Drawer.svelte'
    import Button from '../Button/Button.svelte'
    import { useMediaQuery } from '../../hooks/useMediaQuery/index.js'

    const config = getComponentConfig('navigationMenu', navigationMenuDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        as = 'nav',
        type = 'multiple',
        value = $bindable(),
        defaultValue,
        onValueChange,
        items = [],
        orientation = 'horizontal',
        collapsed = false,
        collapsible = true,
        highlight = false,
        variant = config.defaultVariants.variant ?? 'pill',
        color = config.defaultVariants.color ?? 'primary',
        trailingIcon = icons.chevronDown,
        externalIcon = true,
        arrow = false,
        tooltip = false,
        popover = false,
        contentOrientation = 'horizontal',
        labelKey = 'label',
        exact = true,
        delayDuration = 0,
        skipDelayDuration,
        disableClickTrigger = false,
        disableHoverTrigger = false,
        unmountOnHide = true,
        disabled = false,
        drawer = false,
        drawerOpen = $bindable(false),
        mobileBreakpoint = '(max-width: 767px)',
        drawerWidth = 'min(20rem, 80vw)',
        drawerProps,
        class: className,
        ui,
        item: itemSlot,
        itemLeading,
        itemLabel,
        itemTrailing,
        itemContent,
        listLeading,
        listTrailing,
        ...restProps
    }: Props = $props()

    const groups = $derived((Array.isArray(items[0]) ? items : [items]) as NavigationMenuItem[][])

    function itemValue(item: NavigationMenuItem, groupIndex: number, index: number): string {
        return item.value ?? `${groupIndex}-${index}`
    }

    function itemLabelText(item: NavigationMenuItem): string {
        const label = (item as Record<string, unknown>)[labelKey]
        return typeof label === 'string' ? label : (item.label ?? '')
    }

    function isExternal(href?: string): boolean {
        return !!href && /^(https?:)?\/\//.test(href)
    }

    const UNSAFE_SCHEMES = ['javascript:', 'data:', 'vbscript:']

    function safeHref(href?: string): string | undefined {
        if (!href) return undefined
        const normalized = href
            .replaceAll('\t', '')
            .replaceAll('\n', '')
            .replaceAll('\r', '')
            .trim()
            .toLowerCase()
        if (UNSAFE_SCHEMES.some((scheme) => normalized.startsWith(scheme))) return undefined
        return href
    }

    function isItemActive(
        active: boolean | undefined,
        href?: string,
        itemExact?: boolean
    ): boolean {
        if (active !== undefined) return active
        if (!href || isExternal(href) || !page.url) return false
        const useExact = itemExact ?? exact
        return useExact
            ? page.url.pathname === href
            : page.url.pathname === href || page.url.pathname.startsWith(`${href}/`)
    }

    function hasChildren(item: NavigationMenuItem): boolean {
        return Array.isArray(item.children) && item.children.length > 0
    }

    function asProps<T>(v: boolean | T | undefined): Partial<T> {
        return v && typeof v === 'object' ? (v as Partial<T>) : {}
    }

    function blockClick(e: MouseEvent) {
        e.preventDefault()
    }

    let flyoutKey = $state<string | null>(null)
    let flyoutTimer: ReturnType<typeof setTimeout> | undefined

    function openFlyout(key: string) {
        clearTimeout(flyoutTimer)
        flyoutKey = key
    }

    function closeFlyoutSoon() {
        clearTimeout(flyoutTimer)
        flyoutTimer = setTimeout(() => (flyoutKey = null), 150)
    }

    function handleFlyoutChange(open: boolean, key: string) {
        if (open) openFlyout(key)
        else if (flyoutKey === key) flyoutKey = null
    }

    function resolvedType(item: NavigationMenuItem): 'label' | 'trigger' | 'link' {
        if (item.type) return item.type
        return hasChildren(item) ? 'trigger' : 'link'
    }

    function isDropdown(item: NavigationMenuItem): boolean {
        return resolvedType(item) === 'trigger' && (hasChildren(item) || !!itemContent)
    }

    if (value === undefined) {
        value = untrack(() => {
            if (defaultValue !== undefined) return defaultValue
            const open: string[] = []
            groups.forEach((group, gi) =>
                group.forEach((item, i) => {
                    if ((item.defaultOpen || item.open) && hasChildren(item)) {
                        open.push(itemValue(item, gi, i))
                    }
                })
            )
            return type === 'multiple' ? open : open[0]
        })
    }

    const openSet = $derived(
        new Set(Array.isArray(value) ? value : value !== undefined ? [value] : [])
    )

    function emit(next: string | string[] | undefined) {
        value = next
        onValueChange?.(next)
    }

    function toggleOpen(v: string) {
        if (type === 'single') {
            emit(openSet.has(v) ? undefined : v)
        } else {
            const next = new SvelteSet(openSet)
            if (next.has(v)) next.delete(v)
            else next.add(v)
            emit([...next])
        }
    }

    const horizontalValue = $derived(
        typeof value === 'string' ? value : Array.isArray(value) ? value[0] : undefined
    )

    const isMobile = useMediaQuery(() => mobileBreakpoint)
    const showDrawer = $derived(drawer && isMobile.matches)
    const effectiveOrientation = $derived(showDrawer ? 'vertical' : orientation)
    const effectiveCollapsed = $derived(collapsed && !showDrawer)

    let previousPath = page.url?.pathname
    $effect(() => {
        const path = page.url?.pathname
        if (path !== previousPath) {
            previousPath = path
            drawerOpen = false
        }
    })

    const variantSlots = $derived(
        navigationMenuVariants({
            variant,
            color,
            orientation: effectiveOrientation,
            highlight,
            collapsed: effectiveCollapsed,
            contentOrientation,
            disabled
        })
    )

    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, ui?.root, className] }),
        list: variantSlots.list({ class: [config.slots.list, ui?.list] }),
        highlight: variantSlots.highlight({ class: [config.slots.highlight, ui?.highlight] }),
        item: variantSlots.item({ class: [config.slots.item, ui?.item] }),
        label: variantSlots.label({ class: [config.slots.label, ui?.label] }),
        separator: variantSlots.separator({ class: [config.slots.separator, ui?.separator] }),
        link: variantSlots.link({ class: [config.slots.link, ui?.link] }),
        linkLeadingIcon: variantSlots.linkLeadingIcon({
            class: [config.slots.linkLeadingIcon, ui?.linkLeadingIcon]
        }),
        linkLeadingAvatar: variantSlots.linkLeadingAvatar({
            class: [config.slots.linkLeadingAvatar, ui?.linkLeadingAvatar]
        }),
        linkLabel: variantSlots.linkLabel({ class: [config.slots.linkLabel, ui?.linkLabel] }),
        linkLabelExternalIcon: variantSlots.linkLabelExternalIcon({
            class: [config.slots.linkLabelExternalIcon, ui?.linkLabelExternalIcon]
        }),
        linkTrailing: variantSlots.linkTrailing({
            class: [config.slots.linkTrailing, ui?.linkTrailing]
        }),
        linkTrailingBadge: variantSlots.linkTrailingBadge({
            class: [config.slots.linkTrailingBadge, ui?.linkTrailingBadge]
        }),
        linkTrailingIcon: variantSlots.linkTrailingIcon({
            class: [config.slots.linkTrailingIcon, ui?.linkTrailingIcon]
        }),
        childList: variantSlots.childList({ class: [config.slots.childList, ui?.childList] }),
        childLabel: variantSlots.childLabel({ class: [config.slots.childLabel, ui?.childLabel] }),
        childItem: variantSlots.childItem({ class: [config.slots.childItem, ui?.childItem] }),
        childLink: variantSlots.childLink({ class: [config.slots.childLink, ui?.childLink] }),
        childLinkWrapper: variantSlots.childLinkWrapper({
            class: [config.slots.childLinkWrapper, ui?.childLinkWrapper]
        }),
        childLinkIcon: variantSlots.childLinkIcon({
            class: [config.slots.childLinkIcon, ui?.childLinkIcon]
        }),
        childLinkLabel: variantSlots.childLinkLabel({
            class: [config.slots.childLinkLabel, ui?.childLinkLabel]
        }),
        childLinkDescription: variantSlots.childLinkDescription({
            class: [config.slots.childLinkDescription, ui?.childLinkDescription]
        }),
        childGroup: variantSlots.childGroup({ class: [config.slots.childGroup, ui?.childGroup] }),
        childGroupLabel: variantSlots.childGroupLabel({
            class: [config.slots.childGroupLabel, ui?.childGroupLabel]
        }),
        childGroupList: variantSlots.childGroupList({
            class: [config.slots.childGroupList, ui?.childGroupList]
        }),
        linkBadgeDot: variantSlots.linkBadgeDot({
            class: [config.slots.linkBadgeDot, ui?.linkBadgeDot]
        }),
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        viewportWrapper: variantSlots.viewportWrapper({
            class: [config.slots.viewportWrapper, ui?.viewportWrapper]
        }),
        viewport: variantSlots.viewport({ class: [config.slots.viewport, ui?.viewport] }),
        indicator: variantSlots.indicator({ class: [config.slots.indicator, ui?.indicator] }),
        arrow: variantSlots.arrow({ class: [config.slots.arrow, ui?.arrow] }),
        childTrigger: variantSlots.childTrigger({
            class: [config.slots.childTrigger, ui?.childTrigger]
        })
    })

    function linkClass(item: NavigationMenuItem): string {
        if (!item.ui?.link && item.class === undefined) return classes.link
        return variantSlots.link({
            class: [config.slots.link, ui?.link, item.ui?.link, item.class]
        })
    }

    const contentProps = $derived({ forceMount: !unmountOnHide || undefined })

    let listEl = $state<HTMLElement | null>(null)
    let highlightStyle = $state('')
    let rafId = 0

    const showHighlight = $derived(highlight && variant !== 'pill')

    function updateIndicator() {
        if (!showHighlight || !listEl) return
        const activeEl = listEl.querySelector<HTMLElement>('[data-active]')
        if (!activeEl) {
            highlightStyle = 'opacity:0'
            return
        }
        highlightStyle =
            effectiveOrientation === 'horizontal'
                ? `left:${activeEl.offsetLeft}px;width:${activeEl.offsetWidth}px`
                : `top:${activeEl.offsetTop}px;height:${activeEl.offsetHeight}px`
    }

    function scheduleIndicator() {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(updateIndicator)
    }

    useResizeObserver(() => listEl, scheduleIndicator)

    $effect(() => {
        void value
        void page.url
        void items
        void effectiveOrientation
        void showHighlight
        if (showHighlight) tick().then(updateIndicator)
    })

    $effect(() => () => cancelAnimationFrame(rafId))
    $effect(() => () => clearTimeout(flyoutTimer))
</script>

{#snippet leading(item: NavigationMenuItem, index: number, open: boolean)}
    {#if itemLeading}
        {@render itemLeading({ item, index, active: !!item.active, open })}
    {:else if item.avatar}
        {#if item.chip}
            <Chip
                inset
                {...typeof item.chip === 'object' ? item.chip : {}}
                class={classes.linkLeadingAvatar}
            >
                <Avatar size="2xs" {...item.avatar} />
            </Chip>
        {:else}
            <Avatar size="2xs" {...item.avatar} class={classes.linkLeadingAvatar} />
        {/if}
    {:else if item.icon}
        <Icon name={item.icon} class={classes.linkLeadingIcon} />
    {/if}
{/snippet}

{#snippet label(item: NavigationMenuItem, index: number, open: boolean)}
    {#if itemLabel}
        {@render itemLabel({ item, index, active: !!item.active, open })}
    {:else}
        <span class={classes.linkLabel}>{itemLabelText(item)}</span>
        {#if externalIcon !== false && isExternal(item.href)}
            <Icon
                name={typeof externalIcon === 'string' ? externalIcon : icons.external}
                class={classes.linkLabelExternalIcon}
            />
        {/if}
    {/if}
{/snippet}

{#snippet trailing(item: NavigationMenuItem, index: number, open: boolean, isTrigger: boolean)}
    {#if itemTrailing}
        {@render itemTrailing({ item, index, active: !!item.active, open })}
    {:else}
        <span class={classes.linkTrailing}>
            {#if item.badge !== undefined}
                <Badge
                    size="sm"
                    color="surface"
                    variant="soft"
                    {...typeof item.badge === 'object' ? item.badge : { label: item.badge }}
                    class={classes.linkTrailingBadge}
                />
            {/if}
            {#if isTrigger}
                <Icon
                    name={item.trailingIcon ?? trailingIcon}
                    class={[classes.linkTrailingIcon, open ? 'rotate-180' : '']}
                />
            {/if}
        </span>
    {/if}
{/snippet}

{#snippet linkBody(item: NavigationMenuItem, index: number, open: boolean, isTrigger: boolean)}
    {@render leading(item, index, open)}
    {@render label(item, index, open)}
    {@render trailing(item, index, open, isTrigger)}
    {#if effectiveCollapsed && item.badge !== undefined}
        <span class={classes.linkBadgeDot} data-navigation-menu-badge-dot="" aria-hidden="true"
        ></span>
    {/if}
{/snippet}

{#snippet childLink(sub: NavigationMenuChildItem)}
    {#if sub.children?.length}
        <li class={classes.childGroup}>
            <p class={classes.childGroupLabel}>{sub.label}</p>
            <ul class={classes.childGroupList}>
                {#each sub.children as grandchild, gi (grandchild.href ?? gi)}
                    {@render childLink(grandchild)}
                {/each}
            </ul>
        </li>
    {:else}
        {@const active = isItemActive(sub.active, sub.href, sub.exact)}
        <li class={classes.childItem}>
            <Link
                href={safeHref(sub.href)}
                target={sub.target}
                raw
                exact={sub.exact ?? exact}
                {active}
                onclick={sub.onSelect}
                data-active={active ? '' : undefined}
                class={[classes.childLink, sub.class]}
            >
                {#if sub.icon}
                    <Icon name={sub.icon} class={classes.childLinkIcon} />
                {/if}
                <span class={classes.childLinkWrapper}>
                    <span class="inline-flex items-center gap-1">
                        <span class={classes.childLinkLabel}>{sub.label}</span>
                        {#if externalIcon !== false && isExternal(sub.href)}
                            <Icon
                                name={typeof externalIcon === 'string'
                                    ? externalIcon
                                    : icons.external}
                                class={classes.linkLabelExternalIcon}
                            />
                        {/if}
                    </span>
                    {#if sub.description}
                        <span class={classes.childLinkDescription}>{sub.description}</span>
                    {/if}
                </span>
            </Link>
        </li>
    {/if}
{/snippet}

{#snippet megaContent(item: NavigationMenuItem, index: number)}
    {#if itemContent}
        {@render itemContent({ item, index })}
    {:else}
        <ul class={classes.childList}>
            {#each item.children ?? [] as child, ci (child.href ?? ci)}
                {@render childLink(child)}
            {/each}
        </ul>
    {/if}
{/snippet}

{#snippet horizontalMenu()}
    <Bits.Root
        bind:ref
        value={horizontalValue}
        onValueChange={(v) => emit(v || undefined)}
        orientation="horizontal"
        {delayDuration}
        {skipDelayDuration}
        class={classes.root}
        {...restProps as Record<string, unknown>}
    >
        <Bits.List bind:ref={listEl} class={classes.list}>
            {#if showHighlight}
                <div
                    class={classes.highlight}
                    style={highlightStyle}
                    data-navigation-menu-highlight=""
                    aria-hidden="true"
                ></div>
            {/if}
            {#if listLeading}{@render listLeading()}{/if}
            {#each groups as group, gi (gi)}
                {#each group as item, index (itemValue(item, gi, index))}
                    {@const iv = itemValue(item, gi, index)}
                    {@const kind = resolvedType(item)}
                    {@const open = openSet.has(iv)}
                    {#if itemSlot}
                        <Bits.Item value={iv} class={classes.item}>
                            {@render itemSlot({ item, index, active: !!item.active, open })}
                        </Bits.Item>
                    {:else if kind === 'label'}
                        <li class={classes.label}>{itemLabelText(item)}</li>
                    {:else if isDropdown(item)}
                        <Bits.Item
                            value={iv}
                            openOnHover={!disableHoverTrigger}
                            class={classes.item}
                        >
                            <Bits.Trigger disabled={disabled || item.disabled}>
                                {#snippet child({ props }: { props: Record<string, unknown> })}
                                    <button
                                        {...disableClickTrigger
                                            ? { ...props, onclick: blockClick }
                                            : props}
                                        class={linkClass(item)}
                                        data-active={item.active ? '' : undefined}
                                    >
                                        {@render linkBody(item, index, open, true)}
                                    </button>
                                {/snippet}
                            </Bits.Trigger>
                            <Bits.Content {...contentProps} class={classes.content}>
                                {@render megaContent(item, index)}
                            </Bits.Content>
                        </Bits.Item>
                    {:else}
                        {@const active = isItemActive(item.active, item.href, item.exact)}
                        {@const href = safeHref(item.href)}
                        <Bits.Item value={iv} class={classes.item}>
                            <Bits.Link {href} {active} onSelect={item.onSelect}>
                                {#snippet child({ props }: { props: Record<string, unknown> })}
                                    <Link
                                        {href}
                                        target={item.target}
                                        raw
                                        exact={item.exact ?? exact}
                                        {active}
                                        disabled={disabled || item.disabled}
                                        {...props}
                                        class={linkClass(item)}
                                    >
                                        {@render linkBody(item, index, open, false)}
                                    </Link>
                                {/snippet}
                            </Bits.Link>
                        </Bits.Item>
                    {/if}
                {/each}
                {#if gi < groups.length - 1}
                    <li role="separator" aria-orientation="vertical" class={classes.separator}></li>
                {/if}
            {/each}
            {#if listTrailing}{@render listTrailing()}{/if}
            {#if arrow}
                <Bits.Indicator class={classes.indicator}>
                    <div class={classes.arrow}></div>
                </Bits.Indicator>
            {/if}
        </Bits.List>
        <div class={classes.viewportWrapper}>
            <Bits.Viewport {...contentProps} class={classes.viewport} />
        </div>
    </Bits.Root>
{/snippet}

{#snippet verticalLeaf(item: NavigationMenuItem, index: number)}
    {@const active = isItemActive(item.active, item.href, item.exact)}
    {@const collapsedTip = effectiveCollapsed && (item.tooltip ?? tooltip)}
    {#if collapsedTip}
        <Tooltip text={itemLabelText(item)} side="right" {...asProps(item.tooltip ?? tooltip)}>
            <Link
                href={safeHref(item.href)}
                target={item.target}
                raw
                exact={item.exact ?? exact}
                {active}
                disabled={disabled || item.disabled}
                onclick={item.onSelect}
                data-active={active ? '' : undefined}
                class={linkClass(item)}
            >
                {@render linkBody(item, index, false, false)}
            </Link>
        </Tooltip>
    {:else}
        <Link
            href={safeHref(item.href)}
            target={item.target}
            raw
            exact={item.exact ?? exact}
            {active}
            disabled={disabled || item.disabled}
            onclick={item.onSelect}
            data-active={active ? '' : undefined}
            class={linkClass(item)}
        >
            {@render linkBody(item, index, false, false)}
        </Link>
    {/if}
{/snippet}

{#snippet verticalItem(item: NavigationMenuItem, index: number, groupIndex: number)}
    {@const iv = itemValue(item, groupIndex, index)}
    {@const kind = resolvedType(item)}
    {@const open = openSet.has(iv)}
    <li class={classes.item}>
        {#if itemSlot}
            {@render itemSlot({ item, index, active: !!item.active, open })}
        {:else if kind === 'label'}
            <span class={classes.label}>{itemLabelText(item)}</span>
        {:else if isDropdown(item)}
            {#if effectiveCollapsed}
                <Popover
                    side="right"
                    sideOffset={8}
                    {...asProps(item.popover ?? popover)}
                    open={flyoutKey === iv}
                    onOpenChange={(open) => handleFlyoutChange(open, iv)}
                    ui={{
                        content:
                            'origin-left data-[state=open]:animate-[zoom-in_150ms_ease] data-[state=closed]:animate-[zoom-out_150ms_ease]'
                    }}
                >
                    <span
                        class={linkClass(item)}
                        onpointerenter={() => openFlyout(iv)}
                        onpointerleave={closeFlyoutSoon}
                        onclickcapture={(e) => {
                            e.stopPropagation()
                            openFlyout(iv)
                        }}
                    >
                        {@render linkBody(item, index, false, false)}
                    </span>
                    {#snippet content()}
                        <div
                            class="min-w-52 p-1"
                            onpointerenter={() => clearTimeout(flyoutTimer)}
                            onpointerleave={closeFlyoutSoon}
                        >
                            {#if itemContent}
                                {@render itemContent({ item, index })}
                            {:else}
                                <p class={classes.childLabel}>{itemLabelText(item)}</p>
                                <ul class="grid gap-0.5">
                                    {#each item.children ?? [] as child, ci (child.href ?? ci)}
                                        {@render childLink(child)}
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/snippet}
                </Popover>
            {:else}
                <button
                    type="button"
                    class={linkClass(item)}
                    aria-expanded={open}
                    disabled={disabled || item.disabled || !collapsible}
                    data-state={open ? 'open' : 'closed'}
                    onclick={() => toggleOpen(iv)}
                >
                    {@render linkBody(item, index, open, true)}
                </button>
                {#if open}
                    <ul class={classes.childList} transition:slide={{ duration: 200 }}>
                        {#each item.children ?? [] as child, ci (child.href ?? ci)}
                            {@render childLink(child)}
                        {/each}
                    </ul>
                {/if}
            {/if}
        {:else}
            {@render verticalLeaf(item, index)}
        {/if}
    </li>
{/snippet}

{#snippet verticalMenu()}
    <svelte:element
        this={as}
        bind:this={ref}
        aria-label="Navigation"
        class={classes.root}
        {...restProps}
    >
        <ul bind:this={listEl} class={classes.list}>
            {#if showHighlight}
                <div
                    class={classes.highlight}
                    style={highlightStyle}
                    data-navigation-menu-highlight=""
                    aria-hidden="true"
                ></div>
            {/if}
            {#if listLeading}{@render listLeading()}{/if}
            {#each groups as group, gi (gi)}
                {#each group as item, index (itemValue(item, gi, index))}
                    {@render verticalItem(item, index, gi)}
                {/each}
                {#if gi < groups.length - 1}
                    <li
                        role="separator"
                        aria-orientation="horizontal"
                        class={classes.separator}
                    ></li>
                {/if}
            {/each}
            {#if listTrailing}{@render listTrailing()}{/if}
        </ul>
    </svelte:element>
{/snippet}

{#if showDrawer}
    <Button
        icon={drawerOpen ? icons.close : icons.menu}
        variant="ghost"
        color="surface"
        aria-label="Toggle navigation"
        aria-expanded={drawerOpen}
        onclick={() => (drawerOpen = !drawerOpen)}
    />
    <Drawer bind:open={drawerOpen} direction="left" {...drawerProps}>
        {#snippet body()}
            <div style="width: {drawerWidth}">
                {@render verticalMenu()}
            </div>
        {/snippet}
    </Drawer>
{:else if orientation === 'horizontal'}
    {@render horizontalMenu()}
{:else}
    {@render verticalMenu()}
{/if}
