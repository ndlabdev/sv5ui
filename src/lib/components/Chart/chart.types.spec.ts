/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { ChartIndexKey, ChartValueKey } from './chart.types.js'

type Row = { month: string; year: number; desktop: number; mobile: number | null; note: string[] }

describe('chart key types', () => {
    it('limits concrete rows to compatible keys', () => {
        expectTypeOf<ChartIndexKey<Row>>().toEqualTypeOf<'month' | 'year' | 'desktop'>()
        expectTypeOf<ChartValueKey<Row>>().toEqualTypeOf<'year' | 'desktop' | 'mobile'>()
        // @ts-expect-error an array field cannot be plotted
        const invalid: ChartValueKey<Row> = 'note'
        expect(invalid).toBe('note')
    })

    it('accepts any key for loosely typed records', () => {
        expectTypeOf<ChartIndexKey<Record<string, unknown>>>().toEqualTypeOf<string>()
        expectTypeOf<ChartValueKey<Record<string, unknown>>>().toEqualTypeOf<string>()
        expectTypeOf<ChartValueKey<Record<string, any>>>().toEqualTypeOf<string>()
        const key: ChartValueKey<Record<string, unknown>> = 'anything'
        expect(key).toBe('anything')
    })
})
