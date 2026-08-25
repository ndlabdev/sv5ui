import { tv, type VariantProps } from 'tailwind-variants'

const interactiveThumb = [
    'absolute rounded-full border-2 border-white shadow ring-1 ring-black/25',
    'focus:outline-none focus-visible:ring-3',
    'transition-[box-shadow] duration-150'
]

const iconButton = [
    'inline-flex shrink-0 items-center justify-center rounded-md',
    'text-on-surface-variant/75 hover:text-on-surface',
    'disabled:pointer-events-none disabled:opacity-75',
    'focus:outline-none focus-visible:ring-2',
    'transition-colors'
]

export const colorPickerVariants = tv({
    slots: {
        root: 'flex max-w-full flex-col',
        area: 'relative w-full cursor-crosshair touch-none select-none overflow-hidden rounded-md',
        areaThumb: [...interactiveThumb, '-translate-x-1/2 -translate-y-1/2'],
        controls: 'flex items-center',
        eyeDropper: iconButton,
        eyeDropperIcon: 'shrink-0',
        preview: 'shrink-0 rounded-full ring-1 ring-inset ring-outline-variant',
        sliders: 'flex min-w-0 flex-1 flex-col',
        slider: 'relative flex w-full touch-none select-none items-center',
        track: 'relative w-full grow overflow-hidden rounded-full ring-1 ring-inset ring-outline-variant/50',
        thumb: [...interactiveThumb, 'block'],
        inputs: 'flex items-center',
        formatButton: [
            'inline-flex shrink-0 items-center justify-center rounded-md uppercase',
            'bg-surface-container-high text-on-surface-variant hover:text-on-surface',
            'disabled:pointer-events-none disabled:opacity-75',
            'focus:outline-none focus-visible:ring-2',
            'transition-colors'
        ],
        input: [
            'w-full min-w-0 rounded-md border-0 bg-surface text-on-surface tabular-nums',
            'ring ring-inset ring-outline-variant',
            'placeholder:text-on-surface-variant/50',
            'disabled:cursor-not-allowed disabled:opacity-75',
            'focus:outline-none focus:ring-2',
            'transition-colors'
        ],
        swatches: 'flex flex-wrap items-center',
        swatch: [
            'shrink-0 rounded-md ring-1 ring-inset ring-outline-variant',
            'disabled:pointer-events-none disabled:opacity-75',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
            'data-[selected]:ring-2',
            'transition-shadow'
        ]
    },
    variants: {
        color: {
            primary: {
                areaThumb: 'focus-visible:ring-primary/40',
                thumb: 'focus-visible:ring-primary/40',
                eyeDropper: 'focus-visible:ring-primary',
                formatButton: 'focus-visible:ring-primary',
                input: 'focus:ring-primary',
                swatch: 'focus-visible:ring-primary data-[selected]:ring-primary'
            },
            secondary: {
                areaThumb: 'focus-visible:ring-secondary/40',
                thumb: 'focus-visible:ring-secondary/40',
                eyeDropper: 'focus-visible:ring-secondary',
                formatButton: 'focus-visible:ring-secondary',
                input: 'focus:ring-secondary',
                swatch: 'focus-visible:ring-secondary data-[selected]:ring-secondary'
            },
            tertiary: {
                areaThumb: 'focus-visible:ring-tertiary/40',
                thumb: 'focus-visible:ring-tertiary/40',
                eyeDropper: 'focus-visible:ring-tertiary',
                formatButton: 'focus-visible:ring-tertiary',
                input: 'focus:ring-tertiary',
                swatch: 'focus-visible:ring-tertiary data-[selected]:ring-tertiary'
            },
            success: {
                areaThumb: 'focus-visible:ring-success/40',
                thumb: 'focus-visible:ring-success/40',
                eyeDropper: 'focus-visible:ring-success',
                formatButton: 'focus-visible:ring-success',
                input: 'focus:ring-success',
                swatch: 'focus-visible:ring-success data-[selected]:ring-success'
            },
            warning: {
                areaThumb: 'focus-visible:ring-warning/40',
                thumb: 'focus-visible:ring-warning/40',
                eyeDropper: 'focus-visible:ring-warning',
                formatButton: 'focus-visible:ring-warning',
                input: 'focus:ring-warning',
                swatch: 'focus-visible:ring-warning data-[selected]:ring-warning'
            },
            error: {
                areaThumb: 'focus-visible:ring-error/40',
                thumb: 'focus-visible:ring-error/40',
                eyeDropper: 'focus-visible:ring-error',
                formatButton: 'focus-visible:ring-error',
                input: 'ring-error focus:ring-error',
                swatch: 'focus-visible:ring-error data-[selected]:ring-error'
            },
            info: {
                areaThumb: 'focus-visible:ring-info/40',
                thumb: 'focus-visible:ring-info/40',
                eyeDropper: 'focus-visible:ring-info',
                formatButton: 'focus-visible:ring-info',
                input: 'focus:ring-info',
                swatch: 'focus-visible:ring-info data-[selected]:ring-info'
            },
            surface: {
                areaThumb: 'focus-visible:ring-on-surface/40',
                thumb: 'focus-visible:ring-on-surface/40',
                eyeDropper: 'focus-visible:ring-outline',
                formatButton: 'focus-visible:ring-outline',
                input: 'focus:ring-outline',
                swatch: 'focus-visible:ring-outline data-[selected]:ring-on-surface'
            }
        },
        size: {
            xs: {
                root: 'w-44 gap-2',
                area: 'h-24',
                areaThumb: 'size-3.5',
                controls: 'gap-2',
                eyeDropper: 'size-6',
                eyeDropperIcon: 'size-3.5',
                preview: 'size-6',
                sliders: 'gap-1.5',
                slider: 'h-2',
                track: 'h-2',
                thumb: 'size-3.5',
                inputs: 'gap-1.5',
                formatButton: 'px-1.5 py-1 text-[10px]',
                input: 'px-2 py-1 text-xs',
                swatches: 'gap-1',
                swatch: 'size-5'
            },
            sm: {
                root: 'w-48 gap-2',
                area: 'h-28',
                areaThumb: 'size-4',
                controls: 'gap-2',
                eyeDropper: 'size-7',
                eyeDropperIcon: 'size-4',
                preview: 'size-7',
                sliders: 'gap-2',
                slider: 'h-2.5',
                track: 'h-2.5',
                thumb: 'size-4',
                inputs: 'gap-1.5',
                formatButton: 'px-2 py-1.5 text-[10px]',
                input: 'px-2.5 py-1.5 text-xs',
                swatches: 'gap-1',
                swatch: 'size-5'
            },
            md: {
                root: 'w-56 gap-3',
                area: 'h-32',
                areaThumb: 'size-4',
                controls: 'gap-2.5',
                eyeDropper: 'size-8',
                eyeDropperIcon: 'size-4',
                preview: 'size-8',
                sliders: 'gap-2',
                slider: 'h-3',
                track: 'h-3',
                thumb: 'size-4',
                inputs: 'gap-2',
                formatButton: 'px-2 py-2 text-[11px]',
                input: 'px-3 py-2 text-sm',
                swatches: 'gap-1.5',
                swatch: 'size-6'
            },
            lg: {
                root: 'w-64 gap-3',
                area: 'h-40',
                areaThumb: 'size-4.5',
                controls: 'gap-3',
                eyeDropper: 'size-9',
                eyeDropperIcon: 'size-5',
                preview: 'size-9',
                sliders: 'gap-2.5',
                slider: 'h-3.5',
                track: 'h-3.5',
                thumb: 'size-4.5',
                inputs: 'gap-2',
                formatButton: 'px-2.5 py-2.5 text-xs',
                input: 'px-4 py-2.5 text-sm',
                swatches: 'gap-1.5',
                swatch: 'size-6'
            },
            xl: {
                root: 'w-72 gap-4',
                area: 'h-48',
                areaThumb: 'size-5',
                controls: 'gap-3',
                eyeDropper: 'size-10',
                eyeDropperIcon: 'size-6',
                preview: 'size-10',
                sliders: 'gap-3',
                slider: 'h-4',
                track: 'h-4',
                thumb: 'size-5',
                inputs: 'gap-2.5',
                formatButton: 'px-3 py-3 text-xs',
                input: 'px-5 py-3 text-base',
                swatches: 'gap-2',
                swatch: 'size-7'
            }
        },
        disabled: {
            true: {
                root: 'cursor-not-allowed opacity-75',
                area: 'pointer-events-none',
                slider: 'pointer-events-none'
            }
        }
    },
    defaultVariants: {
        color: 'primary',
        size: 'md'
    }
})

export type ColorPickerVariantProps = VariantProps<typeof colorPickerVariants>
export type ColorPickerSlots = keyof ReturnType<typeof colorPickerVariants>

export const colorPickerDefaults = {
    defaultVariants: colorPickerVariants.defaultVariants,
    slots: {} as Partial<Record<ColorPickerSlots, string>>
}
