<script lang="ts" module>
    import type { AvatarGroupProps } from './avatar-group.types.js'

    export type Props = AvatarGroupProps
</script>

<script lang="ts">
    import { avatarGroupVariants } from './avatar-group.variants.js'
    import { setContext } from 'svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'

    let {
        as = 'div',
        ui,
        size = 'md',
        avatars,
        max,
        class: className,
        children,
        ...restProps
    }: Props = $props()

    const slots = $derived(avatarGroupVariants({ size }))
    const rootClass = $derived(slots.root({ class: [className, ui?.root] }))
    const baseClass = $derived(slots.base({ class: ui?.base }))

    setContext<{ size: AvatarSize; baseClass: string }>('avatarGroup', {
        get size() {
            return size
        },
        get baseClass() {
            return baseClass
        }
    })

    const visibleAvatars = $derived(
        !avatars ? [] :
        max && max > 0 && avatars.length > max ? avatars.slice(0, max) :
        avatars
    )

    const overflowCount = $derived(
        avatars && max && max > 0 ? Math.max(0, avatars.length - max) : 0
    )
</script>

<svelte:element this={as} class={rootClass} {...restProps}>
    {#if avatars}
        {#if overflowCount > 0}
            <Avatar text={`+${overflowCount}`} />
        {/if}
        {#each visibleAvatars as avatar}
            <Avatar {...avatar} />
        {/each}
    {:else if children}
        {@render children()}
    {/if}
</svelte:element>
