import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import Icon from './Icon.svelte'
import { bundledIcons } from './bundled.js'
import { iconsDefaults } from '../../config.js'

const bundledNames = bundledIcons.flatMap((collection) =>
    Object.keys(collection.icons).map((name) => `${collection.prefix}:${name}`)
)

describe('Icon SSR', () => {
    describe('bundled defaults', () => {
        it('covers every icon in iconsDefaults', () => {
            const missing = [...new Set(Object.values(iconsDefaults))].filter(
                (name) => !bundledNames.includes(name)
            )

            expect(missing).toEqual([])
        })

        it.each(bundledNames)('renders %s inline during SSR', (name) => {
            const { body } = render(Icon, { props: { name } })

            expect(body).toContain('<svg')
            expect(body).toMatch(/<(path|circle|rect|g|line|polyline|polygon|ellipse)\b/)
        })

        it('resolves without any network request', () => {
            const fetchSpy = () => {
                throw new Error('Icon triggered a network request during SSR')
            }
            const original = globalThis.fetch

            globalThis.fetch = fetchSpy as unknown as typeof fetch

            try {
                const { body } = render(Icon, { props: { name: iconsDefaults.loading } })

                expect(body).toContain('<svg')
            } finally {
                globalThis.fetch = original
            }
        })
    })

    describe('non-bundled icons', () => {
        it('renders nothing during SSR and defers to the Iconify API on the client', () => {
            const { body } = render(Icon, { props: { name: 'lucide:this-icon-does-not-exist' } })

            expect(body).not.toContain('<svg')
        })
    })
})
