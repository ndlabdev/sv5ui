<script lang="ts" module>
    import type { UserProps } from './user.types.js'

    export type Props = UserProps
</script>

<script lang="ts">
    import { userVariants, userDefaults } from './user.variants.js'
    import { getComponentConfig } from '../config.js'
    import Avatar from '../Avatar/Avatar.svelte'
    import Chip from '../Chip/Chip.svelte'
    import Link from '../Link/Link.svelte'

    const config = getComponentConfig('user', userDefaults)

    let {
        as = 'div',
        ui,
        name,
        description,
        avatar,
        chip,
        size = config.defaultVariants.size,
        orientation = config.defaultVariants.orientation,
        href,
        class: className,
        avatarSlot,
        nameSlot,
        descriptionSlot,
        ...restProps
    }: Props = $props()

    const isClickable = $derived(!!href || !!restProps.onclick)

    const classes = $derived.by(() => {
        const slots = userVariants({ size, orientation, clickable: isClickable })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            wrapper: slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
            name: slots.name({ class: [config.slots.name, ui?.name] }),
            description: slots.description({ class: [config.slots.description, ui?.description] }),
            avatar: slots.avatar({ class: [config.slots.avatar, ui?.avatar] })
        }
    })

    const mergedAvatarProps = $derived(
        avatar ? { size: size as typeof avatar.size, ...avatar } : undefined
    )

    const chipProps = $derived.by(() => {
        if (!chip || !avatar) return null
        return chip === true ? {} : chip
    })
</script>

{#snippet userContent()}
    {#if avatarSlot}
        {@render avatarSlot()}
    {:else if mergedAvatarProps}
        {#if chipProps}
            <Chip {size} inset {...chipProps}>
                <Avatar {...mergedAvatarProps} class={classes.avatar} />
            </Chip>
        {:else}
            <Avatar {...mergedAvatarProps} class={classes.avatar} />
        {/if}
    {/if}

    {#if name || description || nameSlot || descriptionSlot}
        <div class={classes.wrapper}>
            {#if nameSlot}
                {@render nameSlot()}
            {:else if name}
                <div class={classes.name}>{name}</div>
            {/if}

            {#if descriptionSlot}
                {@render descriptionSlot()}
            {:else if description}
                <div class={classes.description}>{description}</div>
            {/if}
        </div>
    {/if}
{/snippet}

{#if href}
    <Link {href} raw class={classes.root}>
        {@render userContent()}
    </Link>
{:else}
    <svelte:element this={as} class={classes.root} {...restProps}>
        {@render userContent()}
    </svelte:element>
{/if}
