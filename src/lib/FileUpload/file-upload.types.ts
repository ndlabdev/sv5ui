import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { FileUploadVariantProps, FileUploadSlots } from './file-upload.variants.js'

/**
 * Reason a file was rejected by FileUpload.
 *
 * - `accept`: file did not match the `accept` MIME/extension filter
 * - `maxSize`: file exceeded the `maxSize` byte limit
 * - `maxFiles`: file would have pushed the selection past `maxFiles`
 */
export type FileUploadRejectionReason = 'accept' | 'maxSize' | 'maxFiles'

/**
 * A single rejected file along with the reason it was rejected.
 */
export interface FileUploadRejection {
    file: File
    reason: FileUploadRejectionReason
}

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
     * Maximum allowed size per file, in bytes. Files exceeding this are
     * rejected and reported through `onReject`.
     *
     * @example
     * ```svelte
     * <FileUpload maxSize={5 * 1024 * 1024} /> <!-- 5 MB -->
     * ```
     */
    maxSize?: number

    /**
     * Maximum number of files that can be selected. When the current
     * selection plus the incoming files would exceed this, the excess
     * files are rejected and reported through `onReject`. The root element
     * exposes a `data-full` attribute when the limit is reached, so the
     * upload area can be styled accordingly.
     */
    maxFiles?: number

    /**
     * Called when one or more incoming files are rejected by `accept`,
     * `maxSize`, or `maxFiles`. Receives the full rejection list for a
     * single user action (one drop or one input change).
     */
    onReject?: (rejected: FileUploadRejection[]) => void

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
