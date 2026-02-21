<script lang="ts" module>
    import type { ThemeModeButtonProps } from './theme-mode-button.types.js'

    export type Props = ThemeModeButtonProps
</script>

<script lang="ts">
    import { toggleMode, mode } from 'mode-watcher'
    import {
        themeModeButtonVariants,
        themeModeButtonDefaults
    } from './theme-mode-button.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('themeModeButton', themeModeButtonDefaults)
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
        ...restProps
    }: Props = $props()

    const isDark = $derived(mode.current === 'dark')

    const slots = $derived(themeModeButtonVariants())

    const iconName = $derived(isDark ? lightIcon : darkIcon)
</script>

{#if children}
    <Button
        {color}
        {variant}
        {size}
        {loading}
        {disabled}
        {square}
        {block}
        class={slots.base({ class: [config.slots.base, className, ui?.base] })}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onclick={toggleMode}
        {...restProps}
    >
        {@render children({ isDark })}
    </Button>
{:else}
    <Button
        {color}
        {variant}
        {size}
        {loading}
        {disabled}
        {square}
        {block}
        icon={iconName}
        class={slots.base({ class: [config.slots.base, className, ui?.base] })}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onclick={toggleMode}
        {...restProps}
    />
{/if}
