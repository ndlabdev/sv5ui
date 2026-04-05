<script lang="ts" module>
    import type { FormFieldProps } from './form-field.types.js'

    export type Props = FormFieldProps
</script>

<script lang="ts">
    import { Label, useId } from 'bits-ui'
    import { formFieldVariants, formFieldDefaults } from './form-field.variants.js'
    import { getComponentConfig } from '../config.js'
    import { setContext, untrack } from 'svelte'
    import { type FormFieldContext, FORM_FIELD_CONTEXT_KEY } from '../hooks/useFormField.svelte.js'
    import { getFormContext } from '../Form/form.context.svelte.js'

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
        eagerValidation,
        validateOnInputDelay,
        errorPattern,
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

    // Form-level context (undefined when FormField is used standalone).
    const formCtx = getFormContext()

    // Resolve error: explicit `error` prop always wins; otherwise ask the Form for
    // errors matching this field's name (or errorPattern regex, if provided).
    const resolvedError = $derived.by<string | boolean | undefined>(() => {
        if (error !== undefined) return error
        if (!formCtx || !name) return undefined
        const errs = errorPattern ? formCtx.getErrors(errorPattern) : formCtx.getErrors(name)
        return errs[0]?.message
    })

    // Register this field with the form. Split into two effects:
    //
    // 1. Lifecycle effect — tracks only `name`. Handles the initial registration
    //    and cleanup on unmount / rename. Reads other entry fields via `untrack`
    //    so they don't retrigger the lifecycle.
    // 2. Update effect — tracks ariaId / errorPattern / eagerValidation /
    //    validateOnInputDelay and rewrites the entry via `.set()`. No cleanup —
    //    a single atomic overwrite, so no window where the registry is empty.
    //
    // Without this split, changing an unrelated prop (e.g. errorPattern) would
    // cause cleanup→re-register, briefly leaving `#fieldRegistry.get(name)`
    // undefined for any concurrent `#resolveErrorIds` call.
    $effect(() => {
        if (!formCtx || !name) return
        const registeredName = name
        untrack(() => {
            formCtx.registerField(registeredName, {
                id: ariaId,
                pattern: errorPattern,
                eagerValidation,
                validateOnInputDelay
            })
        })
        return () => {
            formCtx.unregisterField(registeredName)
        }
    })

    $effect(() => {
        if (!formCtx || !name) return
        formCtx.registerField(name, {
            id: ariaId,
            pattern: errorPattern,
            eagerValidation,
            validateOnInputDelay
        })
    })

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

    const hasError = $derived(resolvedError !== undefined && resolvedError !== false)
    const errorMessage = $derived(typeof resolvedError === 'string' ? resolvedError : undefined)

    setContext<FormFieldContext>(FORM_FIELD_CONTEXT_KEY, {
        get name() {
            return name
        },
        get size() {
            return size
        },
        get error() {
            return resolvedError
        },
        get ariaId() {
            return ariaId
        },
        get eagerValidation() {
            return eagerValidation
        },
        get validateOnInputDelay() {
            return validateOnInputDelay
        },
        get errorPattern() {
            return errorPattern
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
            {@render children({ error: resolvedError })}
        {/if}

        {#if hasError && (errorMessage || errorSlot)}
            {#if errorSlot}
                {@render errorSlot({ error: resolvedError })}
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
