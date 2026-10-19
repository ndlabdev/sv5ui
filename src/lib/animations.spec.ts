import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

const theme = read('./theme.css')

const sources = Object.fromEntries(
    readdirSync(new URL('./components', import.meta.url), { recursive: true, encoding: 'utf8' })
        .filter((file) => file.endsWith('.variants.ts') || file.endsWith('.svelte'))
        .map((file) => [file, read(`./components/${file}`)])
)

const keyframes = new Set([...theme.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]))

const ENTER_STATES = [
    'data-[state=open]',
    'data-[state=visible]',
    'data-[state=delayed-open]',
    'data-[motion=from-'
]
const EXIT_STATES = ['data-[state=closed]', 'data-[state=hidden]', 'data-[motion=to-']

const PLUGIN_UTILITY =
    /(?:^|[\s'"`:])(animate-(?:in|out)|(?:fade|zoom|spin)-(?:in|out)-\d+|slide-(?:in|out)-(?:from|to)-(?:top|bottom|left|right|start|end)-\d+)(?=[\s'"`]|$)/gm

type Animation = { file: string; line: number; variant: string; parts: string[] }

function splitTopLevel(value: string) {
    const parts: string[] = []
    let depth = 0
    let current = ''
    for (const char of value) {
        if (char === '(') depth++
        if (char === ')') depth--
        if (char === ',' && depth === 0) {
            parts.push(current)
            current = ''
        } else {
            current += char
        }
    }
    parts.push(current)
    return parts
}

const keyframeOf = (part: string) => part.split('_')[0]

const inStates = (states: string[]) => (animation: Animation) =>
    states.some((state) => animation.variant.includes(state))

const animations: Animation[] = Object.entries(sources).flatMap(([file, source]) =>
    source.split('\n').flatMap((text, index) =>
        [...text.matchAll(/([^\s'"`]*)animate-\[([^\]]+)\]/g)].map((m) => ({
            file,
            line: index + 1,
            variant: m[1],
            parts: splitTopLevel(m[2])
        }))
    )
)

describe('component animations', () => {
    it('should find the arbitrary animations to check', () => {
        expect(animations.length).toBeGreaterThan(50)
    })

    it('should only reference keyframes defined in theme.css', () => {
        const missing = animations.flatMap(({ file, line, parts }) =>
            parts
                .map(keyframeOf)
                .filter((name) => !keyframes.has(name))
                .map((name) => `${file}:${line}: ${name}`)
        )
        expect(missing).toEqual([])
    })

    it('should not reuse an opening keyframe for the closing animation', () => {
        const lines = new Map<string, Animation[]>()
        for (const animation of animations) {
            const key = `${animation.file}:${animation.line}`
            lines.set(key, [...(lines.get(key) ?? []), animation])
        }
        const reused = [...lines].flatMap(([key, group]) => {
            const opening = new Set(
                group.filter(inStates(ENTER_STATES)).flatMap(({ parts }) => parts.map(keyframeOf))
            )
            return group
                .filter(inStates(EXIT_STATES))
                .flatMap(({ parts }) => parts.map(keyframeOf))
                .filter((name) => opening.has(name))
                .map((name) => `${key}: ${name}`)
        })
        expect(reused).toEqual([])
    })

    it('should keep the final frame of every closing animation', () => {
        const unfilled = animations
            .filter(inStates(EXIT_STATES))
            .flatMap(({ file, line, variant, parts }) =>
                parts
                    .filter((part) => !part.split('_').includes('forwards'))
                    .map((part) => `${file}:${line}: ${variant}${part}`)
            )
        expect(unfilled).toEqual([])
    })

    it('should not use utilities from an animation plugin that is not installed', () => {
        const pluginUtilities = Object.entries(sources).flatMap(([file, source]) =>
            [...source.matchAll(PLUGIN_UTILITY)].map((m) => `${file}: ${m[1]}`)
        )
        expect(pluginUtilities).toEqual([])
    })
})
