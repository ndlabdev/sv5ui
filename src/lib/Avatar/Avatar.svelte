<script lang="ts" module>
    import type { AvatarProps, AvatarSize } from './avatar.types.js'

    export type Props = AvatarProps

    const SIZE_PX: Record<AvatarSize, number> = {
        '3xs': 16,
        '2xs': 20,
        xs: 24,
        sm: 28,
        md: 32,
        lg: 36,
        xl: 40,
        '2xl': 44,
        '3xl': 48
    }
</script>

<script lang="ts">
    import { Avatar } from 'bits-ui'
    import { avatarVariants } from './avatar.variants.js'
    import { getContext } from 'svelte'

    let {
        ref = $bindable(null),
        src,
        alt,
        size,
        text,
        delayMs = 0,
        class: className,
        ui,
        children,
        ...restProps
    }: Props = $props()

    const groupContext = getContext<{ size: AvatarSize; baseClass: string } | undefined>('avatarGroup')

    const resolvedSize = $derived(size ?? groupContext?.size ?? 'md')
    const sizePx = $derived(SIZE_PX[resolvedSize])

    const initials = $derived(
        text || (alt ? alt.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '')
    )

    const slots = $derived(avatarVariants({ size: resolvedSize }))
    const rootClass = $derived(slots.root({ class: [groupContext?.baseClass, className, ui?.root] }))
    const imageClass = $derived(slots.image({ class: ui?.image }))
    const fallbackClass = $derived(slots.fallback({ class: ui?.fallback }))
</script>

<Avatar.Root bind:ref class={rootClass} {delayMs} {...restProps}>
    {#if children}
        {@render children()}
    {:else}
        {#if src}
            <Avatar.Image {src} alt={alt ?? ''} class={imageClass} width={sizePx} height={sizePx} />
        {/if}
        <Avatar.Fallback class={fallbackClass}>
            {initials}
        </Avatar.Fallback>
    {/if}
</Avatar.Root>
