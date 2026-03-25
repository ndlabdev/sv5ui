<script lang="ts" module>
    import type { AvatarProps, AvatarSize, AvatarRounded } from './avatar.types.js'

    export type Props = AvatarProps
</script>

<script lang="ts">
    import { Avatar } from 'bits-ui'
    import { avatarVariants, avatarDefaults, avatarSizePx } from './avatar.variants.js'
    import { getComponentConfig } from '../config.js'
    import { getContext } from 'svelte'
    import Icon from '../Icon/Icon.svelte'
    import Chip from '../Chip/Chip.svelte'

    const config = getComponentConfig('avatar', avatarDefaults)

    let {
        ref = $bindable(null),
        src,
        alt,
        size,
        rounded,
        text,
        icon,
        chip,
        loading,
        delayMs = 0,
        class: className,
        ui,
        fallback: fallbackSnippet,
        children,
        ...restProps
    }: Props = $props()

    const groupContext = getContext<
        { size: AvatarSize; rounded: AvatarRounded; baseClass: string } | undefined
    >('avatarGroup')

    const resolvedSize = $derived(size ?? groupContext?.size ?? config.defaultVariants.size ?? 'md')
    const resolvedRounded = $derived(
        rounded ?? groupContext?.rounded ?? config.defaultVariants.rounded ?? 'full'
    )
    const sizePx = $derived(avatarSizePx[resolvedSize])

    const initials = $derived(
        text !== undefined
            ? text
            : alt
              ? alt
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()
              : ''
    )

    const chipProps = $derived(
        chip === true
            ? { inset: true as const }
            : chip
              ? { inset: true as const, ...chip }
              : undefined
    )

    const classes = $derived.by(() => {
        const slots = avatarVariants({ size: resolvedSize, rounded: resolvedRounded })
        return {
            root: slots.root({
                class: [config.slots.root, groupContext?.baseClass, className, ui?.root]
            }),
            image: slots.image({ class: [config.slots.image, ui?.image] }),
            fallback: slots.fallback({ class: [config.slots.fallback, ui?.fallback] }),
            icon: slots.icon({ class: [config.slots.icon, ui?.icon] })
        }
    })
</script>

{#snippet avatarContent()}
    <Avatar.Root {...restProps} bind:ref class={classes.root} {delayMs}>
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
                    {loading}
                />
            {/if}
            <Avatar.Fallback class={classes.fallback}>
                {#if fallbackSnippet}
                    {@render fallbackSnippet()}
                {:else if initials}
                    {initials}
                {:else if icon}
                    <Icon name={icon} class={classes.icon} />
                {/if}
            </Avatar.Fallback>
        {/if}
    </Avatar.Root>
{/snippet}

{#if chipProps}
    <Chip {...chipProps}>
        {@render avatarContent()}
    </Chip>
{:else}
    {@render avatarContent()}
{/if}
