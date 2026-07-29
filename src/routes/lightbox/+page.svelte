<script lang="ts">
    import { Lightbox, Button, Icon, Badge, Link } from '$lib/index.js'
    import type { LightboxApi, LightboxSlide } from '$lib/index.js'

    const features = [
        { icon: 'lucide:zoom-in', label: 'Zoom & pan', desc: 'Wheel, double-tap, pinch, drag.' },
        { icon: 'lucide:hand', label: 'Touch gestures', desc: 'Swipe to navigate, pinch to zoom.' },
        { icon: 'lucide:images', label: 'Thumbnails', desc: 'Filmstrip with active sync.' },
        { icon: 'lucide:play', label: 'Slideshow', desc: 'Autoplay with configurable delay.' },
        { icon: 'lucide:expand', label: 'Fullscreen', desc: 'Native Fullscreen API + rotate.' },
        { icon: 'lucide:search', label: 'SEO ready', desc: 'Real gallery <img> in the flow.' }
    ]

    const titles = [
        'Sunset Ridge',
        'Quiet Harbor',
        'Open Road',
        'City Lights',
        'Misty Pines',
        'Coastal Drift',
        'Golden Fields',
        'Riverside Bend'
    ]

    const photos: LightboxSlide[] = titles.map((title, i) => ({
        src: `https://picsum.photos/seed/sv5ui-lb-${i}/1600/1000`,
        thumb: `https://picsum.photos/seed/sv5ui-lb-${i}/400/250`,
        alt: title,
        title,
        description: `Photo ${i + 1} of ${titles.length} — captured on assignment.`,
        width: 1600,
        height: 1000
    }))

    const mixed: LightboxSlide[] = [
        {
            src: 'https://picsum.photos/seed/sv5ui-lb-mix1/1600/1000',
            thumb: 'https://picsum.photos/seed/sv5ui-lb-mix1/400/250',
            alt: 'Landscape photo',
            title: 'A still image',
            width: 1600,
            height: 1000
        },
        {
            type: 'video',
            src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            poster: 'https://picsum.photos/seed/sv5ui-lb-poster/1600/1000',
            alt: 'Sample video',
            title: 'A native <video> slide'
        },
        {
            type: 'iframe',
            src: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
            alt: 'Embedded YouTube video',
            title: 'An <iframe> embed',
            attrs: { allow: 'accelerometer; autoplay; encrypted-media; picture-in-picture' }
        }
    ]

    const hero: LightboxSlide[] = [
        {
            src: 'https://picsum.photos/seed/sv5ui-lb-hero/2000/1200',
            alt: 'Hero landscape',
            title: 'Programmatic control',
            description: 'Opened via the imperative API.',
            width: 2000,
            height: 1200
        },
        {
            src: 'https://picsum.photos/seed/sv5ui-lb-hero2/2000/1200',
            alt: 'Second hero landscape',
            title: 'Second frame',
            width: 2000,
            height: 1200
        }
    ]

    let api = $state<LightboxApi>()
    let controlledOpen = $state(false)
    let controlledIndex = $state(0)
</script>

<div class="space-y-10">
    <header class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold">Lightbox</h1>
            <Badge color="primary" variant="soft">Zoom · Pan · Slideshow</Badge>
        </div>
        <p class="max-w-3xl text-on-surface-variant">
            A full-screen media viewer built on top of the accessible
            <Link href="/modal">Dialog</Link> primitive. Zoom and pan images, swipe between slides, play
            a slideshow, go fullscreen, and mix images with video or iframe embeds — all driven by a single
            <code class="rounded bg-surface-container px-1">slides</code> array. The in-page gallery
            renders real
            <code class="rounded bg-surface-container px-1">&lt;img&gt;</code> elements so it stays crawlable
            and SEO-friendly.
        </p>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each features as f (f.label)}
                <div
                    class="flex items-start gap-3 rounded-lg border border-outline-variant/60 bg-surface-container p-3"
                >
                    <Icon name={f.icon} class="mt-0.5 size-5 shrink-0 text-primary" />
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-on-surface">{f.label}</p>
                        <p class="text-xs text-on-surface-variant">{f.desc}</p>
                    </div>
                </div>
            {/each}
        </div>
    </header>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Basic gallery</h2>
            <p class="text-xs text-on-surface-variant">slides + default grid</p>
        </div>
        <div class="rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <Lightbox slides={photos} />
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Slideshow + no loop</h2>
            <p class="text-xs text-on-surface-variant">slideshow, loop=false</p>
        </div>
        <div class="rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <Lightbox slides={photos} loop={false} slideshow={{ delay: 2500, playOnOpen: true }} />
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Mixed media</h2>
            <p class="text-xs text-on-surface-variant">image · video · iframe</p>
        </div>
        <div class="rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <Lightbox slides={mixed} />
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Custom trigger + imperative API</h2>
            <p class="text-xs text-on-surface-variant">trigger snippet, bind:api</p>
        </div>
        <div class="space-y-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <Lightbox slides={hero} bind:api>
                {#snippet trigger({ slides, open })}
                    <button
                        type="button"
                        class="group relative block w-full overflow-hidden rounded-xl ring-1 ring-outline-variant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        onclick={() => open(0)}
                    >
                        <img
                            src={slides[0].src}
                            alt={slides[0].alt}
                            width={slides[0].width}
                            height={slides[0].height}
                            loading="lazy"
                            class="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <span
                            class="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 transition group-hover:opacity-100"
                        >
                            <Icon name="lucide:zoom-in" class="size-10" />
                        </span>
                    </button>
                {/snippet}
            </Lightbox>
            <div class="flex flex-wrap items-center gap-2">
                <Button leadingIcon="lucide:image" onclick={() => api?.open(0)}>Open viewer</Button>
                <Button
                    variant="outline"
                    leadingIcon="lucide:layers"
                    onclick={() => api?.open(hero.length - 1)}>Open at last frame</Button
                >
            </div>
            <p class="text-xs text-on-surface-variant">
                <code class="rounded bg-surface-container-high px-1">api.open(i)</code> launches the
                viewer programmatically. Methods like
                <code class="rounded bg-surface-container-high px-1">next()</code>,
                <code class="rounded bg-surface-container-high px-1">rotate()</code>
                and
                <code class="rounded bg-surface-container-high px-1">zoomIn()</code> act on the viewer
                while it is open, so use the on-screen controls once it appears.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Controlled state</h2>
            <p class="text-xs text-on-surface-variant">bind:open, bind:index</p>
        </div>
        <div class="space-y-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <div class="flex flex-wrap items-center gap-2">
                <Button onclick={() => (controlledOpen = true)}
                    >Open at slide {controlledIndex + 1}</Button
                >
                <Button
                    variant="soft"
                    onclick={() => (controlledIndex = (controlledIndex + 1) % photos.length)}
                    >Cycle start index</Button
                >
                <span class="text-sm text-on-surface-variant">
                    open: <code class="rounded bg-surface-container-high px-1"
                        >{String(controlledOpen)}</code
                    >
                    · index:
                    <code class="rounded bg-surface-container-high px-1">{controlledIndex}</code>
                </span>
            </div>
            <Lightbox
                slides={photos}
                bind:open={controlledOpen}
                bind:index={controlledIndex}
                thumbnails={false}
            >
                {#snippet trigger()}{/snippet}
            </Lightbox>
        </div>
    </section>
</div>
