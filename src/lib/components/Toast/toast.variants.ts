export type ToastVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'accent'
export type ToastColor =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'

export const toastDefaults = {
    defaultVariants: {
        variant: 'outline' as ToastVariant
    }
}
