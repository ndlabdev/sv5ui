import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getIconData } from '@iconify/utils'
import lucide from '@iconify-json/lucide/icons.json' with { type: 'json' }
import { iconsDefaults } from '../src/lib/config.ts'

const sources = { lucide }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, 'src/lib/components/Icon/bundled.ts')

const transformDefaults = { left: 0, top: 0, rotate: 0, hFlip: false, vFlip: false }

const namesByPrefix = new Map()

for (const [key, value] of Object.entries(iconsDefaults)) {
    const [prefix, name, ...rest] = value.split(':')

    if (!prefix || !name || rest.length > 0) {
        throw new Error(`iconsDefaults.${key} is not a valid icon name: "${value}"`)
    }

    if (!namesByPrefix.has(prefix)) namesByPrefix.set(prefix, new Set())
    namesByPrefix.get(prefix).add(name)
}

const collections = []

for (const prefix of [...namesByPrefix.keys()].sort()) {
    const source = sources[prefix]

    if (!source) {
        throw new Error(
            `iconsDefaults uses the "${prefix}" collection, which this script does not load. ` +
                `Install "@iconify-json/${prefix}" and add it to the "sources" map above.`
        )
    }

    const width = source.width ?? 16
    const height = source.height ?? 16
    const icons = {}

    for (const name of [...namesByPrefix.get(prefix)].sort()) {
        const data = getIconData(source, name)

        if (!data)
            throw new Error(`Icon "${prefix}:${name}" does not exist in @iconify-json/${prefix}`)

        const icon = { body: data.body }

        if (data.width !== width) icon.width = data.width
        if (data.height !== height) icon.height = data.height

        for (const [prop, fallback] of Object.entries(transformDefaults)) {
            if (data[prop] !== undefined && data[prop] !== fallback) icon[prop] = data[prop]
        }

        icons[name] = icon
    }

    collections.push({ prefix, width, height, icons })
}

const body = collections
    .map((collection) => {
        const icons = Object.entries(collection.icons)
            .map(([name, icon]) => {
                const props = Object.entries(icon)
                    .map(([prop, value]) => `${prop}: ${JSON.stringify(value)}`)
                    .join(', ')

                return `            ${JSON.stringify(name)}: { ${props} }`
            })
            .join(',\n')

        return [
            '    {',
            `        prefix: ${JSON.stringify(collection.prefix)},`,
            `        width: ${collection.width},`,
            `        height: ${collection.height},`,
            '        icons: {',
            icons,
            '        }',
            '    }'
        ].join('\n')
    })
    .join(',\n')

const contents = `import type { BundledIconCollection } from './icon.types.js'

export const bundledIcons: BundledIconCollection[] = [
${body}
]
`

writeFileSync(output, contents)

const total = collections.reduce((sum, { icons }) => sum + Object.keys(icons).length, 0)

console.log(
    `Generated ${output.replace(`${root}/`, '')} — ` +
        `${total} icons across ${collections.length} collection(s), ` +
        `${(Buffer.byteLength(contents) / 1024).toFixed(1)}KB`
)
