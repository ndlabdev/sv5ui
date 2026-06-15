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

        it('applies an external value change after the editor has emitted (echo-dedup stays correct)', async () => {
            let api: EditorApi | undefined
            const screen = render(Editor, {
                value: '<p>start</p>',
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            api!.insert(' edited')
            await vi.waitFor(() => {
                expect(getProseMirror(screen.container)?.textContent).toContain('edited')
            })
            await screen.rerender({ value: '<p>external</p>' })
            await vi.waitFor(() => {
                expect(getProseMirror(screen.container)?.textContent).toContain('external')
            })
        })

        it('treats output as fixed at mount (changing the prop later has no effect)', async () => {
            let api: EditorApi | undefined
            const screen = render(Editor, {
                output: 'html',
                value: '<p>hi</p>',
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            expect(typeof api!.getValue()).toBe('string')
            await screen.rerender({ output: 'json', value: '<p>hi</p>' })
            expect(typeof api!.getValue()).toBe('string')
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

        const selectFile = (container: Element) => {
            const input = container.querySelector('[data-editor-image-input]') as HTMLInputElement
            const dt = new DataTransfer()
            dt.items.add(new File(['x'], 'x.png', { type: 'image/png' }))
            input.files = dt.files
            input.dispatchEvent(new Event('change', { bubbles: true }))
        }

        it('blocks an unsafe image src returned by onImageUpload', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
            const { container } = render(Editor, {
                image: true,
                onImageUpload: async () => 'javascript:alert(1)'
            })
            await vi.waitFor(() => expect(container.querySelector('.ProseMirror')).not.toBeNull())
            selectFile(container)
            await vi.waitFor(() => expect(warn).toHaveBeenCalled())
            expect(container.querySelector('img')).toBeNull()
            warn.mockRestore()
        })

        it('inserts an image for a safe https src from onImageUpload', async () => {
            const { container } = render(Editor, {
                image: true,
                onImageUpload: async () => 'https://example.com/a.png'
            })
            await vi.waitFor(() => expect(container.querySelector('.ProseMirror')).not.toBeNull())
            selectFile(container)
            await vi.waitFor(() => {
                expect(container.querySelector('img')).not.toBeNull()
            })
        })

        it('calls onImageUploadError when the upload rejects', async () => {
            const onImageUploadError = vi.fn()
            const { container } = render(Editor, {
                image: true,
                onImageUpload: async () => {
                    throw new Error('upload failed')
                },
                onImageUploadError
            })
            await vi.waitFor(() => expect(container.querySelector('.ProseMirror')).not.toBeNull())
            selectFile(container)
            await vi.waitFor(() => expect(onImageUploadError).toHaveBeenCalled())
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
                expect(container.querySelector('.ProseMirror')).not.toBeNull()
                const btn = container.querySelector(
                    'button[data-action="table"]'
                ) as HTMLButtonElement | null
                expect(btn).not.toBeNull()
                expect(btn!.disabled).toBe(false)
            })
            const btn = container.querySelector('button[data-action="table"]') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => {
                expect(container.querySelector('[data-editor-table-picker]')).not.toBeNull()
            })
        })

        it('clicking a dimension cell button inserts a table (UI flow)', async () => {
            const { container } = render(Editor, { tables: true, toolbar: ['table'] })
            await vi.waitFor(() => {
                expect(container.querySelector('.ProseMirror')).not.toBeNull()
                const btn = container.querySelector(
                    'button[data-action="table"]'
                ) as HTMLButtonElement | null
                expect(btn).not.toBeNull()
                expect(btn!.disabled).toBe(false)
            })
            const tableBtn = container.querySelector(
                'button[data-action="table"]'
            ) as HTMLButtonElement
            await tableBtn.click()
            await vi.waitFor(() => {
                expect(container.querySelector('[data-editor-table-picker]')).not.toBeNull()
            })
            const cell = container.querySelector(
                '[data-editor-table-picker] button[aria-label="Insert 2×2 table"]'
            ) as HTMLButtonElement
            expect(cell).not.toBeNull()
            cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
            await vi.waitFor(
                () => {
                    expect(container.querySelector('table')).not.toBeNull()
                },
                { timeout: 1500 }
            )
        })

        it('insertTable command actually inserts a table when tables={true}', async () => {
            let api: EditorApi | undefined
            const props = {
                tables: true,
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            }
            const { container } = render(Editor, props)
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const result = api!
                .editor!.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            expect(result).toBe(true)
            await vi.waitFor(() => {
                expect(container.querySelector('table')).not.toBeNull()
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

    // ==================== PHASE 3: SLASH COMMANDS ====================

    describe('slash commands (Phase 3)', () => {
        it('adds slash extension when slash={true}', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                slash: true,
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const hasExt = api!.editor!.extensionManager.extensions.some(
                (e) => e.name === 'slashCommands'
            )
            expect(hasExt).toBe(true)
        })

        it('omits slash extension when slash={false}', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const hasExt = api!.editor!.extensionManager.extensions.some(
                (e) => e.name === 'slashCommands'
            )
            expect(hasExt).toBe(false)
        })

        it('accepts custom slashCommands array (no slash flag needed)', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                slashCommands: [
                    {
                        id: 'custom',
                        label: 'Custom',
                        run: () => {}
                    }
                ],
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const hasExt = api!.editor!.extensionManager.extensions.some(
                (e) => e.name === 'slashCommands'
            )
            expect(hasExt).toBe(true)
        })
    })

    // ==================== PHASE 3: YOUTUBE ====================

    describe('youtube embed (Phase 3)', () => {
        it('youtube toolbar action renders when configured', async () => {
            const { container } = render(Editor, { youtube: true, toolbar: ['youtube'] })
            await vi.waitFor(() => {
                expect(container.querySelector('button[data-action="youtube"]')).not.toBeNull()
            })
        })

        it('adds youtube extension when youtube={true}', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                youtube: true,
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const hasExt = api!.editor!.extensionManager.extensions.some(
                (e) => e.name === 'youtube'
            )
            expect(hasExt).toBe(true)
        })
    })

    // ==================== PHASE 3: DRAG HANDLE ====================

    describe('drag handle (Phase 3)', () => {
        it('adds dragHandle extension when dragHandle={true}', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                dragHandle: true,
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const hasExt = api!.editor!.extensionManager.extensions.some(
                (e) => e.name === 'dragHandle'
            )
            expect(hasExt).toBe(true)
        })

        it('omits dragHandle extension by default', async () => {
            let api: EditorApi | undefined
            render(Editor, {
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())
            const hasExt = api!.editor!.extensionManager.extensions.some(
                (e) => e.name === 'dragHandle'
            )
            expect(hasExt).toBe(false)
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

    // ==================== LAZY EXTENSION LOADING ====================

    describe('lazy extension loading', () => {
        it('mounts synchronously when no lazy feature (markdown/tables) is enabled', () => {
            const { container } = render(Editor, { toolbar: ['bold'] })
            expect(container.querySelector('.ProseMirror')).not.toBeNull()
        })

        it('mounts asynchronously when tables are enabled (lazy chunk)', async () => {
            const { container } = render(Editor, { tables: true })
            expect(container.querySelector('.ProseMirror')).toBeNull()
            await vi.waitFor(() => {
                expect(container.querySelector('.ProseMirror')).not.toBeNull()
            })
        })

        it('mounts asynchronously for markdown output (lazy chunk)', async () => {
            const { container } = render(Editor, { output: 'markdown' })
            expect(container.querySelector('.ProseMirror')).toBeNull()
            await vi.waitFor(() => {
                expect(container.querySelector('.ProseMirror')).not.toBeNull()
            })
        })
    })

    // ==================== POPUP ACCESSIBILITY ====================

    describe('popup accessibility', () => {
        it('slash popup exposes role=option, aria-selected, and editor aria-activedescendant', async () => {
            let api: EditorApi | undefined
            const { container } = render(Editor, {
                slash: true,
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())

            api!.editor!.chain().focus().insertContent('/').run()

            const popup = await vi.waitFor(() => {
                const el = document.querySelector('[data-editor-slash-popup]')
                expect(el).not.toBeNull()
                return el as HTMLElement
            })

            const options = popup.querySelectorAll('[role="option"]')
            expect(options.length).toBeGreaterThan(0)

            const selected = popup.querySelectorAll('[role="option"][aria-selected="true"]')
            expect(selected.length).toBe(1)

            expect(popup.getAttribute('aria-label')).toBe('Slash commands')
            expect(popup.id).not.toBe('')

            const pm = getProseMirror(container)!
            expect(pm.getAttribute('aria-controls')).toBe(popup.id)
            expect(pm.getAttribute('aria-expanded')).toBe('true')

            const activeId = pm.getAttribute('aria-activedescendant')
            expect(activeId).toBeTruthy()
            expect(popup.querySelector(`#${activeId}`)).not.toBeNull()
            expect(popup.querySelector(`#${activeId}`)?.getAttribute('aria-selected')).toBe('true')
        })

        it('mention popup exposes role=option, aria-selected, and editor aria-activedescendant', async () => {
            let api: EditorApi | undefined
            const { container } = render(Editor, {
                onMention: async () => [
                    { id: 'alice', label: 'Alice' },
                    { id: 'bob', label: 'Bob' }
                ],
                get api() {
                    return api
                },
                set api(v: EditorApi | undefined) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api?.editor).not.toBeNull())

            api!.editor!.chain().focus().insertContent('@').run()

            const popup = await vi.waitFor(() => {
                const el = document.querySelector('[data-editor-mention-popup]')
                expect(el).not.toBeNull()
                const list = (el as HTMLElement).querySelector('[role="listbox"]')
                expect(list?.querySelectorAll('[role="option"]').length).toBeGreaterThan(0)
                return el as HTMLElement
            })

            const listbox = popup.querySelector('[role="listbox"]') as HTMLElement
            expect(listbox.getAttribute('aria-label')).toBe('Mentions')
            expect(listbox.id).not.toBe('')

            const options = listbox.querySelectorAll('[role="option"]')
            expect(options.length).toBe(2)

            const selected = listbox.querySelectorAll('[role="option"][aria-selected="true"]')
            expect(selected.length).toBe(1)

            const pm = getProseMirror(container)!
            expect(pm.getAttribute('aria-controls')).toBe(listbox.id)
            expect(pm.getAttribute('aria-expanded')).toBe('true')

            const activeId = pm.getAttribute('aria-activedescendant')
            expect(activeId).toBeTruthy()
            expect(listbox.querySelector(`#${activeId}`)).not.toBeNull()
            expect(listbox.querySelector(`#${activeId}`)?.getAttribute('aria-selected')).toBe(
                'true'
            )
        })
    })
})
