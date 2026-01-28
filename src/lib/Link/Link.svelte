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

    function isQueryMatch(linkQuery: URLSearchParams, currentQuery: URLSearchParams, mode: boolean | 'partial'): boolean {
        if (mode === false) return true
        if (mode === 'partial') {
            for (const [key, value] of linkQuery) {
                if (currentQuery.get(key) !== value) return false
            }
            return true
        }
        return linkQuery.toString() === currentQuery.toString()
    }

    function isPathnameMatch(linkPath: string, currentPath: string, exactMatch: boolean): boolean {
        if (exactMatch) return linkPath === currentPath

        const link = linkPath.replace(/\/$/, '') || '/'
        const current = currentPath.replace(/\/$/, '') || '/'

        return link === '/'
            ? current === '/'
            : current === link || current.startsWith(link + '/')
    }
</script>

<script lang="ts">
    import { page } from '$app/state'
    import { linkVariants } from './link.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('link')

    let {
        href,
        color = config.defaultVariants.color,
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
        ...restProps
    }: Props = $props()

    const isExternal = $derived(
        external ?? (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))
    )

    const resolvedTarget = $derived(target ?? (isExternal ? '_blank' : undefined))

    const resolvedRel = $derived(
        rel ?? (isExternal || resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined)
    )

    const isActive = $derived.by(() => {
        if (active !== undefined) return active
        if (!page.url || isExternal) return false

        const link = parseUrl(href, page.url)

        if (exactHash && link.hash !== page.url.hash) return false
        if (!isQueryMatch(link.query, page.url.searchParams, exactQuery)) return false

        return isPathnameMatch(link.pathname, page.url.pathname, exact)
    })

    const baseClass = $derived.by(() => {
        const stateClass = isActive ? activeClass : inactiveClass
        if (raw) return [className, stateClass].filter(Boolean).join(' ')

        const slots = linkVariants({ color, active: isActive, disabled, raw })
        return slots.base({ class: [config.slots.base, stateClass, className, ui?.base] })
    })

    const ariaCurrent = $derived(isActive && exact ? ('page' as const) : undefined)
</script>

<a
    href={disabled ? undefined : href}
    class={baseClass}
    target={resolvedTarget}
    rel={resolvedRel}
    aria-disabled={disabled ? 'true' : undefined}
    aria-current={ariaCurrent}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
>
    {@render children?.()}
</a>
