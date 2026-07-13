import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import InputNumber from './InputNumber.svelte'
import InputNumberFormTestWrapper from './InputNumberFormTestWrapper.svelte'

const getInput = () => document.querySelector('input[role="spinbutton"]') as HTMLInputElement | null
const getHidden = () => document.querySelector('input[type="hidden"]') as HTMLInputElement | null
const getIncrement = () =>
    document.querySelector('button[aria-label="Increase"]') as HTMLButtonElement | null
const getDecrement = () =>
    document.querySelector('button[aria-label="Decrease"]') as HTMLButtonElement | null

const pressKey = (key: string) =>
    getInput()!.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    )

describe('InputNumber', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a spinbutton input', async () => {
            render(InputNumber)
            const input = page.getByRole('spinbutton')
            await expect.element(input).toBeInTheDocument()
        })

        it('should render increment and decrement buttons', () => {
            render(InputNumber)
            expect(getIncrement()).not.toBeNull()
            expect(getDecrement()).not.toBeNull()
        })

        it('should render with id', () => {
            render(InputNumber, { id: 'quantity-input' })
            expect(getInput()!.id).toBe('quantity-input')
        })

        it('should render with placeholder', () => {
            render(InputNumber, { placeholder: 'Enter amount' })
            expect(getInput()!.placeholder).toBe('Enter amount')
        })

        it('should render the formatted initial value', () => {
            render(InputNumber, { value: 1234 })
            expect(getInput()!.value).toBe('1,234')
        })

        it('should render empty when value is null', () => {
            render(InputNumber, { value: null })
            expect(getInput()!.value).toBe('')
        })

        it('should exclude stepper buttons from the tab order', () => {
            render(InputNumber)
            expect(getIncrement()!.tabIndex).toBe(-1)
            expect(getDecrement()!.tabIndex).toBe(-1)
        })

        it('should render a hidden input with the raw value when name is provided', () => {
            render(InputNumber, { name: 'qty', value: 5 })
            const hidden = getHidden()
            expect(hidden).not.toBeNull()
            expect(hidden!.name).toBe('qty')
            expect(hidden!.value).toBe('5')
        })

        it('should not render a hidden input without a name', () => {
            render(InputNumber, { value: 5 })
            expect(getHidden()).toBeNull()
        })
    })

    // ==================== VALUE & TYPING ====================

    describe('value and typing', () => {
        it('should update the value while typing', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, { onValueChange })
            await page.getByRole('spinbutton').fill('42')
            expect(onValueChange).toHaveBeenLastCalledWith(42)
        })

        it('should reject non-numeric text', async () => {
            render(InputNumber)
            await page.getByRole('spinbutton').fill('abc')
            expect(getInput()!.value).toBe('')
        })

        it('should format the value on blur', async () => {
            render(InputNumber)
            await page.getByRole('spinbutton').fill('1234')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('1,234')
            })
        })

        it('should normalize the display on blur', async () => {
            render(InputNumber)
            await page.getByRole('spinbutton').fill('007')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('7')
            })
        })

        it('should commit on Enter', async () => {
            render(InputNumber)
            const input = page.getByRole('spinbutton')
            await input.fill('007')
            pressKey('Enter')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('7')
            })
        })

        it('should set value to null when cleared', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, { value: 5, onValueChange })
            await page.getByRole('spinbutton').fill('')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(null)
                expect(getInput()!.value).toBe('')
            })
        })

        it('should round the committed value to the format precision', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, { onValueChange })
            await page.getByRole('spinbutton').fill('1.23456')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('1.235')
                expect(onValueChange).toHaveBeenLastCalledWith(1.235)
            })
        })

        it('should update the display when the value prop changes', async () => {
            const { rerender } = render(InputNumber, { value: 5 })
            expect(getInput()!.value).toBe('5')
            await rerender({ value: 50 })
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('50')
            })
        })
    })

    // ==================== MIN / MAX / STEP ====================

    describe('min, max and step', () => {
        it('should clamp to max on blur', async () => {
            render(InputNumber, { min: 0, max: 10 })
            await page.getByRole('spinbutton').fill('50')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('10')
            })
        })

        it('should reject the minus sign when min is not negative', async () => {
            render(InputNumber, { min: 0 })
            await page.getByRole('spinbutton').fill('-5')
            expect(getInput()!.value).toBe('')
        })

        it('should allow negative values when min is negative', async () => {
            render(InputNumber, { min: -10 })
            await page.getByRole('spinbutton').fill('-5')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('-5')
            })
        })

        it('should keep typed off-step values on commit', async () => {
            render(InputNumber, { step: 5 })
            await page.getByRole('spinbutton').fill('7')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('7')
            })
        })

        it('should snap stepping to the nearest step multiple', async () => {
            render(InputNumber, { value: 7, step: 5 })
            pressKey('ArrowUp')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('10')
            })
        })

        it('should step relative to the current value when stepSnapping is false', async () => {
            render(InputNumber, { value: 7, step: 5, stepSnapping: false })
            pressKey('ArrowUp')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('12')
            })
        })

        it('should snap stepping counting from min', async () => {
            render(InputNumber, { value: 8, min: 2, step: 5 })
            pressKey('ArrowUp')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('12')
            })
        })

        it('should expose min and max as aria attributes', () => {
            render(InputNumber, { min: 0, max: 10, value: 5 })
            const input = getInput()!
            expect(input.getAttribute('aria-valuemin')).toBe('0')
            expect(input.getAttribute('aria-valuemax')).toBe('10')
            expect(input.getAttribute('aria-valuenow')).toBe('5')
        })
    })

    // ==================== STEPPER BUTTONS ====================

    describe('stepper buttons', () => {
        it('should increment from empty to one step', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, { onValueChange })
            await page.getByRole('button', { name: 'Increase' }).click()
            expect(onValueChange).toHaveBeenLastCalledWith(1)
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('1')
            })
        })

        it('should decrement from empty to minus one step', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, { onValueChange })
            await page.getByRole('button', { name: 'Decrease' }).click()
            expect(onValueChange).toHaveBeenLastCalledWith(-1)
        })

        it('should increment by the given step', async () => {
            render(InputNumber, { value: 4, step: 2 })
            await page.getByRole('button', { name: 'Increase' }).click()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('6')
            })
        })

        it('should avoid floating point artifacts when stepping decimals', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, { value: 0.2, step: 0.1, onValueChange })
            await page.getByRole('button', { name: 'Increase' }).click()
            expect(onValueChange).toHaveBeenLastCalledWith(0.3)
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('0.3')
            })
        })

        it('should clamp stepping into range when empty', async () => {
            render(InputNumber, { min: 5, max: 20 })
            await page.getByRole('button', { name: 'Increase' }).click()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('5')
            })
        })

        it('should focus the input when a stepper is pressed', async () => {
            render(InputNumber)
            await page.getByRole('button', { name: 'Increase' }).click()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getInput())
            })
        })

        it('should disable increment at max', () => {
            render(InputNumber, { value: 10, max: 10 })
            expect(getIncrement()!.disabled).toBe(true)
            expect(getDecrement()!.disabled).toBe(false)
        })

        it('should disable increment when snapping cannot advance below max', () => {
            render(InputNumber, { value: 9, min: 0, max: 10, step: 3 })
            expect(getIncrement()!.disabled).toBe(true)
            expect(getDecrement()!.disabled).toBe(false)
        })

        it('should never decrease the value when incrementing from an off-step value', () => {
            render(InputNumber, { value: 10, min: 0, max: 10, step: 3 })
            expect(getIncrement()!.disabled).toBe(true)
        })

        it('should disable decrement at min', () => {
            render(InputNumber, { value: 0, min: 0 })
            expect(getDecrement()!.disabled).toBe(true)
            expect(getIncrement()!.disabled).toBe(false)
        })

        it('should not submit forms', () => {
            render(InputNumber)
            expect(getIncrement()!.type).toBe('button')
            expect(getDecrement()!.type).toBe('button')
        })
    })

    // ==================== KEYBOARD ====================

    describe('keyboard', () => {
        it('should increment with ArrowUp', async () => {
            render(InputNumber, { value: 5 })
            pressKey('ArrowUp')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('6')
            })
        })

        it('should decrement with ArrowDown', async () => {
            render(InputNumber, { value: 5 })
            pressKey('ArrowDown')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('4')
            })
        })

        it('should jump to min with Home', async () => {
            render(InputNumber, { value: 5, min: 2, max: 8 })
            pressKey('Home')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('2')
            })
        })

        it('should jump to max with End', async () => {
            render(InputNumber, { value: 5, min: 2, max: 8 })
            pressKey('End')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('8')
            })
        })

        it('should reach an off-step max with End', async () => {
            render(InputNumber, { value: 5, min: 0, max: 10, step: 3 })
            pressKey('End')
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('10')
            })
        })

        it('should ignore Home and End without min and max', async () => {
            render(InputNumber, { value: 5 })
            pressKey('Home')
            pressKey('End')
            expect(getInput()!.value).toBe('5')
        })

        it('should stop at max when incrementing', async () => {
            render(InputNumber, { value: 10, max: 10 })
            pressKey('ArrowUp')
            expect(getInput()!.value).toBe('10')
        })
    })

    // ==================== WHEEL ====================

    describe('wheel', () => {
        const wheel = (deltaY: number) =>
            getInput()!.dispatchEvent(
                new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true })
            )

        it('should increment on wheel up while focused', async () => {
            render(InputNumber, { value: 5 })
            getInput()!.focus()
            wheel(-100)
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('6')
            })
        })

        it('should decrement on wheel down while focused', async () => {
            render(InputNumber, { value: 5 })
            getInput()!.focus()
            wheel(100)
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('4')
            })
        })

        it('should ignore wheel when not focused', async () => {
            render(InputNumber, { value: 5 })
            wheel(-100)
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getInput()!.value).toBe('5')
        })

        it('should ignore wheel when disableWheelChange is set', async () => {
            render(InputNumber, { value: 5, disableWheelChange: true })
            getInput()!.focus()
            wheel(-100)
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getInput()!.value).toBe('5')
        })

        it('should invert the direction with invertWheelChange', async () => {
            render(InputNumber, { value: 5, invertWheelChange: true })
            getInput()!.focus()
            wheel(-100)
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('4')
            })
        })
    })

    // ==================== FORMATTING ====================

    describe('formatting', () => {
        it('should format currency', () => {
            render(InputNumber, {
                value: 1234,
                formatOptions: { style: 'currency', currency: 'USD' }
            })
            expect(getInput()!.value).toBe('$1,234.00')
        })

        it('should parse typed input back through the currency format', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, {
                formatOptions: { style: 'currency', currency: 'USD' },
                onValueChange
            })
            await page.getByRole('spinbutton').fill('99')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getInput()!.value).toBe('$99.00')
                expect(onValueChange).toHaveBeenLastCalledWith(99)
            })
        })

        it('should format percent and default the step to 0.01', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, {
                value: 0.5,
                formatOptions: { style: 'percent' },
                onValueChange
            })
            expect(getInput()!.value).toBe('50%')
            pressKey('ArrowUp')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(0.51)
                expect(getInput()!.value).toBe('51%')
            })
        })

        it('should format according to the locale', () => {
            render(InputNumber, { value: 1234.5, locale: 'de-DE' })
            expect(getInput()!.value).toBe('1.234,5')
        })

        it('should parse locale-specific input', async () => {
            const onValueChange = vi.fn()
            render(InputNumber, { locale: 'de-DE', onValueChange })
            await page.getByRole('spinbutton').fill('1,5')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(1.5)
            })
        })

        it('should use numeric inputmode for integer formats', () => {
            render(InputNumber, { formatOptions: { maximumFractionDigits: 0 } })
            expect(getInput()!.getAttribute('inputmode')).toBe('numeric')
        })

        it('should use decimal inputmode by default', () => {
            render(InputNumber)
            expect(getInput()!.getAttribute('inputmode')).toBe('decimal')
        })
    })

    // ==================== STATES ====================

    describe('states', () => {
        it('should disable the input and both buttons when disabled', async () => {
            render(InputNumber, { value: 5, disabled: true })
            const input = page.getByRole('spinbutton')
            await expect.element(input).toBeDisabled()
            expect(getIncrement()!.disabled).toBe(true)
            expect(getDecrement()!.disabled).toBe(true)
        })

        it('should mark the input readonly and disable the buttons when readonly', () => {
            render(InputNumber, { value: 5, readonly: true })
            expect(getInput()!.readOnly).toBe(true)
            expect(getIncrement()!.disabled).toBe(true)
            expect(getDecrement()!.disabled).toBe(true)
        })

        it('should ignore arrow keys when readonly', async () => {
            render(InputNumber, { value: 5, readonly: true })
            pressKey('ArrowUp')
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getInput()!.value).toBe('5')
        })

        it('should support required', () => {
            render(InputNumber, { required: true })
            expect(getInput()!.required).toBe(true)
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should default to horizontal with side buttons', () => {
            const { container } = render(InputNumber)
            const root = container.firstElementChild as HTMLElement
            expect(root.getAttribute('data-orientation')).toBe('horizontal')
            expect(getDecrement()!.className).toContain('start-0')
            expect(getIncrement()!.className).toContain('end-0')
        })

        it('should stack the buttons on the trailing side when vertical', () => {
            const { container } = render(InputNumber, { orientation: 'vertical' })
            const root = container.firstElementChild as HTMLElement
            expect(root.getAttribute('data-orientation')).toBe('vertical')
            expect(getIncrement()!.className).toContain('bottom-1/2')
            expect(getDecrement()!.className).toContain('top-1/2')
            expect(getDecrement()!.className).toContain('end-0')
        })

        it('should center the text when horizontal', () => {
            render(InputNumber)
            expect(getInput()!.className).toContain('text-center')
        })

        it('should not center the text when vertical', () => {
            render(InputNumber, { orientation: 'vertical' })
            expect(getInput()!.className).not.toContain('text-center')
        })
    })

    // ==================== VARIANTS / COLORS / SIZES ====================

    describe('variants, colors and sizes', () => {
        it('should apply outline variant classes by default', async () => {
            render(InputNumber)
            const input = page.getByRole('spinbutton')
            await expect.element(input).toHaveClass(/ring/)
            await expect.element(input).toHaveClass(/ring-inset/)
        })

        it('should apply soft variant classes', async () => {
            render(InputNumber, { variant: 'soft', color: 'primary' })
            const input = page.getByRole('spinbutton')
            await expect.element(input).toHaveClass(/bg-primary-container/)
        })

        it('should apply color classes', async () => {
            render(InputNumber, { color: 'success' })
            const input = page.getByRole('spinbutton')
            await expect.element(input).toHaveClass(/ring-success/)
        })

        it('should apply size classes', async () => {
            render(InputNumber, { size: 'xl' })
            const input = page.getByRole('spinbutton')
            await expect.element(input).toHaveClass(/text-base/)
        })

        it('should reserve padding for both buttons when horizontal', async () => {
            render(InputNumber)
            const input = page.getByRole('spinbutton')
            await expect.element(input).toHaveClass(/ps-9/)
            await expect.element(input).toHaveClass(/pe-9/)
        })

        it('should reserve trailing padding only when vertical', async () => {
            render(InputNumber, { orientation: 'vertical' })
            const input = page.getByRole('spinbutton')
            await expect.element(input).toHaveClass(/pe-9/)
            expect(getInput()!.className).not.toMatch(/ps-9/)
        })

        it('should apply highlight ring and aria-invalid', async () => {
            render(InputNumber, { highlight: true, color: 'error' })
            const input = page.getByRole('spinbutton')
            await expect.element(input).toHaveClass(/ring-2/)
            await expect.element(input).toHaveClass(/ring-error/)
            expect(getInput()!.getAttribute('aria-invalid')).toBe('true')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to the root element', () => {
            const { container } = render(InputNumber, { class: 'my-custom-class' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-custom-class')
        })

        it('should apply ui slot overrides', () => {
            const { container } = render(InputNumber, {
                ui: { root: 'my-root-class', base: 'my-base-class', increment: 'my-inc-class' }
            })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-root-class')
            expect(getInput()!.className).toContain('my-base-class')
            expect(getIncrement()!.className).toContain('my-inc-class')
        })

        it('should render with custom icons', () => {
            render(InputNumber, {
                incrementIcon: 'lucide:arrow-up',
                decrementIcon: 'lucide:arrow-down'
            })
            expect(getIncrement()).not.toBeNull()
            expect(getDecrement()).not.toBeNull()
        })

        it('should forward Button props to the steppers', () => {
            render(InputNumber, {
                increment: { variant: 'soft', color: 'primary' },
                decrement: { disabled: true }
            })
            expect(getIncrement()!.className).toMatch(/bg-primary/)
            expect(getDecrement()!.disabled).toBe(true)
        })

        it('should render custom stepper content through slots', () => {
            render(InputNumber, {
                incrementSlot: createRawSnippet(() => ({
                    render: () => '<span data-testid="custom-inc">+1</span>'
                })),
                decrementSlot: createRawSnippet(() => ({
                    render: () => '<span data-testid="custom-dec">-1</span>'
                }))
            })
            expect(getIncrement()!.querySelector('[data-testid="custom-inc"]')).not.toBeNull()
            expect(getDecrement()!.querySelector('[data-testid="custom-dec"]')).not.toBeNull()
        })
    })

    // ==================== EVENTS ====================

    describe('events', () => {
        it('should call oninput while typing', async () => {
            const oninput = vi.fn()
            render(InputNumber, { oninput })
            await page.getByRole('spinbutton').fill('5')
            expect(oninput).toHaveBeenCalled()
        })

        it('should call onblur', async () => {
            const onblur = vi.fn()
            render(InputNumber, { onblur })
            getInput()!.focus()
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(onblur).toHaveBeenCalledOnce()
            })
        })

        it('should call onfocus', async () => {
            const onfocus = vi.fn()
            render(InputNumber, { onfocus })
            getInput()!.focus()
            await vi.waitFor(() => {
                expect(onfocus).toHaveBeenCalledOnce()
            })
        })
    })

    // ==================== FORM INTEGRATION ====================

    describe('form integration', () => {
        it('should wire the label to the input through the form field', async () => {
            render(InputNumberFormTestWrapper)
            await vi.waitFor(() => {
                expect(getInput()).not.toBeNull()
            })
            const label = document.querySelector('label') as HTMLLabelElement
            expect(label).not.toBeNull()
            expect(label.htmlFor).toBe(getInput()!.id)
            expect(getInput()!.getAttribute('aria-describedby')).not.toBeNull()
        })

        it('should show the error state after blurring an empty required field', async () => {
            render(InputNumberFormTestWrapper)
            await vi.waitFor(() => {
                expect(getInput()).not.toBeNull()
            })
            getInput()!.focus()
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('Quantity is required')
                expect(getInput()!.getAttribute('aria-invalid')).toBe('true')
                expect(getInput()!.className).toMatch(/ring-error/)
            })
        })

        it('should re-validate on Enter without blurring', async () => {
            render(InputNumberFormTestWrapper)
            await vi.waitFor(() => {
                expect(getInput()).not.toBeNull()
            })
            getInput()!.focus()
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('Quantity is required')
            })
            await page.getByRole('spinbutton').fill('3')
            pressKey('Enter')
            await vi.waitFor(() => {
                expect(document.body.textContent).not.toContain('Quantity is required')
            })
        })

        it('should clear the error after entering a valid value', async () => {
            render(InputNumberFormTestWrapper)
            await vi.waitFor(() => {
                expect(getInput()).not.toBeNull()
            })
            getInput()!.focus()
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('Quantity is required')
            })
            await page.getByRole('spinbutton').fill('3')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).not.toContain('Quantity is required')
                expect(getInput()!.getAttribute('aria-invalid')).toBeNull()
            })
        })
    })
})
