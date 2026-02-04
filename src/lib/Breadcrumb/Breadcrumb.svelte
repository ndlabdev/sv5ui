<script lang="ts" module>
    import type { BreadcrumbProps } from './breadcrumb.types.js'

    export type Props = BreadcrumbProps
</script>

<script lang="ts">
    import type { ClassNameValue } from 'tailwind-merge'
    import { breadcrumbVariants, breadcrumbDefaults } from './breadcrumb.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Link from '../Link/Link.svelte'

    const config = getComponentConfig('breadcrumb', breadcrumbDefaults)

    let {
        as = 'nav',
        items,
        separatorIcon = 'lucide:chevron-right',
        class: className,
        ui,
        item: itemSnippet,
        separator: separatorSnippet
    }: Props = $props()

    const variantSlots = $derived(breadcrumbVariants(config.defaultVariants))

    const classes = $derived.by(() => ({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        list: variantSlots.list({ class: [config.slots.list, ui?.list] }),
        separator: variantSlots.separator({ class: [config.slots.separator, ui?.separator] }),
        separatorIcon: variantSlots.separatorIcon({
            class: [config.slots.separatorIcon, ui?.separatorIcon]
        })
    }))

    function getLinkClasses(active: boolean, disabled: boolean, itemClass?: ClassNameValue) {
        const slots = breadcrumbVariants({ ...config.defaultVariants, active, disabled })
        return {
            item: slots.item({ class: [config.slots.item, ui?.item] }),
            link: slots.link({ class: [config.slots.link, itemClass, ui?.link] }),
            linkLeadingIcon: slots.linkLeadingIcon({
                class: [config.slots.linkLeadingIcon, ui?.linkLeadingIcon]
            }),
            linkLabel: slots.linkLabel({ class: [config.slots.linkLabel, ui?.linkLabel] })
        }
    }
</script>

<svelte:element this={as} aria-label={as === 'nav' ? 'Breadcrumb' : undefined} class={classes.root}>
    <ol class={classes.list}>
        {#each items as item, index}
            {@const active = index === items.length - 1}
            {@const disabled = item.disabled ?? false}
            {@const itemClasses = getLinkClasses(active, disabled, item.class)}

            <li class={itemClasses.item}>
                {#if itemSnippet}
                    {@render itemSnippet({ item, index, active })}
                {:else if active || !item.href}
                    <span class={itemClasses.link} aria-current={active ? 'page' : undefined}>
                        {#if item.icon}
                            <Icon name={item.icon} class={itemClasses.linkLeadingIcon} />
                        {/if}
                        <span class={itemClasses.linkLabel}>{item.label}</span>
                    </span>
                {:else}
                    <Link href={item.href} raw {disabled} class={itemClasses.link}>
                        {#if item.icon}
                            <Icon name={item.icon} class={itemClasses.linkLeadingIcon} />
                        {/if}
                        <span class={itemClasses.linkLabel}>{item.label}</span>
                    </Link>
                {/if}
            </li>

            {#if index < items.length - 1}
                <li role="presentation" aria-hidden="true" class={classes.separator}>
                    {#if separatorSnippet}
                        {@render separatorSnippet()}
                    {:else}
                        <Icon name={separatorIcon} class={classes.separatorIcon} />
                    {/if}
                </li>
            {/if}
        {/each}
    </ol>
</svelte:element>
