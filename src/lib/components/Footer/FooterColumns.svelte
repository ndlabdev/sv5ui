<script lang="ts" module>
    import type { FooterColumnsProps } from './footer-columns.types.js'

    export type Props = FooterColumnsProps
</script>

<script lang="ts">
    import { footerColumnsVariants, footerColumnsDefaults } from './footer-columns.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Link from '../Link/Link.svelte'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('footerColumns', footerColumnsDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        as = 'nav',
        ui,
        columns,
        class: className,
        columnLabel,
        link,
        left,
        right,
        children,
        ...restProps
    }: Props = $props()

    const slots = footerColumnsVariants()

    const classes = $derived.by(() => {
        const c = config.slots
        const u = ui ?? {}
        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            left: slots.left({ class: [c.left, u.left] }),
            center: slots.center({ class: [c.center, u.center] }),
            right: slots.right({ class: [c.right, u.right] }),
            column: slots.column({ class: [c.column, u.column] }),
            label: slots.label({ class: [c.label, u.label] }),
            list: slots.list({ class: [c.list, u.list] }),
            item: slots.item({ class: [c.item, u.item] }),
            link: slots.link({ class: [c.link, u.link] }),
            linkActive: slots.linkActive({ class: [c.linkActive, u.linkActive] }),
            linkInactive: slots.linkInactive({ class: [c.linkInactive, u.linkInactive] }),
            linkLeadingIcon: slots.linkLeadingIcon({
                class: [c.linkLeadingIcon, u.linkLeadingIcon]
            }),
            linkLabel: slots.linkLabel({ class: [c.linkLabel, u.linkLabel] }),
            linkLabelExternalIcon: slots.linkLabelExternalIcon({
                class: [c.linkLabelExternalIcon, u.linkLabelExternalIcon]
            })
        }
    })

    const hasColumns = $derived((columns?.length ?? 0) > 0 || !!children)
</script>

<svelte:element this={as} bind:this={ref} class={classes.root} {...restProps}>
    {#if left}
        <div class={classes.left}>
            {@render left()}
        </div>
    {/if}

    {#if hasColumns}
        <div class={classes.center}>
            {#each columns ?? [] as column, columnIndex (columnIndex)}
                <div class={classes.column}>
                    {#if columnLabel}
                        {@render columnLabel({ column })}
                    {:else}
                        <p class={classes.label}>{column.label}</p>
                    {/if}

                    <ul class={classes.list}>
                        {#each column.children as columnLink, linkIndex (linkIndex)}
                            <li class={classes.item}>
                                {#if link}
                                    {@render link({ link: columnLink })}
                                {:else}
                                    {@const { label, icon, ...linkProps } = columnLink}
                                    <Link
                                        raw
                                        activeClass={classes.linkActive}
                                        inactiveClass={classes.linkInactive}
                                        {...linkProps}
                                        class={[classes.link, columnLink.class]}
                                    >
                                        {#if icon}
                                            <Icon name={icon} class={classes.linkLeadingIcon} />
                                        {/if}
                                        <span class={classes.linkLabel}>
                                            {label}
                                            {#if columnLink.target === '_blank'}
                                                <Icon
                                                    name={icons.external}
                                                    class={classes.linkLabelExternalIcon}
                                                />
                                            {/if}
                                        </span>
                                    </Link>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}

            {@render children?.()}
        </div>
    {/if}

    {#if right}
        <div class={classes.right}>
            {@render right()}
        </div>
    {/if}
</svelte:element>
