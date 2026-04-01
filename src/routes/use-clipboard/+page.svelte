<script lang="ts">
    import { useClipboard } from '$lib/index.js'
    import { Button, Input, Textarea, Badge, Icon, Card } from '$lib/index.js'

    const clipboard = useClipboard()
    const clipboardLong = useClipboard({ timeout: 5000 })

    let inputValue = $state('Hello, SV5UI!')
    let textareaValue = $state('const greeting = "Hello World";\nconsole.log(greeting);')

    const snippets = [
        { label: 'npm', text: 'npm install sv5ui', icon: 'lucide:terminal' },
        { label: 'pnpm', text: 'pnpm add sv5ui', icon: 'lucide:terminal' },
        { label: 'yarn', text: 'yarn add sv5ui', icon: 'lucide:terminal' }
    ]
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useClipboard</h1>
        <p class="text-on-surface-variant">
            Reactive clipboard hook. Copies text and tracks the copied state with auto-reset.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                onclick={() => clipboard.copy('Hello from SV5UI!')}
                icon={clipboard.copied ? 'lucide:check' : 'lucide:copy'}
                color={clipboard.copied ? 'success' : 'primary'}
            >
                {clipboard.copied ? 'Copied!' : 'Copy Text'}
            </Button>

            <Badge
                label={clipboard.copied ? 'Copied' : 'Ready'}
                color={clipboard.copied ? 'success' : 'surface'}
                variant="subtle"
            />
        </div>
    </section>

    <!-- Custom Timeout -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Timeout</h2>
        <p class="text-sm text-on-surface-variant">
            The default timeout is 2 seconds. You can set a custom timeout for longer feedback.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                onclick={() => clipboardLong.copy('Copied with 5s timeout!')}
                icon={clipboardLong.copied ? 'lucide:check' : 'lucide:copy'}
                color={clipboardLong.copied ? 'success' : 'secondary'}
                variant="outline"
            >
                {clipboardLong.copied ? 'Copied! (5s reset)' : 'Copy (5s timeout)'}
            </Button>
        </div>
    </section>

    <!-- Copy from Input -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Copy from Input</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <div class="flex items-center gap-2">
                <div class="flex-1">
                    <Input bind:value={inputValue} placeholder="Type something..." />
                </div>
                <Button
                    onclick={() => clipboard.copy(inputValue)}
                    icon={clipboard.copied ? 'lucide:check' : 'lucide:copy'}
                    color={clipboard.copied ? 'success' : 'primary'}
                    variant="outline"
                    square
                />
            </div>
        </div>
    </section>

    <!-- Copy Code Block -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Copy from Textarea</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Textarea bind:value={textareaValue} rows={3} />
            <Button
                onclick={() => clipboard.copy(textareaValue)}
                icon={clipboard.copied ? 'lucide:check' : 'lucide:copy'}
                color={clipboard.copied ? 'success' : 'primary'}
                size="sm"
            >
                {clipboard.copied ? 'Copied!' : 'Copy Code'}
            </Button>
        </div>
    </section>

    <!-- Install Commands -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World: Install Commands</h2>
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            {#each snippets as snippet (snippet.label)}
                <div class="flex items-center justify-between rounded-md bg-surface-container p-3">
                    <div class="flex items-center gap-3">
                        <Icon name={snippet.icon} size="16" class="text-on-surface-variant" />
                        <code class="font-mono text-sm">{snippet.text}</code>
                    </div>
                    <Button
                        onclick={() => clipboard.copy(snippet.text)}
                        icon={clipboard.copied ? 'lucide:check' : 'lucide:clipboard'}
                        color={clipboard.copied ? 'success' : 'surface'}
                        variant="ghost"
                        size="xs"
                        square
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Share Card -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World: Share Link</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Card class="p-4">
                <div class="space-y-3">
                    <p class="text-sm font-medium">Share this page</p>
                    <div class="flex items-center gap-2">
                        <div
                            class="flex-1 truncate rounded-md bg-surface-container px-3 py-2 font-mono text-xs text-on-surface-variant"
                        >
                            https://sv5ui.vercel.app/use-clipboard
                        </div>
                        <Button
                            onclick={() => clipboard.copy('https://sv5ui.vercel.app/use-clipboard')}
                            icon={clipboard.copied ? 'lucide:check' : 'lucide:link'}
                            color={clipboard.copied ? 'success' : 'primary'}
                            variant="soft"
                            size="sm"
                        >
                            {clipboard.copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    </section>
</div>
