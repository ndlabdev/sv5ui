<script lang="ts" module>
    import type { FormFieldProps } from './form-field.types.js'

    export type Props = FormFieldProps
</script>

<script lang="ts">
    import { Label, useId } from 'bits-ui'
    import { formFieldVariants, formFieldDefaults } from './form-field.variants.js'
    import { getComponentConfig } from '../config.js'
    import { setContext } from 'svelte'
    import type { FormFieldContext } from '../hooks/useFormField.svelte.js'

    const config = getComponentConfig('formField', formFieldDefaults)

    let {
        ref = $bindable(null),
        ui,
        name,
        label,
        description,
        hint,
        help,
        error,
        size = config.defaultVariants.size ?? 'md',
        required = false,
        orientation = config.defaultVariants.orientation ?? 'vertical',
        class: className,
        children,
        labelSlot,
        hintSlot,
        descriptionSlot,
        helpSlot,
        errorSlot,
        ...restProps
    }: Props = $props()

    const id = useId()
    const ariaId = $derived(name ? `form-field-${name}` : id)

    const variantSlots = $derived(formFieldVariants({ size, required, orientation }))
    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        wrapper: variantSlots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
        labelWrapper: variantSlots.labelWrapper({
            class: [config.slots.labelWrapper, ui?.labelWrapper]
        }),
        label: variantSlots.label({ class: [config.slots.label, ui?.label] }),
        container: variantSlots.container({ class: [config.slots.container, ui?.container] }),
        description: variantSlots.description({
            class: [config.slots.description, ui?.description]
        }),
        error: variantSlots.error({ class: [config.slots.error, ui?.error] }),
        hint: variantSlots.hint({ class: [config.slots.hint, ui?.hint] }),
        help: variantSlots.help({ class: [config.slots.help, ui?.help] })
    })

    const hasError = $derived(error !== undefined && error !== false)
    const errorMessage = $derived(typeof error === 'string' ? error : undefined)

    setContext<FormFieldContext>('formField', {
        get name() {
            return name
        },
        get size() {
            return size
        },
        get error() {
            return error
        },
        get ariaId() {
            return ariaId
        }
    })
</script>

<div bind:this={ref} class={classes.root} {...restProps}>
    <div class={classes.wrapper}>
        {#if label || labelSlot || hint || hintSlot}
            <div class={classes.labelWrapper}>
                {#if labelSlot}
                    {@render labelSlot({ label })}
                {:else if label}
                    <Label.Root for={ariaId} class={classes.label}>
                        {label}
                    </Label.Root>
                {/if}

                {#if hintSlot}
                    {@render hintSlot({ hint })}
                {:else if hint}
                    <span class={classes.hint}>{hint}</span>
                {/if}
            </div>
        {/if}

        {#if descriptionSlot}
            {@render descriptionSlot({ description })}
        {:else if description}
            <p id="{ariaId}-description" class={classes.description}>{description}</p>
        {/if}
    </div>

    <div class={classes.container}>
        {#if children}
            {@render children({ error })}
        {/if}

        {#if hasError && (errorMessage || errorSlot)}
            {#if errorSlot}
                {@render errorSlot({ error })}
            {:else if errorMessage}
                <p id="{ariaId}-error" class={classes.error}>{errorMessage}</p>
            {/if}
        {:else if help || helpSlot}
            {#if helpSlot}
                {@render helpSlot({ help })}
            {:else if help}
                <p id="{ariaId}-help" class={classes.help}>{help}</p>
            {/if}
        {/if}
    </div>
</div>
