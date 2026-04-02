<script lang="ts">
    import { useMediaQuery } from '$lib/index.js'
    import { Badge, Button, Icon, Card } from '$lib/index.js'

    const isMobile = useMediaQuery('(max-width: 640px)')
    const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
    const isDesktop = useMediaQuery('(min-width: 1025px)')
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
    const isLandscape = useMediaQuery('(orientation: landscape)')

    let customQuery = $state('(min-width: 768px)')
    const customResult = useMediaQuery(() => customQuery)

    const breakpoints = [
        { label: 'Mobile', query: '(max-width: 640px)', result: isMobile },
        { label: 'Tablet', query: '(min-width: 641px) and (max-width: 1024px)', result: isTablet },
        { label: 'Desktop', query: '(min-width: 1025px)', result: isDesktop }
    ] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useMediaQuery</h1>
        <p class="text-on-surface-variant">
            Reactive media query hook. Tracks whether a CSS media query matches in JavaScript.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Resize the browser window to see values change in real time.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each breakpoints as bp (bp.label)}
                <Badge
                    label="{bp.label}: {bp.result.matches}"
                    color={bp.result.matches ? 'success' : 'surface'}
                    variant="subtle"
                    size="md"
                />
            {/each}
        </div>
    </section>

    <!-- Current Breakpoint -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Current Breakpoint</h2>
        <div class="flex flex-col items-center gap-4 rounded-lg bg-surface-container-high p-8">
            <Icon
                name={isMobile.matches
                    ? 'lucide:smartphone'
                    : isTablet.matches
                      ? 'lucide:tablet'
                      : 'lucide:monitor'}
                size="48"
                class="text-primary"
            />
            <span class="text-lg font-medium">
                {isMobile.matches ? 'Mobile' : isTablet.matches ? 'Tablet' : 'Desktop'}
            </span>
            <span class="text-sm text-on-surface-variant">
                {isMobile.matches ? '< 640px' : isTablet.matches ? '641px - 1024px' : '> 1025px'}
            </span>
        </div>
    </section>

    <!-- User Preferences -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">User Preferences</h2>
        <p class="text-sm text-on-surface-variant">
            Detect OS-level user preferences for dark mode, motion, and orientation.
        </p>
        <div class="grid gap-3 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-md bg-surface-container p-3">
                <Icon
                    name={prefersDark.matches ? 'lucide:moon' : 'lucide:sun'}
                    size="20"
                    class="text-on-surface-variant"
                />
                <div>
                    <p class="text-sm font-medium">Color Scheme</p>
                    <p class="text-xs text-on-surface-variant">
                        {prefersDark.matches ? 'Dark mode' : 'Light mode'}
                    </p>
                </div>
                <Badge
                    label={prefersDark.matches ? 'dark' : 'light'}
                    color={prefersDark.matches ? 'info' : 'warning'}
                    variant="soft"
                    size="sm"
                    class="ml-auto"
                />
            </div>

            <div class="flex items-center gap-3 rounded-md bg-surface-container p-3">
                <Icon
                    name={prefersReducedMotion.matches ? 'lucide:pause' : 'lucide:play'}
                    size="20"
                    class="text-on-surface-variant"
                />
                <div>
                    <p class="text-sm font-medium">Motion</p>
                    <p class="text-xs text-on-surface-variant">
                        {prefersReducedMotion.matches ? 'Reduced' : 'Normal'}
                    </p>
                </div>
                <Badge
                    label={prefersReducedMotion.matches ? 'reduced' : 'normal'}
                    color={prefersReducedMotion.matches ? 'warning' : 'success'}
                    variant="soft"
                    size="sm"
                    class="ml-auto"
                />
            </div>

            <div class="flex items-center gap-3 rounded-md bg-surface-container p-3">
                <Icon
                    name={isLandscape.matches
                        ? 'lucide:rectangle-horizontal'
                        : 'lucide:rectangle-vertical'}
                    size="20"
                    class="text-on-surface-variant"
                />
                <div>
                    <p class="text-sm font-medium">Orientation</p>
                    <p class="text-xs text-on-surface-variant">
                        {isLandscape.matches ? 'Landscape' : 'Portrait'}
                    </p>
                </div>
                <Badge
                    label={isLandscape.matches ? 'landscape' : 'portrait'}
                    color="info"
                    variant="soft"
                    size="sm"
                    class="ml-auto"
                />
            </div>
        </div>
    </section>

    <!-- Custom Query -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Query</h2>
        <p class="text-sm text-on-surface-variant">
            Supports reactive query strings via getter functions.
        </p>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap items-center gap-3">
                <Button
                    variant={customQuery === '(min-width: 768px)' ? 'solid' : 'outline'}
                    size="sm"
                    onclick={() => (customQuery = '(min-width: 768px)')}
                >
                    min-width: 768px
                </Button>
                <Button
                    variant={customQuery === '(max-width: 1200px)' ? 'solid' : 'outline'}
                    size="sm"
                    onclick={() => (customQuery = '(max-width: 1200px)')}
                >
                    max-width: 1200px
                </Button>
                <Button
                    variant={customQuery === '(hover: hover)' ? 'solid' : 'outline'}
                    size="sm"
                    onclick={() => (customQuery = '(hover: hover)')}
                >
                    hover: hover
                </Button>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <code class="rounded bg-surface-container px-2 py-1 font-mono">{customQuery}</code>
                <span class="text-on-surface-variant">=</span>
                <Badge
                    label={String(customResult.matches)}
                    color={customResult.matches ? 'success' : 'error'}
                    variant="subtle"
                />
            </div>
        </div>
    </section>

    <!-- Responsive Layout -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World: Responsive Layout</h2>
        <p class="text-sm text-on-surface-variant">
            Switch between layouts based on viewport. Resize the window to see the layout change.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            {#if isMobile.matches}
                <div class="space-y-3">
                    {#each ['Card 1', 'Card 2', 'Card 3'] as title (title)}
                        <Card class="p-4">
                            <p class="text-sm font-medium">{title}</p>
                            <p class="text-xs text-on-surface-variant">Mobile: stacked layout</p>
                        </Card>
                    {/each}
                </div>
            {:else}
                <div class="grid grid-cols-3 gap-3">
                    {#each ['Card 1', 'Card 2', 'Card 3'] as title (title)}
                        <Card class="p-4">
                            <p class="text-sm font-medium">{title}</p>
                            <p class="text-xs text-on-surface-variant">Desktop: grid layout</p>
                        </Card>
                    {/each}
                </div>
            {/if}
        </div>
    </section>
</div>
