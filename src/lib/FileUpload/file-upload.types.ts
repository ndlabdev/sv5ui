import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { FileUploadVariantProps, FileUploadSlots } from './file-upload.variants.js'

export type FileUploadProps = Omit<HTMLAttributes<HTMLElement>, 'class' | 'children'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The list of selected files. Supports two-way binding with `bind:value`.
     * @default []
     */
    value?: File[]

    /**
     * Callback when the selected files change.
     */
    onValueChange?: (value: File[]) => void

    /**
     * Allow multiple files to be selected.
     * @default false
     */
    multiple?: boolean

    /**
     * Accepted file types as MIME types or extensions (e.g. "image/*,.pdf").
     */
    accept?: string

    /**
     * Enable drag-and-drop file upload.
     * @default true
     */
    dropzone?: boolean

    /**
     * Whether clicking the area opens the file dialog.
     * @default true
     */
    interactive?: boolean

    /**
     * Label text displayed in the upload area.
     * @default 'Drop files here or click to upload'
     */
    label?: string

    /**
     * Description text displayed below the label.
     */
    description?: string

    /**
     * Icon displayed in the upload area.
     * @default 'lucide:upload'
     */
    icon?: string

    /**
     * Color scheme of the upload area.
     * @default 'primary'
     */
    color?: NonNullable<FileUploadVariantProps['color']>

    /**
     * Size of the upload area and file items.
     * @default 'md'
     */
    size?: NonNullable<FileUploadVariantProps['size']>

    /**
     * Visual style of the upload trigger.
     * @default 'area'
     */
    variant?: NonNullable<FileUploadVariantProps['variant']>

    /**
     * Layout of the file list.
     * @default 'list'
     */
    layout?: NonNullable<FileUploadVariantProps['layout']>

    /**
     * Whether the upload area is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * Show a loading state on the upload area.
     * @default false
     */
    loading?: boolean

    /**
     * Icon displayed in the loading state.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Show the file list after selection.
     * @default true
     */
    preview?: boolean

    /**
     * Highlight the upload area border with the active color.
     * @default false
     */
    highlight?: boolean

    /**
     * The name attribute for the file input (used in form submission).
     */
    name?: string

    /**
     * The HTML id attribute for the root element.
     */
    id?: string

    /**
     * Mark the file input as required for form submission.
     * @default false
     */
    required?: boolean

    /**
     * Icon displayed for non-image files.
     * @default 'lucide:file'
     */
    fileIcon?: string

    /**
     * Show a preview button on image files in the list to open a lightbox.
     * @default true
     */
    imagePreview?: boolean

    /**
     * Custom snippet for the leading icon/avatar inside the upload area.
     */
    leadingSlot?: Snippet

    /**
     * Custom snippet for the label text.
     */
    labelSlot?: Snippet

    /**
     * Custom snippet for the description text.
     */
    descriptionSlot?: Snippet

    /**
     * Custom snippet for action buttons. Receives `open()` to trigger the file dialog.
     */
    actionsSlot?: Snippet<[{ open: () => void }]>

    /**
     * Custom snippet to replace the entire file list.
     */
    filesSlot?: Snippet<[{ files: File[] }]>

    /**
     * Custom snippet for each file item.
     */
    fileSlot?: Snippet<[{ file: File; index: number; remove: () => void }]>

    /**
     * Default slot for additional content inside the upload area.
     */
    children?: Snippet

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific upload slots.
     */
    ui?: Partial<Record<FileUploadSlots, ClassNameValue>>
}
