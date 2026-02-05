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
    import { avatarVariants, avatarDefaults } from './avatar.variants.js'
    import { getComponentConfig } from '../config.js'
    import { getContext } from 'svelte'

    const config = getComponentConfig('avatar', avatarDefaults)

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

    const groupContext = getContext<{ size: AvatarSize; baseClass: string } | undefined>(
        'avatarGroup'
    )

    const resolvedSize = $derived(size ?? groupContext?.size ?? config.defaultVariants.size ?? 'md')
    const sizePx = $derived(SIZE_PX[resolvedSize])

    const initials = $derived(
        text ||
            (alt
                ? alt
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()
                : '')
    )

    const classes = $derived.by(() => {
        const slots = avatarVariants({ size: resolvedSize })
        return {
            root: slots.root({
                class: [config.slots.root, groupContext?.baseClass, className, ui?.root]
            }),
            image: slots.image({ class: [config.slots.image, ui?.image] }),
            fallback: slots.fallback({ class: [config.slots.fallback, ui?.fallback] })
        }
    })
</script>

<Avatar.Root bind:ref class={classes.root} {delayMs} {...restProps}>
    {#if children}
        {@render children()}
    {:else}
        {#if src}
            <Avatar.Image
                {src}
                alt={alt ?? ''}
                class={classes.image}
                width={sizePx}
                height={sizePx}
            />
        {/if}
        <Avatar.Fallback class={classes.fallback}>
            {initials}
        </Avatar.Fallback>
    {/if}
</Avatar.Root>
