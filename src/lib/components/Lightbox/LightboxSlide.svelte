<script lang="ts">
    import type { LightboxSlide } from './lightbox.types.js'
    import Icon from '../Icon/Icon.svelte'

    interface Props {
        slide: LightboxSlide
        active: boolean
        eager: boolean
        transform: string
        zoomable: boolean
        slideClass: string
        imageClass: string
        mediaClass: string
        spinnerClass: string
        loadingIcon: string
    }

    let {
        slide,
        active,
        eager,
        transform,
        zoomable,
        slideClass,
        imageClass,
        mediaClass,
        spinnerClass,
        loadingIcon
    }: Props = $props()

    const type = $derived(slide.type ?? 'image')

    let loaded = $state(false)
    let errored = $state(false)

    function onLoad() {
        loaded = true
    }

    function onError() {
        errored = true
        loaded = true
    }
</script>

<div
    class={slideClass}
    role="group"
    aria-roledescription="slide"
    aria-hidden={!active}
    aria-label={slide.alt}
    data-lb-backdrop
>
    {#if type === 'image'}
        {#if !loaded}
            <Icon name={loadingIcon} class={[spinnerClass, 'animate-spin']} aria-hidden="true" />
        {/if}
        {#if errored}
            <div
                class="flex flex-col items-center gap-2 text-white/60"
                role="img"
                aria-label={slide.alt}
            >
                <Icon name="lucide:image-off" class="size-12" aria-hidden="true" />
                <span class="text-sm">{slide.alt}</span>
            </div>
        {:else}
            <img
                src={eager ? slide.src : undefined}
                srcset={eager ? slide.srcset : undefined}
                sizes={slide.sizes}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                draggable="false"
                decoding="async"
                loading={eager ? 'eager' : 'lazy'}
                data-zoomable={zoomable && active ? '' : undefined}
                class={imageClass}
                style={active ? transform : undefined}
                style:opacity={loaded ? undefined : 0}
                onload={onLoad}
                onerror={onError}
            />
        {/if}
    {:else if type === 'video'}
        <video
            src={eager ? slide.src : undefined}
            poster={slide.poster}
            controls
            playsinline
            class={mediaClass}
            {...slide.attrs}><track kind="captions" /></video
        >
    {:else}
        <iframe
            src={eager ? slide.src : undefined}
            title={slide.alt}
            class={[mediaClass, 'h-full w-full']}
            allowfullscreen
            {...slide.attrs}
        ></iframe>
    {/if}
</div>
