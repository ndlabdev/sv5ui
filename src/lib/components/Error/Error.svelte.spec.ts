import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import ErrorComponent from './Error.svelte'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

describe('Error', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as main by default', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 }
            })
            expect(container.firstElementChild!.tagName).toBe('MAIN')
        })

        it('should apply base root classes', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/flex/)
            await expect.element(root).toHaveClass(/flex-col/)
            await expect.element(root).toHaveClass(/items-center/)
            await expect.element(root).toHaveClass(/justify-center/)
        })

        it('should render without an error object', async () => {
            const { container } = render(ErrorComponent, {})
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })
    })

    // ==================== ERROR DATA ====================

    describe('error data', () => {
        it('should render statusCode', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 }
            })
            expect(container.textContent).toContain('404')
        })

        it('should render statusCode as string', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: '500' }
            })
            expect(container.textContent).toContain('500')
        })

        it('should render statusMessage as heading', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404, statusMessage: 'Page not found' }
            })
            const heading = container.querySelector('h1')
            expect(heading).not.toBeNull()
            expect(heading!.textContent).toBe('Page not found')
        })

        it('should render message', async () => {
            const { container } = render(ErrorComponent, {
                error: {
                    statusCode: 404,
                    statusMessage: 'Page not found',
                    message: 'The page you are looking for does not exist.'
                }
            })
            expect(container.textContent).toContain('The page you are looking for does not exist.')
        })

        it('should hide message when identical to statusMessage', async () => {
            const { container } = render(ErrorComponent, {
                error: {
                    statusCode: 404,
                    statusMessage: 'Page not found',
                    message: 'Page not found'
                }
            })
            const occurrences = container.textContent!.split('Page not found').length - 1
            expect(occurrences).toBe(1)
        })

        it('should not render statusCode element when missing', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusMessage: 'Something went wrong' }
            })
            const paragraphs = container.querySelectorAll('p')
            expect(paragraphs.length).toBe(0)
        })

        it('should not render heading when statusMessage is missing', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 }
            })
            expect(container.querySelector('h1')).toBeNull()
        })
    })

    // ==================== ICON ====================

    describe('icon', () => {
        it('should render with icon prop', async () => {
            const { container } = render(ErrorComponent, {
                icon: 'lucide:triangle-alert',
                error: { statusCode: 404 }
            })
            const iconEl = container.querySelector('svg, [class*="iconify"], span[class*="icon"]')
            expect(container.firstElementChild!.children.length).toBeGreaterThan(1)
            expect(iconEl ?? container.firstElementChild!.firstElementChild).not.toBeNull()
        })

        it('should not render leading area when icon is not provided', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                ui: { leading: 'leading-probe' }
            })
            expect(container.querySelector('.leading-probe')).toBeNull()
        })
    })

    // ==================== CLEAR BUTTON ====================

    describe('clear button', () => {
        it('should render clear button as link by default', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 }
            })
            const link = container.querySelector('a')
            expect(link).not.toBeNull()
            expect(link!.getAttribute('href')).toBe('/')
            expect(link!.textContent).toContain('Back to home')
        })

        it('should use redirect prop as link target', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                redirect: '/dashboard'
            })
            const link = container.querySelector('a')
            expect(link!.getAttribute('href')).toBe('/dashboard')
        })

        it('should hide clear button when clear is false', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                clear: false
            })
            expect(container.querySelector('a')).toBeNull()
            expect(container.querySelector('button')).toBeNull()
        })

        it('should customize clear button with ButtonProps', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                clear: { label: 'Go back', variant: 'outline' }
            })
            expect(container.textContent).toContain('Go back')
            expect(container.textContent).not.toContain('Back to home')
        })

        it('should render as button and fire onClear when provided', async () => {
            const onClear = vi.fn()
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                onClear
            })
            const button = container.querySelector('button')
            expect(button).not.toBeNull()
            expect(container.querySelector('a')).toBeNull()
            button!.click()
            expect(onClear).toHaveBeenCalledTimes(1)
        })

        it('should allow href override alongside onClear via clear props', async () => {
            const onClear = vi.fn()
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                onClear,
                clear: { href: '/home' }
            })
            const link = container.querySelector('a')
            expect(link).not.toBeNull()
            expect(link!.getAttribute('href')).toBe('/home')
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as div element', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                as: 'div'
            })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should render as section element', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                as: 'section'
            })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                class: 'my-custom-error'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-custom-error/)
        })

        it('should merge min-height override via class', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                class: 'min-h-0'
            })
            const root = container.firstElementChild!
            expect(root.className).toContain('min-h-0')
            expect(root.className).not.toContain('100svh')
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                ui: { root: 'custom-root' }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should apply ui.statusCode class', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                ui: { statusCode: 'custom-code' }
            })
            const code = container.querySelector('.custom-code')
            expect(code).not.toBeNull()
            expect(code!.textContent).toBe('404')
        })

        it('should apply ui.statusMessage class', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404, statusMessage: 'Not found' },
                ui: { statusMessage: 'custom-status-message' }
            })
            const heading = container.querySelector('.custom-status-message')
            expect(heading).not.toBeNull()
            expect(heading!.textContent).toBe('Not found')
        })

        it('should apply ui.message class', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404, message: 'Details here' },
                ui: { message: 'custom-message' }
            })
            const message = container.querySelector('.custom-message')
            expect(message).not.toBeNull()
            expect(message!.textContent).toBe('Details here')
        })

        it('should apply ui.links class', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                ui: { links: 'custom-links' }
            })
            expect(container.querySelector('.custom-links')).not.toBeNull()
        })
    })

    // ==================== SNIPPETS ====================

    describe('snippets', () => {
        it('should render leading snippet instead of icon', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                icon: 'lucide:triangle-alert',
                leading: snippet('<span data-testid="custom-leading">Logo</span>')
            })
            expect(container.querySelector('[data-testid="custom-leading"]')).not.toBeNull()
        })

        it('should render statusCode snippet instead of default', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                statusCode: snippet('<span data-testid="custom-code">Oops 404</span>')
            })
            expect(container.querySelector('[data-testid="custom-code"]')).not.toBeNull()
            expect(container.textContent).toContain('Oops 404')
        })

        it('should render statusMessage snippet instead of default heading', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404, statusMessage: 'Not found' },
                statusMessage: snippet('<h2 data-testid="custom-heading">Custom</h2>')
            })
            expect(container.querySelector('h1')).toBeNull()
            expect(container.querySelector('[data-testid="custom-heading"]')).not.toBeNull()
        })

        it('should render message snippet instead of default', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404, message: 'Default message' },
                message: snippet('<span data-testid="custom-msg">Custom message</span>')
            })
            expect(container.querySelector('[data-testid="custom-msg"]')).not.toBeNull()
            expect(container.textContent).not.toContain('Default message')
        })

        it('should render links snippet instead of clear button', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                links: snippet('<span data-testid="custom-links">Links</span>')
            })
            expect(container.querySelector('[data-testid="custom-links"]')).not.toBeNull()
            expect(container.textContent).not.toContain('Back to home')
        })

        it('should render children content', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                children: snippet('<span data-testid="extra">Extra content</span>')
            })
            expect(container.querySelector('[data-testid="extra"]')).not.toBeNull()
        })
    })

    // ==================== NATIVE ATTRIBUTES ====================

    describe('native attributes', () => {
        it('should pass through native attributes', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 404 },
                id: 'error-page',
                'data-testid': 'error-root'
            })
            const root = container.firstElementChild!
            expect(root.getAttribute('id')).toBe('error-page')
            expect(root.getAttribute('data-testid')).toBe('error-root')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render a complete 404 page', async () => {
            const { container } = render(ErrorComponent, {
                icon: 'lucide:triangle-alert',
                error: {
                    statusCode: 404,
                    statusMessage: 'Page not found',
                    message: 'Sorry, the page you are looking for could not be found.'
                },
                redirect: '/home',
                clear: { label: 'Take me home' }
            })

            expect(container.textContent).toContain('404')
            expect(container.textContent).toContain('Page not found')
            expect(container.textContent).toContain(
                'Sorry, the page you are looking for could not be found.'
            )

            const link = container.querySelector('a')
            expect(link!.getAttribute('href')).toBe('/home')
            expect(link!.textContent).toContain('Take me home')
        })

        it('should render a 500 page without clear button', async () => {
            const { container } = render(ErrorComponent, {
                error: { statusCode: 500, statusMessage: 'Server error' },
                clear: false
            })

            expect(container.textContent).toContain('500')
            expect(container.textContent).toContain('Server error')
            expect(container.querySelector('a')).toBeNull()
        })
    })
})
