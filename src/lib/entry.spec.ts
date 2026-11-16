import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

function imports(file: string): string[] {
    const source = readFileSync(file, 'utf8')
    return [...source.matchAll(/(?:import|export)[^'"]*?from\s+['"]([^'"]+)['"]/g)].map(
        (match) => match[1]
    )
}

function resolveLocal(from: string, specifier: string): string | undefined {
    const base = resolve(dirname(from), specifier)
    return [base, base.replace(/\.js$/, '.ts'), `${base}.ts`, `${base}/index.ts`].find(
        (candidate) => existsSync(candidate) && !candidate.endsWith('/')
    )
}

function packagesReachableFrom(entry: string): Set<string> {
    const seen = new Set<string>()
    const packages = new Set<string>()
    const queue = [entry]
    while (queue.length) {
        const file = queue.pop()!
        if (seen.has(file)) continue
        seen.add(file)
        if (!/\.(ts|svelte)$/.test(file)) continue
        for (const specifier of imports(file)) {
            if (specifier.startsWith('.')) {
                const local = resolveLocal(file, specifier)
                if (local) queue.push(local)
            } else {
                packages.add(specifier)
            }
        }
    }
    return packages
}

describe('package entries', () => {
    it('keeps the chart engine out of the main entry', () => {
        const packages = [...packagesReachableFrom(resolve(root, 'index.ts'))]
        expect(packages.length).toBeGreaterThan(0)
        expect(packages.filter((name) => name.startsWith('@tanstack/charts'))).toEqual([])
    })

    it('loads the chart engine from the chart entry', () => {
        const packages = [...packagesReachableFrom(resolve(root, 'components/Chart/index.ts'))]
        expect(packages).toContain('@tanstack/charts/svelte')
    })
})
