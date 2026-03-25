<script lang="ts" module>
    import type { LinkProps } from './link.types.js'

    export type Props = LinkProps

    function parseUrl(url: string, baseUrl: URL) {
        try {
            const parsed = new URL(url, baseUrl.origin)
            return {
                pathname: parsed.pathname,
                query: parsed.searchParams,
                hash: parsed.hash
            }
        } catch {
            return {
                pathname: url,
                query: new URLSearchParams(),
                hash: ''
            }
        }
    }

    function isQueryMatch(
        linkQuery: URLSearchParams,
        currentQuery: URLSearchParams,
        mode: boolean | 'partial'
    ): boolean {
        if (mode === false) return true
        if (mode === 'partial') {
            for (const [key, value] of linkQuery) {
                if (!currentQuery.getAll(key).includes(value)) return false
            }
            return true
        }

        // Exact: check size first (O(1) bail-out), then compare sorted strings
        if (linkQuery.size !== currentQuery.size) return false
        const sorted = (p: URLSearchParams) => new URLSearchParams([...p].sort()).toString()
        return sorted(linkQuery) === sorted(currentQuery)
    }

    function isPathnameMatch(linkPath: string, currentPath: string, exactMatch: boolean): boolean {
        if (exactMatch) return linkPath === currentPath

        const link = linkPath.replace(/\/$/, '') || '/'
        const current = currentPath.replace(/\/$/, '') || '/'

        return link === '/' ? current === '/' : current === link || current.startsWith(link + '/')
    }
</script>

<script lang="ts">
    import { page } from '$app/state'
    import { linkVariants, linkDefaults } from './link.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('link', linkDefaults)

    let {
        ref = $bindable(null),
        href,
        type,
        active,
        exact = false,
        exactQuery = false,
        exactHash = false,
        activeClass,
        inactiveClass,
        disabled = false,
        raw = false,
        external,
        children,
        class: className,
        ui,
        target,
        rel,
        onclick,
        ...restProps
    }: Props = $props()

    const isLink = $derived(!!href)

    const isExternal = $derived(
        isLink &&
            (external ??
                (href!.startsWith('http://') ||
                    href!.startsWith('https://') ||
                    href!.startsWith('//')))
    )

    const resolvedTarget = $derived(
        isLink ? (target ?? (isExternal ? '_blank' : undefined)) : undefined
    )

    const resolvedRel = $derived(
        isLink
            ? (rel ??
                  (isExternal || resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined))
            : undefined
    )

    const isActive = $derived.by(() => {
        if (active !== undefined) return active
        if (!isLink || !page.url || isExternal) return false

        const link = parseUrl(href!, page.url)

        if (exactHash && link.hash !== page.url.hash) return false
        if (!isQueryMatch(link.query, page.url.searchParams, exactQuery)) return false

        return isPathnameMatch(link.pathname, page.url.pathname, exact)
    })

    const baseClass = $derived.by(() => {
        const stateClass = isActive ? activeClass : inactiveClass
        if (raw) return [className, stateClass].filter(Boolean).join(' ')

        const slots = linkVariants({ active: isActive, disabled, raw })
        return slots.base({ class: [config.slots.base, stateClass, className, ui?.base] })
    })

    const ariaCurrent = $derived(isActive && exact ? ('page' as const) : undefined)

    function handleClick(e: MouseEvent) {
        if (disabled) {
            e.preventDefault()
            e.stopPropagation()
            return
        }

        if (typeof onclick === 'function') {
            ;(onclick as (e: MouseEvent) => void)(e)
        }
    }
</script>

{#if isLink}
    <!-- eslint-disable svelte/no-navigation-without-resolve -->
    <a
        bind:this={ref}
        href={disabled ? undefined : href}
        class={baseClass}
        target={resolvedTarget}
        rel={resolvedRel}
        role={disabled ? 'link' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        aria-current={ariaCurrent}
        tabindex={disabled ? -1 : undefined}
        onclick={handleClick}
        {...restProps}
    >
        <!-- eslint-enable svelte/no-navigation-without-resolve -->
        {@render children?.()}
    </a>
{:else}
    <button
        bind:this={ref}
        type={type ?? 'button'}
        class={baseClass}
        {disabled}
        aria-current={ariaCurrent}
        onclick={handleClick}
        {...restProps}
    >
        {@render children?.()}
    </button>
{/if}
