import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { InputProps } from '../Input/input.types.js'
import type { InputPasswordSlots } from './input-password.variants.js'

/**
 * What the field is for, which decides the `autocomplete` value browsers and
 * password managers rely on.
 *
 * - `login` maps to `current-password`
 * - `signup` and `change` map to `new-password`, which lets a password manager
 *   offer to generate a strong one
 */
export type InputPasswordPurpose = 'login' | 'signup' | 'change'

export type InputPasswordProps = Omit<
    InputProps<string>,
    'type' | 'icon' | 'trailing' | 'trailingIcon' | 'trailingSlot' | 'autocomplete'
> & {
    /**
     * Bindable reference to the underlying input element.
     */
    ref?: HTMLInputElement | null

    /**
     * What the field is for. Sets `autocomplete` accordingly.
     * @default 'login'
     */
    purpose?: InputPasswordPurpose

    /**
     * Whether the value is currently readable. Bindable, so the caller can
     * drive or observe the toggle.
     * @default false
     */
    visible?: boolean

    /**
     * Renders the visibility toggle button.
     * @default true
     */
    toggle?: boolean

    /**
     * Icon for the button that reveals the value.
     * @default Uses `icons.passwordShow` from app config
     */
    showIcon?: string

    /**
     * Icon for the button that hides the value.
     * @default Uses `icons.passwordHide` from app config
     */
    hideIcon?: string

    /**
     * Accessible name of the toggle when the value is hidden.
     * @default 'Show password'
     */
    showLabel?: string

    /**
     * Accessible name of the toggle when the value is visible.
     * @default 'Hide password'
     */
    hideLabel?: string

    /**
     * Warns while caps lock is on, a common cause of failed sign in.
     * @default true
     */
    capsLockWarning?: boolean

    /**
     * Message shown while caps lock is on.
     * @default 'Caps Lock is on'
     */
    capsLockMessage?: string

    /**
     * Current strength, as an index into `strengthLevels`. Scoring is left to
     * the caller: this component renders the result and never judges a password
     * itself. Pass `null` or leave it out to hide the meter.
     */
    strength?: number | null

    /**
     * Labels for each strength step, in ascending order. Also decides how many
     * steps the meter has.
     * @default ['Weak', 'Fair', 'Good', 'Strong']
     */
    strengthLevels?: string[]

    /**
     * Extra content rendered below the field, after the meter. Receives the
     * current value so a caller can render their own hints.
     */
    footer?: Snippet<[{ value: string; strength: number | null }]>

    /**
     * Additional CSS classes for the outer wrapper, which holds the field, the
     * strength meter, the caps lock warning and the footer. To style the field
     * alone, use `ui.base`.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific slots.
     */
    ui?: Partial<Record<InputPasswordSlots, ClassNameValue>> & InputProps<string>['ui']
}
