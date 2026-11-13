import { tv, type VariantProps } from 'tailwind-variants'

export const chartVariants = tv({
    slots: {
        root: [
            'relative flex w-full flex-col gap-3 text-xs text-on-surface-variant',
            '[--ts-chart-1:var(--color-chart-1)] [--ts-chart-2:var(--color-chart-2)] [--ts-chart-3:var(--color-chart-3)]',
            '[--ts-chart-4:var(--color-chart-4)] [--ts-chart-5:var(--color-chart-5)] [--ts-chart-6:var(--color-chart-6)]',
            '[--ts-chart-focus-fill:var(--color-surface)]'
        ],
        base: [
            'relative w-full',
            '[&_.ts-chart]:rounded-sm [&_.ts-chart]:outline-none',
            '[&_.ts-chart:focus-visible]:outline-2 [&_.ts-chart:focus-visible]:outline-offset-2 [&_.ts-chart:focus-visible]:outline-primary'
        ],
        center: 'pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center',
        legend: 'flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5',
        legendItem: 'flex min-w-0 items-center gap-1.5',
        legendIndicator: 'shrink-0',
        legendLabel: 'truncate text-on-surface-variant',
        tooltip:
            'flex min-w-32 flex-col gap-1 rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-2 text-xs text-on-surface-variant shadow-md',
        tooltipTitle: 'font-medium whitespace-pre-line text-on-surface',
        tooltipRow:
            'flex items-center gap-2 text-on-surface-variant data-[active=true]:text-on-surface',
        tooltipIndicator: 'h-1 w-3 shrink-0 rounded-full',
        tooltipLabel: 'truncate',
        tooltipValue: 'ms-auto ps-4 font-medium text-on-surface tabular-nums'
    },
    variants: {
        type: {
            line: {
                legendIndicator: 'h-0.5 w-3 rounded-full'
            },
            area: {
                legendIndicator: 'size-2.5 rounded-xs'
            },
            bar: {
                legendIndicator: 'size-2.5 rounded-xs'
            },
            donut: {
                legendIndicator: 'size-2.5 rounded-full'
            }
        }
    },
    defaultVariants: {
        type: 'line'
    }
})

export type ChartVariantProps = VariantProps<typeof chartVariants>
export type ChartSlots = keyof ReturnType<typeof chartVariants>

export const chartDefaults = {
    defaultVariants: chartVariants.defaultVariants,
    slots: {} as Partial<Record<ChartSlots, string>>
}
