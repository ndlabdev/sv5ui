<script lang="ts" module>
    import type { ColorPickerProps } from './color-picker.types.js'

    export type Props = ColorPickerProps
</script>

<script lang="ts">
    import { onMount, untrack } from 'svelte'
    import { Slider, useId } from 'bits-ui'
    import { colorPickerVariants, colorPickerDefaults } from './color-picker.variants.js'
    import {
        clamp,
        formatColor,
        hueCssColor,
        parseColor,
        stepAreaValue,
        toCssColor,
        type ColorFormat,
        type Hsva
    } from './color-picker.utils.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'

    const config = getComponentConfig('colorPicker', colorPickerDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    const FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl']
    const CHECKERBOARD =
        'repeating-conic-gradient(var(--color-outline-variant) 0% 25%, var(--color-surface) 0% 50%)'
    const HUE_GRADIENT =
        'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
    const AREA_GRADIENT =
        'linear-gradient(to top, #000000, rgba(0, 0, 0, 0)), linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0))'

    type EyeDropperInstance = {
        open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>
    }
    type EyeDropperConstructor = new () => EyeDropperInstance

    let {
        ref = $bindable(null),
        id,
        value = $bindable('#000000'),
        format = $bindable('hex'),
        alpha = false,
        onValueChange,
        onValueCommit,
        swatches,
        preview = true,
        input = true,
        formatSelect = false,
        eyeDropper = true,
        eyeDropperIcon = icons.eyeDropper,
        disabled = false,
        color = config.defaultVariants.color,
        size,
        name,
        areaLabel = 'Saturation and brightness',
        hueLabel = 'Hue',
        alphaLabel = 'Alpha',
        class: className,
        ui,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const autoId = useId()
    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedId = $derived(id ?? formFieldContext?.ariaId ?? autoId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedColor = $derived(hasError ? 'error' : color)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    let hsva = $state<Hsva>(parseColor(value) ?? { h: 0, s: 0, v: 0, a: 1 })
    let lastEmitted = value
    let syncedFormat: ColorFormat = untrack(() => format)
    let syncedAlpha = untrack(() => alpha)

    function applyColor(next: Hsva, commit: boolean) {
        hsva = { ...next, a: alpha ? clamp(next.a, 0, 1) : 1 }

        const serialized = formatColor(hsva, format, alpha)
        if (serialized !== lastEmitted) {
            lastEmitted = serialized
            value = serialized
            onValueChange?.(serialized)
            emit.onInput()
        }

        if (commit) {
            onValueCommit?.(serialized)
            emit.onChange()
        }
    }

    function keepNeutralHue(next: Hsva, current: Hsva): Hsva {
        if (next.v === 0) return { ...next, h: current.h, s: current.s }
        if (next.s === 0) return { ...next, h: current.h }
        return next
    }

    $effect(() => {
        const incoming = value
        untrack(() => {
            if (incoming === lastEmitted) return
            lastEmitted = incoming
            const parsed = parseColor(incoming)
            if (parsed) hsva = keepNeutralHue(parsed, hsva)
        })
    })

    $effect(() => {
        const nextFormat = format
        const nextAlpha = alpha
        untrack(() => {
            if (nextFormat === syncedFormat && nextAlpha === syncedAlpha) return
            syncedFormat = nextFormat
            syncedAlpha = nextAlpha
            applyColor(hsva, false)
        })
    })

    const serializedValue = $derived(formatColor(hsva, format, alpha))
    const currentColor = $derived(toCssColor(hsva, alpha))
    const opaqueColor = $derived(toCssColor({ ...hsva, a: 1 }, false))
    const transparentColor = $derived(toCssColor({ ...hsva, a: 0 }, true))

    const areaStyle = $derived(
        `background-color: ${hueCssColor(hsva.h)}; background-image: ${AREA_GRADIENT};`
    )
    const areaThumbStyle = $derived(
        `left: ${hsva.s * 100}%; top: ${(1 - hsva.v) * 100}%; background-color: ${opaqueColor};`
    )
    const previewStyle = $derived(
        `background-image: linear-gradient(${currentColor}, ${currentColor}), ${CHECKERBOARD}; background-size: auto, 8px 8px;`
    )
    const hueTrackStyle = `background-image: ${HUE_GRADIENT};`
    const hueThumbStyle = $derived(`background-color: ${hueCssColor(hsva.h)};`)
    const alphaTrackStyle = $derived(
        `background-image: linear-gradient(to right, ${transparentColor}, ${opaqueColor}), ${CHECKERBOARD}; background-size: auto, 8px 8px;`
    )
    const alphaThumbStyle = $derived(`background-color: ${currentColor};`)

    const resolvedSwatches = $derived(
        (swatches ?? [])
            .map((swatch) => ({ value: swatch, hsva: parseColor(swatch) }))
            .filter((swatch): swatch is { value: string; hsva: Hsva } => swatch.hsva !== null)
    )

    let areaEl = $state<HTMLElement | null>(null)
    let areaThumbEl = $state<HTMLElement | null>(null)
    let dragging = $state(false)

    function updateFromPointer(event: PointerEvent, commit: boolean) {
        if (!areaEl) return

        const rect = areaEl.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return

        applyColor(
            {
                ...hsva,
                s: clamp((event.clientX - rect.left) / rect.width, 0, 1),
                v: clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1)
            },
            commit
        )
    }

    function capturePointer(pointerId: number) {
        try {
            areaEl?.setPointerCapture(pointerId)
        } catch {
            return
        }
    }

    function releasePointer(pointerId: number) {
        if (areaEl?.hasPointerCapture(pointerId)) areaEl.releasePointerCapture(pointerId)
    }

    function handleAreaPointerDown(event: PointerEvent) {
        if (disabled) return
        if (event.button !== 0 && event.pointerType === 'mouse') return

        dragging = true
        capturePointer(event.pointerId)
        areaThumbEl?.focus()
        updateFromPointer(event, false)
    }

    function handleAreaPointerMove(event: PointerEvent) {
        if (!dragging) return
        updateFromPointer(event, false)
    }

    function handleAreaPointerUp(event: PointerEvent) {
        if (!dragging) return

        dragging = false
        releasePointer(event.pointerId)
        updateFromPointer(event, true)
    }

    function handleAreaKeydown(event: KeyboardEvent) {
        if (disabled) return

        const next = stepAreaValue(event.key, hsva, event.shiftKey ? 0.1 : 0.01)
        if (!next) return

        event.preventDefault()
        applyColor({ ...hsva, s: next.s, v: next.v }, true)
    }

    function handleHueChange(hue: number, commit: boolean) {
        applyColor({ ...hsva, h: hue }, commit)
    }

    function handleAlphaChange(percentage: number, commit: boolean) {
        applyColor({ ...hsva, a: percentage / 100 }, commit)
    }

    let inputDraft = $state<string | null>(null)
    const inputText = $derived(inputDraft ?? serializedValue)

    function handleInput(event: Event) {
        inputDraft = (event.currentTarget as HTMLInputElement).value
        const parsed = parseColor(inputDraft)
        if (parsed) applyColor(keepNeutralHue(parsed, hsva), false)
    }

    function handleInputBlur() {
        const parsed = parseColor(inputDraft)
        if (parsed) applyColor(keepNeutralHue(parsed, hsva), true)
        inputDraft = null
    }

    function handleInputKeydown(event: KeyboardEvent) {
        if (event.key !== 'Enter') return

        event.preventDefault()
        ;(event.currentTarget as HTMLInputElement).blur()
    }

    function cycleFormat() {
        format = FORMATS[(FORMATS.indexOf(format) + 1) % FORMATS.length]
    }

    let eyeDropperSupported = $state(false)

    onMount(() => {
        eyeDropperSupported =
            typeof (globalThis as { EyeDropper?: EyeDropperConstructor }).EyeDropper === 'function'
    })

    async function pickFromScreen() {
        const EyeDropperCtor = (globalThis as { EyeDropper?: EyeDropperConstructor }).EyeDropper
        if (!EyeDropperCtor) return

        try {
            const result = await new EyeDropperCtor().open()
            const parsed = parseColor(result.sRGBHex)
            if (parsed) applyColor({ ...keepNeutralHue(parsed, hsva), a: hsva.a }, true)
        } catch {
            return
        }
    }

    function handleFocusOut(event: FocusEvent) {
        const next = event.relatedTarget as Node | null
        if (next && ref?.contains(next)) return

        emit.onBlur()
    }

    const variantSlots = $derived(
        colorPickerVariants({ color: resolvedColor, size: resolvedSize, disabled })
    )
    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: variantSlots.root({ class: [config.slots.root, className, u.root] }),
            area: variantSlots.area({ class: [config.slots.area, u.area] }),
            areaThumb: variantSlots.areaThumb({ class: [config.slots.areaThumb, u.areaThumb] }),
            controls: variantSlots.controls({ class: [config.slots.controls, u.controls] }),
            eyeDropper: variantSlots.eyeDropper({ class: [config.slots.eyeDropper, u.eyeDropper] }),
            eyeDropperIcon: variantSlots.eyeDropperIcon({
                class: [config.slots.eyeDropperIcon, u.eyeDropperIcon]
            }),
            preview: variantSlots.preview({ class: [config.slots.preview, u.preview] }),
            sliders: variantSlots.sliders({ class: [config.slots.sliders, u.sliders] }),
            slider: variantSlots.slider({ class: [config.slots.slider, u.slider] }),
            track: variantSlots.track({ class: [config.slots.track, u.track] }),
            thumb: variantSlots.thumb({ class: [config.slots.thumb, u.thumb] }),
            inputs: variantSlots.inputs({ class: [config.slots.inputs, u.inputs] }),
            formatButton: variantSlots.formatButton({
                class: [config.slots.formatButton, u.formatButton]
            }),
            input: variantSlots.input({ class: [config.slots.input, u.input] }),
            swatches: variantSlots.swatches({ class: [config.slots.swatches, u.swatches] }),
            swatch: variantSlots.swatch({ class: [config.slots.swatch, u.swatch] })
        }
    })
</script>

<div
    {...restProps}
    bind:this={ref}
    class={classes.root}
    onfocusin={() => emit.onFocus()}
    onfocusout={handleFocusOut}
>
    {#if resolvedName}
        <input type="hidden" name={resolvedName} value={serializedValue} />
    {/if}

    <div
        bind:this={areaEl}
        role="none"
        class={classes.area}
        style={areaStyle}
        onpointerdown={handleAreaPointerDown}
        onpointermove={handleAreaPointerMove}
        onpointerup={handleAreaPointerUp}
        onpointercancel={handleAreaPointerUp}
    >
        <span
            bind:this={areaThumbEl}
            id={resolvedId}
            role="slider"
            tabindex={disabled ? -1 : 0}
            class={classes.areaThumb}
            style={areaThumbStyle}
            aria-label={areaLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(hsva.s * 100)}
            aria-valuetext="Saturation {Math.round(hsva.s * 100)}%, brightness {Math.round(
                hsva.v * 100
            )}%"
            aria-describedby={ariaDescribedBy}
            aria-disabled={disabled ? true : undefined}
            aria-invalid={hasError ? true : undefined}
            data-disabled={disabled ? '' : undefined}
            onkeydown={handleAreaKeydown}
        ></span>
    </div>

    <div class={classes.controls}>
        {#if eyeDropper && eyeDropperSupported}
            <button
                type="button"
                class={classes.eyeDropper}
                {disabled}
                aria-label="Pick a color from the screen"
                onclick={pickFromScreen}
            >
                <Icon name={eyeDropperIcon} class={classes.eyeDropperIcon} />
            </button>
        {/if}

        {#if preview}
            <span class={classes.preview} style={previewStyle}></span>
        {/if}

        <div class={classes.sliders}>
            <Slider.Root
                type="single"
                value={Math.round(hsva.h)}
                min={0}
                max={360}
                step={1}
                {disabled}
                onValueChange={(hue) => handleHueChange(hue, false)}
                onValueCommit={(hue) => handleHueChange(hue, true)}
                class={classes.slider}
                data-channel="hue"
            >
                <span class={classes.track} style={hueTrackStyle}></span>
                <Slider.Thumb
                    index={0}
                    class={classes.thumb}
                    style={hueThumbStyle}
                    aria-label={hueLabel}
                />
            </Slider.Root>

            {#if alpha}
                <Slider.Root
                    type="single"
                    value={Math.round(hsva.a * 100)}
                    min={0}
                    max={100}
                    step={1}
                    {disabled}
                    onValueChange={(percentage) => handleAlphaChange(percentage, false)}
                    onValueCommit={(percentage) => handleAlphaChange(percentage, true)}
                    class={classes.slider}
                    data-channel="alpha"
                >
                    <span class={classes.track} style={alphaTrackStyle}></span>
                    <Slider.Thumb
                        index={0}
                        class={classes.thumb}
                        style={alphaThumbStyle}
                        aria-label={alphaLabel}
                    />
                </Slider.Root>
            {/if}
        </div>
    </div>

    {#if input}
        <div class={classes.inputs}>
            {#if formatSelect}
                <button
                    type="button"
                    class={classes.formatButton}
                    {disabled}
                    aria-label="Change color format"
                    onclick={cycleFormat}
                >
                    {format}
                </button>
            {/if}

            <input
                type="text"
                class={classes.input}
                value={inputText}
                {disabled}
                spellcheck="false"
                autocomplete="off"
                autocapitalize="none"
                aria-label="Color value"
                oninput={handleInput}
                onblur={handleInputBlur}
                onkeydown={handleInputKeydown}
            />
        </div>
    {/if}

    {#if resolvedSwatches.length > 0}
        <div class={classes.swatches}>
            {#each resolvedSwatches as swatch, index (index)}
                {@const selected = formatColor(swatch.hsva, format, alpha) === serializedValue}
                <button
                    type="button"
                    class={classes.swatch}
                    style="background-image: linear-gradient({toCssColor(
                        swatch.hsva,
                        alpha
                    )}, {toCssColor(
                        swatch.hsva,
                        alpha
                    )}), {CHECKERBOARD}; background-size: auto, 8px 8px;"
                    {disabled}
                    title={swatch.value}
                    aria-label={swatch.value}
                    aria-pressed={selected}
                    data-selected={selected ? '' : undefined}
                    onclick={() => applyColor(swatch.hsva, true)}
                ></button>
            {/each}
        </div>
    {/if}
</div>
