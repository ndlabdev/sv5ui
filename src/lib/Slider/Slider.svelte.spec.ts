import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Slider from './Slider.svelte'

const getRoot = () => document.querySelector('[data-slider-root]') as HTMLElement | null
const getTrack = () => document.querySelector('[data-slider-track]') as HTMLElement | null
const pressKey = (el: HTMLElement, key: string) =>
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
const getRange = () => document.querySelector('[data-slider-range]') as HTMLElement | null
const getThumbs = () =>
    Array.from(document.querySelectorAll('[data-slider-thumb]')) as HTMLElement[]
const getThumb = () => getThumbs()[0]

describe('Slider', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a slider root element', async () => {
            render(Slider)
            const slider = page.getByRole('slider')
            await expect.element(slider).toBeInTheDocument()
        })

        it('should render a track element', () => {
            render(Slider)
            expect(getTrack()).not.toBeNull()
        })

        it('should render a range element', () => {
            render(Slider)
            expect(getRange()).not.toBeNull()
        })

        it('should render one thumb by default (single value)', () => {
            render(Slider)
            expect(getThumbs()).toHaveLength(1)
        })

        it('should render multiple thumbs for array value', () => {
            render(Slider, { value: [20, 80] })
            expect(getThumbs()).toHaveLength(2)
        })

        it('should render three thumbs for three-value array', () => {
            render(Slider, { value: [10, 50, 90] })
            expect(getThumbs()).toHaveLength(3)
        })
    })

    // ==================== VALUE ====================

    describe('value', () => {
        it('should reflect single value via aria-valuenow', () => {
            render(Slider, { value: 42 })
            expect(getThumb()!.getAttribute('aria-valuenow')).toBe('42')
        })

        it('should reflect multiple values via aria-valuenow on each thumb', () => {
            render(Slider, { value: [25, 75] })
            const thumbs = getThumbs()
            expect(thumbs[0]!.getAttribute('aria-valuenow')).toBe('25')
            expect(thumbs[1]!.getAttribute('aria-valuenow')).toBe('75')
        })

        it('should default value to 0 when not provided', () => {
            render(Slider)
            expect(getThumb()!.getAttribute('aria-valuenow')).toBe('0')
        })

        it('should set aria-valuemin and aria-valuemax from min/max props', () => {
            render(Slider, { min: 10, max: 90, value: 50 })
            expect(getThumb()!.getAttribute('aria-valuemin')).toBe('10')
            expect(getThumb()!.getAttribute('aria-valuemax')).toBe('90')
        })

        it('should call onValueChange during interaction', async () => {
            const onValueChange = vi.fn()
            render(Slider, { value: 50, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'ArrowRight')
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalled())
        })

        it('should call onValueCommit when interaction ends', async () => {
            const onValueCommit = vi.fn()
            render(Slider, { value: 50, onValueCommit })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'ArrowRight')
            await vi.waitFor(() => expect(onValueCommit).toHaveBeenCalled())
        })

        it('should increment by step with ArrowRight', async () => {
            const onValueChange = vi.fn()
            render(Slider, { value: 50, step: 10, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'ArrowRight')
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith(60))
        })

        it('should decrement by step with ArrowLeft', async () => {
            const onValueChange = vi.fn()
            render(Slider, { value: 50, step: 10, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'ArrowLeft')
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith(40))
        })

        it('should jump to min with Home key', async () => {
            const onValueChange = vi.fn()
            render(Slider, { min: 0, max: 100, value: 50, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'Home')
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith(0))
        })

        it('should jump to max with End key', async () => {
            const onValueChange = vi.fn()
            render(Slider, { min: 0, max: 100, value: 50, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'End')
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith(100))
        })

        it('should not exceed max', async () => {
            const onValueChange = vi.fn()
            render(Slider, { min: 0, max: 100, value: 100, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'ArrowRight')
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it('should not go below min', async () => {
            const onValueChange = vi.fn()
            render(Slider, { min: 0, max: 100, value: 0, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'ArrowLeft')
            expect(onValueChange).not.toHaveBeenCalled()
        })
    })

    // ==================== DISABLED ====================

    describe('disabled', () => {
        it('should set disabled attribute on thumb when disabled', async () => {
            render(Slider, { disabled: true })
            const thumb = page.getByRole('slider')
            await expect.element(thumb).toBeDisabled()
        })

        it('should apply disabled variant class to base', () => {
            render(Slider, { disabled: true })
            expect(getRoot()!.className).toMatch(/opacity-50/)
        })

        it('should apply cursor-not-allowed when disabled', () => {
            render(Slider, { disabled: true })
            expect(getRoot()!.className).toMatch(/cursor-not-allowed/)
        })

        it('should not change value when disabled', async () => {
            const onValueChange = vi.fn()
            render(Slider, { disabled: true, value: 50, onValueChange })
            const thumb = getThumb()!
            thumb.focus()
            pressKey(thumb, 'ArrowRight')
            expect(onValueChange).not.toHaveBeenCalled()
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = [
            'primary',
            'secondary',
            'tertiary',
            'success',
            'warning',
            'error',
            'info'
        ] as const

        for (const color of colors) {
            it(`should apply range color for color="${color}"`, () => {
                render(Slider, { color, value: 50 })
                expect(getRange()!.className).toMatch(new RegExp(`bg-${color}`))
            })

            it(`should apply thumb ring color for color="${color}"`, () => {
                render(Slider, { color, value: 50 })
                expect(getThumb()!.className).toMatch(new RegExp(`ring-${color}`))
            })
        }

        it('should apply surface color to range', () => {
            render(Slider, { color: 'surface', value: 50 })
            expect(getRange()!.className).toMatch(/bg-on-surface/)
        })

        it('should apply surface color to thumb ring', () => {
            render(Slider, { color: 'surface', value: 50 })
            expect(getThumb()!.className).toMatch(/ring-on-surface/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs thumb size', () => {
            render(Slider, { size: 'xs' })
            expect(getThumb()!.className).toMatch(/size-3/)
        })

        it('should apply sm thumb size', () => {
            render(Slider, { size: 'sm' })
            expect(getThumb()!.className).toMatch(/size-3\.5/)
        })

        it('should apply md thumb size by default', () => {
            render(Slider)
            expect(getThumb()!.className).toMatch(/size-4/)
        })

        it('should apply lg thumb size', () => {
            render(Slider, { size: 'lg' })
            expect(getThumb()!.className).toMatch(/size-4\.5/)
        })

        it('should apply xl thumb size', () => {
            render(Slider, { size: 'xl' })
            expect(getThumb()!.className).toMatch(/size-5/)
        })

        it('should apply xs track height for horizontal', () => {
            render(Slider, { size: 'xs', orientation: 'horizontal' })
            expect(getTrack()!.className).toMatch(/h-1/)
        })

        it('should apply md track height for horizontal', () => {
            render(Slider, { size: 'md', orientation: 'horizontal' })
            expect(getTrack()!.className).toMatch(/h-2/)
        })

        it('should apply md track width for vertical', () => {
            render(Slider, { size: 'md', orientation: 'vertical' })
            expect(getTrack()!.className).toMatch(/w-2/)
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should apply horizontal layout class by default', () => {
            render(Slider)
            expect(getRoot()!.className).toMatch(/flex-row|w-full/)
        })

        it('should apply vertical layout class', () => {
            render(Slider, { orientation: 'vertical' })
            expect(getRoot()!.className).toMatch(/flex-col|h-full/)
        })

        it('should set aria-orientation on thumb for vertical', () => {
            render(Slider, { orientation: 'vertical' })
            expect(getThumb()!.getAttribute('aria-orientation')).toBe('vertical')
        })
    })

    // ==================== FORM (name / hidden inputs) ====================

    describe('form integration', () => {
        it('should render a hidden input when name is set', () => {
            const { container } = render(Slider, { name: 'volume', value: 50 })
            const hidden = container.querySelector(
                'input[type="hidden"][name="volume"]'
            ) as HTMLInputElement
            expect(hidden).not.toBeNull()
            expect(hidden!.value).toBe('50')
        })

        it('should render one hidden input per thumb for range values', () => {
            const { container } = render(Slider, { name: 'range', value: [20, 80] })
            const inputs = container.querySelectorAll('input[type="hidden"][name="range"]')
            expect(inputs).toHaveLength(2)
            expect((inputs[0] as HTMLInputElement).value).toBe('20')
            expect((inputs[1] as HTMLInputElement).value).toBe('80')
        })

        it('should not render hidden inputs when name is not set', () => {
            const { container } = render(Slider, { value: 50 })
            expect(container.querySelector('input[type="hidden"]')).toBeNull()
        })
    })

    // ==================== TOOLTIP ====================

    describe('tooltip', () => {
        it('should render thumb label when tooltip=true', async () => {
            render(Slider, { tooltip: true, value: 50 })
            await vi.waitFor(() => {
                // Slider.ThumbLabel renders a positioned span with the value
                const labels = document.querySelectorAll('[data-slider-thumb-label]')
                expect(labels.length).toBeGreaterThan(0)
            })
        })

        it('should not render thumb label when tooltip=false', () => {
            render(Slider, { tooltip: false, value: 50 })
            const labels = document.querySelectorAll('[data-slider-thumb-label]')
            expect(labels).toHaveLength(0)
        })

        it('should render one label per thumb in range mode', async () => {
            render(Slider, { tooltip: true, value: [25, 75] })
            await vi.waitFor(() => {
                const labels = document.querySelectorAll('[data-slider-thumb-label]')
                expect(labels.length).toBe(2)
            })
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            const { container } = render(Slider, { class: 'my-root-class' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-root-class')
        })

        it('should apply ui.base override to slider root', () => {
            render(Slider, { ui: { base: 'my-base-class' } })
            expect(getRoot()!.className).toContain('my-base-class')
        })

        it('should apply ui.track override', () => {
            render(Slider, { ui: { track: 'my-track-class' } })
            expect(getTrack()!.className).toContain('my-track-class')
        })

        it('should apply ui.range override', () => {
            render(Slider, { ui: { range: 'my-range-class' } })
            expect(getRange()!.className).toContain('my-range-class')
        })

        it('should apply ui.thumb override', () => {
            render(Slider, { ui: { thumb: 'my-thumb-class' } })
            expect(getThumb()!.className).toContain('my-thumb-class')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should have role="slider" on thumb', async () => {
            render(Slider)
            const thumb = page.getByRole('slider')
            await expect.element(thumb).toBeInTheDocument()
        })

        it('should have correct aria-valuemin', () => {
            render(Slider, { min: 5 })
            expect(getThumb()!.getAttribute('aria-valuemin')).toBe('5')
        })

        it('should have correct aria-valuemax', () => {
            render(Slider, { max: 200 })
            expect(getThumb()!.getAttribute('aria-valuemax')).toBe('200')
        })

        it('should have aria-disabled when disabled', () => {
            render(Slider, { disabled: true })
            const thumb = getThumb()!
            // bits-ui sets disabled attribute or aria-disabled
            expect(
                thumb.hasAttribute('disabled') || thumb.getAttribute('aria-disabled') === 'true'
            ).toBe(true)
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render range slider with color and size', () => {
            render(Slider, { value: [10, 90], color: 'success', size: 'lg' })
            expect(getThumbs()).toHaveLength(2)
            expect(getRange()!.className).toMatch(/bg-success/)
            expect(getThumb()!.className).toMatch(/size-4\.5/)
        })

        it('should render disabled range slider with correct initial values', () => {
            render(Slider, { value: [20, 80], disabled: true })
            const thumbs = getThumbs()
            expect(thumbs[0]!.getAttribute('aria-valuenow')).toBe('20')
            expect(thumbs[1]!.getAttribute('aria-valuenow')).toBe('80')
            expect(getRoot()!.className).toMatch(/opacity-50/)
        })

        it('should render with all variant props combined', () => {
            render(Slider, {
                value: 60,
                min: 0,
                max: 100,
                step: 5,
                color: 'error',
                size: 'xl',
                orientation: 'horizontal'
            })
            expect(getThumb()!.getAttribute('aria-valuenow')).toBe('60')
            expect(getRange()!.className).toMatch(/bg-error/)
            expect(getThumb()!.className).toMatch(/size-5/)
        })
    })
})
