<script lang="ts" module>
    import type { DrawerProps } from './drawer.types.js'

    export type Props = DrawerProps
</script>

<script lang="ts">
    import { Drawer } from 'vaul-svelte'
    import { drawerVariants, drawerDefaults } from './drawer.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('drawer', drawerDefaults)

    let {
        open = $bindable(false),
        onOpenChange,
        direction = config.defaultVariants.direction ?? 'bottom',
        inset = config.defaultVariants.inset ?? false,
        title,
        description,
        overlay: showOverlay = true,
        handle: showHandle = true,
        portal = true,
        dismissible = true,
        modal = true,
        nested = false,
        shouldScaleBackground = false,
        closeThreshold,
        scrollLockTimeout,
        snapPoints,
        fadeFromIndex,
        activeSnapPoint = $bindable(undefined),
        onActiveSnapPointChange,
        handleOnly = false,
        noBodyStyles,
        onDrag,
        onRelease,
        onClose,
        ui,
        class: className,
        children,
        content: contentSlot,
        header: headerSlot,
        titleSlot,
        descriptionSlot,
        body: bodySlot,
        footer: footerSlot
    }: Props = $props()

    const hasTitle = $derived(!!title || !!titleSlot)
    const hasDescription = $derived(!!description || !!descriptionSlot)
    const hasHeading = $derived(hasTitle || hasDescription)
    const hasHeader = $derived(!!headerSlot || hasHeading)
    const hasSnapPoints = $derived(!!snapPoints?.length)

    const variantSlots = $derived(drawerVariants({ direction, inset, snapPoints: hasSnapPoints }))

    const classes = $derived({
        overlay: variantSlots.overlay({ class: [config.slots.overlay, ui?.overlay] }),
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        handle: variantSlots.handle({ class: [config.slots.handle, ui?.handle] }),
        container: variantSlots.container({ class: [config.slots.container, ui?.container] }),
        header: variantSlots.header({ class: [config.slots.header, ui?.header] }),
        title: variantSlots.title({ class: [config.slots.title, ui?.title] }),
        description: variantSlots.description({ class: [config.slots.description, ui?.description] }),
        body: variantSlots.body({ class: [config.slots.body, ui?.body] }),
        footer: variantSlots.footer({ class: [config.slots.footer, ui?.footer] })
    })

    function handleOpenChange(value: boolean) {
        open = value
        onOpenChange?.(value)
    }

    function handleActiveSnapPointChange(value: number | string | null) {
        activeSnapPoint = value
        onActiveSnapPointChange?.(value)
    }

    const rootProps = $derived.by(() => {
        const base = {
            open,
            onOpenChange: handleOpenChange,
            direction,
            dismissible,
            modal,
            shouldScaleBackground,
            closeThreshold,
            scrollLockTimeout,
            activeSnapPoint,
            onActiveSnapPointChange: handleActiveSnapPointChange,
            handleOnly,
            noBodyStyles,
            onDrag,
            onRelease,
            onClose
        }
        if (snapPoints && fadeFromIndex != null) {
            return { ...base, snapPoints, fadeFromIndex }
        }
        if (snapPoints) {
            return { ...base, snapPoints }
        }
        return base
    })
</script>

{#snippet drawerInner()}
    {#if contentSlot}
        {#if hasHeading}
            <div class="sr-only">
                {#if hasTitle}
                    <Drawer.Title>
                        {#if titleSlot}{@render titleSlot()}{:else}{title}{/if}
                    </Drawer.Title>
                {/if}
                {#if hasDescription}
                    <Drawer.Description>
                        {#if descriptionSlot}{@render descriptionSlot()}{:else}{description}{/if}
                    </Drawer.Description>
                {/if}
            </div>
        {/if}
        {@render contentSlot()}
    {:else}
        <div class={classes.container}>
            {#if hasHeader}
                <div class={classes.header}>
                    {#if headerSlot}
                        {@render headerSlot()}
                    {:else}
                        {#if hasTitle}
                            <Drawer.Title class={classes.title}>
                                {#if titleSlot}{@render titleSlot()}{:else}{title}{/if}
                            </Drawer.Title>
                        {/if}
                        {#if hasDescription}
                            <Drawer.Description class={classes.description}>
                                {#if descriptionSlot}{@render descriptionSlot()}{:else}{description}{/if}
                            </Drawer.Description>
                        {/if}
                    {/if}
                </div>
            {/if}

            {#if bodySlot}
                <div class={classes.body}>
                    {@render bodySlot()}
                </div>
            {/if}

            {#if footerSlot}
                <div class={classes.footer}>
                    {@render footerSlot()}
                </div>
            {/if}
        </div>
    {/if}
{/snippet}

{#snippet drawerContent()}
    {#if showOverlay}
        <Drawer.Overlay class={classes.overlay} />
    {/if}

    <Drawer.Content class={[classes.content, !children ? className : undefined]}>
        {#if showHandle}
            <Drawer.Handle class={classes.handle} />
        {/if}
        {@render drawerInner()}
    </Drawer.Content>
{/snippet}

{#snippet drawerBody()}
    {#if children}
        <Drawer.Trigger class={className as string}>
            {@render children()}
        </Drawer.Trigger>
    {/if}

    {#if portal}
        <Drawer.Portal>
            {@render drawerContent()}
        </Drawer.Portal>
    {:else}
        {@render drawerContent()}
    {/if}
{/snippet}

{#if nested}
    <Drawer.NestedRoot {...rootProps}>
        {@render drawerBody()}
    </Drawer.NestedRoot>
{:else}
    <Drawer.Root {...rootProps}>
        {@render drawerBody()}
    </Drawer.Root>
{/if}
