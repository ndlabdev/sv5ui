<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Customization</h1>
        <p class="text-on-surface-variant">Customize defaults and colors when needed.</p>
    </div>

    <!-- Custom Defaults -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Component Defaults</h2>
        <p class="text-sm text-on-surface-variant">Create a config file to change default props:</p>
        <div class="rounded-lg bg-surface-container-highest p-4">
            <pre class="overflow-x-auto text-sm"><code class="text-on-surface"
                    >{`// src/sv5ui.config.ts
import { defineConfig } from 'sv5ui'

defineConfig({
    button: {
        variant: 'outline',  // Change default variant
        color: 'secondary',  // Change default color
        size: 'sm'           // Change default size
    }
})`}</code
                ></pre>
        </div>
        <p class="text-sm text-on-surface-variant">Then import it in your layout:</p>
        <div class="rounded-lg bg-surface-container-highest p-4">
            <pre class="overflow-x-auto text-sm"><code class="text-on-surface"
                    >{"// +layout.svelte\n<script>\n    import 'sv5ui/theme.css'\n    import '../sv5ui.config'  // Add this line\n    import { ModeWatcher } from 'sv5ui'\n<\/script>"}</code
                ></pre>
        </div>
    </section>

    <!-- Custom Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Override theme colors in your own CSS file (after importing theme.css):
        </p>
        <div class="rounded-lg bg-surface-container-highest p-4">
            <pre class="overflow-x-auto text-sm"><code class="text-on-surface"
                    >{`/* src/app.css */
:root {
    --color-primary: oklch(0.6 0.2 260);
    --color-on-primary: oklch(1 0 0);
}

.dark {
    --color-primary: oklch(0.75 0.15 260);
}`}</code
                ></pre>
        </div>
    </section>

    <!-- Reset Config -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Reset Config</h2>
        <div class="rounded-lg bg-surface-container-highest p-4">
            <pre class="overflow-x-auto text-sm"><code class="text-on-surface"
                    >{`import { resetConfig } from 'sv5ui'

// Reset to library defaults
resetConfig()`}</code
                ></pre>
        </div>
    </section>

    <!-- Customizing Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Customizing Variants</h2>
        <p class="text-sm text-on-surface-variant">
            To add new variants or modify existing ones, edit the <code
                class="rounded bg-surface-container-highest px-1">button.variants.ts</code
            > file:
        </p>
        <div class="rounded-lg bg-surface-container-highest p-4">
            <pre class="overflow-x-auto text-sm"><code class="text-on-surface"
                    >{`// src/lib/Button/button.variants.ts
export const buttonVariants = tv({
    variants: {
        variant: {
            solid: '',
            outline: '',
            soft: '',
            // Add your custom variant
            gradient: '',
        },
        // ...
    },
    compoundVariants: [
        // Add styles for your custom variant
        {
            variant: 'gradient',
            color: 'primary',
            class: {
                base: 'bg-linear-to-r from-primary to-tertiary text-on-primary'
            }
        },
        // ...
    ]
})`}</code
                ></pre>
        </div>
    </section>
</div>
