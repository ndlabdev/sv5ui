<script lang="ts" module>
    import type { ThemeModeProps } from './theme-mode.types.js'

    export type Props = ThemeModeProps
</script>

<script lang="ts">
    import { onMount, untrack } from 'svelte'
    import {
        DEFAULT_MODE_STORAGE_KEY,
        DEFAULT_THEME_STORAGE_KEY,
        applyMode,
        applyTheme,
        configureMode,
        isValidMode,
        mode,
        readStored,
        readTheme,
        setMode,
        setTheme,
        systemPrefersMode,
        warnOnForeignWatcher
    } from './mode.svelte.js'
    import { createHeadScript, isValidNonce } from './mode-script.js'

    let {
        track = true,
        defaultMode = 'system',
        themeColors,
        disableTransitions = true,
        synchronousModeChanges = false,
        darkClassNames = ['dark'],
        lightClassNames = [],
        defaultTheme = '',
        modeStorageKey = DEFAULT_MODE_STORAGE_KEY,
        themeStorageKey = DEFAULT_THEME_STORAGE_KEY,
        nonce = '',
        disableHeadScriptInjection = false
    }: Props = $props()

    untrack(() => {
        if (nonce && !isValidNonce(nonce)) {
            // eslint-disable-next-line no-console
            console.warn(
                '[sv5ui ThemeMode] The nonce contains characters outside the CSP nonce set and was dropped.'
            )
        }
    })

    const headScript = $derived(
        createHeadScript(
            {
                defaultMode,
                themeColors,
                darkClassNames,
                lightClassNames,
                defaultTheme,
                modeStorageKey,
                themeStorageKey
            },
            nonce
        )
    )

    const resolvedMode = $derived(mode.current)
    const theme = $derived(readTheme())

    $effect.pre(() => {
        configureMode({
            darkClassNames,
            lightClassNames,
            themeColors,
            disableTransitions,
            synchronousModeChanges,
            modeStorageKey,
            themeStorageKey
        })
    })

    $effect(() => {
        void [resolvedMode, theme, darkClassNames, lightClassNames, themeColors]
        applyMode()
        applyTheme()
    })

    onMount(() => {
        systemPrefersMode.tracking(track)
        systemPrefersMode.query()
        const stored = readStored(modeStorageKey)
        setMode(isValidMode(stored) ? stored : defaultMode)
        setTheme(readStored(themeStorageKey) || defaultTheme)
        warnOnForeignWatcher()
    })
</script>

<svelte:head>
    {#if themeColors}
        <meta name="theme-color" content={themeColors.dark} />
    {/if}
    {#if !disableHeadScriptInjection}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html headScript}
    {/if}
</svelte:head>
