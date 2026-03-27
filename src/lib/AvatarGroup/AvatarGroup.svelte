<script lang="ts" module>
    import type { AvatarGroupProps } from './avatar-group.types.js'

    export type Props = AvatarGroupProps
</script>

<script lang="ts">
    import { avatarGroupVariants, avatarGroupDefaults } from './avatar-group.variants.js'
    import { getComponentConfig } from '../config.js'
    import { setContext } from 'svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize, AvatarRounded } from '../Avatar/avatar.types.js'

    const config = getComponentConfig('avatarGroup', avatarGroupDefaults)

    let {
        ref = $bindable(null),
        as = 'div',
        ui,
        size = config.defaultVariants.size ?? 'md',
        rounded = config.defaultVariants.rounded ?? 'full',
        avatars,
        max,
        class: className,
        children,
        ...restProps
    }: Props = $props()

    const classes = $derived.by(() => {
        const slots = avatarGroupVariants({ size, rounded })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            base: slots.base({ class: [config.slots.base, ui?.base] })
        }
    })

    setContext<{ size: AvatarSize; rounded: AvatarRounded; baseClass: string }>('avatarGroup', {
        get size() {
            return size
        },
        get rounded() {
            return rounded
        },
        get baseClass() {
            return classes.base
        }
    })

    const visibleAvatars = $derived(
        !avatars ? [] : max && max > 0 ? avatars.slice(0, max) : avatars
    )

    const overflowCount = $derived(
        avatars && max && max > 0 ? Math.max(0, avatars.length - max) : 0
    )
</script>

<svelte:element this={as} bind:this={ref} class={classes.root} {...restProps}>
    {#if avatars}
        {#if overflowCount > 0}
            <Avatar text={`+${overflowCount}`} />
        {/if}
        {#each visibleAvatars as avatar, index (index)}
            <Avatar {...avatar} />
        {/each}
    {:else if children}
        {@render children()}
    {/if}
</svelte:element>
