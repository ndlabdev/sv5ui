import type { Editor } from '@tiptap/core'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom'
import type { MentionItem } from './editor.types.js'

interface BuildMentionSuggestionOptions {
    onQuery: (query: string) => Promise<MentionItem[]>
}

interface SuggestionRef {
    items: MentionItem[]
    selectedIndex: number
    popupEl: HTMLElement | null
    listEl: HTMLElement | null
    cleanup: (() => void) | null
    pickItem: (index: number) => void
}

function createPopup(): HTMLElement {
    const popup = document.createElement('div')
    popup.setAttribute('data-editor-mention-popup', '')
    popup.className = [
        'absolute z-50 min-w-44 max-w-72 overflow-hidden',
        'rounded-lg border border-outline-variant bg-surface shadow-lg',
        'py-1 max-h-64 overflow-y-auto'
    ].join(' ')
    return popup
}

function renderItems(state: SuggestionRef): void {
    if (!state.listEl) return
    state.listEl.innerHTML = ''
    if (state.items.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'px-3 py-2 text-sm text-on-surface-variant'
        empty.textContent = 'No matches'
        state.listEl.appendChild(empty)
        return
    }
    state.items.forEach((item, i) => {
        const row = document.createElement('button')
        row.type = 'button'
        row.setAttribute('data-mention-item', '')
        row.setAttribute('data-index', String(i))
        row.className = [
            'flex w-full items-center gap-2 px-3 py-1.5 text-sm text-start',
            'hover:bg-surface-container-high',
            i === state.selectedIndex
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface'
        ].join(' ')

        if (item.avatar) {
            const img = document.createElement('img')
            img.src = item.avatar
            img.alt = ''
            img.className = 'size-5 rounded-full shrink-0 object-cover'
            row.appendChild(img)
        }

        const label = document.createElement('span')
        label.className = 'truncate'
        label.textContent = item.label
        row.appendChild(label)

        row.addEventListener('mousedown', (e) => {
            e.preventDefault()
            state.pickItem(i)
        })
        state.listEl?.appendChild(row)
    })
}

export function buildMentionSuggestion(
    options: BuildMentionSuggestionOptions
): Omit<SuggestionOptions, 'editor'> {
    return {
        items: async ({ query }: { query: string; editor: Editor }) => {
            try {
                return await options.onQuery(query)
            } catch {
                return []
            }
        },
        render: () => {
            let state: SuggestionRef | null = null

            return {
                onStart: (props: SuggestionProps) => {
                    if (typeof document === 'undefined') return

                    const popupEl = createPopup()
                    const listEl = document.createElement('div')
                    listEl.setAttribute('role', 'listbox')
                    popupEl.appendChild(listEl)
                    document.body.appendChild(popupEl)

                    state = {
                        items: props.items as MentionItem[],
                        selectedIndex: 0,
                        popupEl,
                        listEl,
                        cleanup: null,
                        pickItem: (i: number) => {
                            const it = state?.items[i]
                            if (!it) return
                            props.command({ id: it.id, label: it.label })
                        }
                    }

                    renderItems(state)

                    const rect = props.clientRect?.()
                    if (rect) {
                        const virtualEl = {
                            getBoundingClientRect: () => rect as DOMRect
                        }
                        state.cleanup = autoUpdate(virtualEl, popupEl, () => {
                            void computePosition(virtualEl, popupEl, {
                                placement: 'bottom-start',
                                middleware: [offset(6), flip(), shift({ padding: 8 })]
                            }).then(({ x, y }: { x: number; y: number }) => {
                                popupEl.style.left = `${x}px`
                                popupEl.style.top = `${y}px`
                            })
                        })
                    }
                },

                onUpdate: (props: SuggestionProps) => {
                    if (!state) return
                    state.items = props.items as MentionItem[]
                    state.selectedIndex = 0
                    renderItems(state)
                },

                onKeyDown: (props: { event: KeyboardEvent }) => {
                    if (!state) return false
                    const { event } = props
                    if (event.key === 'ArrowDown') {
                        state.selectedIndex =
                            (state.selectedIndex + 1) % Math.max(state.items.length, 1)
                        renderItems(state)
                        return true
                    }
                    if (event.key === 'ArrowUp') {
                        state.selectedIndex =
                            (state.selectedIndex + state.items.length - 1) %
                            Math.max(state.items.length, 1)
                        renderItems(state)
                        return true
                    }
                    if (event.key === 'Enter') {
                        state.pickItem(state.selectedIndex)
                        return true
                    }
                    if (event.key === 'Escape') {
                        return true
                    }
                    return false
                },

                onExit: () => {
                    state?.cleanup?.()
                    state?.popupEl?.remove()
                    state = null
                }
            }
        }
    }
}
