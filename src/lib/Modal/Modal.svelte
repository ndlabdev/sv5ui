<script lang="ts" module>
    import type { ModalProps } from './modal.types.js'

    export type Props = ModalProps
</script>

<script lang="ts">
    import { Dialog } from 'bits-ui'
    import { modalVariants, modalDefaults } from './modal.variants.js'
    import { getComponentConfig } from '../config.js'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('modal', modalDefaults)

    let {
        open = $bindable(false),
        onOpenChange,
        onOpenChangeComplete,
        trapFocus = true,
        preventScroll = true,
        onOpenAutoFocus,
        onCloseAutoFocus,
        onEscapeKeydown,
        onInteractOutside,
        forceMount,
        restoreScrollDelay,
        title,
        description,
        overlay: showOverlay = config.defaultVariants.overlay ?? true,
        scrollable = config.defaultVariants.scrollable ?? false,
        transition = config.defaultVariants.transition ?? true,
        fullscreen = config.defaultVariants.fullscreen ?? false,
        portal = true,
        close: closeProp = true,
        dismissible = true,
        ui,
        class: className,
        children,
        content: contentSlot,
        header: headerSlot,
        titleSlot,
        descriptionSlot,
        body: bodySlot,
        footer: footerSlot,
        closeSlot
    }: Props = $props()

    const showClose = $derived(!!closeProp)
    const closeProps = $derived(typeof closeProp === 'object' ? closeProp : {})

    const hasTitle = $derived(!!title || !!titleSlot)
    const hasDescription = $derived(!!description || !!descriptionSlot)
    const hasHeading = $derived(hasTitle || hasDescription)
    const hasHeader = $derived(!!headerSlot || hasHeading || showClose || !!closeSlot)

    const variantSlots = $derived(
        modalVariants({ transition, fullscreen, overlay: showOverlay, scrollable })
    )

    const classes = $derived({
        overlay: variantSlots.overlay({ class: [config.slots.overlay, ui?.overlay] }),
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        header: variantSlots.header({ class: [config.slots.header, ui?.header] }),
        wrapper: variantSlots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
        title: variantSlots.title({ class: [config.slots.title, ui?.title] }),
        description: variantSlots.description({
            class: [config.slots.description, ui?.description]
        }),
        body: variantSlots.body({ class: [config.slots.body, ui?.body] }),
        footer: variantSlots.footer({ class: [config.slots.footer, ui?.footer] }),
        close: variantSlots.close({ class: [config.slots.close, ui?.close] })
    })

    const contentProps = $derived.by(() => {
        const behavior = dismissible ? ('close' as const) : ('ignore' as const)
        return {
            trapFocus,
            preventScroll,
            escapeKeydownBehavior: behavior,
            interactOutsideBehavior: behavior,
            onOpenAutoFocus,
            onCloseAutoFocus,
            onEscapeKeydown,
            onInteractOutside,
            forceMount,
            restoreScrollDelay
        }
    })

    function handleOpenChange(value: boolean) {
        open = value
        onOpenChange?.(value)
    }
</script>

{#snippet titleEl()}
    {#if titleSlot}{@render titleSlot()}{:else}{title}{/if}
{/snippet}

{#snippet descriptionEl()}
    {#if descriptionSlot}{@render descriptionSlot()}{:else}{description}{/if}
{/snippet}

{#snippet modalContentInner()}
    <Dialog.Content {...contentProps} class={[classes.content, !children ? className : undefined]}>
        {#if contentSlot}
            {#if hasHeading}
                <div class="sr-only">
                    {#if hasTitle}<Dialog.Title>{@render titleEl()}</Dialog.Title>{/if}
                    {#if hasDescription}<Dialog.Description
                            >{@render descriptionEl()}</Dialog.Description
                        >{/if}
                </div>
            {/if}
            {@render contentSlot()}
        {:else}
            {#if hasHeader}
                <div class={classes.header}>
                    {#if headerSlot}
                        {@render headerSlot()}
                    {:else}
                        <div class={classes.wrapper}>
                            {#if hasTitle}
                                <Dialog.Title class={classes.title}
                                    >{@render titleEl()}</Dialog.Title
                                >
                            {/if}
                            {#if hasDescription}
                                <Dialog.Description class={classes.description}
                                    >{@render descriptionEl()}</Dialog.Description
                                >
                            {/if}
                        </div>

                        {#if showClose || closeSlot}
                            <Dialog.Close>
                                {#snippet child({ props })}
                                    {#if closeSlot}
                                        <span {...props} class={classes.close}
                                            >{@render closeSlot()}</span
                                        >
                                    {:else}
                                        <Button
                                            {...props}
                                            leadingIcon={closeProps.icon ?? 'lucide:x'}
                                            color={closeProps.color ?? 'surface'}
                                            variant={closeProps.variant ?? 'ghost'}
                                            size={closeProps.size ?? 'sm'}
                                            square
                                            aria-label="Close"
                                            class={classes.close}
                                        />
                                    {/if}
                                {/snippet}
                            </Dialog.Close>
                        {/if}
                    {/if}
                </div>
            {/if}

            {#if bodySlot}
                <div class={classes.body}>{@render bodySlot()}</div>
            {/if}

            {#if footerSlot}
                <div class={classes.footer}>{@render footerSlot()}</div>
            {/if}
        {/if}
    </Dialog.Content>
{/snippet}

{#snippet modalPortalContent()}
    {#if scrollable}
        <Dialog.Overlay class={classes.overlay}>
            {@render modalContentInner()}
        </Dialog.Overlay>
    {:else}
        {#if showOverlay}
            <Dialog.Overlay class={classes.overlay} />
        {/if}
        {@render modalContentInner()}
    {/if}
{/snippet}

<Dialog.Root bind:open onOpenChange={handleOpenChange} {onOpenChangeComplete}>
    {#if children}
        <Dialog.Trigger class={className as string}>
            {@render children()}
        </Dialog.Trigger>
    {/if}

    {#if portal}
        <Dialog.Portal>{@render modalPortalContent()}</Dialog.Portal>
    {:else}
        {@render modalPortalContent()}
    {/if}
</Dialog.Root>
