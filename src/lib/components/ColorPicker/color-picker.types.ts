import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ColorFormat } from './color-picker.utils.js'
import type { ColorPickerSlots, ColorPickerVariantProps } from './color-picker.variants.js'

export type { ColorFormat }

export type ColorPickerProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    'class' | 'children' | 'color'
> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The HTML id attribute forwarded to the saturation/brightness handle,
     * which is the element a `<FormField>` label points at.
     */
    id?: string

    /**
     * The selected color, serialized using `format`. Supports two-way binding
     * with `bind:value`. Accepts any hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`),
     * `rgb()`/`rgba()` or `hsl()`/`hsla()` string on the way in, plus `transparent`.
     * Invalid strings are ignored and leave the current color untouched.
     * The incoming string is kept verbatim until the first change, so a value
     * written in another notation is only rewritten in `format` once the color
     * is edited.
     * @default '#000000'
     */
    value?: string

    /**
     * Output format used when serializing the selected color.
     * The alpha channel is only appended when `alpha` is enabled and the color
     * is not fully opaque, so opaque colors stay `#3b82f6` rather than `#3b82f6ff`.
     * Supports two-way binding with `bind:format` when `formatSelect` is enabled.
     * @default 'hex'
     */
    format?: ColorFormat

    /**
     * Show the alpha slider and include the alpha channel in the emitted value.
     * @default false
     */
    alpha?: boolean

    /**
     * Callback fired every time the color changes, including while dragging.
     */
    onValueChange?: (value: string) => void

    /**
     * Callback fired once the interaction ends: on pointer release, on each
     * keyboard step, and when a swatch, eyedropper or text input sets the color.
     */
    onValueCommit?: (value: string) => void

    /**
     * Preset colors rendered as a row of swatches below the picker.
     * Accepts the same color strings as `value`; invalid entries are skipped.
     */
    swatches?: string[]

    /**
     * Show the swatch preview of the currently selected color.
     * @default true
     */
    preview?: boolean

    /**
     * Show the editable text field holding the color in the active `format`.
     * @default true
     */
    input?: boolean

    /**
     * Show a button next to the text field that cycles through
     * `hex` → `rgb` → `hsl`. Requires `input`.
     * @default false
     */
    formatSelect?: boolean

    /**
     * Show the eyedropper button used to sample a color from anywhere on screen.
     * Automatically hidden in browsers without the EyeDropper API.
     * @default true
     */
    eyeDropper?: boolean

    /**
     * Icon rendered inside the eyedropper button.
     * @default 'lucide:pipette'
     */
    eyeDropperIcon?: string

    /**
     * Disable every control and skip pointer interaction.
     * @default false
     */
    disabled?: boolean

    /**
     * Color scheme applied to focus rings and the selected swatch outline.
     * Automatically switches to `error` inside a `<FormField>` that has an error.
     * @default 'primary'
     */
    color?: NonNullable<ColorPickerVariantProps['color']>

    /**
     * Size of the picker.
     * @default 'md'
     */
    size?: NonNullable<ColorPickerVariantProps['size']>

    /**
     * The name attribute for the hidden input used in form submission.
     */
    name?: string

    /**
     * Accessible label for the saturation/brightness handle.
     * @default 'Saturation and brightness'
     */
    areaLabel?: string

    /**
     * Accessible label for the hue slider.
     * @default 'Hue'
     */
    hueLabel?: string

    /**
     * Accessible label for the alpha slider.
     * @default 'Alpha'
     */
    alphaLabel?: string

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific color picker slots.
     */
    ui?: Partial<Record<ColorPickerSlots, ClassNameValue>>
}
