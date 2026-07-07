<script lang="ts">
    import {
        Tour,
        Button,
        Badge,
        Icon,
        Switch,
        Slider,
        type TourController,
        type TourStep
    } from '$lib/index.js'

    let basicApi = $state<TourController>()
    const basicSteps: TourStep[] = [
        {
            target: '#tour-logo',
            title: 'Your workspace',
            description: 'This logo always brings you back home.'
        },
        {
            target: '#tour-search',
            title: 'Quick search',
            description: 'Press the search box to jump anywhere instantly.',
            placement: 'bottom'
        },
        {
            target: '#tour-create',
            title: 'Create something',
            description: 'Start a new project from this button.',
            placement: 'left'
        },
        {
            target: null,
            title: "You're all set",
            description: 'That was the whole tour. Enjoy exploring!',
            disableSpotlight: true
        }
    ]

    let guardApi = $state<TourController>()
    let agreed = $state(false)
    const guardSteps: TourStep[] = [
        {
            target: '#tour-agree',
            title: 'Accept the terms',
            description: 'Toggle the switch below before you can continue.',
            nextLabel: 'Continue',
            onBeforeNext: () => agreed
        },
        {
            target: null,
            title: 'Thanks!',
            description: 'You accepted the terms. Tour complete.',
            disableSpotlight: true
        }
    ]

    let interactApi = $state<TourController>()
    let clicks = $state(0)
    const interactSteps: TourStep[] = [
        {
            target: '#tour-like',
            title: 'Try it yourself',
            description: 'Click the heart button below — the tour lets you interact with it.',
            spotlightInteractable: true,
            nextLabel: 'Done',
            onBeforeNext: () => clicks > 0
        }
    ]

    let dismissible = $state(true)
    let withArrow = $state(true)

    const placements = ['top', 'right', 'bottom', 'left'] as const
    let placeApi = $state<TourController>()
    let placeSteps = $state<TourStep[]>([])

    function demoPlacement(placement: (typeof placements)[number]) {
        placeSteps = [
            {
                target: '#place-target',
                title: `Placement: ${placement}`,
                description: `The panel sits on the ${placement} of the target, arrow pointing back at it.`,
                placement
            }
        ]
        placeApi?.start()
    }

    // Sizes
    let sizeApi = $state<TourController>()
    let tourSize = $state<'sm' | 'md' | 'lg'>('md')
    const sizeSteps: TourStep[] = [
        {
            target: '#size-target',
            title: 'Panel size',
            description: 'The size prop controls the panel width (sm / md / lg).'
        }
    ]
    function demoSize(s: 'sm' | 'md' | 'lg') {
        tourSize = s
        sizeApi?.start()
    }

    // Spotlight tuning
    let spotApi = $state<TourController>()
    let spotPad = $state(8)
    let spotRad = $state(8)
    let noSpot = $state(false)
    const spotSteps = $derived<TourStep[]>([
        {
            target: '#spot-target',
            title: 'Spotlight controls',
            description: 'Adjust the sliders while the tour is open — the spotlight updates live.',
            spotlightPadding: spotPad,
            spotlightRadius: spotRad,
            disableSpotlight: noSpot
        }
    ])

    // Display & labels
    let dispApi = $state<TourController>()
    let showProg = $state(true)
    let showSkipBtn = $state(true)
    let useTransition = $state(true)
    const dispSteps: TourStep[] = [
        { target: '#disp-a', title: 'First', description: 'Custom labels and toggles.' },
        {
            target: '#disp-b',
            title: 'Second',
            description: 'Progress dots and skip can be hidden.'
        },
        { target: '#disp-c', title: 'Third', description: 'Transitions can be turned off.' }
    ]

    // Custom footer snippet
    let snipApi = $state<TourController>()
    const snipSteps: TourStep[] = [
        {
            target: '#snip-a',
            title: 'Custom footer',
            description: 'This panel uses a footer snippet.'
        },
        { target: '#snip-b', title: 'Full control', description: 'Render any controls you like.' }
    ]

    // Behavior: scroll, disabled skip, callbacks
    let advApi = $state<TourController>()
    let log = $state<string[]>([])
    const advSteps: TourStep[] = [
        {
            id: 'top',
            target: '#adv-top',
            title: 'Step one',
            description: 'Then we skip a disabled step.'
        },
        { id: 'skipped', target: '#adv-top', title: 'Never shown', disabled: true },
        {
            id: 'far',
            target: '#adv-bottom',
            title: 'Scrolled into view',
            description: 'The tour auto-scrolled to this far-away target.',
            onEnter: () => {
                log = [...log, 'onEnter: far']
            }
        }
    ]
    function runAdv() {
        log = []
        advApi?.start()
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Tour</h1>
        <p class="text-on-surface-variant">
            Guide users through your UI with a spotlight, a floating panel and step navigation.
            Drive it declaratively with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">bind:api</code
            >, or headlessly with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">useTour</code> hook
            for multi-page tours.
        </p>
    </div>

    <!-- Mock app chrome to anchor the tour against -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic tour</h2>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <div id="tour-logo" class="flex items-center gap-2 font-semibold">
                <Icon name="lucide:hexagon" />
                Acme
            </div>
            <input
                id="tour-search"
                class="min-w-40 flex-1 rounded-md bg-surface-container-lowest px-3 py-2 text-sm ring ring-surface-container-highest focus:outline-none"
                placeholder="Search…"
            />
            <Button id="tour-create" color="primary" leadingIcon="lucide:plus">Create</Button>
        </div>

        <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline" onclick={() => basicApi?.start()}>Start tour</Button>
            <Button variant="soft" href="/tour/multi" trailingIcon="lucide:arrow-right">
                Multi-page demo
            </Button>
            <label class="flex items-center gap-2 text-sm">
                <Switch bind:checked={dismissible} /> Dismissible
            </label>
            <label class="flex items-center gap-2 text-sm">
                <Switch bind:checked={withArrow} /> Arrow
            </label>
        </div>

        <Tour steps={basicSteps} bind:api={basicApi} {dismissible} arrow={withArrow} />
    </section>

    <!-- Guarded navigation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Guarded step</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onBeforeNext</code
            >
            blocks navigation until a condition is met.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <label id="tour-agree" class="flex items-center gap-2 text-sm">
                <Switch bind:checked={agreed} /> I accept the terms
            </label>
            <Button variant="outline" onclick={() => guardApi?.start()}>Start guarded tour</Button>
        </div>
        <Tour steps={guardSteps} bind:api={guardApi} />
    </section>

    <!-- Interactable spotlight -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Interactable spotlight</h2>
        <p class="text-sm text-on-surface-variant">
            With <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >spotlightInteractable</code
            >, users can click the highlighted target during the tour.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Button
                id="tour-like"
                variant="soft"
                color="error"
                leadingIcon="lucide:heart"
                onclick={() => clicks++}
            >
                Like
            </Button>
            <Badge color="surface">Clicks: {clicks}</Badge>
            <Button variant="outline" onclick={() => interactApi?.start()}>Start</Button>
        </div>
        <Tour steps={interactSteps} bind:api={interactApi} />
    </section>

    <!-- Placements -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Placements</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >placement</code
            > prop positions the panel and points the arrow back at the target.
        </p>
        <div class="flex flex-wrap gap-2">
            {#each placements as p (p)}
                <Button variant="soft" color="secondary" onclick={() => demoPlacement(p)}>
                    Placement: {p}
                </Button>
            {/each}
        </div>
        <div
            class="flex min-h-128 items-center justify-center rounded-lg bg-surface-container-high p-6"
        >
            <div
                id="place-target"
                class="flex size-24 items-center justify-center rounded-lg bg-primary text-on-primary"
            >
                <Icon name="lucide:crosshair" size="28" />
            </div>
        </div>
        <Tour steps={placeSteps} bind:api={placeApi} dismissible />
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> prop
            sets the panel width.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each ['sm', 'md', 'lg'] as const as s (s)}
                <Button variant="soft" color="secondary" onclick={() => demoSize(s)}>
                    {s.toUpperCase()}
                </Button>
            {/each}
            <div
                id="size-target"
                class="ml-auto flex size-12 items-center justify-center rounded-lg bg-primary text-on-primary"
            >
                <Icon name="lucide:scaling" />
            </div>
        </div>
        <Tour steps={sizeSteps} bind:api={sizeApi} size={tourSize} />
    </section>

    <!-- Spotlight customization -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Spotlight</h2>
        <p class="text-sm text-on-surface-variant">
            Tune <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >spotlightPadding</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >spotlightRadius</code
            >, or turn it off entirely — live while the tour is open.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap items-center gap-6">
                <div class="w-48 space-y-1">
                    <span class="text-xs text-on-surface-variant">Padding: {spotPad}px</span>
                    <Slider bind:value={spotPad} min={0} max={24} />
                </div>
                <div class="w-48 space-y-1">
                    <span class="text-xs text-on-surface-variant">Radius: {spotRad}px</span>
                    <Slider bind:value={spotRad} min={0} max={32} />
                </div>
                <label class="flex items-center gap-2 text-sm">
                    <Switch bind:checked={noSpot} /> Disable spotlight
                </label>
            </div>
            <div class="flex items-center gap-3">
                <Button
                    id="spot-target"
                    color="primary"
                    leadingIcon="lucide:image"
                    onclick={() => spotApi?.start()}
                >
                    Highlight me
                </Button>
            </div>
        </div>
        <Tour steps={spotSteps} bind:api={spotApi} dismissible />
    </section>

    <!-- Display & labels -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Display & labels</h2>
        <p class="text-sm text-on-surface-variant">
            Toggle <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >showProgress</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">showSkip</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >transition</code
            >, and use custom labels.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap items-center gap-4">
                <label class="flex items-center gap-2 text-sm">
                    <Switch bind:checked={showProg} /> Progress
                </label>
                <label class="flex items-center gap-2 text-sm">
                    <Switch bind:checked={showSkipBtn} /> Skip
                </label>
                <label class="flex items-center gap-2 text-sm">
                    <Switch bind:checked={useTransition} /> Transition
                </label>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <span id="disp-a" class="font-medium">Alpha</span>
                <span id="disp-b" class="font-medium">Beta</span>
                <span id="disp-c" class="font-medium">Gamma</span>
                <Button variant="outline" class="ml-auto" onclick={() => dispApi?.start()}>
                    Start
                </Button>
            </div>
        </div>
        <Tour
            steps={dispSteps}
            bind:api={dispApi}
            showProgress={showProg}
            showSkip={showSkipBtn}
            transition={useTransition}
            prevLabel="Previous"
            nextLabel="Continue"
            doneLabel="Finish"
            skipLabel="Dismiss"
        />
    </section>

    <!-- Custom footer snippet -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom footer snippet</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >footer</code
            >
            snippet receives the full step context and action handlers.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <span id="snip-a" class="font-medium">Anchor A</span>
            <span id="snip-b" class="font-medium">Anchor B</span>
            <Button variant="outline" class="ml-auto" onclick={() => snipApi?.start()}>Start</Button
            >
        </div>
        <Tour steps={snipSteps} bind:api={snipApi}>
            {#snippet footer({ number, total, isFirst, isLast, next, prev, stop })}
                <div class="flex items-center justify-between gap-3 p-4 pt-0">
                    <Badge color="primary" variant="soft">{number} / {total}</Badge>
                    <div class="flex items-center gap-2">
                        <Button size="sm" variant="ghost" color="surface" onclick={stop}>
                            Exit
                        </Button>
                        {#if !isFirst}
                            <Button size="sm" variant="soft" color="surface" onclick={prev}>
                                ←
                            </Button>
                        {/if}
                        <Button size="sm" color="primary" onclick={next}>
                            {isLast ? '🎉 Finish' : 'Onward →'}
                        </Button>
                    </div>
                </div>
            {/snippet}
        </Tour>
    </section>

    <!-- Behavior: scroll, disabled skip, callbacks -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Scroll, skip & callbacks</h2>
        <p class="text-sm text-on-surface-variant">
            A <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >disabled</code
            >
            step is skipped, a far target is scrolled into view, and lifecycle callbacks fire.
        </p>
        <div class="flex items-center gap-3">
            <Button color="primary" leadingIcon="lucide:play" onclick={runAdv}>Run</Button>
            {#if log.length}
                <code class="rounded bg-surface-container-highest px-2 py-1 text-xs">
                    {log.join(' · ')}
                </code>
            {/if}
        </div>
        <div class="rounded-lg bg-surface-container-high p-4">
            <span id="adv-top" class="font-medium">Start target (top)</span>
            <div class="my-2 flex h-64 items-center justify-center text-sm text-on-surface-variant">
                — scroll gap —
            </div>
            <span id="adv-bottom" class="font-medium">Far target (bottom)</span>
        </div>
        <Tour
            steps={advSteps}
            bind:api={advApi}
            onStepChange={(i, p) => (log = [...log, `step ${p}→${i}`])}
            onComplete={() => (log = [...log, 'complete'])}
            onSkip={(i) => (log = [...log, `skip@${i}`])}
        />
    </section>
</div>
