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
    // Active state detection
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
    // Precomputed variant classes for active/inactive states
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
        }),
        separator: baseSlots.separator({ class: [config.slots.separator, ui?.separator] })
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
</script>

{#snippet itemLink(item: NavigationMenuItem, index: number, level: 'root' | 'child')}
    {@const active = isItemOrChildActive(item)}
    {@const itemClasses = level === 'root' ? getItemClasses(item, active) : null}
    {@const trailingIcon = level === 'root' ? getTrailingIcon(item) : undefined}
    {@const hasChildren = item.children && item.children.length > 0}
    {@const isDisabled = item.disabled || disabled}
    {@const slotProps = { item, index, active }}

    {#if level === 'root'}
        {#if hasChildren && orientation === 'vertical'}
            <!-- Vertical with children: trigger to expand -->
            <button
                type="button"
                class={itemClasses?.link}
                disabled={isDisabled}
                aria-expanded={isExpanded(item)}
                onclick={() => toggleExpand(item)}
            >
                {#if leading}
                    {@render leading(slotProps)}
                {:else if item.avatar}
                    <Avatar
                        src={item.avatar.src}
                        alt={item.avatar.alt ?? item.label}
                        size="2xs"
                        class={itemClasses?.linkLeadingAvatar}
                    />
                {:else if item.icon}
                    <Icon name={item.icon} class={itemClasses?.linkLeadingIcon} />
                {/if}

                {#if labelSlot}
                    <span class={itemClasses?.linkLabel}>{@render labelSlot(slotProps)}</span>
                {:else}
                    <span class={itemClasses?.linkLabel}>{item.label}</span>
                {/if}

                {#if trailing}
                    {@render trailing(slotProps)}
                {:else}
                    <span class={itemClasses?.linkTrailing}>
                        {#if item.badge}
                            <Badge
                                label={item.badge.label}
                                color={item.badge.color ?? 'primary'}
                                variant={item.badge.variant ?? 'soft'}
                                size="xs"
                                class={itemClasses?.linkTrailingBadge}
                            />
                        {/if}
                        {#if trailingIcon}
                            <Icon
                                name={trailingIcon}
                                class="{itemClasses?.linkTrailingIcon} {isExpanded(item)
                                    ? 'rotate-90'
                                    : ''}"
                                size={16}
                            />
                        {/if}
                    </span>
                {/if}
            </button>
        {:else}
            <!-- eslint-disable svelte/no-navigation-without-resolve -->
            <a
                href={isDisabled ? undefined : item.href}
                class={itemClasses?.link}
                aria-disabled={isDisabled || undefined}
                aria-current={active ? 'page' : undefined}
                tabindex={isDisabled ? -1 : undefined}
            >
                {#if leading}
                    {@render leading(slotProps)}
                {:else if item.avatar}
                    <Avatar
                        src={item.avatar.src}
                        alt={item.avatar.alt ?? item.label}
                        size="2xs"
                        class={itemClasses?.linkLeadingAvatar}
                    />
                {:else if item.icon}
                    <Icon name={item.icon} class={itemClasses?.linkLeadingIcon} />
                {/if}

                {#if labelSlot}
                    <span class={itemClasses?.linkLabel}>{@render labelSlot(slotProps)}</span>
                {:else}
                    <span class={itemClasses?.linkLabel}>{item.label}</span>
                {/if}

                {#if trailing}
                    {@render trailing(slotProps)}
                {:else}
                    <span class={itemClasses?.linkTrailing}>
                        {#if item.badge}
                            <Badge
                                label={item.badge.label}
                                color={item.badge.color ?? 'primary'}
                                variant={item.badge.variant ?? 'soft'}
                                size="xs"
                                class={itemClasses?.linkTrailingBadge}
                            />
                        {/if}
                    </span>
                {/if}
            </a>
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
        {/if}
    {:else}
        <!-- eslint-disable svelte/no-navigation-without-resolve -->
        <a
            href={isDisabled ? undefined : item.href}
            class={active && highlight ? classes.childLinkActive : classes.childLink}
            aria-disabled={isDisabled || undefined}
            aria-current={active ? 'page' : undefined}
            tabindex={isDisabled ? -1 : undefined}
        >
            {#if item.icon}
                <Icon name={item.icon} class={classes.childLinkIcon} />
            {/if}
            <div class="min-w-0 flex-1">
                <span class={classes.childLinkLabel}>{item.label}</span>
                {#if item.description}
                    <p class={classes.childLinkDescription}>{item.description}</p>
                {/if}
            </div>
        </a>
        <!-- eslint-enable svelte/no-navigation-without-resolve -->
    {/if}
{/snippet}

<nav bind:this={ref} class={classes.root} aria-label="Navigation" {...restProps}>
    <ul class={classes.list}>
        {#each items as item, index (item.value ?? item.label ?? String(index))}
            {#if item.type === 'separator'}
                <li role="separator" class={classes.separator}></li>
            {:else}
                <li class={classes.item}>
                    {#if collapsed && orientation === 'vertical'}
                        <!-- Collapsed: icon + tooltip -->
                        <Tooltip text={item.label} side="right">
                            {@render itemLink(item, index, 'root')}
                        </Tooltip>
                    {:else}
                        {@render itemLink(item, index, 'root')}
                    {/if}

                    <!-- Vertical children: accordion expand -->
                    {#if item.children && item.children.length > 0 && orientation === 'vertical' && !collapsed && isExpanded(item)}
                        <ul class={classes.childList}>
                            {#each item.children as child, childIdx (child.value ?? child.label ?? String(childIdx))}
                                {#if child.type === 'separator'}
                                    <li role="separator" class={classes.separator}></li>
                                {:else}
                                    <li>
                                        {@render itemLink(child, childIdx, 'child')}
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
