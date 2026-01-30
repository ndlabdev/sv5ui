<script lang="ts" module>
    import type { SeparatorProps } from './separator.types.js'

    export type Props = SeparatorProps
</script>

<script lang="ts">
    import { Separator } from 'bits-ui'
    import { separatorVariants, separatorDefaults } from './separator.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'

    const config = getComponentConfig('separator', separatorDefaults)

    let {
        ref = $bindable(null),
        ui,
        label,
        icon,
        avatar,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        type = config.defaultVariants.type,
        orientation = config.defaultVariants.orientation,
        decorative = false,
        class: className,
        content,
        ...restProps
    }: Props = $props()

    const hasContent = $derived(!!label || !!icon || !!avatar || !!content)

    const classes = $derived.by(() => {
        const slots = separatorVariants({ color, size, type, orientation })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            border: slots.border({ class: [config.slots.border, ui?.border] }),
            container: slots.container({ class: [config.slots.container, ui?.container] }),
            icon: slots.icon({ class: [config.slots.icon, ui?.icon] }),
            avatar: slots.avatar({ class: [config.slots.avatar, ui?.avatar] }),
            avatarSize: slots.avatarSize() as AvatarSize,
            label: slots.label({ class: [config.slots.label, ui?.label] })
        }
    })
</script>

<Separator.Root bind:ref class={classes.root} {orientation} {decorative} {...restProps}>
    <div class={classes.border}></div>

    {#if hasContent}
        <div class={classes.container}>
            {#if content}
                {@render content()}
            {:else if avatar}
                <Avatar {...avatar} size={avatar.size ?? classes.avatarSize} class={classes.avatar} />
            {:else if icon}
                <Icon name={icon} class={classes.icon} />
            {:else if label}
                <span class={classes.label}>{label}</span>
            {/if}
        </div>

        <div class={classes.border}></div>
    {/if}
</Separator.Root>
