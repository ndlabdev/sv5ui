<script lang="ts" module>
    import type { BannerProps } from './banner.types.js'

    export type Props = BannerProps
</script>

<script lang="ts">
    import { useId } from 'bits-ui'
    import { bannerVariants, bannerDefaults } from './banner.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('banner', bannerDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        as = 'div',
        id,
        title,
        icon,
        color = config.defaultVariants.color,
        to,
        target,
        close = false,
        closeIcon,
        actions,
        open = $bindable(true),
        onClose,
        class: className,
        ui,
        leading,
        titleSlot,
        actionsSlot,
        closeSlot,
        ...restProps
    }: Props = $props()

    const fallbackId = useId('banner-')
    const effectiveId = $derived(id ?? fallbackId)

    let dismissed = $state(false)

    function storageKey(rawId: string) {
        return `sv5ui-banner-${rawId.replace(/[^\w-]/g, '-')}`
    }

    $effect(() => {
        void open
        if (!id || typeof window === 'undefined') {
            dismissed = false
            return
        }
        dismissed = localStorage.getItem(storageKey(id)) === '1'
    })

    const visible = $derived(open && !dismissed)
    const isClickable = $derived(!!to)
    const resolvedCloseIcon = $derived(closeIcon ?? icons.close)
    const closeButtonProps = $derived(!close ? null : close === true ? {} : close)

    const classes = $derived.by(() => {
        const slots = bannerVariants({ color, to: isClickable })
        const c = config.slots
        const u = ui ?? {}
        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            container: slots.container({ class: [c.container, u.container] }),
            left: slots.left({ class: [c.left, u.left] }),
            center: slots.center({ class: [c.center, u.center] }),
            right: slots.right({ class: [c.right, u.right] }),
            icon: slots.icon({ class: [c.icon, u.icon] }),
            title: slots.title({ class: [c.title, u.title] }),
            actions: slots.actions({ class: [c.actions, u.actions] }),
            close: slots.close({ class: [c.close, u.close] })
        }
    })

    function handleClose(event?: Event) {
        event?.stopPropagation()
        if (id && typeof window !== 'undefined') {
            localStorage.setItem(storageKey(id), '1')
        }
        open = false
        onClose?.()
    }
</script>

{#if visible}
    <svelte:element
        this={as}
        bind:this={ref}
        class={classes.root}
        role={isClickable ? undefined : 'region'}
        aria-label={isClickable || titleSlot ? undefined : title}
        data-banner-id={effectiveId}
        {...restProps}
    >
        {#if isClickable}
            <!-- eslint-disable svelte/no-navigation-without-resolve -->
            <a
                href={to}
                {target}
                class="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-inset"
                aria-label={title}
                data-banner-link
            ></a>
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
        {/if}

        <div class={classes.container}>
            <div class={classes.left} aria-hidden="true"></div>

            <div class={classes.center}>
                {#if leading}
                    {@render leading()}
                {:else if icon}
                    <Icon name={icon} class={classes.icon} />
                {/if}

                {#if titleSlot}
                    {@render titleSlot()}
                {:else if title}
                    <span class={classes.title}>{title}</span>
                {/if}

                {#if actionsSlot}
                    {@render actionsSlot()}
                {:else if actions && actions.length > 0}
                    <div
                        class="{classes.actions} relative z-10"
                        onclick={(e) => e.stopPropagation()}
                        role="presentation"
                    >
                        {#each actions as action, i (i)}
                            <Button size="xs" variant="ghost" color="surface" {...action} />
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="{classes.right} relative z-10">
                {#if closeSlot}
                    {@render closeSlot()}
                {:else if closeButtonProps}
                    <Button
                        size="xs"
                        variant="ghost"
                        color="surface"
                        square
                        {...closeButtonProps}
                        icon={closeButtonProps.icon ?? resolvedCloseIcon}
                        class={classes.close}
                        onclick={handleClose}
                        aria-label={closeButtonProps['aria-label'] ?? 'Dismiss banner'}
                    />
                {/if}
            </div>
        </div>
    </svelte:element>
{/if}
