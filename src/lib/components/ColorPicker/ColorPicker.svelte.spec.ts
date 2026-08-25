import '../../../routes/layout.css'
import { userEvent } from 'vitest/browser'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { tick } from 'svelte'
import ColorPicker from './ColorPicker.svelte'
import ColorPickerFormTestWrapper from './ColorPickerFormTestWrapper.svelte'

const getAreaThumb = () =>
    document.querySelector(
        '[role="slider"][aria-label="Saturation and brightness"]'
    ) as HTMLElement | null
const getArea = () => getAreaThumb()!.parentElement as HTMLElement
const getHueThumb = () =>
    document.querySelector('[role="slider"][aria-label="Hue"]') as HTMLElement | null
const getAlphaThumb = () =>
    document.querySelector('[role="slider"][aria-label="Alpha"]') as HTMLElement | null
const getTextInput = () => document.querySelector('input[type="text"]') as HTMLInputElement | null
const getHiddenInput = () =>
    document.querySelector('input[type="hidden"]') as HTMLInputElement | null
const getEyeDropperButton = () =>
    document.querySelector(
        'button[aria-label="Pick a color from the screen"]'
    ) as HTMLElement | null
const getFormatButton = () =>
    document.querySelector('button[aria-label="Change color format"]') as HTMLElement | null
const getSwatch = (value: string) =>
    document.querySelector(`button[aria-label="${value}"]`) as HTMLElement | null

const saturation = () => Number(getAreaThumb()!.getAttribute('aria-valuenow'))

async function firePointer(type: string, xRatio: number, yRatio: number) {
    const area = getArea()
    const rect = area.getBoundingClientRect()
    area.dispatchEvent(
        new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            pointerId: 1,
            button: 0,
            clientX: Math.round(rect.left + rect.width * xRatio),
            clientY: Math.round(rect.top + rect.height * yRatio)
        })
    )
    await tick()
}

async function pressKey(element: HTMLElement, key: string, shiftKey = false) {
    element.dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true })
    )
    await tick()
}

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('ColorPicker', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the saturation and brightness handle', () => {
            render(ColorPicker)
            expect(getAreaThumb()).not.toBeNull()
        })

        it('should render the hue slider', () => {
            render(ColorPicker)
            expect(getHueThumb()).not.toBeNull()
        })

        it('should not render the alpha slider by default', () => {
            render(ColorPicker)
            expect(getAlphaThumb()).toBeNull()
        })

        it('should render the alpha slider when enabled', () => {
            render(ColorPicker, { alpha: true })
            expect(getAlphaThumb()).not.toBeNull()
        })

        it('should render the text input by default', () => {
            render(ColorPicker)
            expect(getTextInput()).not.toBeNull()
        })

        it('should hide the text input when disabled', () => {
            render(ColorPicker, { input: false })
            expect(getTextInput()).toBeNull()
        })

        it('should not render the format button by default', () => {
            render(ColorPicker)
            expect(getFormatButton()).toBeNull()
        })

        it('should render the format button when formatSelect is set', () => {
            render(ColorPicker, { formatSelect: true })
            expect(getFormatButton()!.textContent!.trim()).toBe('hex')
        })

        it('should render the preview swatch by default', () => {
            const { container } = render(ColorPicker, { value: '#ff0000' })
            const preview = container.querySelector('.rounded-full.shrink-0') as HTMLElement
            expect(preview).not.toBeNull()
        })

        it('should hide the preview when disabled', () => {
            const { container } = render(ColorPicker, { preview: false, eyeDropper: false })
            expect(container.querySelector('.rounded-full.shrink-0')).toBeNull()
        })

        it('should render a custom eyedropper icon', async () => {
            vi.stubGlobal(
                'EyeDropper',
                class {
                    open() {
                        return Promise.resolve({ sRGBHex: '#ff0000' })
                    }
                }
            )
            render(ColorPicker, { eyeDropperIcon: 'lucide:star' })
            await vi.waitFor(() => expect(getEyeDropperButton()).not.toBeNull())
            await vi.waitFor(() =>
                expect(getEyeDropperButton()!.querySelector('svg')).not.toBeNull()
            )
        })

        it('should generate an id automatically', () => {
            render(ColorPicker)
            expect(getAreaThumb()!.id).toBeTruthy()
        })

        it('should render with a custom id', () => {
            render(ColorPicker, { id: 'brand-color' })
            expect(getAreaThumb()!.id).toBe('brand-color')
        })

        it('should apply custom class and ui overrides', () => {
            const { container } = render(ColorPicker, {
                class: 'my-picker',
                ui: { area: 'my-area' }
            })
            expect(container.querySelector('.my-picker')).not.toBeNull()
            expect(container.querySelector('.my-area')).not.toBeNull()
        })
    })

    // ==================== VALUE ====================

    describe('value', () => {
        it('should default to black', () => {
            render(ColorPicker, { name: 'color' })
            expect(getHiddenInput()!.value).toBe('#000000')
        })

        it('should show the initial value in the text input', () => {
            render(ColorPicker, { value: '#3b82f6' })
            expect(getTextInput()!.value).toBe('#3b82f6')
        })

        it('should normalize shorthand hex input', () => {
            render(ColorPicker, { value: '#f00' })
            expect(getTextInput()!.value).toBe('#ff0000')
        })

        it('should accept an rgb string and re-emit it as hex', () => {
            render(ColorPicker, { value: 'rgb(59, 130, 246)' })
            expect(getTextInput()!.value).toBe('#3b82f6')
        })

        it('should keep the current color when the incoming value is invalid', () => {
            render(ColorPicker, { value: 'not-a-color' })
            expect(getTextInput()!.value).toBe('#000000')
        })

        it('should reflect the saturation of the initial value', () => {
            render(ColorPicker, { value: '#ff0000' })
            expect(saturation()).toBe(100)
        })

        it('should update when the value prop changes externally', async () => {
            const screen = render(ColorPicker, { value: '#ff0000' })
            await screen.rerender({ value: '#0000ff' })
            expect(getTextInput()!.value).toBe('#0000ff')
            expect(getHueThumb()!.getAttribute('aria-valuenow')).toBe('240')
        })

        it('should keep the hue when the color becomes black', async () => {
            const screen = render(ColorPicker, { value: '#00ff00' })
            expect(getHueThumb()!.getAttribute('aria-valuenow')).toBe('120')
            await screen.rerender({ value: '#000000' })
            expect(getHueThumb()!.getAttribute('aria-valuenow')).toBe('120')
        })
    })

    // ==================== FORMAT ====================

    describe('format', () => {
        it('should emit rgb strings', () => {
            render(ColorPicker, { value: '#ff0000', format: 'rgb' })
            expect(getTextInput()!.value).toBe('rgb(255, 0, 0)')
        })

        it('should emit hsl strings', () => {
            render(ColorPicker, { value: '#ff0000', format: 'hsl' })
            expect(getTextInput()!.value).toBe('hsl(0, 100%, 50%)')
        })

        it('should re-serialize when the format prop changes', async () => {
            const screen = render(ColorPicker, { value: '#ff0000', name: 'color' })
            expect(getHiddenInput()!.value).toBe('#ff0000')
            await screen.rerender({ value: '#ff0000', name: 'color', format: 'rgb' })
            expect(getHiddenInput()!.value).toBe('rgb(255, 0, 0)')
        })

        it('should cycle formats with the format button', async () => {
            render(ColorPicker, { value: '#ff0000', formatSelect: true })
            await userEvent.click(getFormatButton()!)
            expect(getTextInput()!.value).toBe('rgb(255, 0, 0)')
            await userEvent.click(getFormatButton()!)
            expect(getTextInput()!.value).toBe('hsl(0, 100%, 50%)')
            await userEvent.click(getFormatButton()!)
            expect(getTextInput()!.value).toBe('#ff0000')
        })

        it('should omit alpha when the channel is disabled', () => {
            render(ColorPicker, { value: 'rgba(255, 0, 0, 0.5)', format: 'rgb' })
            expect(getTextInput()!.value).toBe('rgb(255, 0, 0)')
        })

        it('should keep alpha when the channel is enabled', () => {
            render(ColorPicker, { value: 'rgba(255, 0, 0, 0.5)', format: 'rgb', alpha: true })
            expect(getTextInput()!.value).toBe('rgba(255, 0, 0, 0.5)')
        })

        it('should render the alpha slider at the parsed alpha', () => {
            render(ColorPicker, { value: '#ff000080', alpha: true })
            expect(getAlphaThumb()!.getAttribute('aria-valuenow')).toBe('50')
        })
    })

    // ==================== POINTER ====================

    describe('pointer interaction', () => {
        it('should set saturation and brightness on pointer down', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await firePointer('pointerdown', 0.25, 0.5)
            expect(saturation()).toBeGreaterThanOrEqual(24)
            expect(saturation()).toBeLessThanOrEqual(26)
            expect(getAreaThumb()!.getAttribute('aria-valuetext')).toMatch(/brightness (49|50|51)%/)
        })

        it('should track the pointer while dragging', async () => {
            const onValueChange = vi.fn()
            render(ColorPicker, { value: '#ff0000', onValueChange })
            await firePointer('pointerdown', 0.25, 0.5)
            await firePointer('pointermove', 0.75, 0.5)
            expect(saturation()).toBeGreaterThanOrEqual(74)
            expect(saturation()).toBeLessThanOrEqual(76)
            expect(onValueChange).toHaveBeenCalled()
        })

        it('should ignore pointer move before pointer down', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await firePointer('pointermove', 0.75, 0.25)
            expect(saturation()).toBe(100)
        })

        it('should commit on pointer up', async () => {
            const onValueCommit = vi.fn()
            render(ColorPicker, { value: '#ff0000', onValueCommit })
            await firePointer('pointerdown', 0.5, 0.5)
            expect(onValueCommit).not.toHaveBeenCalled()
            await firePointer('pointerup', 0.5, 0.5)
            expect(onValueCommit).toHaveBeenCalledTimes(1)
        })

        it('should stop dragging after pointer cancel', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await firePointer('pointerdown', 0.5, 0.5)
            await firePointer('pointercancel', 0.5, 0.5)
            const before = saturation()
            await firePointer('pointermove', 0.1, 0.5)
            expect(saturation()).toBe(before)
        })

        it('should not react to pointer events when disabled', async () => {
            render(ColorPicker, { value: '#ff0000', disabled: true })
            await firePointer('pointerdown', 0.25, 0.5)
            expect(saturation()).toBe(100)
        })
    })

    // ==================== KEYBOARD ====================

    describe('keyboard interaction', () => {
        it('should decrease saturation with ArrowLeft', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await pressKey(getAreaThumb()!, 'ArrowLeft')
            expect(saturation()).toBe(99)
        })

        it('should increase saturation with ArrowRight', async () => {
            render(ColorPicker, { value: '#804040' })
            const before = saturation()
            await pressKey(getAreaThumb()!, 'ArrowRight')
            expect(saturation()).toBe(before + 1)
        })

        it('should use a larger step with shift', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await pressKey(getAreaThumb()!, 'ArrowLeft', true)
            expect(saturation()).toBe(90)
        })

        it('should change brightness with ArrowDown', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await pressKey(getAreaThumb()!, 'ArrowDown')
            expect(getAreaThumb()!.getAttribute('aria-valuetext')).toContain('brightness 99%')
        })

        it('should jump brightness with PageDown', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await pressKey(getAreaThumb()!, 'PageDown')
            expect(getAreaThumb()!.getAttribute('aria-valuetext')).toContain('brightness 90%')
        })

        it('should snap saturation with Home and End', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await pressKey(getAreaThumb()!, 'Home')
            expect(saturation()).toBe(0)
            await pressKey(getAreaThumb()!, 'End')
            expect(saturation()).toBe(100)
        })

        it('should clamp at the edges', async () => {
            render(ColorPicker, { value: '#ff0000' })
            await pressKey(getAreaThumb()!, 'ArrowRight')
            expect(saturation()).toBe(100)
        })

        it('should commit on every keyboard step', async () => {
            const onValueCommit = vi.fn()
            render(ColorPicker, { value: '#ff0000', onValueCommit })
            await pressKey(getAreaThumb()!, 'ArrowLeft')
            expect(onValueCommit).toHaveBeenCalledTimes(1)
        })

        it('should ignore unrelated keys', async () => {
            const onValueChange = vi.fn()
            render(ColorPicker, { value: '#ff0000', onValueChange })
            await pressKey(getAreaThumb()!, 'Enter')
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it('should ignore keys when disabled', async () => {
            render(ColorPicker, { value: '#ff0000', disabled: true })
            await pressKey(getAreaThumb()!, 'ArrowLeft')
            expect(saturation()).toBe(100)
        })
    })

    // ==================== CHANNEL SLIDERS ====================

    describe('channel sliders', () => {
        it('should change the hue with the keyboard', async () => {
            render(ColorPicker, { value: '#ff0000' })
            getHueThumb()!.focus()
            await userEvent.keyboard('{ArrowRight}')
            expect(getHueThumb()!.getAttribute('aria-valuenow')).toBe('1')
            expect(getTextInput()!.value).not.toBe('#ff0000')
        })

        it('should jump the hue to the maximum with End', async () => {
            render(ColorPicker, { value: '#ff0000' })
            getHueThumb()!.focus()
            await userEvent.keyboard('{End}')
            expect(getHueThumb()!.getAttribute('aria-valuenow')).toBe('360')
        })

        it('should keep saturation and brightness while the hue changes', async () => {
            render(ColorPicker, { value: '#804040' })
            const before = getAreaThumb()!.getAttribute('aria-valuetext')
            getHueThumb()!.focus()
            await userEvent.keyboard('{ArrowRight}')
            expect(getAreaThumb()!.getAttribute('aria-valuetext')).toBe(before)
        })

        it('should change the alpha with the keyboard', async () => {
            render(ColorPicker, { value: '#ff000080', alpha: true, format: 'rgb' })
            getAlphaThumb()!.focus()
            await userEvent.keyboard('{ArrowRight}')
            expect(getAlphaThumb()!.getAttribute('aria-valuenow')).toBe('51')
            expect(getTextInput()!.value).toBe('rgba(255, 0, 0, 0.51)')
        })

        it('should not drift the color when the hue slider is only focused', async () => {
            render(ColorPicker, { value: '#3b82f6', name: 'color' })
            getHueThumb()!.focus()
            await tick()
            expect(getHiddenInput()!.value).toBe('#3b82f6')
        })

        it('should mark the sliders disabled', () => {
            render(ColorPicker, { alpha: true, disabled: true })
            expect(getHueThumb()!.getAttribute('aria-disabled')).toBe('true')
            expect(getAlphaThumb()!.getAttribute('aria-disabled')).toBe('true')
        })
    })

    // ==================== TEXT INPUT ====================

    describe('text input', () => {
        it('should apply a typed color', async () => {
            render(ColorPicker, { value: '#000000', name: 'color' })
            await userEvent.fill(getTextInput()!, '#3b82f6')
            expect(getHiddenInput()!.value).toBe('#3b82f6')
        })

        it('should keep the raw text while typing', async () => {
            render(ColorPicker, { value: '#000000' })
            await userEvent.fill(getTextInput()!, 'rgb(255, 0, 0)')
            expect(getTextInput()!.value).toBe('rgb(255, 0, 0)')
        })

        it('should normalize the text on blur', async () => {
            render(ColorPicker, { value: '#000000' })
            const input = getTextInput()!
            await userEvent.fill(input, 'rgb(255, 0, 0)')
            input.blur()
            await vi.waitFor(() => expect(getTextInput()!.value).toBe('#ff0000'))
        })

        it('should revert invalid text on blur', async () => {
            render(ColorPicker, { value: '#ff0000' })
            const input = getTextInput()!
            await userEvent.fill(input, 'nonsense')
            input.blur()
            await vi.waitFor(() => expect(getTextInput()!.value).toBe('#ff0000'))
        })

        it('should ignore invalid text while typing', async () => {
            render(ColorPicker, { value: '#ff0000', name: 'color' })
            await userEvent.fill(getTextInput()!, '#zzz')
            expect(getHiddenInput()!.value).toBe('#ff0000')
        })

        it('should commit on Enter', async () => {
            const onValueCommit = vi.fn()
            render(ColorPicker, { value: '#000000', onValueCommit })
            const input = getTextInput()!
            await userEvent.fill(input, '#ff0000')
            await userEvent.keyboard('{Enter}')
            expect(onValueCommit).toHaveBeenCalled()
        })
    })

    // ==================== SWATCHES ====================

    describe('swatches', () => {
        it('should not render a swatch row without swatches', () => {
            render(ColorPicker)
            expect(getSwatch('#ff0000')).toBeNull()
        })

        it('should render one button per swatch', () => {
            render(ColorPicker, { swatches: ['#ff0000', '#00ff00'] })
            expect(getSwatch('#ff0000')).not.toBeNull()
            expect(getSwatch('#00ff00')).not.toBeNull()
        })

        it('should skip invalid swatches', () => {
            render(ColorPicker, { swatches: ['#ff0000', 'nope'] })
            expect(getSwatch('nope')).toBeNull()
        })

        it('should tolerate duplicate swatches', () => {
            render(ColorPicker, { swatches: ['#ff0000', '#ff0000'] })
            expect(document.querySelectorAll('button[aria-label="#ff0000"]')).toHaveLength(2)
        })

        it('should select a color when clicked', async () => {
            render(ColorPicker, { value: '#000000', name: 'color', swatches: ['#3b82f6'] })
            await userEvent.click(getSwatch('#3b82f6')!)
            expect(getHiddenInput()!.value).toBe('#3b82f6')
        })

        it('should mark the active swatch as pressed', async () => {
            render(ColorPicker, { value: '#000000', swatches: ['#3b82f6'] })
            expect(getSwatch('#3b82f6')!.getAttribute('aria-pressed')).toBe('false')
            await userEvent.click(getSwatch('#3b82f6')!)
            expect(getSwatch('#3b82f6')!.getAttribute('aria-pressed')).toBe('true')
        })

        it('should commit when a swatch is chosen', async () => {
            const onValueCommit = vi.fn()
            render(ColorPicker, { value: '#000000', swatches: ['#3b82f6'], onValueCommit })
            await userEvent.click(getSwatch('#3b82f6')!)
            expect(onValueCommit).toHaveBeenCalledWith('#3b82f6')
        })

        it('should disable swatches when the picker is disabled', () => {
            render(ColorPicker, { swatches: ['#3b82f6'], disabled: true })
            expect((getSwatch('#3b82f6') as HTMLButtonElement).disabled).toBe(true)
        })
    })

    // ==================== EYEDROPPER ====================

    describe('eyedropper', () => {
        it('should not render the button when the API is unavailable', () => {
            vi.stubGlobal('EyeDropper', undefined)
            render(ColorPicker)
            expect(getEyeDropperButton()).toBeNull()
        })

        it('should not render the button when disabled by prop', () => {
            vi.stubGlobal(
                'EyeDropper',
                class {
                    open() {
                        return Promise.resolve({ sRGBHex: '#ff0000' })
                    }
                }
            )
            render(ColorPicker, { eyeDropper: false })
            expect(getEyeDropperButton()).toBeNull()
        })

        it('should render the button when the API is available', async () => {
            vi.stubGlobal(
                'EyeDropper',
                class {
                    open() {
                        return Promise.resolve({ sRGBHex: '#ff0000' })
                    }
                }
            )
            render(ColorPicker)
            await vi.waitFor(() => expect(getEyeDropperButton()).not.toBeNull())
        })

        it('should apply the sampled color', async () => {
            vi.stubGlobal(
                'EyeDropper',
                class {
                    open() {
                        return Promise.resolve({ sRGBHex: '#3b82f6' })
                    }
                }
            )
            render(ColorPicker, { value: '#000000', name: 'color' })
            await vi.waitFor(() => expect(getEyeDropperButton()).not.toBeNull())
            await userEvent.click(getEyeDropperButton()!)
            await vi.waitFor(() => expect(getHiddenInput()!.value).toBe('#3b82f6'))
        })

        it('should keep the current color when the user cancels', async () => {
            vi.stubGlobal(
                'EyeDropper',
                class {
                    open() {
                        return Promise.reject(new Error('aborted'))
                    }
                }
            )
            render(ColorPicker, { value: '#ff0000', name: 'color' })
            await vi.waitFor(() => expect(getEyeDropperButton()).not.toBeNull())
            await userEvent.click(getEyeDropperButton()!)
            expect(getHiddenInput()!.value).toBe('#ff0000')
        })
    })

    // ==================== FORM INTEGRATION ====================

    describe('form integration', () => {
        it('should render a hidden input when name is set', () => {
            render(ColorPicker, { name: 'brand', value: '#ff0000' })
            const hidden = getHiddenInput()!
            expect(hidden.name).toBe('brand')
            expect(hidden.value).toBe('#ff0000')
        })

        it('should not render a hidden input without a name', () => {
            render(ColorPicker, { value: '#ff0000' })
            expect(getHiddenInput()).toBeNull()
        })

        it('should take its name from the FormField context', () => {
            render(ColorPickerFormTestWrapper)
            expect(getHiddenInput()!.name).toBe('brand')
        })

        it('should link the handle to the FormField label', () => {
            render(ColorPickerFormTestWrapper)
            const label = document.querySelector('label') as HTMLLabelElement
            expect(label.getAttribute('for')).toBe(getAreaThumb()!.id)
        })

        it('should describe the handle with the FormField description', () => {
            render(ColorPickerFormTestWrapper)
            expect(getAreaThumb()!.getAttribute('aria-describedby')).toContain('-description')
        })

        it('should not validate while focus moves between its own controls', async () => {
            render(ColorPickerFormTestWrapper)
            getTextInput()!.focus()
            await tick()
            getAreaThumb()!.focus()
            await tick()
            expect(document.body.textContent).not.toContain('Pick a color other than white')
        })

        it('should validate once focus leaves the picker', async () => {
            render(ColorPickerFormTestWrapper)
            getTextInput()!.focus()
            await tick()
            ;(document.querySelector('[data-outside]') as HTMLElement).focus()
            await vi.waitFor(() =>
                expect(document.body.textContent).toContain('Pick a color other than white')
            )
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should expose the handle as a slider', () => {
            render(ColorPicker, { value: '#ff0000' })
            const thumb = getAreaThumb()!
            expect(thumb.getAttribute('aria-valuemin')).toBe('0')
            expect(thumb.getAttribute('aria-valuemax')).toBe('100')
            expect(thumb.getAttribute('aria-valuenow')).toBe('100')
        })

        it('should describe both channels in aria-valuetext', () => {
            render(ColorPicker, { value: '#ff0000' })
            expect(getAreaThumb()!.getAttribute('aria-valuetext')).toBe(
                'Saturation 100%, brightness 100%'
            )
        })

        it('should be focusable', () => {
            render(ColorPicker)
            expect(getAreaThumb()!.getAttribute('tabindex')).toBe('0')
        })

        it('should not be focusable when disabled', () => {
            render(ColorPicker, { disabled: true })
            expect(getAreaThumb()!.getAttribute('tabindex')).toBe('-1')
            expect(getAreaThumb()!.getAttribute('aria-disabled')).toBe('true')
        })

        it('should accept custom channel labels', () => {
            render(ColorPicker, {
                alpha: true,
                areaLabel: 'Do bao hoa',
                hueLabel: 'Mau sac',
                alphaLabel: 'Do trong suot'
            })
            expect(document.querySelector('[aria-label="Do bao hoa"]')).not.toBeNull()
            expect(document.querySelector('[aria-label="Mau sac"]')).not.toBeNull()
            expect(document.querySelector('[aria-label="Do trong suot"]')).not.toBeNull()
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply size classes', () => {
            const { container } = render(ColorPicker, { size: 'xl' })
            expect((container.firstElementChild as HTMLElement).className).toMatch(/w-72/)
        })

        it('should apply color classes to the handle', () => {
            render(ColorPicker, { color: 'success' })
            expect(getAreaThumb()!.className).toMatch(/ring-success/)
        })

        it('should apply disabled styling', () => {
            const { container } = render(ColorPicker, { disabled: true })
            expect((container.firstElementChild as HTMLElement).className).toMatch(/opacity-75/)
        })
    })
})
