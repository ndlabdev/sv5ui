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
        children,
        ...restProps
    }: Props = $props()

    const slots = footerColumnsVariants()

    const classes = $derived.by(() => {
        const c = config.slots
        const u = ui ?? {}
        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            column: slots.column({ class: [c.column, u.column] }),
            label: slots.label({ class: [c.label, u.label] }),
            list: slots.list({ class: [c.list, u.list] }),
            item: slots.item({ class: [c.item, u.item] }),
            link: slots.link({ class: [c.link, u.link] }),
            linkLeadingIcon: slots.linkLeadingIcon({
                class: [c.linkLeadingIcon, u.linkLeadingIcon]
            }),
            linkLabel: slots.linkLabel({ class: [c.linkLabel, u.linkLabel] }),
            linkLabelExternalIcon: slots.linkLabelExternalIcon({
                class: [c.linkLabelExternalIcon, u.linkLabelExternalIcon]
            })
        }
    })
</script>

<svelte:element this={as} bind:this={ref} class={classes.root} {...restProps}>
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
                            <Link raw {...linkProps} class={[classes.link, columnLink.class]}>
                                {#if icon}
                                    <Icon name={icon} class={classes.linkLeadingIcon} />
                                {/if}
                                <span class={classes.linkLabel}>{label}</span>
                                {#if columnLink.target === '_blank'}
                                    <Icon
                                        name={icons.external}
                                        class={classes.linkLabelExternalIcon}
                                    />
                                {/if}
                            </Link>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    {/each}

    {@render children?.()}
</svelte:element>
