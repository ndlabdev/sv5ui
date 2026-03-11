import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { sveltekit } from '@sveltejs/kit/vite'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],

    define: {
        __SV5UI_VERSION__: JSON.stringify(pkg.version)
    },

    test: {
        expect: { requireAssertions: true },

        projects: [
            {
                extends: './vite.config.ts',

                test: {
                    name: 'client',

                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium', headless: true }]
                    },

                    include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
                    exclude: ['src/lib/server/**']
                }
            },

            {
                extends: './vite.config.ts',

                test: {
                    name: 'server',
                    environment: 'node',
                    include: ['src/**/*.{test,spec}.{js,ts}'],
                    exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
                }
            }
        ]
    }
})
