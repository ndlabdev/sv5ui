<script lang="ts">
    import { ImageCropper, Button, Icon, Badge, FileUpload, Link, Switch } from '$lib/index.js'
    import type {
        ImageCropperApi,
        ImageCropperArea,
        ImageCropperError,
        ImageCropperResult
    } from '$lib/index.js'

    const features = [
        {
            icon: 'lucide:crop',
            label: 'Two modes',
            desc: 'Fixed frame with pan & zoom, or a draggable crop box.'
        },
        { icon: 'lucide:hand', label: 'Touch ready', desc: 'Drag, pinch to zoom, wheel to zoom.' },
        {
            icon: 'lucide:rotate-cw',
            label: 'Rotate & flip',
            desc: 'Toolbar actions mirrored in the export.'
        },
        {
            icon: 'lucide:circle',
            label: 'Any shape',
            desc: 'Square, free ratio, or a circular avatar.'
        },
        {
            icon: 'lucide:download',
            label: 'Canvas export',
            desc: 'Blob and File at the source resolution.'
        },
        {
            icon: 'lucide:keyboard',
            label: 'Keyboard',
            desc: 'Arrows move, +/- zoom, R rotates, 0 resets.'
        }
    ]

    const sampleImage = 'https://picsum.photos/seed/sv5ui-cropper/1600/1000'
    const portraitImage = 'https://picsum.photos/seed/sv5ui-cropper-portrait/900/1400'

    const ratios = [
        { label: '1:1', value: 1 },
        { label: '16:9', value: 16 / 9 },
        { label: '4:3', value: 4 / 3 },
        { label: 'Free', value: 'free' as const }
    ]

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    let previews = $state<Record<string, string>>({})
    let details = $state<Record<string, string>>({})

    function showResult(key: string, result: ImageCropperResult) {
        const previous = previews[key]
        if (previous) URL.revokeObjectURL(previous)

        previews = { ...previews, [key]: URL.createObjectURL(result.blob) }
        details = {
            ...details,
            [key]: `${result.width} × ${result.height} · ${(result.blob.size / 1024).toFixed(1)} KB · ${result.blob.type}`
        }
    }

    let basicApi = $state<ImageCropperApi>()
    let boxApi = $state<ImageCropperApi>()
    let avatarApi = $state<ImageCropperApi>()
    let outputApi = $state<ImageCropperApi>()
    let uploadApi = $state<ImageCropperApi>()
    let controlApi = $state<ImageCropperApi>()

    let aspect = $state<number | 'free'>(1)
    let uploadFiles = $state<File[]>([])
    let croppedValue = $state<File | null>(null)
    let lastError = $state<ImageCropperError | null>(null)
    let restoreArea = $state<ImageCropperArea>()
    let savedArea = $state<ImageCropperArea>()
    let rotatedArea = $state<ImageCropperArea>()

    const playgroundModes = ['fixed', 'box'] as const
    const playgroundShapes = ['rect', 'circle'] as const
    const playgroundWheel = ['always', 'ctrl', 'off'] as const

    let playMode = $state<'fixed' | 'box'>('fixed')
    let playShape = $state<'rect' | 'circle'>('rect')
    let playAspect = $state<number | 'free'>(1)
    let playWheel = $state<'always' | 'ctrl' | 'off'>('always')
    let playGrid = $state(true)
    let playRotationSlider = $state(false)
    let playAutoCrop = $state(false)
    let playDisabled = $state(false)
    let playApi = $state<ImageCropperApi>()
    let playArea = $state<ImageCropperArea>()
    let playZoom = $state(1)
    let playRotation = $state(0)
    let playGestures = $state(0)
    let playErrors = $state<string[]>([])

    const edgeCases = [
        {
            label: 'Panorama 1600×300, aspect 1:1',
            src: 'https://picsum.photos/seed/sv5ui-crop-pano/1600/300',
            props: { aspect: 1 }
        },
        {
            label: 'Tall 600×1600, aspect 16:9',
            src: 'https://picsum.photos/seed/sv5ui-crop-tall/600/1600',
            props: { aspect: 16 / 9 }
        },
        {
            label: 'Small 120×90 upscaled into the frame',
            src: 'https://picsum.photos/seed/sv5ui-crop-small/120/90',
            props: { aspect: 1 }
        },
        {
            label: 'Free ratio in box mode',
            src: 'https://picsum.photos/seed/sv5ui-crop-free/1200/800',
            props: { aspect: 'free' as const, mode: 'box' as const }
        }
    ]
    let controlZoom = $state(1)
    let controlRotation = $state(0)
    let liveArea = $state({ x: 0, y: 0, width: 0, height: 0 })

    const uploadedFile = $derived(uploadFiles[0] ?? null)
</script>

<div class="space-y-10">
    <header class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold">Image Cropper</h1>
            <Badge color="primary" variant="soft">Pan · Zoom · Export</Badge>
        </div>
        <p class="max-w-3xl text-on-surface-variant">
            Crop an image entirely in the browser and get back a
            <code class="rounded bg-surface-container px-1">Blob</code> and a
            <code class="rounded bg-surface-container px-1">File</code> ready for an upload. Pair it
            with <Link href="/file-upload">File Upload</Link> to let people pick a picture, or point
            <code class="rounded bg-surface-container px-1">src</code> at a URL. Cropping happens on a
            canvas, so a remote image must be served with CORS headers.
        </p>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each features as feature (feature.label)}
                <div
                    class="flex items-start gap-3 rounded-lg border border-outline-variant/60 bg-surface-container p-3"
                >
                    <Icon name={feature.icon} class="mt-0.5 size-5 shrink-0 text-primary" />
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-on-surface">{feature.label}</p>
                        <p class="text-xs text-on-surface-variant">{feature.desc}</p>
                    </div>
                </div>
            {/each}
        </div>
    </header>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Basic</h2>
            <p class="text-xs text-on-surface-variant">mode="fixed" · drag to pan, wheel to zoom</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-[2fr_1fr]"
        >
            <ImageCropper
                bind:api={basicApi}
                src={sampleImage}
                grid
                onCrop={(result) => showResult('basic', result)}
                onAreaChange={(area) => (liveArea = area)}
            />
            <div class="space-y-3">
                <Button
                    label="Crop"
                    leadingIcon="lucide:crop"
                    class="w-full"
                    onclick={() => basicApi?.crop()}
                />
                <p class="text-xs text-on-surface-variant">
                    Source area: {Math.round(liveArea.width)} × {Math.round(liveArea.height)} px
                </p>
                {#if previews.basic}
                    <img
                        src={previews.basic}
                        alt="Cropped result"
                        class="w-full rounded-lg border border-outline-variant"
                    />
                    <p class="text-xs text-on-surface-variant">{details.basic}</p>
                {:else}
                    <p class="text-xs text-on-surface-variant">
                        The result preview appears here after cropping.
                    </p>
                {/if}
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Crop box</h2>
            <p class="text-xs text-on-surface-variant">
                mode="box" · drag the frame, resize the handles, drag outside to pan
            </p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-[2fr_1fr]"
        >
            <ImageCropper
                bind:api={boxApi}
                src={sampleImage}
                mode="box"
                aspect="free"
                size="lg"
                onCrop={(result) => showResult('box', result)}
            />
            <div class="space-y-3">
                <Button
                    label="Crop"
                    leadingIcon="lucide:crop"
                    class="w-full"
                    onclick={() => boxApi?.crop()}
                />
                {#if previews.box}
                    <img
                        src={previews.box}
                        alt="Cropped result"
                        class="w-full rounded-lg border border-outline-variant"
                    />
                    <p class="text-xs text-on-surface-variant">{details.box}</p>
                {/if}
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Aspect ratio</h2>
            <p class="text-xs text-on-surface-variant">aspect</p>
        </div>
        <div class="space-y-3 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <div class="flex flex-wrap gap-2">
                {#each ratios as ratio (ratio.label)}
                    <Button
                        size="sm"
                        variant={aspect === ratio.value ? 'solid' : 'outline'}
                        label={ratio.label}
                        onclick={() => (aspect = ratio.value)}
                    />
                {/each}
            </div>
            <ImageCropper src={portraitImage} {aspect} mode="box" grid />
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Circular avatar</h2>
            <p class="text-xs text-on-surface-variant">shape="circle" · transparent PNG</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-[2fr_1fr]"
        >
            <ImageCropper
                bind:api={avatarApi}
                src={portraitImage}
                shape="circle"
                size="sm"
                output={{ maxWidth: 256, maxHeight: 256 }}
                onCrop={(result) => showResult('avatar', result)}
            />
            <div class="space-y-3">
                <Button
                    label="Crop avatar"
                    leadingIcon="lucide:user-round"
                    class="w-full"
                    onclick={() => avatarApi?.crop()}
                />
                {#if previews.avatar}
                    <img
                        src={previews.avatar}
                        alt="Cropped avatar"
                        class="size-32 rounded-full border border-outline-variant object-cover"
                    />
                    <p class="text-xs text-on-surface-variant">{details.avatar}</p>
                {/if}
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">With File Upload</h2>
            <p class="text-xs text-on-surface-variant">src accepts a File or Blob</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-2"
        >
            <FileUpload
                bind:value={uploadFiles}
                accept="image/*"
                label="Drop an image here or click to upload"
                description="The picked file is cropped locally, nothing is uploaded."
            />
            <div class="space-y-3">
                <ImageCropper
                    bind:api={uploadApi}
                    bind:value={croppedValue}
                    src={uploadedFile}
                    aspect={16 / 9}
                    onCrop={(result) => showResult('upload', result)}
                    onError={(error) => (lastError = error)}
                />
                <div class="flex flex-wrap items-center gap-2">
                    <Button
                        label="Crop"
                        leadingIcon="lucide:crop"
                        disabled={!uploadedFile}
                        onclick={() => uploadApi?.crop()}
                    />
                    {#if croppedValue}
                        <span class="text-xs text-on-surface-variant">
                            bind:value → {croppedValue.name} ({(croppedValue.size / 1024).toFixed(
                                1
                            )} KB)
                        </span>
                    {/if}
                </div>
                {#if previews.upload}
                    <img
                        src={previews.upload}
                        alt="Cropped upload"
                        class="w-full rounded-lg border border-outline-variant"
                    />
                {/if}
                {#if lastError}
                    <p class="text-xs text-error">{lastError.code}: {lastError.message}</p>
                {/if}
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Output options</h2>
            <p class="text-xs text-on-surface-variant">output.type · quality · maxWidth</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-[2fr_1fr]"
        >
            <ImageCropper
                bind:api={outputApi}
                src={sampleImage}
                aspect={4 / 3}
                output={{ type: 'image/jpeg', quality: 0.7, maxWidth: 640 }}
                onCrop={(result) => showResult('output', result)}
            />
            <div class="space-y-3">
                <Button
                    label="Export JPEG"
                    leadingIcon="lucide:file-image"
                    class="w-full"
                    onclick={() => outputApi?.crop()}
                />
                <p class="text-xs text-on-surface-variant">
                    Capped at 640px wide, encoded as JPEG at quality 0.7.
                </p>
                {#if previews.output}
                    <img
                        src={previews.output}
                        alt="Cropped result"
                        class="w-full rounded-lg border border-outline-variant"
                    />
                    <p class="text-xs text-on-surface-variant">{details.output}</p>
                {/if}
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Free rotation</h2>
            <p class="text-xs text-on-surface-variant">rotationSlider · double click to zoom</p>
        </div>
        <div class="space-y-3 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <ImageCropper
                src={sampleImage}
                rotationSlider
                grid
                toolbar={['rotateLeft', 'rotateRight', 'reset']}
                onCropEnd={(area) => (rotatedArea = area)}
            />
            <p class="text-xs text-on-surface-variant">
                The slider straightens the image between -180° and 180°, and a double click zooms in
                or back out. Free angles stay exact in <code
                    class="rounded bg-surface-container-high px-1">fixed</code
                >
                mode; in <code class="rounded bg-surface-container-high px-1">box</code> mode prefer
                quarter turns.
                {#if rotatedArea}
                    Last gesture ended on {Math.round(rotatedArea.width)} × {Math.round(
                        rotatedArea.height
                    )} px.
                {/if}
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Live crop</h2>
            <p class="text-xs text-on-surface-variant">autoCrop={'{300}'} · no button needed</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-[2fr_1fr]"
        >
            <ImageCropper
                src={sampleImage}
                autoCrop={300}
                size="sm"
                onCrop={(result) => showResult('live', result)}
            />
            <div class="space-y-3">
                <p class="text-xs text-on-surface-variant">
                    Every pan, zoom or rotation re-crops after a 300ms pause. The preview below is
                    driven purely by <code class="rounded bg-surface-container-high px-1"
                        >onCrop</code
                    >.
                </p>
                {#if previews.live}
                    <img
                        src={previews.live}
                        alt="Live cropped result"
                        class="w-full rounded-lg border border-outline-variant"
                    />
                    <p class="text-xs text-on-surface-variant">{details.live}</p>
                {/if}
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Save and restore a crop</h2>
            <p class="text-xs text-on-surface-variant">bind:area</p>
        </div>
        <div class="space-y-3 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <div class="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    label="Save this crop"
                    leadingIcon="lucide:bookmark"
                    disabled={!restoreArea}
                    onclick={() => (savedArea = restoreArea)}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label="Restore"
                    leadingIcon="lucide:undo-2"
                    disabled={!savedArea}
                    onclick={() => (restoreArea = savedArea)}
                />
                {#if savedArea}
                    <span class="text-xs text-on-surface-variant">
                        saved: {Math.round(savedArea.x)}, {Math.round(savedArea.y)} · {Math.round(
                            savedArea.width
                        )} × {Math.round(savedArea.height)} px
                    </span>
                {/if}
            </div>
            <ImageCropper bind:area={restoreArea} src={sampleImage} size="sm" grid />
            <p class="text-xs text-on-surface-variant">
                The area is reported in source pixels, so it can be stored next to the original
                image and assigned back later to reopen the exact same crop.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Wheel behaviour</h2>
            <p class="text-xs text-on-surface-variant">wheelZoom="ctrl"</p>
        </div>
        <div class="space-y-3 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <p class="text-xs text-on-surface-variant">
                By default the wheel zooms and page scrolling is suppressed over the stage. Inside a
                long page, <code class="rounded bg-surface-container-high px-1"
                    >wheelZoom="ctrl"</code
                >
                keeps the page scrolling and only zooms while Ctrl or Cmd is held;
                <code class="rounded bg-surface-container-high px-1">{'wheelZoom={false}'}</code> turns
                wheel zooming off entirely.
            </p>
            <ImageCropper src={sampleImage} wheelZoom="ctrl" size="sm" />
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Imperative API</h2>
            <p class="text-xs text-on-surface-variant">bind:api · bind:zoom · bind:rotation</p>
        </div>
        <div class="space-y-3 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <div class="flex flex-wrap gap-2">
                <Button size="sm" label="Zoom in" onclick={() => controlApi?.zoomIn()} />
                <Button size="sm" label="Zoom out" onclick={() => controlApi?.zoomOut()} />
                <Button size="sm" label="Rotate 90°" onclick={() => controlApi?.rotate(90)} />
                <Button size="sm" label="Flip" onclick={() => controlApi?.flip('horizontal')} />
                <Button
                    size="sm"
                    variant="outline"
                    label="Reset"
                    onclick={() => controlApi?.reset()}
                />
            </div>
            <ImageCropper
                bind:api={controlApi}
                bind:zoom={controlZoom}
                bind:rotation={controlRotation}
                src={sampleImage}
                toolbar={false}
            />
            <p class="text-xs text-on-surface-variant">
                zoom: {controlZoom.toFixed(2)} · rotation: {controlRotation}°
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Localised labels</h2>
            <p class="text-xs text-on-surface-variant">labels · icons · ui</p>
        </div>
        <div class="space-y-3 rounded-xl border border-outline-variant/60 bg-surface-container p-4">
            <ImageCropper
                src={sampleImage}
                size="sm"
                mode="box"
                aspect="free"
                label="Trình cắt ảnh"
                labels={{
                    zoomIn: 'Phóng to',
                    zoomOut: 'Thu nhỏ',
                    rotateLeft: 'Xoay trái',
                    rotateRight: 'Xoay phải',
                    flipHorizontal: 'Lật ngang',
                    flipVertical: 'Lật dọc',
                    reset: 'Đặt lại',
                    zoom: 'Thu phóng',
                    empty: 'Chưa chọn ảnh',
                    loading: 'Đang tải ảnh',
                    error: 'Không tải được ảnh',
                    hint: 'Dùng phím mũi tên để di chuyển, +/- để thu phóng, R để xoay.',
                    handles: { se: 'Kéo góc dưới phải' }
                }}
                ui={{
                    frame: 'outline-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]',
                    handle: 'bg-primary ring-white/70',
                    stage: 'rounded-2xl'
                }}
            />
            <p class="text-xs text-on-surface-variant">
                Every string comes from <code class="rounded bg-surface-container-high px-1"
                    >labels</code
                >, every icon from
                <code class="rounded bg-surface-container-high px-1">icons</code>, and each of the
                16 parts can be restyled through
                <code class="rounded bg-surface-container-high px-1">ui</code> — here the frame, the handles
                and the stage radius.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Playground</h2>
            <p class="text-xs text-on-surface-variant">every prop on one stage</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-[2fr_1fr]"
        >
            <div class="space-y-3">
                <div class="flex flex-wrap gap-3">
                    <div class="flex flex-wrap gap-1">
                        {#each playgroundModes as value (value)}
                            <Button
                                size="xs"
                                variant={playMode === value ? 'solid' : 'outline'}
                                label={value}
                                onclick={() => (playMode = value)}
                            />
                        {/each}
                    </div>
                    <div class="flex flex-wrap gap-1">
                        {#each playgroundShapes as value (value)}
                            <Button
                                size="xs"
                                variant={playShape === value ? 'solid' : 'outline'}
                                label={value}
                                onclick={() => (playShape = value)}
                            />
                        {/each}
                    </div>
                    <div class="flex flex-wrap gap-1">
                        {#each ratios as ratio (ratio.label)}
                            <Button
                                size="xs"
                                variant={playAspect === ratio.value ? 'solid' : 'outline'}
                                label={ratio.label}
                                onclick={() => (playAspect = ratio.value)}
                            />
                        {/each}
                    </div>
                    <div class="flex flex-wrap gap-1">
                        {#each playgroundWheel as value (value)}
                            <Button
                                size="xs"
                                variant={playWheel === value ? 'solid' : 'outline'}
                                label="wheel: {value}"
                                onclick={() => (playWheel = value)}
                            />
                        {/each}
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                    <Switch size="sm" label="grid" bind:checked={playGrid} />
                    <Switch size="sm" label="rotationSlider" bind:checked={playRotationSlider} />
                    <Switch size="sm" label="autoCrop" bind:checked={playAutoCrop} />
                    <Switch size="sm" label="disabled" bind:checked={playDisabled} />
                </div>

                <ImageCropper
                    bind:api={playApi}
                    bind:area={playArea}
                    bind:zoom={playZoom}
                    bind:rotation={playRotation}
                    src={sampleImage}
                    mode={playMode}
                    shape={playShape}
                    aspect={playAspect}
                    grid={playGrid}
                    rotationSlider={playRotationSlider}
                    autoCrop={playAutoCrop ? 400 : false}
                    wheelZoom={playWheel === 'off' ? false : playWheel}
                    disabled={playDisabled}
                    onCropEnd={() => (playGestures += 1)}
                    onCrop={(result) => showResult('play', result)}
                    onError={(error) => (playErrors = [...playErrors, error.code])}
                />
            </div>

            <div class="space-y-3">
                <Button
                    label="Crop"
                    leadingIcon="lucide:crop"
                    class="w-full"
                    onclick={() => playApi?.crop()}
                />
                <dl class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-on-surface-variant">
                    <dt>zoom</dt>
                    <dd class="text-on-surface">{playZoom.toFixed(2)}</dd>
                    <dt>rotation</dt>
                    <dd class="text-on-surface">{playRotation}°</dd>
                    <dt>area</dt>
                    <dd class="text-on-surface">
                        {playArea
                            ? `${Math.round(playArea.x)}, ${Math.round(playArea.y)} · ${Math.round(playArea.width)}×${Math.round(playArea.height)}`
                            : '—'}
                    </dd>
                    <dt>gestures</dt>
                    <dd class="text-on-surface">{playGestures}</dd>
                    <dt>errors</dt>
                    <dd class="text-on-surface">{playErrors.join(', ') || 'none'}</dd>
                </dl>
                {#if previews.play}
                    <img
                        src={previews.play}
                        alt="Playground result"
                        class="w-full rounded-lg border border-outline-variant"
                    />
                    <p class="text-xs text-on-surface-variant">{details.play}</p>
                {/if}
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Edge cases</h2>
            <p class="text-xs text-on-surface-variant">extreme ratios and tiny sources</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-2"
        >
            {#each edgeCases as demo (demo.label)}
                <div class="space-y-2">
                    <p class="text-xs font-medium text-on-surface-variant">{demo.label}</p>
                    <ImageCropper src={demo.src} size="sm" {...demo.props} />
                </div>
            {/each}
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Sizes</h2>
            <p class="text-xs text-on-surface-variant">size</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-2"
        >
            {#each sizes as size (size)}
                <div class="space-y-2">
                    <p class="text-xs font-medium text-on-surface-variant">size="{size}"</p>
                    <ImageCropper
                        src={sampleImage}
                        {size}
                        toolbar={['zoomOut', 'zoomIn', 'reset']}
                    />
                </div>
            {/each}
        </div>
    </section>
</div>
