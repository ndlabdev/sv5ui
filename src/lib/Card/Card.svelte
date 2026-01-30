<script lang="ts" module>
    import type { CardProps } from './card.types.js'

    export type Props = CardProps
</script>

<script lang="ts">
    import { cardVariants, cardDefaults } from './card.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('card', cardDefaults)

    let {
        as = 'div',
        ui,
        variant = config.defaultVariants.variant,
        class: className,
        header,
        children,
        footer,
        ...restProps
    }: Props = $props()

    const classes = $derived.by(() => {
        const slots = cardVariants({ variant })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            header: header ? slots.header({ class: [config.slots.header, ui?.header] }) : '',
            body: children ? slots.body({ class: [config.slots.body, ui?.body] }) : '',
            footer: footer ? slots.footer({ class: [config.slots.footer, ui?.footer] }) : ''
        }
    })
</script>

<svelte:element this={as} class={classes.root} {...restProps}>
    {#if header}
        <div class={classes.header}>
            {@render header()}
        </div>
    {/if}

    {#if children}
        <div class={classes.body}>
            {@render children()}
        </div>
    {/if}

    {#if footer}
        <div class={classes.footer}>
            {@render footer()}
        </div>
    {/if}
</svelte:element>
