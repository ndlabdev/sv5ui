<script lang="ts" module>
    import type { NavigationMenuProps } from './navigation-menu.types.js'

    export type Props = NavigationMenuProps
</script>

<script lang="ts">
    import type { NavigationMenuItem } from './navigation-menu.types.js'
    import { navigationMenuVariants, navigationMenuDefaults } from './navigation-menu.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { page } from '$app/state'
    import { SvelteSet } from 'svelte/reactivity'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import Badge from '../Badge/Badge.svelte'
    import Link from '../Link/Link.svelte'
    import Separator from '../Separator/Separator.svelte'
    import Tooltip from '../Tooltip/Tooltip.svelte'

    const config = getComponentConfig('navigationMenu', navigationMenuDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        items = [],
        orientation = config.defaultVariants.orientation ?? 'horizontal',
        variant = config.defaultVariants.variant ?? 'pill',
        color = config.defaultVariants.color ?? 'primary',
        collapsed = false,
        disabled = false,
        highlight = true,
        ui,
        class: className,
        leading,
        label: labelSlot,
        trailing,
        ...restProps
    }: NavigationMenuProps = $props()

    // =========================================================================
    // Active state detection — needed for parent highlight when child is active
    // =========================================================================
    function isItemActive(item: NavigationMenuItem): boolean {
        if (item.disabled) return false
        if (!item.href || !page.url) return false

        try {
            const parsed = new URL(item.href, page.url.origin)
            const linkPath = parsed.pathname.replace(/\/$/, '') || '/'
            const currentPath = page.url.pathname.replace(/\/$/, '') || '/'
            return linkPath === '/'
                ? currentPath === '/'
                : currentPath === linkPath || currentPath.startsWith(linkPath + '/')
        } catch {
            return false
        }
    }

    function isItemOrChildActive(item: NavigationMenuItem): boolean {
        if (isItemActive(item)) return true
        if (item.children) {
            return item.children.some((child) => isItemOrChildActive(child))
        }
        return false
    }

    // =========================================================================
    // Expand state for children (vertical accordion)
    // =========================================================================
    // svelte-ignore state_referenced_locally
    const initialExpanded = items
        .filter((item) => item.children && (item.defaultOpen || isItemOrChildActive(item)))
        .map((item) => item.value ?? item.label ?? '')
    const expandedKeys = new SvelteSet<string>(initialExpanded)

    function isExpanded(item: NavigationMenuItem): boolean {
        return expandedKeys.has(item.value ?? item.label ?? '')
    }

    function toggleExpand(item: NavigationMenuItem) {
        const key = item.value ?? item.label ?? ''
        if (expandedKeys.has(key)) {
            expandedKeys.delete(key)
        } else {
            expandedKeys.add(key)
        }
    }

    // =========================================================================
    // Precomputed variant classes
    // =========================================================================
    const activeClasses = $derived(
        navigationMenuVariants({
            orientation,
            variant,
            color,
            active: true,
            collapsed: collapsed || undefined
        } as Parameters<typeof navigationMenuVariants>[0])
    )

    const inactiveClasses = $derived(
        navigationMenuVariants({
            orientation,
            variant,
            color,
            active: false,
            collapsed: collapsed || undefined
        } as Parameters<typeof navigationMenuVariants>[0])
    )

    const disabledClasses = $derived(
        navigationMenuVariants({
            orientation,
            variant,
            color,
            active: false,
            disabled: true,
            collapsed: collapsed || undefined
        } as Parameters<typeof navigationMenuVariants>[0])
    )

    function getItemClasses(item: NavigationMenuItem, isActive: boolean) {
        const isDisabled = item.disabled || disabled
        const slots = isDisabled
            ? disabledClasses
            : isActive && highlight
              ? activeClasses
              : inactiveClasses

        return {
            link: slots.link({ class: [config.slots.link, item.class, ui?.link] }),
            linkLeadingIcon: slots.linkLeadingIcon({
                class: [config.slots.linkLeadingIcon, ui?.linkLeadingIcon]
            }),
            linkLeadingAvatar: slots.linkLeadingAvatar({
                class: [config.slots.linkLeadingAvatar, ui?.linkLeadingAvatar]
            }),
            linkLabel: slots.linkLabel({ class: [config.slots.linkLabel, ui?.linkLabel] }),
            linkTrailing: slots.linkTrailing({
                class: [config.slots.linkTrailing, ui?.linkTrailing]
            }),
            linkTrailingBadge: slots.linkTrailingBadge({
                class: [config.slots.linkTrailingBadge, ui?.linkTrailingBadge]
            }),
            linkTrailingIcon: slots.linkTrailingIcon({
                class: [config.slots.linkTrailingIcon, ui?.linkTrailingIcon]
            })
        }
    }

    const baseSlots = $derived(
        navigationMenuVariants({
            orientation,
            variant,
            color,
            collapsed: collapsed || undefined
        } as Parameters<typeof navigationMenuVariants>[0])
    )

    const classes = $derived({
        root: baseSlots.root({ class: [config.slots.root, className, ui?.root] }),
        list: baseSlots.list({ class: [config.slots.list, ui?.list] }),
        item: baseSlots.item({ class: [config.slots.item, ui?.item] }),
        childList: baseSlots.childList({ class: [config.slots.childList, ui?.childList] }),
        childLink: baseSlots.childLink({ class: [config.slots.childLink, ui?.childLink] }),
        childLinkActive: activeClasses.childLink({
            class: [config.slots.childLink, ui?.childLink]
        }),
        childLinkIcon: baseSlots.childLinkIcon({
            class: [config.slots.childLinkIcon, ui?.childLinkIcon]
        }),
        childLinkLabel: baseSlots.childLinkLabel({
            class: [config.slots.childLinkLabel, ui?.childLinkLabel]
        }),
        childLinkDescription: baseSlots.childLinkDescription({
            class: [config.slots.childLinkDescription, ui?.childLinkDescription]
        })
    })

    // =========================================================================
    // Helpers
    // =========================================================================
    function getTrailingIcon(item: NavigationMenuItem): string | undefined {
        if (item.trailingIcon) return item.trailingIcon
        if (item.children && item.children.length > 0) {
            return orientation === 'vertical' ? icons.chevronRight : icons.chevronDown
        }
        return undefined
    }

    function hasTrailingContent(item: NavigationMenuItem): boolean {
        return !!trailing || !!item.badge || !!getTrailingIcon(item)
    }
</script>

{#snippet itemLeading(
    item: NavigationMenuItem,
    index: number,
    active: boolean,
    cls: ReturnType<typeof getItemClasses>
)}
    {#if leading}
        {@render leading({ item, index, active })}
    {:else if item.avatar}
        <Avatar
            src={item.avatar.src}
            alt={item.avatar.alt ?? item.label}
            size="2xs"
            class={cls.linkLeadingAvatar}
        />
    {:else if item.icon}
        <Icon name={item.icon} class={cls.linkLeadingIcon} />
    {/if}
{/snippet}

{#snippet itemLabel(
    item: NavigationMenuItem,
    index: number,
    active: boolean,
    cls: ReturnType<typeof getItemClasses>
)}
    {#if labelSlot}
        <span class={cls.linkLabel}>{@render labelSlot({ item, index, active })}</span>
    {:else if item.label}
        <span class={cls.linkLabel}>{item.label}</span>
    {/if}
{/snippet}

{#snippet itemTrailing(
    item: NavigationMenuItem,
    index: number,
    active: boolean,
    cls: ReturnType<typeof getItemClasses>,
    expanded?: boolean
)}
    {@const trIcon = getTrailingIcon(item)}
    {#if trailing}
        {@render trailing({ item, index, active })}
    {:else if item.badge || trIcon}
        <span class={cls.linkTrailing}>
            {#if item.badge}
                <Badge
                    label={item.badge.label}
                    color={item.badge.color ?? 'primary'}
                    variant={item.badge.variant ?? 'soft'}
                    size="xs"
                    class={cls.linkTrailingBadge}
                />
            {/if}
            {#if trIcon}
                <Icon
                    name={trIcon}
                    class="{cls.linkTrailingIcon} {expanded ? 'rotate-90' : ''}"
                    size={16}
                />
            {/if}
        </span>
    {/if}
{/snippet}

<nav bind:this={ref} class={classes.root} aria-label="Navigation" {...restProps}>
    <ul class={classes.list}>
        {#each items as item, index (item.value ?? item.label ?? String(index))}
            {#if item.type === 'separator'}
                <li>
                    <Separator
                        orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
                    />
                </li>
            {:else}
                {@const active = isItemOrChildActive(item)}
                {@const cls = getItemClasses(item, active)}
                {@const hasChildren = item.children && item.children.length > 0}
                {@const isDisabled = item.disabled || disabled}

                <li class={classes.item}>
                    {#if hasChildren && orientation === 'vertical'}
                        <!-- Vertical parent with children: button trigger -->
                        {#if collapsed}
                            <Tooltip text={item.label} side="right">
                                <button
                                    type="button"
                                    class={cls.link}
                                    disabled={isDisabled}
                                    aria-expanded={isExpanded(item)}
                                    onclick={() => toggleExpand(item)}
                                >
                                    {@render itemLeading(item, index, active, cls)}
                                    {@render itemLabel(item, index, active, cls)}
                                </button>
                            </Tooltip>
                        {:else}
                            <button
                                type="button"
                                class={cls.link}
                                disabled={isDisabled}
                                aria-expanded={isExpanded(item)}
                                onclick={() => toggleExpand(item)}
                            >
                                {@render itemLeading(item, index, active, cls)}
                                {@render itemLabel(item, index, active, cls)}
                                {@render itemTrailing(item, index, active, cls, isExpanded(item))}
                            </button>
                        {/if}
                    {:else}
                        <!-- Leaf item: Link component -->
                        {#if collapsed && orientation === 'vertical'}
                            <Tooltip text={item.label} side="right">
                                <Link href={item.href} disabled={isDisabled} raw class={cls.link}>
                                    {@render itemLeading(item, index, active, cls)}
                                    {@render itemLabel(item, index, active, cls)}
                                </Link>
                            </Tooltip>
                        {:else}
                            <Link href={item.href} disabled={isDisabled} raw class={cls.link}>
                                {@render itemLeading(item, index, active, cls)}
                                {@render itemLabel(item, index, active, cls)}
                                {#if hasTrailingContent(item)}
                                    {@render itemTrailing(item, index, active, cls)}
                                {/if}
                            </Link>
                        {/if}
                    {/if}

                    <!-- Vertical children: accordion -->
                    {#if hasChildren && orientation === 'vertical' && !collapsed && isExpanded(item)}
                        <ul class={classes.childList}>
                            {#each item.children as child, childIdx (child.value ?? child.label ?? String(childIdx))}
                                {#if child.type === 'separator'}
                                    <li>
                                        <Separator />
                                    </li>
                                {:else}
                                    {@const childActive = isItemActive(child)}
                                    <li>
                                        <Link
                                            href={child.href}
                                            disabled={child.disabled || disabled}
                                            raw
                                            class={childActive && highlight
                                                ? classes.childLinkActive
                                                : classes.childLink}
                                        >
                                            {#if child.icon}
                                                <Icon
                                                    name={child.icon}
                                                    class={classes.childLinkIcon}
                                                />
                                            {/if}
                                            <div class="min-w-0 flex-1">
                                                <span class={classes.childLinkLabel}
                                                    >{child.label}</span
                                                >
                                                {#if child.description}
                                                    <p class={classes.childLinkDescription}>
                                                        {child.description}
                                                    </p>
                                                {/if}
                                            </div>
                                        </Link>
                                    </li>
                                {/if}
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/if}
        {/each}
    </ul>
</nav>
