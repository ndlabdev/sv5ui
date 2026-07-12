<script lang="ts" module>
    import type { InputNumberProps } from './input-number.types.js'

    export type Props = InputNumberProps
</script>

<script lang="ts">
    import { setContext, untrack } from 'svelte'
    import { NumberFormatter, NumberParser } from '@internationalized/number'
    import { inputNumberVariants, inputNumberDefaults } from './input-number.variants.js'
    import { inputVariants } from '../Input/input.variants.js'
    import { getComponentConfig } from '../../config.js'
    import Button from '../Button/Button.svelte'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'
    import { useEventListener } from '../../hooks/useEventListener/index.js'
    import { useTimeout, useInterval } from '../../hooks/useTimers/index.js'

    const config = getComponentConfig('inputNumber', inputNumberDefaults)

    setContext('fieldGroup', undefined)

    let {
        ref = $bindable(null),
        value = $bindable(null),
        onValueChange,
        min,
        max,
        step,
        stepSnapping = true,
        formatOptions,
        locale = 'en',
        orientation = config.defaultVariants.orientation ?? 'horizontal',
        incrementIcon,
        decrementIcon,
        increment,
        decrement,
        incrementAriaLabel = 'Increase',
        decrementAriaLabel = 'Decrease',
        disableWheelChange = false,
        invertWheelChange = false,
        id,
        name,
        required = false,
        disabled = false,
        readonly = false,
        highlight,
        color = config.defaultVariants.color ?? 'primary',
        variant = config.defaultVariants.variant ?? 'outline',
        size,
        ui,
        class: className,
        incrementSlot,
        decrementSlot,
        onblur,
        oninput,
        onchange,
        onfocus,
        onkeydown,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const formatter = $derived(new NumberFormatter(locale, formatOptions))
    const parser = $derived(new NumberParser(locale, formatOptions))
    const resolvedStep = $derived(
        step ?? (formatter.resolvedOptions().style === 'percent' ? 0.01 : 1)
    )
    const inputMode = $derived(
        formatter.resolvedOptions().maximumFractionDigits === 0 ? 'numeric' : 'decimal'
    )

    function isEmptyValue(v: number | null | undefined): v is null | undefined {
        return v === null || v === undefined || Number.isNaN(v)
    }

    function format(v: number | null | undefined): string {
        return isEmptyValue(v) ? '' : formatter.format(v)
    }

    function countDecimals(n: number): number {
        if (!Number.isFinite(n)) return 0
        const match = String(n).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
        const fraction = match?.[1]?.length ?? 0
        const exponent = match?.[2] ? Number(match[2]) : 0
        return Math.min(Math.max(fraction - exponent, 0), 20)
    }

    function addPrecise(a: number, b: number): number {
        const factor = 10 ** Math.max(countDecimals(a), countDecimals(b))
        return Math.round(a * factor + b * factor) / factor
    }

    function clamp(v: number): number {
        if (min !== undefined && v < min) return min
        if (max !== undefined && v > max) return max
        return v
    }

    function snapValueToStep(v: number): number {
        const origin = min ?? 0
        const remainder = (v - origin) % resolvedStep
        let snapped =
            Math.abs(remainder) * 2 >= resolvedStep
                ? v + Math.sign(remainder) * (resolvedStep - Math.abs(remainder))
                : v - remainder
        if (min !== undefined && snapped < min) {
            snapped = min
        } else if (max !== undefined && snapped > max) {
            snapped =
                min !== undefined
                    ? min + Math.floor((max - min) / resolvedStep) * resolvedStep
                    : Math.floor(max / resolvedStep) * resolvedStep
        }
        const precision = Math.max(countDecimals(resolvedStep), countDecimals(origin))
        return Number(snapped.toFixed(Math.min(precision, 20)))
    }

    function constrain(v: number): number {
        return stepSnapping ? snapValueToStep(clamp(v)) : clamp(v)
    }

    let inputValue = $state(format(value))

    function setValue(next: number | null): boolean {
        if (next === (value ?? null)) return false
        value = next
        onValueChange?.(next)
        return true
    }

    function applyValue(next: number | null) {
        setValue(next)
        inputValue = format(next)
        emit.onChange()
    }

    $effect(() => {
        const v = value ?? null
        const currentParser = parser
        untrack(() => {
            const parsed = currentParser.parse(inputValue)
            const displayed = Number.isNaN(parsed) ? null : parsed
            if (displayed !== v) inputValue = format(v)
        })
    })

    function commit() {
        if (inputValue === '') {
            if (setValue(null)) emit.onChange()
            return
        }
        const parsed = parser.parse(inputValue)
        if (Number.isNaN(parsed)) {
            inputValue = format(value ?? null)
            return
        }
        const clamped = clamp(parsed)
        const formatted = format(clamped)
        const rounded = parser.parse(formatted)
        const changed = setValue(Number.isNaN(rounded) ? clamped : rounded)
        inputValue = formatted
        if (changed) emit.onChange()
    }

    function stepTarget(direction: 1 | -1): number | null {
        if (isEmptyValue(value)) {
            return constrain(addPrecise(0, resolvedStep * direction))
        }
        const candidate = constrain(addPrecise(value, resolvedStep * direction))
        if (direction === 1 ? candidate <= value : candidate >= value) return null
        return candidate
    }

    const incrementTarget = $derived(stepTarget(1))
    const decrementTarget = $derived(stepTarget(-1))
    const canIncrement = $derived(!disabled && !readonly && incrementTarget !== null)
    const canDecrement = $derived(!disabled && !readonly && decrementTarget !== null)

    function stepBy(direction: 1 | -1) {
        if (disabled || readonly) return
        const target = direction === 1 ? incrementTarget : decrementTarget
        if (target === null) return
        applyValue(target)
    }

    let holdDirection = $state<1 | -1 | null>(null)
    let holdRepeating = $state(false)

    useTimeout(
        () => {
            holdRepeating = true
        },
        () => (holdDirection === null ? null : 400)
    )

    useInterval(
        () => {
            if (holdDirection !== null) stepBy(holdDirection)
        },
        80,
        { paused: () => !holdRepeating || holdDirection === null }
    )

    function stopRepeat() {
        holdDirection = null
        holdRepeating = false
    }

    function handleStepperPointerDown(event: PointerEvent, direction: 1 | -1) {
        if (event.button !== 0) return
        event.preventDefault()
        ref?.focus()
        stepBy(direction)
        holdDirection = direction
    }

    function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
        const target = event.currentTarget
        const text = target.value
        if (parser.isValidPartialNumber(text, min, max)) {
            inputValue = text
            const parsed = parser.parse(text)
            setValue(Number.isNaN(parsed) ? null : parsed)
            emit.onInput()
        } else {
            const caret = Math.max((target.selectionStart ?? 1) - 1, 0)
            target.value = inputValue
            target.setSelectionRange(caret, caret)
        }
        oninput?.(event)
    }

    function handleStepperKey(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault()
                stepBy(1)
                break
            case 'ArrowDown':
                event.preventDefault()
                stepBy(-1)
                break
            case 'Home':
                if (min !== undefined) {
                    event.preventDefault()
                    applyValue(min)
                }
                break
            case 'End':
                if (max !== undefined) {
                    event.preventDefault()
                    applyValue(max)
                }
                break
            case 'Enter':
                commit()
                break
        }
    }

    function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
        if (!disabled && !readonly) handleStepperKey(event)
        onkeydown?.(event)
    }

    function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        commit()
        emit.onBlur()
        onblur?.(event)
    }

    function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        emit.onFocus()
        onfocus?.(event)
    }

    function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
        emit.onChange()
        onchange?.(event)
    }

    useEventListener(
        () => ref,
        'wheel',
        (event) => {
            if (disableWheelChange || disabled || readonly) return
            if (document.activeElement !== ref || event.deltaY === 0) return
            event.preventDefault()
            const towardMax = invertWheelChange ? event.deltaY > 0 : event.deltaY < 0
            stepBy(towardMax ? 1 : -1)
        },
        { passive: false }
    )

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedHighlight = $derived(highlight ?? hasError)
    const resolvedId = $derived(id ?? formFieldContext?.ariaId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const isVertical = $derived(orientation === 'vertical')
    const resolvedIncrementIcon = $derived(
        incrementIcon ?? (isVertical ? 'lucide:chevron-up' : 'lucide:plus')
    )
    const resolvedDecrementIcon = $derived(
        decrementIcon ?? (isVertical ? 'lucide:chevron-down' : 'lucide:minus')
    )

    const inputSlotFns = $derived(
        inputVariants({
            variant,
            color: resolvedColor,
            size: resolvedSize,
            highlight: resolvedHighlight,
            leading: !isVertical,
            trailing: true
        })
    )
    const variantSlots = $derived(inputNumberVariants({ orientation, size: resolvedSize }))
    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        base: variantSlots.base({ class: [inputSlotFns.base(), config.slots.base, ui?.base] }),
        increment: variantSlots.increment({ class: [config.slots.increment, ui?.increment] }),
        decrement: variantSlots.decrement({ class: [config.slots.decrement, ui?.decrement] }),
        incrementIcon: variantSlots.incrementIcon({
            class: [config.slots.incrementIcon, ui?.incrementIcon]
        }),
        decrementIcon: variantSlots.decrementIcon({
            class: [config.slots.decrementIcon, ui?.decrementIcon]
        })
    })
</script>

<div class={classes.root} data-orientation={orientation}>
    <input
        {...restProps}
        bind:this={ref}
        type="text"
        role="spinbutton"
        id={resolvedId}
        value={inputValue}
        inputmode={inputMode}
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        {required}
        {disabled}
        {readonly}
        aria-valuenow={value ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={inputValue === '' ? undefined : inputValue}
        aria-describedby={ariaDescribedBy}
        aria-invalid={resolvedHighlight ? true : undefined}
        class={classes.base}
        oninput={handleInput}
        onchange={handleChange}
        onblur={handleBlur}
        onfocus={handleFocus}
        onkeydown={handleKeydown}
    />

    <Button
        variant="link"
        color="surface"
        size={resolvedSize}
        square
        tabindex={-1}
        icon={resolvedDecrementIcon}
        leadingSlot={decrementSlot}
        aria-label={decrementAriaLabel}
        {...decrement}
        disabled={!canDecrement || decrement?.disabled === true}
        class={[classes.decrement, decrement?.class]}
        ui={{ leadingIcon: classes.decrementIcon, ...decrement?.ui }}
        onpointerdown={(event) => handleStepperPointerDown(event, -1)}
        onpointerup={stopRepeat}
        onpointerleave={stopRepeat}
        onpointercancel={stopRepeat}
    />

    <Button
        variant="link"
        color="surface"
        size={resolvedSize}
        square
        tabindex={-1}
        icon={resolvedIncrementIcon}
        leadingSlot={incrementSlot}
        aria-label={incrementAriaLabel}
        {...increment}
        disabled={!canIncrement || increment?.disabled === true}
        class={[classes.increment, increment?.class]}
        ui={{ leadingIcon: classes.incrementIcon, ...increment?.ui }}
        onpointerdown={(event) => handleStepperPointerDown(event, 1)}
        onpointerup={stopRepeat}
        onpointerleave={stopRepeat}
        onpointercancel={stopRepeat}
    />

    {#if resolvedName}
        <input type="hidden" name={resolvedName} value={value ?? ''} {disabled} />
    {/if}
</div>
