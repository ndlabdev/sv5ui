<script lang="ts" module>
    import type { CardProps } from './card.types.js'

    export type Props = CardProps
</script>

<script lang="ts">
    import { cardVariants } from './card.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('card')

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

    const slots = $derived(cardVariants({ variant }))

    const rootClass = $derived(slots.root({ class: [config.slots.root, className, ui?.root] }))
    const headerClass = $derived(header ? slots.header({ class: [config.slots.header, ui?.header] }) : '')
    const bodyClass = $derived(children ? slots.body({ class: [config.slots.body, ui?.body] }) : '')
    const footerClass = $derived(footer ? slots.footer({ class: [config.slots.footer, ui?.footer] }) : '')
</script>

<svelte:element this={as} class={rootClass} {...restProps}>
    {#if header}
        <div class={headerClass}>
            {@render header()}
        </div>
    {/if}

    {#if children}
        <div class={bodyClass}>
            {@render children()}
        </div>
    {/if}

    {#if footer}
        <div class={footerClass}>
            {@render footer()}
        </div>
    {/if}
</svelte:element>
