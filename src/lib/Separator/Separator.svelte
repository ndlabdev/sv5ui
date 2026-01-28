<script lang="ts" module>
    import type { SeparatorProps } from './separator.types.js'

    export type Props = SeparatorProps
</script>

<script lang="ts">
    import { Separator } from 'bits-ui'
    import { separatorVariants } from './separator.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'

    const config = getComponentConfig('separator')

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

    const slots = $derived(separatorVariants({ color, size, type, orientation }))

    const rootClass = $derived(slots.root({ class: [config.slots.root, className, ui?.root] }))
    const borderClass = $derived(slots.border({ class: [config.slots.border, ui?.border] }))
    const containerClass = $derived(slots.container({ class: [config.slots.container, ui?.container] }))
    const iconClass = $derived(slots.icon({ class: [config.slots.icon, ui?.icon] }))
    const avatarClass = $derived(slots.avatar({ class: [config.slots.avatar, ui?.avatar] }))
    const avatarSize = $derived(slots.avatarSize() as AvatarSize)
    const labelClass = $derived(slots.label({ class: [config.slots.label, ui?.label] }))
</script>

<Separator.Root bind:ref class={rootClass} {orientation} {decorative} {...restProps}>
    <div class={borderClass}></div>

    {#if hasContent}
        <div class={containerClass}>
            {#if content}
                {@render content()}
            {:else if avatar}
                <Avatar {...avatar} size={avatar.size ?? avatarSize} class={avatarClass} />
            {:else if icon}
                <Icon name={icon} class={iconClass} />
            {:else if label}
                <span class={labelClass}>{label}</span>
            {/if}
        </div>

        <div class={borderClass}></div>
    {/if}
</Separator.Root>
