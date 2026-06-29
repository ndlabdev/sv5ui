<script lang="ts">
    import { Tour, Button, Icon, useTour, type TourStep } from '$lib/index.js'
    import { goto } from '$app/navigation'
    import { resolve } from '$app/paths'
    import { page } from '$app/state'

    let { children } = $props()

    const HOME = '/tour/multi'
    const SETTINGS = '/tour/multi/settings'
    const PROFILE = '/tour/multi/profile'

    const steps: TourStep[] = [
        {
            id: 'home',
            route: HOME,
            target: '#m-home-hero',
            title: 'Welcome aboard',
            description: 'This multi-page tour walks you across real routes.'
        },
        {
            id: 'go-settings',
            route: HOME,
            target: '#m-nav-settings',
            title: 'Navigate the app',
            description: 'Next takes you to the Settings page automatically.',
            placement: 'right'
        },
        {
            id: 'settings',
            route: SETTINGS,
            target: '#m-settings-toggle',
            title: 'On the Settings page',
            description: 'The tour navigated here and waited for this control to render.',
            waitForTarget: 3000
        },
        {
            id: 'profile',
            route: PROFILE,
            target: '#m-profile-card',
            title: 'And the Profile page',
            description: 'State survived two navigations — same controller throughout.',
            waitForTarget: 3000
        },
        {
            id: 'done',
            target: null,
            title: 'Tour complete',
            description: 'Reload mid-tour and it resumes — persist is on.',
            disableSpotlight: true
        }
    ]

    function navigateTo(route: string) {
        if (route === SETTINGS) goto(resolve(SETTINGS))
        else if (route === PROFILE) goto(resolve(PROFILE))
        else goto(resolve(HOME))
    }

    const tour = useTour({
        steps,
        persist: true,
        onStepChange: (i) => {
            const route = steps[i]?.route
            if (route && page.url.pathname !== route) navigateTo(route)
        }
    })

    const linkClass = (href: string) =>
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ' +
        (page.url.pathname === href
            ? 'bg-primary text-on-primary'
            : 'hover:bg-surface-container-highest')
</script>

<div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
            <h1 class="text-2xl font-bold">Multi-page tour</h1>
            <p class="text-sm text-on-surface-variant">
                One <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >useTour</code
                > controller in this layout drives steps across separate routes.
            </p>
        </div>
        <div class="flex items-center gap-2">
            <Button variant="outline" href={resolve('/tour')} leadingIcon="lucide:arrow-left">
                Single-page
            </Button>
            <Button color="primary" leadingIcon="lucide:route" onclick={() => tour.start()}>
                Start tour
            </Button>
        </div>
    </div>

    <div class="flex gap-4 rounded-lg bg-surface-container-high p-4">
        <nav class="flex w-40 shrink-0 flex-col gap-1">
            <a href={resolve(HOME)} class={linkClass(HOME)}>
                <Icon name="lucide:house" /> Home
            </a>
            <a id="m-nav-settings" href={resolve(SETTINGS)} class={linkClass(SETTINGS)}>
                <Icon name="lucide:settings" /> Settings
            </a>
            <a href={resolve(PROFILE)} class={linkClass(PROFILE)}>
                <Icon name="lucide:user" /> Profile
            </a>
        </nav>

        <div class="min-h-48 flex-1 rounded-md bg-surface-container-lowest p-6">
            {@render children?.()}
        </div>
    </div>
</div>

<Tour {steps} controller={tour} dismissible />
