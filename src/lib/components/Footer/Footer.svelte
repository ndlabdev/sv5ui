<script lang="ts" module>
    import type { FooterProps } from './footer.types.js'

    export type Props = FooterProps
</script>

<script lang="ts">
    import { footerVariants, footerDefaults } from './footer.variants.js'
    import { getComponentConfig } from '../../config.js'
    import Container from '../Container/Container.svelte'

    const config = getComponentConfig('footer', footerDefaults)

    let {
        ref = $bindable(null),
        as = 'footer',
        ui,
        class: className,
        top,
        left,
        children,
        right,
        bottom,
        ...restProps
    }: Props = $props()

    const slots = footerVariants()

    const classes = $derived.by(() => {
        const c = config.slots
        const u = ui ?? {}
        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            top: slots.top({ class: [c.top, u.top] }),
            container: slots.container({ class: [c.container, u.container] }),
            left: slots.left({ class: [c.left, u.left] }),
            center: slots.center({ class: [c.center, u.center] }),
            right: slots.right({ class: [c.right, u.right] }),
            bottom: slots.bottom({ class: [c.bottom, u.bottom] })
        }
    })
</script>

<svelte:element this={as} bind:this={ref} class={classes.root} {...restProps}>
    {#if top}
        <div class={classes.top}>
            <Container>
                {@render top()}
            </Container>
        </div>
    {/if}

    <Container class={classes.container}>
        {#if right}
            <div class={classes.right}>
                {@render right()}
            </div>
        {/if}

        {#if children}
            <div class={classes.center}>
                {@render children()}
            </div>
        {/if}

        {#if left}
            <div class={classes.left}>
                {@render left()}
            </div>
        {/if}
    </Container>

    {#if bottom}
        <div class={classes.bottom}>
            <Container>
                {@render bottom()}
            </Container>
        </div>
    {/if}
</svelte:element>
