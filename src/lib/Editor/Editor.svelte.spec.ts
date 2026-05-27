import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Editor from './Editor.svelte'
import type { EditorApi } from './editor.types.js'

describe('Editor', () => {
    const getRoot = (container: Element) => container.firstElementChild as HTMLElement
    const getToolbar = (container: Element) =>
        container.querySelector('[role="toolbar"]') as HTMLElement | null
    const getToolbarButtons = (container: Element) =>
        container.querySelectorAll(
            '[role="toolbar"] button[data-action]'
        ) as NodeListOf<HTMLButtonElement>
    const getContent = (container: Element) =>
        container.querySelector('[data-editor-content]') as HTMLElement | null
    const getProseMirror = (container: Element) =>
        container.querySelector('.ProseMirror') as HTMLElement | null
    const getFooter = (container: Element) =>
        container.querySelector('[data-editor-footer]') as HTMLElement | null
    const getBubble = (container: Element) =>
        container.querySelector('[data-editor-bubble]') as HTMLElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('renders root element', () => {
            const { container } = render(Editor, {})
            expect(getRoot(container)).not.toBeNull()
        })

        it('renders the content area immediately (SSR-safe placeholder)', () => {
            const { container } = render(Editor, {})
            expect(getContent(container)).not.toBeNull()
        })

        it('mounts Tiptap into the content area client-side', async () => {
            const { container } = render(Editor, {})
            await vi.waitFor(() => {
                expect(getProseMirror(container)).not.toBeNull()
            })
        })

        it('renders default toolbar', async () => {
            const { container } = render(Editor, {})
            await vi.waitFor(() => {
                expect(getToolbar(container)).not.toBeNull()
                expect(getToolbarButtons(container).length).toBeGreaterThan(5)
            })
        })

        it('renders custom toolbar config', async () => {
            const { container } = render(Editor, {
                toolbar: ['bold', 'italic']
            })
            await vi.waitFor(() => {
                const buttons = getToolbarButtons(container)
                expect(buttons.length).toBe(2)
                expect(buttons[0].getAttribute('data-action')).toBe('bold')
                expect(buttons[1].getAttribute('data-action')).toBe('italic')
            })
        })

        it('hides toolbar when toolbar={false}', async () => {
            const { container } = render(Editor, { toolbar: false })
            await vi.waitFor(() => {
                expect(getProseMirror(container)).not.toBeNull()
            })
            expect(getToolbar(container)).toBeNull()
        })

        it('renders separator markers in toolbar', async () => {
            const { container } = render(Editor, {
                toolbar: ['bold', '|', 'italic']
            })
            await vi.waitFor(() => {
                const sep = container.querySelector('[role="toolbar"] [aria-hidden="true"]')
                expect(sep).not.toBeNull()
            })
        })
    })

    // ==================== CONTENT I/O ====================

    describe('content I/O', () => {
        it('renders initial value as HTML', async () => {
            const { container } = render(Editor, { value: '<p>Hello World</p>' })
            await vi.waitFor(() => {
                expect(getProseMirror(container)?.textContent).toContain('Hello World')
            })
        })

        it('renders placeholder via data attribute', async () => {
            const { container } = render(Editor, { placeholder: 'Write here...' })
            await vi.waitFor(() => {
                const pm = getProseMirror(container)
                const p = pm?.querySelector('[data-placeholder]')
                expect(p).not.toBeNull()
                expect(p?.getAttribute('data-placeholder')).toBe('Write here...')
            })
        })

        it('accepts initial JSON content', async () => {
            const { container } = render(Editor, {
                output: 'json',
                value: {
                    type: 'doc',
                    content: [
                        {
                            type: 'paragraph',
                            content: [{ type: 'text', text: 'From JSON' }]
                        }
                    ]
                }
            })
            await vi.waitFor(() => {
                expect(getProseMirror(container)?.textContent).toContain('From JSON')
            })
        })
    })

    // ==================== EDITABILITY ====================

    describe('editability', () => {
        it('marks content as readonly via aria when readonly={true}', async () => {
            const { container } = render(Editor, { readonly: true })
            await vi.waitFor(() => {
                expect(getContent(container)?.getAttribute('aria-readonly')).toBe('true')
            })
        })

        it('marks content as disabled via aria when disabled={true}', async () => {
            const { container } = render(Editor, { disabled: true })
            await vi.waitFor(() => {
                expect(getContent(container)?.getAttribute('aria-disabled')).toBe('true')
            })
            expect(getRoot(container).getAttribute('data-disabled')).toBe('true')
        })

        it('ProseMirror contenteditable is false when readonly', async () => {
            const { container } = render(Editor, { readonly: true })
            await vi.waitFor(() => {
                const pm = getProseMirror(container)
                expect(pm?.getAttribute('contenteditable')).toBe('false')
            })
        })

        it('ProseMirror contenteditable is true by default', async () => {
            const { container } = render(Editor, {})
            await vi.waitFor(() => {
                const pm = getProseMirror(container)
                expect(pm?.getAttribute('contenteditable')).toBe('true')
            })
        })
    })

    // ==================== TOOLBAR ====================

    describe('toolbar interactions', () => {
        it('toolbar buttons have aria-label', async () => {
            const { container } = render(Editor, { toolbar: ['bold'] })
            await vi.waitFor(() => {
                const btn = getToolbarButtons(container)[0]
                expect(btn?.getAttribute('aria-label')).toBe('Bold')
            })
        })

        it('toolbar has role="toolbar"', async () => {
            const { container } = render(Editor, {})
            await vi.waitFor(() => {
                expect(getToolbar(container)?.getAttribute('role')).toBe('toolbar')
            })
        })

        it('clicking bold makes selection bold (then state reflects)', async () => {
            let api: EditorApi | undefined
            const props = {
                value: '<p>hello</p>',
                toolbar: ['bold'] as ('bold' | '|')[],
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            }
            const { container } = render(Editor, props)
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            api?.editor?.commands.selectAll()
            const btn = getToolbarButtons(container)[0]
            await btn.click()
            await vi.waitFor(() => {
                expect(api?.state.active.bold).toBe(true)
                expect(btn.getAttribute('data-active')).toBe('true')
            })
        })

        it('undo button disabled when no history', async () => {
            const { container } = render(Editor, { toolbar: ['undo'] })
            await vi.waitFor(() => {
                const btn = getToolbarButtons(container)[0]
                expect(btn.hasAttribute('disabled')).toBe(true)
            })
        })
    })

    // ==================== FOOTER / COUNT ====================

    describe('character count footer', () => {
        it('renders footer when showCount={true}', async () => {
            const { container } = render(Editor, { showCount: true })
            await vi.waitFor(() => {
                expect(getFooter(container)).not.toBeNull()
            })
        })

        it('renders footer when maxLength is provided', async () => {
            const { container } = render(Editor, { maxLength: 100 })
            await vi.waitFor(() => {
                expect(getFooter(container)).not.toBeNull()
                expect(getFooter(container)?.textContent).toContain('/')
                expect(getFooter(container)?.textContent).toContain('100')
            })
        })

        it('omits footer by default', async () => {
            const { container } = render(Editor, {})
            await vi.waitFor(() => {
                expect(getContent(container)).not.toBeNull()
            })
            expect(getFooter(container)).toBeNull()
        })
    })

    // ==================== BUBBLE MENU ====================

    describe('bubble menu', () => {
        it('renders bubble menu element when bubbleMenu={true}', async () => {
            const { container } = render(Editor, { bubbleMenu: true })
            await vi.waitFor(() => {
                expect(getBubble(container)).not.toBeNull()
            })
        })

        it('omits bubble menu when bubbleMenu={false}', async () => {
            const { container } = render(Editor, {})
            await vi.waitFor(() => {
                expect(getContent(container)).not.toBeNull()
            })
            expect(getBubble(container)).toBeNull()
        })

        it('default bubble buttons include bold, italic, link', async () => {
            const { container } = render(Editor, { bubbleMenu: true })
            await vi.waitFor(() => {
                const buttons = getBubble(container)?.querySelectorAll('button[data-action]')
                expect(buttons?.length).toBe(3)
                const actions = Array.from(buttons ?? []).map((b) => b.getAttribute('data-action'))
                expect(actions).toEqual(['bold', 'italic', 'link'])
            })
        })
    })

    // ==================== IMPERATIVE API ====================

    describe('imperative API', () => {
        it('exposes api via bind:api', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => {
                expect(api).toBeDefined()
                expect(typeof api?.focus).toBe('function')
                expect(typeof api?.run).toBe('function')
                expect(typeof api?.clear).toBe('function')
            })
        })

        it('api.setValue updates content', async () => {
            let api: EditorApi | undefined
            const { container } = render(Editor, {
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            api?.setValue('<p>Programmatic content</p>')
            await vi.waitFor(() => {
                expect(getProseMirror(container)?.textContent).toContain('Programmatic content')
            })
        })

        it('api.clear empties the editor', async () => {
            let api: EditorApi | undefined
            const { container } = render(Editor, {
                value: '<p>Some text</p>',
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            api?.clear()
            await vi.waitFor(() => {
                expect(getProseMirror(container)?.textContent).not.toContain('Some text')
            })
        })

        it('api.getValue returns HTML by default', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                value: '<p>Hello</p>',
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const html = api?.getValue() as string
            expect(html).toContain('Hello')
        })

        it('api.getValue("json") returns Tiptap JSON', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                value: '<p>JSON test</p>',
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const json = api?.getValue('json')
            expect(json).toMatchObject({ type: 'doc' })
        })

        it('does NOT recreate the editor instance when value changes (typing regression)', async () => {
            let api: EditorApi | undefined
            const props = {
                value: '<p>start</p>',
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            }
            render(Editor, props)
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const ed = api!.editor!
            ed.commands.insertContent('a')
            ed.commands.insertContent('b')
            ed.commands.insertContent('c')
            await new Promise((r) => setTimeout(r, 50))
            expect(api!.editor).toBe(ed)
            expect(ed.isDestroyed).toBe(false)
        })

        it('api.run toggles a mark', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                value: '<p>test</p>',
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            api?.editor?.commands.selectAll()
            api?.run('italic')
            await vi.waitFor(() => {
                expect(api?.state.active.italic).toBe(true)
            })
        })
    })

    // ==================== VISUAL VARIANTS ====================

    describe('variants', () => {
        it('applies sm size', () => {
            const { container } = render(Editor, { size: 'sm' })
            expect(getContent(container)?.className).toContain('text-sm')
        })

        it('applies lg size', () => {
            const { container } = render(Editor, { size: 'lg' })
            expect(getContent(container)?.className).toContain('text-base')
        })

        it('applies color focus ring', () => {
            const { container } = render(Editor, { color: 'success' })
            expect(getRoot(container).className).toContain('focus-within:ring-success')
        })

        it('applies sticky toolbar', async () => {
            const { container } = render(Editor, { stickyToolbar: true })
            await vi.waitFor(() => {
                expect(getToolbar(container)?.className).toContain('sticky')
            })
        })
    })

    // ==================== PHASE 2: IMAGE ====================

    describe('image extension (Phase 2)', () => {
        it('renders hidden file input when image={true}', async () => {
            const { container } = render(Editor, { image: true })
            await vi.waitFor(() => {
                expect(container.querySelector('[data-editor-image-input]')).not.toBeNull()
            })
        })

        it('omits file input when image={false}', async () => {
            const { container } = render(Editor, {})
            await vi.waitFor(() => {
                expect(getContent(container)).not.toBeNull()
            })
            expect(container.querySelector('[data-editor-image-input]')).toBeNull()
        })

        it('image toolbar action renders when configured', async () => {
            const { container } = render(Editor, { image: true, toolbar: ['image'] })
            await vi.waitFor(() => {
                const btn = container.querySelector('button[data-action="image"]')
                expect(btn).not.toBeNull()
            })
        })
    })

    // ==================== PHASE 2: TABLES ====================

    describe('table extension (Phase 2)', () => {
        it('table toolbar action renders when configured', async () => {
            const { container } = render(Editor, { tables: true, toolbar: ['table'] })
            await vi.waitFor(() => {
                const btn = container.querySelector('button[data-action="table"]')
                expect(btn).not.toBeNull()
            })
        })

        it('clicking table button opens dimension picker', async () => {
            const { container } = render(Editor, { tables: true, toolbar: ['table'] })
            await vi.waitFor(() => {
                expect(container.querySelector('button[data-action="table"]')).not.toBeNull()
            })
            const btn = container.querySelector('button[data-action="table"]') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => {
                expect(container.querySelector('[data-editor-table-picker]')).not.toBeNull()
            })
        })
    })

    // ==================== PHASE 2: MARKDOWN ====================

    describe('markdown output (Phase 2)', () => {
        it('serializes content as markdown when output="markdown"', async () => {
            let api: EditorApi | undefined
            const props = {
                value: '# Hello',
                output: 'markdown' as const,
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            }
            render(Editor, props)
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const md = api!.getValue() as string
            expect(md).toContain('# Hello')
        })
    })

    // ==================== PHASE 2: FORM INTEGRATION ====================

    describe('form integration (Phase 2)', () => {
        it('accepts custom id and forwards to ProseMirror', async () => {
            const { container } = render(Editor, { id: 'my-editor' })
            await vi.waitFor(() => {
                const pm = getProseMirror(container)
                expect(pm?.id).toBe('my-editor')
            })
        })

        it('exposes data attributes for form state hooks', async () => {
            const { container } = render(Editor, { disabled: true })
            await vi.waitFor(() => {
                expect(getRoot(container).getAttribute('data-disabled')).toBe('true')
            })
        })
    })

    // ==================== UI OVERRIDES ====================

    describe('ui overrides', () => {
        it('applies root class prop', () => {
            const { container } = render(Editor, { class: 'custom-root-cls' })
            expect(getRoot(container).className).toContain('custom-root-cls')
        })

        it('applies ui slot overrides', async () => {
            const { container } = render(Editor, {
                ui: { content: 'custom-content-cls' }
            })
            await vi.waitFor(() => {
                expect(getContent(container)?.className).toContain('custom-content-cls')
            })
        })
    })
})
