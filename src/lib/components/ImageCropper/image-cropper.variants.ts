import { tv, type VariantProps } from 'tailwind-variants'

export const imageCropperVariants = tv({
    slots: {
        root: 'flex w-full flex-col',
        stage: [
            'relative w-full select-none overflow-hidden rounded-xl',
            'border border-outline-variant bg-[oklch(0.19_0.012_260)]',
            'focus-visible:outline-2 focus-visible:outline-offset-2'
        ],
        image: 'pointer-events-none absolute top-0 left-0 max-w-none origin-top-left',
        frame: 'absolute outline-1 outline-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]',
        corner: 'pointer-events-none absolute border-white',
        grid: [
            'pointer-events-none absolute inset-0',
            '[background-image:linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)]',
            '[background-size:33.333%_33.333%]',
            '[background-position:33.333%_33.333%]'
        ],
        handle: 'absolute z-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.45)]',
        placeholder:
            'absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-white/65',
        toolbar:
            'flex w-fit flex-wrap items-center gap-0.5 rounded-lg border border-outline-variant bg-surface-container p-1',
        control: '',
        controls: 'flex flex-col gap-2',
        sliderWrapper:
            'flex flex-1 items-center rounded-lg border border-outline-variant bg-surface-container',
        sliderIcon: 'shrink-0 text-on-surface-variant',
        slider: 'flex-1',
        rotationRange: 'hidden',
        hint: 'sr-only'
    },
    variants: {
        color: {
            primary: { stage: 'focus-visible:outline-primary' },
            secondary: { stage: 'focus-visible:outline-secondary' },
            tertiary: { stage: 'focus-visible:outline-tertiary' },
            success: { stage: 'focus-visible:outline-success' },
            warning: { stage: 'focus-visible:outline-warning' },
            error: { stage: 'focus-visible:outline-error' },
            info: { stage: 'focus-visible:outline-info' },
            surface: { stage: 'focus-visible:outline-outline' }
        },
        size: {
            xs: {
                root: 'gap-1.5',
                stage: 'h-56 text-xs',
                corner: 'size-3 border-2',
                sliderWrapper: 'gap-2 px-2 py-1.5',
                sliderIcon: 'size-3.5',
                controls: 'gap-1.5'
            },
            sm: {
                root: 'gap-2',
                stage: 'h-64 text-xs',
                corner: 'size-3.5 border-2',
                sliderWrapper: 'gap-2.5 px-2.5 py-1.5',
                sliderIcon: 'size-4',
                controls: 'gap-2'
            },
            md: {
                root: 'gap-2.5',
                stage: 'h-72 text-sm',
                corner: 'size-4 border-[3px]',
                sliderWrapper: 'gap-3 px-3 py-2',
                sliderIcon: 'size-4',
                controls: 'gap-2.5'
            },
            lg: {
                root: 'gap-3',
                stage: 'h-80 text-sm',
                corner: 'size-5 border-[3px]',
                sliderWrapper: 'gap-3 px-3 py-2.5',
                sliderIcon: 'size-5',
                controls: 'gap-3'
            },
            xl: {
                root: 'gap-3.5',
                stage: 'h-96 text-base',
                corner: 'size-6 border-4',
                sliderWrapper: 'gap-3.5 px-4 py-3',
                sliderIcon: 'size-5',
                controls: 'gap-3.5'
            }
        },
        shape: {
            rect: { frame: 'rounded-[3px]' },
            circle: { frame: 'rounded-full', handle: 'hidden', corner: 'hidden' }
        },
        mode: {
            fixed: { stage: 'touch-none', frame: 'pointer-events-none' },
            box: { stage: 'touch-none', frame: 'cursor-move' }
        },
        disabled: {
            true: { root: 'opacity-75', stage: 'pointer-events-none cursor-not-allowed' },
            false: {}
        },
        dragging: {
            true: { stage: 'cursor-grabbing' },
            false: {}
        }
    },
    compoundVariants: [
        {
            mode: 'fixed',
            disabled: false,
            dragging: false,
            class: { stage: 'cursor-grab' }
        }
    ],
    defaultVariants: {
        color: 'primary',
        size: 'md',
        shape: 'rect',
        mode: 'fixed'
    }
})

export type ImageCropperVariantProps = VariantProps<typeof imageCropperVariants>
export type ImageCropperSlots = keyof ReturnType<typeof imageCropperVariants>

export const imageCropperDefaults = {
    defaultVariants: imageCropperVariants.defaultVariants,
    slots: {} as Partial<Record<ImageCropperSlots, string>>
}
