import { tv, type VariantProps } from 'tailwind-variants'

export const fileUploadVariants = tv({
    slots: {
        root: 'relative flex flex-col',
        base: [
            'w-full bg-surface-container border border-outline-variant select-none',
            'flex flex-col items-stretch justify-center rounded-lg',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'transition-colors duration-200'
        ],
        wrapper: 'flex flex-col items-center justify-center text-center',
        icon: 'shrink-0 text-on-surface-variant',
        label: 'font-medium text-on-surface mt-2',
        description: 'text-on-surface-variant mt-1',
        actions: 'flex flex-wrap gap-1.5 shrink-0 mt-4',
        files: '',
        file: 'relative',
        fileLeading: 'shrink-0',
        fileWrapper: 'flex flex-col min-w-0',
        fileName: 'text-on-surface truncate',
        fileSize: 'text-on-surface-variant truncate',
        fileTrailing: '',
        previewContent: '',
        previewBody: ''
    },
    variants: {
        color: {
            primary: { base: 'focus-visible:outline-primary' },
            secondary: { base: 'focus-visible:outline-secondary' },
            tertiary: { base: 'focus-visible:outline-tertiary' },
            success: { base: 'focus-visible:outline-success' },
            warning: { base: 'focus-visible:outline-warning' },
            error: { base: 'focus-visible:outline-error' },
            info: { base: 'focus-visible:outline-info' },
            surface: { base: 'focus-visible:outline-outline' }
        },
        variant: {
            area: {
                base: 'p-4 min-h-[120px]',
                wrapper: 'py-6'
            },
            button: {}
        },
        size: {
            xs: {
                base: 'text-xs',
                icon: 'size-5',
                label: 'text-xs',
                description: 'text-xs',
                file: 'text-xs px-2 py-1 gap-1',
                fileWrapper: 'flex-row gap-1'
            },
            sm: {
                base: 'text-xs',
                icon: 'size-6',
                label: 'text-sm',
                description: 'text-xs',
                file: 'text-xs px-2.5 py-1.5 gap-1.5',
                fileWrapper: 'flex-row gap-1'
            },
            md: {
                base: 'text-sm',
                icon: 'size-8',
                label: 'text-sm',
                description: 'text-sm',
                file: 'text-xs px-2.5 py-1.5 gap-1.5'
            },
            lg: {
                base: 'text-sm',
                icon: 'size-10',
                label: 'text-base',
                description: 'text-sm',
                file: 'text-sm px-3 py-2 gap-2',
                fileSize: 'text-xs'
            },
            xl: {
                base: 'text-base',
                icon: 'size-12',
                label: 'text-base',
                description: 'text-base',
                file: 'text-sm px-3 py-2 gap-2'
            }
        },
        layout: {
            list: {
                root: 'gap-2 items-start',
                files: 'flex flex-col w-full gap-1.5',
                file: 'min-w-0 flex items-center bg-surface-container border border-outline-variant rounded-md w-full',
                fileTrailing: 'ms-auto'
            },
            grid: {
                root: 'gap-2',
                files: 'grid grid-cols-2 gap-3 w-full',
                file: 'relative aspect-square rounded-lg border border-outline-variant',
                fileWrapper: 'hidden',
                fileLeading: 'size-full',
                fileTrailing: ''
            }
        },
        dropzone: {
            true: {
                base: 'border-dashed data-[dragging=true]:bg-surface-container-high data-[dragging=true]:border-solid'
            }
        },
        interactive: {
            true: {
                base: 'cursor-pointer hover:bg-surface-container-high'
            }
        },
        highlight: {
            true: {}
        },
        multiple: {
            true: {}
        },
        disabled: {
            true: {
                base: 'cursor-not-allowed opacity-75 hover:bg-surface-container'
            }
        }
    },
    compoundVariants: [
        // Highlight: colored border
        { color: 'primary', highlight: true, class: { base: 'border-primary' } },
        { color: 'secondary', highlight: true, class: { base: 'border-secondary' } },
        { color: 'tertiary', highlight: true, class: { base: 'border-tertiary' } },
        { color: 'success', highlight: true, class: { base: 'border-success' } },
        { color: 'warning', highlight: true, class: { base: 'border-warning' } },
        { color: 'error', highlight: true, class: { base: 'border-error' } },
        { color: 'info', highlight: true, class: { base: 'border-info' } },
        { color: 'surface', highlight: true, class: { base: 'border-outline' } },
        // Dragging: colored border per color
        { color: 'primary', dropzone: true, class: { base: 'data-[dragging=true]:border-primary' } },
        { color: 'secondary', dropzone: true, class: { base: 'data-[dragging=true]:border-secondary' } },
        { color: 'tertiary', dropzone: true, class: { base: 'data-[dragging=true]:border-tertiary' } },
        { color: 'success', dropzone: true, class: { base: 'data-[dragging=true]:border-success' } },
        { color: 'warning', dropzone: true, class: { base: 'data-[dragging=true]:border-warning' } },
        { color: 'error', dropzone: true, class: { base: 'data-[dragging=true]:border-error' } },
        { color: 'info', dropzone: true, class: { base: 'data-[dragging=true]:border-info' } },
        // Button variant size padding
        { variant: 'button', size: 'xs', class: { base: 'p-1' } },
        { variant: 'button', size: 'sm', class: { base: 'p-1.5' } },
        { variant: 'button', size: 'md', class: { base: 'p-1.5' } },
        { variant: 'button', size: 'lg', class: { base: 'p-2' } },
        { variant: 'button', size: 'xl', class: { base: 'p-2' } },
        // Grid + multiple: 3 cols on larger screens, remove button outside top-right corner
        {
            layout: 'grid',
            multiple: true,
            class: { files: 'sm:grid-cols-3', fileTrailing: 'absolute -top-1.5 -end-1.5' }
        },
        // Grid + single: file overlays the base, remove button top-right inside
        // variant:'area' guard is required — without it, variant='button' would also get
        // absolute inset-0 on the external file item, making it invisible.
        {
            layout: 'grid',
            multiple: false,
            variant: 'area',
            class: {
                base: 'relative overflow-hidden',
                file: 'absolute inset-0 p-0 border-0 rounded-none aspect-auto',
                fileTrailing: 'absolute top-2 end-2'
            }
        },
        // List size trailing adjustments
        { size: 'xs', layout: 'list', class: { fileTrailing: '-me-1' } },
        { size: 'sm', layout: 'list', class: { fileTrailing: '-me-1.5' } },
        { size: 'md', layout: 'list', class: { fileTrailing: '-me-1.5' } },
        { size: 'lg', layout: 'list', class: { fileTrailing: '-me-2' } },
        { size: 'xl', layout: 'list', class: { fileTrailing: '-me-2' } }
    ],
    defaultVariants: {
        color: 'primary',
        variant: 'area',
        size: 'md',
        layout: 'list'
    }
})

export type FileUploadVariantProps = VariantProps<typeof fileUploadVariants>
export type FileUploadSlots = keyof ReturnType<typeof fileUploadVariants>

export const fileUploadDefaults = {
    defaultVariants: {
        color: 'primary' as NonNullable<FileUploadVariantProps['color']>,
        variant: 'area' as NonNullable<FileUploadVariantProps['variant']>,
        size: 'md' as NonNullable<FileUploadVariantProps['size']>,
        layout: 'list' as NonNullable<FileUploadVariantProps['layout']>
    },
    slots: {
        root: '',
        base: '',
        wrapper: '',
        icon: '',
        label: '',
        description: '',
        actions: '',
        files: '',
        file: '',
        fileLeading: '',
        fileWrapper: '',
        fileName: '',
        fileSize: '',
        fileTrailing: '',
        previewContent: '',
        previewBody: ''
    } as Partial<Record<FileUploadSlots, string>>
}
