<script lang="ts" module>
    import type { HeaderProps } from './header.types.js'

    export type Props = HeaderProps
</script>

<script lang="ts">
    import type { ButtonProps } from '../Button/button.types.js'
    import { headerVariants, headerDefaults } from './header.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { page } from '$app/state'
    import Container from '../Container/Container.svelte'
    import Link from '../Link/Link.svelte'
    import Button from '../Button/Button.svelte'
    import Modal from '../Modal/Modal.svelte'
    import Slideover from '../Slideover/Slideover.svelte'
    import Drawer from '../Drawer/Drawer.svelte'

    const config = getComponentConfig('header', headerDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        as = 'header',
        ui,
        title,
        to = '/',
        mode = 'modal',
        menu,
        toggle = true,
        toggleSide = config.defaultVariants.toggleSide,
        open = $bindable(false),
        autoClose = true,
        class: className,
        titleSlot,
        left,
        children,
        right,
        toggleSlot,
        top,
        bottom,
        body,
        content,
        ...restProps
    }: Props = $props()

    const classes = $derived.by(() => {
        const slots = headerVariants({ toggleSide })
        const c = config.slots
        const u = ui ?? {}
        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            container: slots.container({ class: [c.container, u.container] }),
            left: slots.left({ class: [c.left, u.left] }),
            center: slots.center({ class: [c.center, u.center] }),
            right: slots.right({ class: [c.right, u.right] }),
            title: slots.title({ class: [c.title, u.title] }),
            toggle: slots.toggle({ class: [c.toggle, u.toggle] }),
            top: slots.top({ class: [c.top, u.top] }),
            bottom: slots.bottom({ class: [c.bottom, u.bottom] }),
            body: slots.body({ class: [c.body, u.body] })
        }
    })

    const hasMenu = $derived(!!body || !!content)
    const showToggle = $derived(toggle !== false && (!!toggleSlot || hasMenu))

    const userToggle: ButtonProps = $derived(typeof toggle === 'object' ? toggle : {})

    const toggleProps: ButtonProps = $derived({
        color: 'secondary',
        variant: 'ghost',
        icon: open ? icons.close : icons.menu,
        'aria-label': open ? 'Close menu' : 'Open menu',
        'aria-expanded': open,
        ...userToggle
    })

    const menuUi = $derived({ body: classes.body })

    function handleToggle(event: MouseEvent & { currentTarget: EventTarget & HTMLElement }) {
        userToggle.onclick?.(event)
        if (!event.defaultPrevented) {
            open = !open
        }
    }

    let previousPath = page.url.pathname
    $effect(() => {
        const path = page.url.pathname
        if (path !== previousPath) {
            previousPath = path
            if (autoClose) {
                open = false
            }
        }
    })
</script>

{#snippet toggleArea()}
    {#if showToggle}
        {#if toggleSlot}
            {@render toggleSlot()}
        {:else}
            <Button
                {...toggleProps}
                onclick={handleToggle}
                class={[classes.toggle, toggleProps.class]}
            />
        {/if}
    {/if}
{/snippet}

<svelte:element this={as} bind:this={ref} class={classes.root} {...restProps}>
    {#if top}
        <div class={classes.top}>
            {@render top()}
        </div>
    {/if}

    <Container class={classes.container}>
        <div class={classes.left}>
            {#if toggleSide === 'left'}
                {@render toggleArea()}
            {/if}

            {#if titleSlot}
                {@render titleSlot()}
            {:else if title}
                <Link href={to} raw aria-label={title} class={classes.title}>{title}</Link>
            {/if}

            {@render left?.()}
        </div>

        {#if children}
            <div class={classes.center}>
                {@render children()}
            </div>
        {/if}

        <div class={classes.right}>
            {@render right?.()}

            {#if toggleSide === 'right'}
                {@render toggleArea()}
            {/if}
        </div>
    </Container>

    {#if bottom}
        <div class={classes.bottom}>
            {@render bottom()}
        </div>
    {/if}
</svelte:element>

{#if hasMenu}
    {#if mode === 'modal'}
        <Modal
            bind:open
            {title}
            fullscreen
            overlay={menu?.overlay}
            dismissible={menu?.dismissible}
            {body}
            {content}
            ui={menuUi}
        />
    {:else if mode === 'slideover'}
        <Slideover
            bind:open
            {title}
            side={menu?.side ?? 'right'}
            overlay={menu?.overlay}
            dismissible={menu?.dismissible}
            {body}
            {content}
            ui={menuUi}
        />
    {:else if mode === 'drawer'}
        <Drawer
            bind:open
            {title}
            direction={menu?.direction}
            overlay={menu?.overlay}
            {body}
            {content}
            ui={menuUi}
        />
    {/if}
{/if}
