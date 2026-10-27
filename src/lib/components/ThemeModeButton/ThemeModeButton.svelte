<script lang="ts" module>
    import type { ThemeModeButtonProps } from './theme-mode-button.types.js'

    export type Props = ThemeModeButtonProps
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import {
        applyModeOnce,
        mode,
        toggleMode,
        warnOnForeignWatcher
    } from '../ThemeMode/mode.svelte.js'
    import {
        themeModeButtonVariants,
        themeModeButtonDefaults
    } from './theme-mode-button.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { buttonDefaults } from '../Button/button.variants.js'
    import Button from '../Button/Button.svelte'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('themeModeButton', themeModeButtonDefaults)
    const buttonConfig = getComponentConfig('button', buttonDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ui,
        color = config.defaultVariants.color ?? 'surface',
        variant = config.defaultVariants.variant ?? 'ghost',
        size,
        lightIcon = icons.light,
        darkIcon = icons.dark,
        loading = false,
        disabled = false,
        square = true,
        block = false,
        children,
        class: className,
        onclick,
        ...restProps
    }: Props = $props()

    function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLElement }) {
        const result = onclick?.(event)
        if (!event.defaultPrevented) toggleMode()
        return result
    }

    onMount(() => {
        warnOnForeignWatcher()
        applyModeOnce()
    })

    const isDark = $derived(mode.current === 'dark')
    const resolvedSize = $derived(
        size ?? config.defaultVariants.size ?? buttonConfig.defaultVariants.size
    )

    const classes = $derived.by(() => {
        const slots = themeModeButtonVariants({ size: resolvedSize })
        return {
            base: slots.base({ class: [config.slots.base, className, ui?.base] }),
            icon: slots.icon({ class: [config.slots.icon, ui?.icon] }),
            lightIcon: slots.lightIcon({ class: [config.slots.lightIcon, ui?.lightIcon] }),
            darkIcon: slots.darkIcon({ class: [config.slots.darkIcon, ui?.darkIcon] })
        }
    })
</script>

{#if children}
    <Button
        {color}
        {variant}
        size={resolvedSize}
        {loading}
        {disabled}
        {square}
        {block}
        class={classes.base}
        aria-label="Toggle theme"
        onclick={handleClick}
        {...restProps}
    >
        {@render children({ isDark })}
    </Button>
{:else}
    <Button
        {color}
        {variant}
        size={resolvedSize}
        {loading}
        {disabled}
        {square}
        {block}
        class={classes.base}
        aria-label="Toggle theme"
        onclick={handleClick}
        leadingSlot={loading ? undefined : modeIcons}
        {...restProps}
    />
{/if}

{#snippet modeIcons()}
    <Icon name={darkIcon} class={[classes.icon, classes.darkIcon]} />
    <Icon name={lightIcon} class={[classes.icon, classes.lightIcon]} />
{/snippet}
