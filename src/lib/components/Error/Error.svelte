<script lang="ts" module>
    import type { ErrorProps } from './error.types.js'

    export type Props = ErrorProps
</script>

<script lang="ts">
    import type { ButtonProps } from '../Button/button.types.js'
    import { errorVariants, errorDefaults } from './error.variants.js'
    import { getComponentConfig } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('error', errorDefaults)

    let {
        ref = $bindable(null),
        as = 'main',
        ui,
        icon,
        error,
        redirect = '/',
        clear = true,
        onClear,
        class: className,
        leading,
        statusCode,
        statusMessage,
        message,
        links,
        children,
        ...restProps
    }: Props = $props()

    const slots = errorVariants()

    const classes = $derived.by(() => {
        const c = config.slots
        return {
            root: slots.root({ class: [c.root, className, ui?.root] }),
            leading: slots.leading({ class: [c.leading, ui?.leading] }),
            leadingIcon: slots.leadingIcon({ class: [c.leadingIcon, ui?.leadingIcon] }),
            statusCode: slots.statusCode({ class: [c.statusCode, ui?.statusCode] }),
            statusMessage: slots.statusMessage({ class: [c.statusMessage, ui?.statusMessage] }),
            message: slots.message({ class: [c.message, ui?.message] }),
            links: slots.links({ class: [c.links, ui?.links] })
        }
    })

    const clearButton: ButtonProps = $derived({
        label: 'Back to home',
        color: 'primary',
        size: 'lg',
        ...(onClear ? {} : { href: redirect }),
        ...(typeof clear === 'object' ? clear : {})
    })

    const showMessage = $derived(!!error?.message && error.message !== error.statusMessage)
</script>

<svelte:element this={as} bind:this={ref} class={classes.root} {...restProps}>
    {#if leading}
        <div class={classes.leading}>
            {@render leading()}
        </div>
    {:else if icon}
        <div class={classes.leading}>
            <Icon name={icon} class={classes.leadingIcon} />
        </div>
    {/if}

    {#if statusCode}
        {@render statusCode()}
    {:else if error?.statusCode}
        <p class={classes.statusCode}>{error.statusCode}</p>
    {/if}

    {#if statusMessage}
        {@render statusMessage()}
    {:else if error?.statusMessage}
        <h1 class={classes.statusMessage}>{error.statusMessage}</h1>
    {/if}

    {#if message}
        {@render message()}
    {:else if showMessage}
        <p class={classes.message}>{error?.message}</p>
    {/if}

    {#if links}
        <div class={classes.links}>
            {@render links()}
        </div>
    {:else if clear}
        <div class={classes.links}>
            <Button onclick={onClear} {...clearButton} />
        </div>
    {/if}

    {@render children?.()}
</svelte:element>
