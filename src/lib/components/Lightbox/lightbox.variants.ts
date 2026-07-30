import { tv, type VariantProps } from 'tailwind-variants'

export const lightboxVariants = tv({
    slots: {
        gallery: 'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4',
        galleryItem:
            'group relative aspect-square overflow-hidden rounded-lg bg-surface-container ring-1 ring-outline-variant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        galleryImage:
            'size-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-90',
        overlay: 'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm',
        content:
            'fixed inset-0 z-50 flex flex-col focus:outline-none text-white select-none [--lb-pad:env(safe-area-inset-top,0px)]',
        toolbar:
            'absolute inset-x-0 top-0 z-20 flex items-center gap-1 p-2 pt-[calc(0.5rem+var(--lb-pad))] sm:p-3 bg-gradient-to-b from-black/60 to-transparent',
        counter: 'text-sm font-medium tabular-nums text-white/80 px-2',
        toolbarSpacer: 'flex-1',
        control:
            'inline-flex items-center justify-center rounded-full size-9 sm:size-10 text-white/80 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:opacity-40 disabled:pointer-events-none transition-colors',
        stage: 'relative flex-1 overflow-hidden touch-none',
        track: 'absolute inset-0 flex items-center',
        slide: 'absolute inset-0 flex items-center justify-center px-4 py-16 sm:px-14 sm:py-20',
        image: 'max-h-full max-w-full object-contain will-change-transform',
        media: 'max-h-full max-w-full',
        arrow: 'absolute top-1/2 z-20 -translate-y-1/2 inline-flex items-center justify-center rounded-full size-10 sm:size-12 bg-black/30 text-white/80 hover:text-white hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:opacity-30 disabled:pointer-events-none transition-colors',
        arrowPrev: 'start-2 sm:start-4',
        arrowNext: 'end-2 sm:end-4',
        caption:
            'pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 p-4 pb-6 text-center bg-gradient-to-t from-black/70 to-transparent',
        captionTitle: 'text-base font-semibold text-white',
        captionDescription: 'max-w-2xl text-sm text-white/70',
        thumbnails:
            'relative z-20 hidden md:flex items-center justify-center gap-2 overflow-x-auto p-3 bg-black/40',
        thumbnail:
            'relative h-14 w-20 shrink-0 overflow-hidden rounded-md opacity-50 ring-2 ring-transparent transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70',
        thumbnailImage: 'size-full object-cover',
        spinner: 'absolute inset-0 m-auto size-8 text-white/70'
    },
    variants: {
        transition: {
            none: {},
            fade: {
                overlay:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]',
                content:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]'
            },
            scale: {
                overlay:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]',
                content:
                    'data-[state=open]:animate-[scale-in_200ms_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[scale-out_150ms_cubic-bezier(0.32,0.72,0,1)]'
            }
        },
        active: {
            true: {
                thumbnail: 'opacity-100 ring-white'
            }
        }
    },
    defaultVariants: {
        transition: 'fade'
    }
})

export type LightboxVariantProps = VariantProps<typeof lightboxVariants>
export type LightboxSlots = keyof ReturnType<typeof lightboxVariants>

export const lightboxDefaults = {
    defaultVariants: lightboxVariants.defaultVariants,
    slots: {} as Partial<Record<LightboxSlots, string>>
}
