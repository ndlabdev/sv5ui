import '../../../routes/layout.css'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import { defineConfig, resetConfig } from '../../config.js'
import InputPassword from './InputPassword.svelte'

afterEach(() => resetConfig())

const settle = async (container: Element) => {
    await vi.waitFor(() => expect(container.querySelector('input')).not.toBeNull())
}

const parts = (container: Element) => ({
    input: container.querySelector('input')!,
    toggle: container.querySelector<HTMLButtonElement>('button'),
    meter: container.querySelector('[role="progressbar"]'),
    live: container.querySelector('[aria-live]'),
    caps: container.querySelector('p')
})

describe('InputPassword', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a password field by default', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)

            expect(parts(container).input.type).toBe('password')
        })

        it('should render the visibility toggle by default', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)

            expect(parts(container).toggle).not.toBeNull()
        })

        it('should render no toggle when it is turned off', async () => {
            const { container } = render(InputPassword, { toggle: false })
            await settle(container)

            expect(parts(container).toggle).toBeNull()
        })
    })

    // ==================== VISIBILITY TOGGLE ====================

    describe('visibility toggle', () => {
        it('should reveal and hide the value', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)
            const { input, toggle } = parts(container)

            toggle!.click()
            await vi.waitFor(() => expect(input.type).toBe('text'))

            toggle!.click()
            await vi.waitFor(() => expect(input.type).toBe('password'))
        })

        it('should name the toggle for its next action', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)
            const { toggle } = parts(container)

            expect(toggle!.getAttribute('aria-label')).toBe('Show password')
            toggle!.click()
            await vi.waitFor(() => expect(toggle!.getAttribute('aria-label')).toBe('Hide password'))
        })

        it('should report the toggle state through aria-pressed', async () => {
            const { container } = render(InputPassword, { visible: true })
            await settle(container)

            expect(parts(container).toggle!.getAttribute('aria-pressed')).toBe('true')
        })

        it('should accept custom labels', async () => {
            const { container } = render(InputPassword, { showLabel: 'Reveal' })
            await settle(container)

            expect(parts(container).toggle!.getAttribute('aria-label')).toBe('Reveal')
        })

        it.each([
            ['disabled', { disabled: true }],
            ['loading', { loading: true }]
        ])('should disable the toggle while %s', async (_label, props) => {
            const { container } = render(InputPassword, props)
            await settle(container)

            expect(parts(container).toggle!.disabled).toBe(true)
        })
    })

    // ==================== AUTOCOMPLETE ====================

    describe('autocomplete', () => {
        it.each([
            ['login', 'current-password'],
            ['signup', 'new-password'],
            ['change', 'new-password']
        ] as const)('should map purpose=%s to %s', async (purpose, expected) => {
            const { container } = render(InputPassword, { purpose })
            await settle(container)

            expect(parts(container).input.getAttribute('autocomplete')).toBe(expected)
        })

        it('should default to the sign in value', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)

            expect(parts(container).input.getAttribute('autocomplete')).toBe('current-password')
        })
    })

    // ==================== PASTE ====================

    describe('paste', () => {
        it('should never block pasting into the field', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)
            const { input } = parts(container)

            const event = new Event('paste', { bubbles: true, cancelable: true })
            input.dispatchEvent(event)

            expect(event.defaultPrevented).toBe(false)
            expect(input.onpaste).toBeNull()
        })
    })

    // ==================== CAPS LOCK ====================

    describe('caps lock warning', () => {
        const keydown = (input: HTMLInputElement, capsLock: boolean) => {
            const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true })
            Object.defineProperty(event, 'getModifierState', {
                value: (key: string) => key === 'CapsLock' && capsLock
            })
            input.dispatchEvent(event)
        }

        it('should warn while caps lock is on', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)
            keydown(parts(container).input, true)

            await vi.waitFor(() =>
                expect(parts(container).caps?.textContent).toContain('Caps Lock is on')
            )
        })

        it('should stay quiet while caps lock is off', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)
            keydown(parts(container).input, false)

            await vi.waitFor(() => expect(parts(container).caps).toBeNull())
        })

        it('should clear the warning once caps lock is released', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)
            const { input } = parts(container)

            keydown(input, true)
            await vi.waitFor(() => expect(parts(container).caps).not.toBeNull())

            keydown(input, false)
            await vi.waitFor(() => expect(parts(container).caps).toBeNull())
        })

        it('should clear the warning when the field loses focus', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)
            const { input } = parts(container)

            keydown(input, true)
            await vi.waitFor(() => expect(parts(container).caps).not.toBeNull())

            input.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
            await vi.waitFor(() => expect(parts(container).caps).toBeNull())
        })

        it('should accept a custom message', async () => {
            const { container } = render(InputPassword, { capsLockMessage: 'Caps is active' })
            await settle(container)
            keydown(parts(container).input, true)

            await vi.waitFor(() =>
                expect(parts(container).caps?.textContent).toContain('Caps is active')
            )
        })

        it('should render nothing when the warning is turned off', async () => {
            const { container } = render(InputPassword, { capsLockWarning: false })
            await settle(container)
            keydown(parts(container).input, true)

            await vi.waitFor(() => expect(parts(container).caps).toBeNull())
        })
    })

    // ==================== STRENGTH METER ====================

    describe('strength meter', () => {
        it('should render no meter when no score is given', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)

            expect(parts(container).meter).toBeNull()
        })

        it('should render no meter for a null score', async () => {
            const { container } = render(InputPassword, { strength: null })
            await settle(container)

            expect(parts(container).meter).toBeNull()
        })

        it.each([0, 1, 2, 3])('should report score %i on the progressbar', async (score) => {
            const { container } = render(InputPassword, { strength: score })
            await settle(container)

            const meter = parts(container).meter!
            expect(meter.getAttribute('aria-valuenow')).toBe(String(score))
            expect(meter.getAttribute('aria-valuemax')).toBe('3')
        })

        it('should clamp a score above the last level', async () => {
            const { container } = render(InputPassword, { strength: 99 })
            await settle(container)

            expect(parts(container).meter!.getAttribute('aria-valuenow')).toBe('3')
        })

        it('should clamp a negative score', async () => {
            const { container } = render(InputPassword, { strength: -5 })
            await settle(container)

            expect(parts(container).meter!.getAttribute('aria-valuenow')).toBe('0')
        })

        it('should follow custom levels', async () => {
            const { container } = render(InputPassword, {
                strength: 1,
                strengthLevels: ['Low', 'High']
            })
            await settle(container)

            expect(parts(container).meter!.getAttribute('aria-valuemax')).toBe('1')
        })

        it('should announce the level in a live region only when a meter exists', async () => {
            const without = render(InputPassword, {})
            await settle(without.container)
            expect(parts(without.container).live).toBeNull()

            const withMeter = render(InputPassword, { strength: 2 })
            await settle(withMeter.container)
            expect(parts(withMeter.container).live).not.toBeNull()
        })
    })

    // ==================== SIZE ====================

    describe('size', () => {
        const padOf = (container: Element) => getComputedStyle(parts(container).toggle!).padding

        it('should keep the toggle in step with the field by default', async () => {
            const { container } = render(InputPassword, {})
            await settle(container)

            expect(padOf(container)).toBe('6px')
        })

        it('should follow an explicit size', async () => {
            const { container } = render(InputPassword, { size: 'xs' })
            await settle(container)

            expect(padOf(container)).toBe('4px')
        })

        it('should follow the size configured for Input', async () => {
            defineConfig({ input: { defaultVariants: { size: 'xl' } } } as never)
            const { container } = render(InputPassword, {})
            await settle(container)

            expect(padOf(container)).toBe('10px')
        })
    })

    // ==================== UI OVERRIDES ====================

    describe('ui overrides', () => {
        it('should apply its own root class exactly once', async () => {
            const { container } = render(InputPassword, { ui: { root: 'probe-root' } } as never)
            await settle(container)

            expect(container.querySelectorAll('.probe-root')).toHaveLength(1)
        })

        it('should still forward slots that belong to the field', async () => {
            const { container } = render(InputPassword, { ui: { base: 'probe-base' } } as never)
            await settle(container)

            expect(parts(container).input.className).toContain('probe-base')
        })
    })

    // ==================== FOOTER ====================

    describe('footer', () => {
        it('should render footer content below the field', async () => {
            const { container } = render(InputPassword, {
                footer: createRawSnippet(() => ({
                    render: () => '<p id="probe-footer">hint</p>',
                    setup: () => {}
                }))
            } as never)
            await settle(container)

            expect(container.querySelector('#probe-footer')).not.toBeNull()
        })
    })

    // ==================== REF ====================

    describe('ref', () => {
        it('should expose the underlying input element', async () => {
            let el = $state<HTMLInputElement | null>(null)
            const { container } = render(InputPassword, {
                get ref() {
                    return el
                },
                set ref(v: HTMLInputElement | null) {
                    el = v
                }
            } as never)
            await settle(container)

            expect(el).toBe(parts(container).input)
        })
    })
})
