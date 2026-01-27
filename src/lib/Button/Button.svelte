<script lang="ts" module>
    import type { ButtonProps } from './button.types.js'

    export type Props = ButtonProps
</script>

<script lang="ts">
    import Icon from '../Icon/Icon.svelte'
    import { buttonVariants } from './button.variants.js'

    let {
        variant = 'solid',
        color = 'primary',
        size = 'md',
        disabled = false,
        loading = false,
        iconLeading,
        iconTrailing,
        fullWidth = false,
        children,
        class: className,
        ...restProps
    }: Props = $props()

    const classes = $derived(
        buttonVariants({
            variant,
            color,
            size,
            fullWidth,
            loading,
            class: className
        })
    )

    const isDisabled = $derived(disabled || loading)
</script>

<button
    class={classes}
    disabled={isDisabled}
    {...restProps}
>
    {#if loading}
        <Icon name="lucide:loader-2" class="animate-spin" />
    {:else if iconLeading}
        <Icon name={iconLeading} />
    {/if}

    {#if children}
        {@render children()}
    {/if}

    {#if iconTrailing && !loading}
        <Icon name={iconTrailing} />
    {/if}
</button>
