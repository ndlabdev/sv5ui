import { tv, type VariantProps } from 'tailwind-variants'

export const editorVariants = tv({
    slots: {
        root: [
            'relative w-full rounded-lg border border-outline-variant bg-surface',
            'transition-shadow',
            'focus-within:ring-2 focus-within:ring-offset-0',
            'data-[disabled=true]:opacity-60 data-[disabled=true]:pointer-events-none'
        ],
        toolbar: [
            'flex flex-wrap items-center gap-0.5',
            'border-b border-outline-variant',
            'bg-surface-container-low',
            'rounded-t-lg p-1.5'
        ],
        toolbarButton: [
            'inline-flex items-center justify-center rounded text-on-surface-variant',
            'hover:bg-surface-container-high hover:text-on-surface',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'data-[active=true]:bg-primary-container data-[active=true]:text-on-primary-container',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
            'transition-colors'
        ],
        toolbarSeparator: 'mx-1 h-5 w-px shrink-0 bg-outline-variant',
        content: [
            'text-on-surface',
            '[&_.ProseMirror]:outline-none',
            '[&_.ProseMirror]:focus:outline-none',
            '[&_.ProseMirror]:focus-visible:outline-none',
            '[&_.ProseMirror]:p-4',
            '[&_.ProseMirror]:min-h-32',
            '[&_.ProseMirror]:whitespace-pre-wrap',
            '[&_.ProseMirror]:break-words',
            '[&_.is-editor-empty]:before:content-[attr(data-placeholder)]',
            '[&_.is-editor-empty]:before:text-on-surface-variant/60',
            '[&_.is-editor-empty]:before:pointer-events-none',
            '[&_.is-editor-empty]:before:float-left',
            '[&_.is-editor-empty]:before:h-0',
            '[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
            '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3',
            '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3',
            '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2',
            '[&_ul]:list-disc [&_ul]:ps-6 [&_ul]:my-2',
            '[&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:my-2',
            '[&_li>p]:my-0',
            '[&_blockquote]:border-l-4 [&_blockquote]:border-outline-variant [&_blockquote]:ps-3 [&_blockquote]:italic [&_blockquote]:text-on-surface-variant [&_blockquote]:my-3',
            '[&_code]:rounded [&_code]:bg-surface-container-highest [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono',
            '[&_pre]:rounded-md [&_pre]:bg-surface-container-highest [&_pre]:p-3 [&_pre]:my-3 [&_pre]:overflow-x-auto',
            '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
            '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
            '[&_a:hover]:text-primary/80',
            '[&_hr]:border-outline-variant [&_hr]:my-4',
            '[&_strong]:font-semibold',
            '[&_em]:italic',
            '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-2',
            '[&_iframe[src*="youtube"]]:aspect-video [&_iframe[src*="youtube"]]:w-full [&_iframe[src*="youtube"]]:rounded-md [&_iframe[src*="youtube"]]:my-3 [&_iframe[src*="youtube"]]:border-0',
            '[&_.sv5ui-editor-mention]:inline-flex [&_.sv5ui-editor-mention]:items-center',
            '[&_.sv5ui-editor-mention]:rounded [&_.sv5ui-editor-mention]:bg-primary-container/60',
            '[&_.sv5ui-editor-mention]:text-on-primary-container',
            '[&_.sv5ui-editor-mention]:px-1.5 [&_.sv5ui-editor-mention]:py-0.5',
            '[&_.sv5ui-editor-mention]:text-sm [&_.sv5ui-editor-mention]:font-medium',
            '[&_.tableWrapper]:my-3 [&_.tableWrapper]:overflow-x-auto',
            '[&_table]:w-full [&_table]:border-collapse [&_table]:table-fixed',
            '[&_table]:border [&_table]:border-outline-variant [&_table]:rounded-md',
            '[&_th]:border [&_th]:border-outline-variant',
            '[&_th]:bg-surface-container-low [&_th]:px-2 [&_th]:py-1.5',
            '[&_th]:font-semibold [&_th]:text-start [&_th]:align-top',
            '[&_th]:relative [&_th]:min-w-16',
            '[&_td]:border [&_td]:border-outline-variant',
            '[&_td]:px-2 [&_td]:py-1.5 [&_td]:align-top',
            '[&_td]:relative [&_td]:min-w-16',
            '[&_.selectedCell]:bg-primary/10',
            '[&_.column-resize-handle]:absolute [&_.column-resize-handle]:top-0 [&_.column-resize-handle]:bottom-[-2px]',
            '[&_.column-resize-handle]:-right-0.5 [&_.column-resize-handle]:w-1',
            '[&_.column-resize-handle]:bg-primary/40 [&_.column-resize-handle]:pointer-events-none',
            '[&_::selection]:bg-primary/20'
        ],
        footer: [
            'flex items-center justify-between gap-2',
            'border-t border-outline-variant',
            'bg-surface-container-low',
            'px-3 py-1.5 rounded-b-lg',
            'text-xs text-on-surface-variant'
        ],
        countLabel: 'tabular-nums',
        bubbleMenu: [
            'absolute top-0 left-0 z-50 invisible',
            'flex items-center gap-0.5 p-1',
            'rounded-lg border border-outline-variant bg-surface',
            'shadow-md'
        ]
    },
    variants: {
        size: {
            sm: {
                toolbarButton: 'size-7 *:size-3.5',
                content: 'text-sm [&_.ProseMirror]:p-3 [&_.ProseMirror]:min-h-24',
                footer: 'text-[11px]'
            },
            md: {
                toolbarButton: 'size-8 *:size-4',
                content: 'text-sm',
                footer: ''
            },
            lg: {
                toolbarButton: 'size-9 *:size-5',
                content: 'text-base [&_.ProseMirror]:p-5 [&_.ProseMirror]:min-h-40',
                footer: ''
            }
        },
        color: {
            primary: { root: 'focus-within:ring-primary' },
            secondary: { root: 'focus-within:ring-secondary' },
            tertiary: { root: 'focus-within:ring-tertiary' },
            success: { root: 'focus-within:ring-success' },
            warning: { root: 'focus-within:ring-warning' },
            error: { root: 'focus-within:ring-error' },
            info: { root: 'focus-within:ring-info' },
            surface: { root: 'focus-within:ring-outline' }
        },
        sticky: {
            true: { toolbar: 'sticky top-0 z-10 backdrop-blur-sm' },
            false: ''
        }
    },
    defaultVariants: {
        size: 'md',
        color: 'primary',
        sticky: false
    }
})

export type EditorVariantProps = VariantProps<typeof editorVariants>
export type EditorSlots = keyof ReturnType<typeof editorVariants>

export const editorDefaults = {
    defaultVariants: editorVariants.defaultVariants,
    slots: {} as Partial<Record<EditorSlots, string>>
}
