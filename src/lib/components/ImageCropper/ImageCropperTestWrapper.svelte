<script lang="ts">
    import ImageCropper from './ImageCropper.svelte'
    import type { ImageCropperApi, ImageCropperProps } from './image-cropper.types.js'

    let { onReady, ...props }: ImageCropperProps & { onReady?: (api: ImageCropperApi) => void } =
        $props()

    let api = $state<ImageCropperApi>()

    $effect(() => {
        if (api) onReady?.(api)
    })
</script>

<ImageCropper bind:api {...props} />
