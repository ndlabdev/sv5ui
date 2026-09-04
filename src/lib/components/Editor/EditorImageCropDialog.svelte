<script lang="ts">
    import Modal from '../Modal/Modal.svelte'
    import Button from '../Button/Button.svelte'
    import ImageCropper from '../ImageCropper/ImageCropper.svelte'
    import type { ImageCropperApi } from '../ImageCropper/image-cropper.types.js'
    import type { EditorImageCropOptions } from './editor.types.js'

    interface Props {
        open: boolean
        file: File | null
        options?: EditorImageCropOptions
        onConfirm?: (file: File) => void
        onCancel?: () => void
    }

    let { open = $bindable(false), file, options, onConfirm, onCancel }: Props = $props()

    let api = $state<ImageCropperApi>()
    let busy = $state(false)
    let settled = false

    const sourceType = $derived(file?.type ?? '')
    const outputType = $derived(
        options?.output?.type ??
            (sourceType === 'image/jpeg' || sourceType === 'image/webp'
                ? (sourceType as 'image/jpeg' | 'image/webp')
                : 'image/png')
    )

    $effect(() => {
        if (open) {
            settled = false
            busy = false
        } else if (!settled) {
            settled = true
            onCancel?.()
        }
    })

    async function confirm(): Promise<void> {
        if (!api || busy) return

        busy = true
        const result = await api.crop()
        busy = false
        if (!result) return

        settled = true
        onConfirm?.(result.file)
        open = false
    }

    function cancel(): void {
        settled = true
        onCancel?.()
        open = false
    }
</script>

<Modal
    bind:open
    title={options?.title ?? 'Crop image'}
    description={options?.description ?? 'Drag to reposition, and drag a handle to resize.'}
    size="lg"
    dismissible={false}
>
    {#snippet body()}
        {#if file}
            <ImageCropper
                bind:api
                src={file}
                mode={options?.mode ?? 'box'}
                aspect={options?.aspect ?? 'free'}
                shape={options?.shape ?? 'rect'}
                grid
                output={{ ...options?.output, type: outputType }}
            />
        {/if}
    {/snippet}
    {#snippet footer()}
        <div class="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" label="Cancel" onclick={cancel} />
            <Button
                color="primary"
                size="sm"
                label={options?.confirmLabel ?? 'Insert'}
                loading={busy}
                onclick={confirm}
            />
        </div>
    {/snippet}
</Modal>
