<script lang="ts" module>
    import type { PinInputProps } from './pin-input.types.js'

    export type Props = PinInputProps
</script>

<script lang="ts">
    import { PinInput, useId } from 'bits-ui'
    import { pinInputVariants, pinInputDefaults } from './pin-input.variants.js'
    import { getComponentConfig } from '../config.js'
    import { useFormField } from '../hooks/useFormField.svelte.js'

    const config = getComponentConfig('pinInput', pinInputDefaults)

    let {
        ref = $bindable(null),
        defaultValue = '',
        value = $bindable(defaultValue),
        onValueChange,
        onComplete,
        length = 5,
        type = 'text',
        mask = false,
        otp = false,
        disabled = false,
        required,
        textalign,
        pasteTransformer,
        pushPasswordManagerStrategy,
        inputId,
        name,
        placeholder = '○',
        autofocus = false,
        autofocusDelay = 0,
        highlight = false,
        fixed = false,
        color = config.defaultVariants.color,
        size,
        variant = config.defaultVariants.variant,
        class: className,
        ui,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()

    const autoInputId = useId()
    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedInputId = $derived(inputId ?? formFieldContext?.ariaId ?? autoInputId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedHighlight = $derived(hasError || highlight)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const resolvedPasteTransformer = $derived(
        pasteTransformer ??
            (type === 'number' ? (text: string) => text.replace(/\D/g, '') : undefined)
    )

    function handleValueChange(v: string) {
        const filtered = type === 'number' ? v.replace(/\D/g, '') : v
        value = filtered
        onValueChange?.(filtered)
    }

    const slots = $derived(
        pinInputVariants({
            variant,
            color: resolvedColor,
            size: resolvedSize,
            highlight: resolvedHighlight,
            fixed,
            disabled
        })
    )

    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: slots.root({ class: [config.slots.root, className, u.root] }),
            base: slots.base({ class: [config.slots.base, u.base] })
        }
    })

    $effect(() => {
        if (!autofocus) return
        const input = ref?.querySelector('[data-pin-input-input]') as HTMLInputElement | null
        if (!input) return
        const timer = setTimeout(() => input.focus(), autofocusDelay)
        return () => clearTimeout(timer)
    })
</script>

<div class="contents" {...restProps}>
    {#if resolvedName}
        <input type="hidden" name={resolvedName} {value} />
    {/if}
    <PinInput.Root
        bind:ref
        {value}
        maxlength={length}
        {disabled}
        {textalign}
        {onComplete}
        pasteTransformer={resolvedPasteTransformer}
        {pushPasswordManagerStrategy}
        inputId={resolvedInputId}
        autocomplete={otp ? 'one-time-code' : undefined}
        inputmode={type === 'number' ? 'numeric' : 'text'}
        {required}
        aria-describedby={ariaDescribedBy}
        onValueChange={handleValueChange}
        class={classes.root}
    >
        {#snippet children({ cells })}
            {#each cells as cell, i (i)}
                <PinInput.Cell {cell} class={classes.base}>
                    {#if mask && cell.char}
                        <span class="block size-2 rounded-full bg-current"></span>
                    {:else if cell.char}
                        {cell.char}
                    {:else if cell.hasFakeCaret}
                        <span class="pointer-events-none absolute animate-pulse select-none">|</span
                        >
                    {:else}
                        <span class="text-on-surface/30">{placeholder}</span>
                    {/if}
                </PinInput.Cell>
            {/each}
        {/snippet}
    </PinInput.Root>
</div>
