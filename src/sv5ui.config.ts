/**
 * SV5UI Configuration File
 *
 * Copy this file to your project root and customize as needed.
 * Then import it in your +layout.svelte:
 *
 * ```svelte
 * <script>
 *     import '../sv5ui.config'
 * </script>
 * ```
 */

import { defineConfig } from '$lib/config.js'

defineConfig({
    // Example: customize button defaults and slots
    // button: {
    //     defaultVariants: { variant: 'outline', color: 'secondary' },
    //     slots: { base: 'shadow-md', label: 'font-bold' }
    // },

    // Example: customize avatar
    // avatar: {
    //     defaultVariants: { size: 'lg' },
    //     slots: { root: 'ring-2 ring-primary' }
    // },

    // Example: customize icons
    // icons: { loading: 'svg-spinners:ring-resize' }
})
