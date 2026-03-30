<script lang="ts" module>
    import type { ToasterProps } from './toast.types.js'

    export type Props = ToasterProps
</script>

<script lang="ts">
    import { Toaster as SonnerToaster } from 'svelte-sonner'
    import { toastDefaults } from './toast.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('toast', toastDefaults)

    let {
        variant = config.defaultVariants.variant,
        position = 'bottom-right',
        visibleToasts = 3,
        duration = 5000,
        closeButton = true,
        expand = false,
        gap = 14,
        class: className,
        ...restProps
    }: Props = $props()

    const toasterClass = $derived([`sv5ui-toast-${variant}`, className].filter(Boolean).join(' '))
</script>

<SonnerToaster
    {position}
    {visibleToasts}
    {duration}
    {closeButton}
    {expand}
    {gap}
    class={toasterClass}
    {...restProps}
/>

<style>
    /* ============================================
     * BASE OVERRIDES — applied to all variants
     *
     * Selector: [data-sonner-toaster] with our variant class.
     * Sonner renders via portal, so we use :global() selectors
     * scoped by our variant class on the toaster <ol> element.
     * ============================================ */

    :global([data-sonner-toaster][class*='sv5ui-toast-'] [data-sonner-toast][data-styled='true']) {
        font-family: inherit;
        border-radius: 0.75rem;
        box-shadow:
            0 4px 6px -1px oklch(0 0 0 / 0.1),
            0 2px 4px -2px oklch(0 0 0 / 0.1);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-content]
    ) {
        gap: 2px;
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-icon]:has([data-avatar-root])
    ) {
        width: auto;
        height: auto;
        margin: 0;
        margin-right: 4px;
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-title]
    ) {
        font-weight: 600;
        font-size: 0.875rem;
        line-height: 1.25rem;
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-description]
    ) {
        font-size: 0.8125rem;
        line-height: 1.25rem;
        opacity: 0.85;
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-button]
    ) {
        font-weight: 600;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        padding: 0 0.625rem;
        height: 1.625rem;
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-close-button]
    ) {
        border-radius: 50%;
        transition:
            opacity 150ms,
            background-color 150ms,
            border-color 150ms;
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-close-button]:hover
    ) {
        opacity: 1;
    }

    /* ============================================
     * SHARED — CSS custom properties per toast type
     *
     * Each variant sets --toast-bg, --toast-border, --toast-color,
     * --toast-desc, --toast-close-bg, --toast-close-border per type.
     * The shared rules below consume them.
     * ============================================ */

    :global([data-sonner-toaster][class*='sv5ui-toast-'] [data-sonner-toast][data-styled='true']) {
        background-color: var(--toast-bg);
        border: 1px solid var(--toast-border);
        color: var(--toast-color);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-description]
    ) {
        color: var(--toast-desc);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-icon]
    ) {
        color: var(--toast-icon, inherit);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-title]
    ) {
        color: var(--toast-title, inherit);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-button]
    ) {
        background-color: var(--toast-action-bg);
        color: var(--toast-action-color);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-cancel]
    ) {
        background-color: var(--toast-cancel-bg);
        color: var(--toast-cancel-color);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']
            [data-close-button]
    ) {
        background-color: var(--toast-close-bg);
        border-color: var(--toast-close-border);
        color: var(--toast-close-color);
    }

    :global(
        [data-sonner-toaster][class*='sv5ui-toast-']
            [data-sonner-toast][data-styled='true']:hover
            [data-close-button]:hover
    ) {
        background-color: var(--toast-close-hover-bg);
    }

    /* ============================================
     * OUTLINE VARIANT — surface bg, semantic border + icon + title
     * ============================================ */
    :global([data-sonner-toaster].sv5ui-toast-outline [data-sonner-toast][data-styled='true']) {
        --toast-bg: var(--color-surface-container);
        --toast-border: var(--color-outline-variant);
        --toast-color: var(--color-on-surface);
        --toast-desc: var(--color-on-surface-variant);
        --toast-icon: inherit;
        --toast-title: inherit;
        --toast-action-bg: var(--color-primary);
        --toast-action-color: var(--color-on-primary);
        --toast-cancel-bg: var(--color-surface-container-highest);
        --toast-cancel-color: var(--color-on-surface);
        --toast-close-bg: var(--color-surface-container);
        --toast-close-border: var(--color-outline-variant);
        --toast-close-color: var(--color-on-surface-variant);
        --toast-close-hover-bg: var(--color-surface-container-highest);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-outline
            [data-sonner-toast][data-type='success'][data-styled='true']
    ) {
        --toast-border: oklch(from var(--color-success) l c h / 0.4);
        --toast-icon: var(--color-success);
        --toast-title: var(--color-success);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-outline
            [data-sonner-toast][data-type='error'][data-styled='true']
    ) {
        --toast-border: oklch(from var(--color-error) l c h / 0.4);
        --toast-icon: var(--color-error);
        --toast-title: var(--color-error);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-outline
            [data-sonner-toast][data-type='warning'][data-styled='true']
    ) {
        --toast-border: oklch(from var(--color-warning) l c h / 0.4);
        --toast-icon: var(--color-warning);
        --toast-title: var(--color-warning);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-outline
            [data-sonner-toast][data-type='info'][data-styled='true']
    ) {
        --toast-border: oklch(from var(--color-info) l c h / 0.4);
        --toast-icon: var(--color-info);
        --toast-title: var(--color-info);
    }

    /* ============================================
     * SOFT VARIANT — tinted bg, semantic text
     * ============================================ */
    :global([data-sonner-toaster].sv5ui-toast-soft [data-sonner-toast][data-styled='true']) {
        --toast-bg: var(--color-surface-container-high);
        --toast-border: transparent;
        --toast-color: var(--color-on-surface);
        --toast-desc: var(--color-on-surface-variant);
        --toast-icon: inherit;
        --toast-title: inherit;
        --toast-action-bg: var(--color-primary);
        --toast-action-color: var(--color-on-primary);
        --toast-cancel-bg: var(--color-surface-container-highest);
        --toast-cancel-color: var(--color-on-surface);
        --toast-close-bg: var(--color-surface-container-high);
        --toast-close-border: transparent;
        --toast-close-color: var(--color-on-surface-variant);
        --toast-close-hover-bg: var(--color-surface-container-highest);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-soft
            [data-sonner-toast][data-type='success'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-success) l c h / 0.1);
        --toast-color: var(--color-success);
        --toast-desc: oklch(from var(--color-success) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-success) l c h / 0.1);
        --toast-close-color: var(--color-success);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-soft
            [data-sonner-toast][data-type='error'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-error) l c h / 0.1);
        --toast-color: var(--color-error);
        --toast-desc: oklch(from var(--color-error) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-error) l c h / 0.1);
        --toast-close-color: var(--color-error);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-soft
            [data-sonner-toast][data-type='warning'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-warning) l c h / 0.1);
        --toast-color: var(--color-warning);
        --toast-desc: oklch(from var(--color-warning) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-warning) l c h / 0.1);
        --toast-close-color: var(--color-warning);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-soft
            [data-sonner-toast][data-type='info'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-info) l c h / 0.1);
        --toast-color: var(--color-info);
        --toast-desc: oklch(from var(--color-info) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-info) l c h / 0.1);
        --toast-close-color: var(--color-info);
    }

    /* ============================================
     * SUBTLE VARIANT — tinted bg + semantic border
     * ============================================ */
    :global([data-sonner-toaster].sv5ui-toast-subtle [data-sonner-toast][data-styled='true']) {
        --toast-bg: var(--color-surface-container-high);
        --toast-border: var(--color-outline-variant);
        --toast-color: var(--color-on-surface);
        --toast-desc: var(--color-on-surface-variant);
        --toast-icon: inherit;
        --toast-title: inherit;
        --toast-action-bg: var(--color-primary);
        --toast-action-color: var(--color-on-primary);
        --toast-cancel-bg: var(--color-surface-container-highest);
        --toast-cancel-color: var(--color-on-surface);
        --toast-close-bg: var(--color-surface-container-high);
        --toast-close-border: var(--color-outline-variant);
        --toast-close-color: var(--color-on-surface-variant);
        --toast-close-hover-bg: var(--color-surface-container-highest);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-subtle
            [data-sonner-toast][data-type='success'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-success) l c h / 0.1);
        --toast-border: oklch(from var(--color-success) l c h / 0.3);
        --toast-color: var(--color-success);
        --toast-desc: oklch(from var(--color-success) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-success) l c h / 0.1);
        --toast-close-border: oklch(from var(--color-success) l c h / 0.3);
        --toast-close-color: var(--color-success);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-subtle
            [data-sonner-toast][data-type='error'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-error) l c h / 0.1);
        --toast-border: oklch(from var(--color-error) l c h / 0.3);
        --toast-color: var(--color-error);
        --toast-desc: oklch(from var(--color-error) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-error) l c h / 0.1);
        --toast-close-border: oklch(from var(--color-error) l c h / 0.3);
        --toast-close-color: var(--color-error);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-subtle
            [data-sonner-toast][data-type='warning'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-warning) l c h / 0.1);
        --toast-border: oklch(from var(--color-warning) l c h / 0.3);
        --toast-color: var(--color-warning);
        --toast-desc: oklch(from var(--color-warning) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-warning) l c h / 0.1);
        --toast-close-border: oklch(from var(--color-warning) l c h / 0.3);
        --toast-close-color: var(--color-warning);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-subtle
            [data-sonner-toast][data-type='info'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--color-info) l c h / 0.1);
        --toast-border: oklch(from var(--color-info) l c h / 0.3);
        --toast-color: var(--color-info);
        --toast-desc: oklch(from var(--color-info) l c h / 0.8);
        --toast-close-bg: oklch(from var(--color-info) l c h / 0.1);
        --toast-close-border: oklch(from var(--color-info) l c h / 0.3);
        --toast-close-color: var(--color-info);
    }

    /* ============================================
     * SOLID VARIANT — full semantic bg
     * ============================================ */
    :global([data-sonner-toaster].sv5ui-toast-solid [data-sonner-toast][data-styled='true']) {
        --toast-bg: var(--color-inverse-surface);
        --toast-border: transparent;
        --toast-color: var(--color-inverse-on-surface);
        --toast-desc: var(--color-inverse-on-surface);
        --toast-icon: inherit;
        --toast-title: inherit;
        --toast-action-bg: oklch(from var(--color-inverse-on-surface) l c h / 0.2);
        --toast-action-color: var(--color-inverse-on-surface);
        --toast-cancel-bg: oklch(from var(--color-inverse-on-surface) l c h / 0.1);
        --toast-cancel-color: var(--color-inverse-on-surface);
        --toast-close-bg: var(--color-inverse-surface);
        --toast-close-border: oklch(from var(--color-inverse-on-surface) l c h / 0.2);
        --toast-close-color: var(--color-inverse-on-surface);
        --toast-close-hover-bg: oklch(from var(--color-inverse-on-surface) l c h / 0.1);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-solid
            [data-sonner-toast][data-styled='true']
            [data-description]
    ) {
        opacity: 0.8;
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-solid
            [data-sonner-toast][data-type='success'][data-styled='true']
    ) {
        --toast-bg: var(--color-success);
        --toast-color: var(--color-on-success);
        --toast-desc: var(--color-on-success);
        --toast-close-bg: var(--color-success);
        --toast-close-color: var(--color-on-success);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-solid
            [data-sonner-toast][data-type='error'][data-styled='true']
    ) {
        --toast-bg: var(--color-error);
        --toast-color: var(--color-on-error);
        --toast-desc: var(--color-on-error);
        --toast-close-bg: var(--color-error);
        --toast-close-color: var(--color-on-error);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-solid
            [data-sonner-toast][data-type='warning'][data-styled='true']
    ) {
        --toast-bg: var(--color-warning);
        --toast-color: var(--color-on-warning);
        --toast-desc: var(--color-on-warning);
        --toast-close-bg: var(--color-warning);
        --toast-close-color: var(--color-on-warning);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-solid
            [data-sonner-toast][data-type='info'][data-styled='true']
    ) {
        --toast-bg: var(--color-info);
        --toast-color: var(--color-on-info);
        --toast-desc: var(--color-on-info);
        --toast-close-bg: var(--color-info);
        --toast-close-color: var(--color-on-info);
    }

    /* ============================================
     * ACCENT VARIANT — left border accent strip
     * ============================================ */
    :global([data-sonner-toaster].sv5ui-toast-accent [data-sonner-toast][data-styled='true']) {
        --toast-bg: var(--color-surface-container);
        --toast-border: var(--color-outline-variant);
        --toast-color: var(--color-on-surface);
        --toast-desc: var(--color-on-surface-variant);
        --toast-icon: inherit;
        --toast-title: inherit;
        --toast-action-bg: var(--color-primary);
        --toast-action-color: var(--color-on-primary);
        --toast-cancel-bg: var(--color-surface-container-highest);
        --toast-cancel-color: var(--color-on-surface);
        --toast-close-bg: var(--color-surface-container);
        --toast-close-border: var(--color-outline-variant);
        --toast-close-color: var(--color-on-surface-variant);
        --toast-close-hover-bg: var(--color-surface-container-highest);
        border-left: 3px solid var(--color-on-surface-variant);
        border-radius: 0.5rem;
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-accent
            [data-sonner-toast][data-type='success'][data-styled='true']
    ) {
        border-left-color: var(--color-success);
        --toast-icon: var(--color-success);
        --toast-title: var(--color-success);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-accent
            [data-sonner-toast][data-type='error'][data-styled='true']
    ) {
        border-left-color: var(--color-error);
        --toast-icon: var(--color-error);
        --toast-title: var(--color-error);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-accent
            [data-sonner-toast][data-type='warning'][data-styled='true']
    ) {
        border-left-color: var(--color-warning);
        --toast-icon: var(--color-warning);
        --toast-title: var(--color-warning);
    }

    :global(
        [data-sonner-toaster].sv5ui-toast-accent
            [data-sonner-toast][data-type='info'][data-styled='true']
    ) {
        border-left-color: var(--color-info);
        --toast-icon: var(--color-info);
        --toast-title: var(--color-info);
    }

    /* ============================================
     * COLOR CLASSES — per-toast color override via class
     *
     * Usage: toast('msg', { class: 'sv5ui-color-primary' })
     * These set --sv5ui-c (main) and --sv5ui-c-on (contrast)
     * which are consumed by variant-specific rules below.
     * ============================================ */

    :global([data-sonner-toast].sv5ui-color-primary) {
        --sv5ui-c: var(--color-primary);
        --sv5ui-c-on: var(--color-on-primary);
    }
    :global([data-sonner-toast].sv5ui-color-secondary) {
        --sv5ui-c: var(--color-secondary);
        --sv5ui-c-on: var(--color-on-secondary);
    }
    :global([data-sonner-toast].sv5ui-color-tertiary) {
        --sv5ui-c: var(--color-tertiary);
        --sv5ui-c-on: var(--color-on-tertiary);
    }
    :global([data-sonner-toast].sv5ui-color-success) {
        --sv5ui-c: var(--color-success);
        --sv5ui-c-on: var(--color-on-success);
    }
    :global([data-sonner-toast].sv5ui-color-warning) {
        --sv5ui-c: var(--color-warning);
        --sv5ui-c-on: var(--color-on-warning);
    }
    :global([data-sonner-toast].sv5ui-color-error) {
        --sv5ui-c: var(--color-error);
        --sv5ui-c-on: var(--color-on-error);
    }
    :global([data-sonner-toast].sv5ui-color-info) {
        --sv5ui-c: var(--color-info);
        --sv5ui-c-on: var(--color-on-info);
    }

    /* Outline + color class */
    :global(
        [data-sonner-toaster].sv5ui-toast-outline
            [data-sonner-toast][class*='sv5ui-color-'][data-styled='true']
    ) {
        --toast-border: oklch(from var(--sv5ui-c) l c h / 0.4);
        --toast-icon: var(--sv5ui-c);
        --toast-title: var(--sv5ui-c);
    }

    /* Soft + color class */
    :global(
        [data-sonner-toaster].sv5ui-toast-soft
            [data-sonner-toast][class*='sv5ui-color-'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--sv5ui-c) l c h / 0.1);
        --toast-color: var(--sv5ui-c);
        --toast-desc: oklch(from var(--sv5ui-c) l c h / 0.8);
        --toast-close-bg: oklch(from var(--sv5ui-c) l c h / 0.1);
        --toast-close-color: var(--sv5ui-c);
    }

    /* Subtle + color class */
    :global(
        [data-sonner-toaster].sv5ui-toast-subtle
            [data-sonner-toast][class*='sv5ui-color-'][data-styled='true']
    ) {
        --toast-bg: oklch(from var(--sv5ui-c) l c h / 0.1);
        --toast-border: oklch(from var(--sv5ui-c) l c h / 0.3);
        --toast-color: var(--sv5ui-c);
        --toast-desc: oklch(from var(--sv5ui-c) l c h / 0.8);
        --toast-close-bg: oklch(from var(--sv5ui-c) l c h / 0.1);
        --toast-close-border: oklch(from var(--sv5ui-c) l c h / 0.3);
        --toast-close-color: var(--sv5ui-c);
    }

    /* Solid + color class */
    :global(
        [data-sonner-toaster].sv5ui-toast-solid
            [data-sonner-toast][class*='sv5ui-color-'][data-styled='true']
    ) {
        --toast-bg: var(--sv5ui-c);
        --toast-color: var(--sv5ui-c-on);
        --toast-desc: var(--sv5ui-c-on);
        --toast-close-bg: var(--sv5ui-c);
        --toast-close-color: var(--sv5ui-c-on);
    }

    /* Accent + color class */
    :global(
        [data-sonner-toaster].sv5ui-toast-accent
            [data-sonner-toast][class*='sv5ui-color-'][data-styled='true']
    ) {
        border-left-color: var(--sv5ui-c);
        --toast-icon: var(--sv5ui-c);
        --toast-title: var(--sv5ui-c);
    }
</style>
