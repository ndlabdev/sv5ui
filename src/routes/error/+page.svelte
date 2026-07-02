<script lang="ts">
    import { Error } from '$lib/index.js'

    let retryCount = $state(0)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Error</h1>
        <p class="text-on-surface-variant">
            A pre-built error page component for displaying status codes, error messages, and a
            clear action. Pair it with SvelteKit's +error.svelte or svelte:boundary.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Error
                class="min-h-0 py-12"
                error={{
                    statusCode: 404,
                    statusMessage: 'Page not found',
                    message: 'The page you are looking for does not exist.'
                }}
            />
        </div>
    </section>

    <!-- With Icon -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icon</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Error
                class="min-h-0 py-12"
                icon="lucide:triangle-alert"
                error={{
                    statusCode: 500,
                    statusMessage: 'Internal server error',
                    message: 'Something went wrong on our end. Please try again later.'
                }}
            />
        </div>
    </section>

    <!-- Clear Button -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Clear Button</h2>
        <div class="grid gap-4 lg:grid-cols-3">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom label + variant</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Error
                        class="min-h-0 py-8"
                        error={{ statusCode: 403, statusMessage: 'Forbidden' }}
                        clear={{ label: 'Go back', variant: 'outline', color: 'secondary' }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom redirect</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Error
                        class="min-h-0 py-8"
                        error={{ statusCode: 401, statusMessage: 'Unauthorized' }}
                        redirect="/button"
                        clear={{ label: 'Go to Button docs' }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Hidden (clear=false)</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Error
                        class="min-h-0 py-8"
                        error={{ statusCode: 503, statusMessage: 'Service unavailable' }}
                        clear={false}
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- onClear Callback -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">onClear Callback</h2>
        <p class="text-sm text-on-surface-variant">
            When onClear is provided the clear action renders as a button instead of a link — useful
            with svelte:boundary's reset function. Clicked {retryCount} times.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Error
                class="min-h-0 py-8"
                error={{ statusCode: 500, statusMessage: 'Render failed' }}
                clear={{ label: 'Try again' }}
                onClear={() => retryCount++}
            />
        </div>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Error class="min-h-0 py-12" error={{ statusCode: 404 }}>
                {#snippet statusMessage()}
                    <h1 class="mt-2 text-3xl font-black text-error">We lost this page</h1>
                {/snippet}
                {#snippet message()}
                    <p class="mt-4 max-w-md text-on-surface-variant">
                        The link may be broken, or the page may have been moved. Custom content via
                        the message snippet.
                    </p>
                {/snippet}
            </Error>
        </div>
    </section>

    <!-- UI Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Overrides</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Error
                class="min-h-0 py-12"
                error={{
                    statusCode: 404,
                    statusMessage: 'Not found',
                    message: 'Styled through the ui prop.'
                }}
                ui={{
                    statusCode: 'text-error text-2xl',
                    statusMessage: 'text-2xl sm:text-3xl',
                    links: 'mt-6'
                }}
                clear={{ label: 'Back home', size: 'md' }}
            />
        </div>
    </section>
</div>
