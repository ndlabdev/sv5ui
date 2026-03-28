<script lang="ts" module>
    import type { FileUploadProps } from './file-upload.types.js'

    export type Props = FileUploadProps
</script>

<script lang="ts">
    import { useId } from 'bits-ui'
    import { untrack } from 'svelte'
    import { fileUploadVariants, fileUploadDefaults } from './file-upload.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Button from '../Button/Button.svelte'
    import Modal from '../Modal/Modal.svelte'

    const config = getComponentConfig('fileUpload', fileUploadDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable([]),
        onValueChange,
        multiple = false,
        accept,
        dropzone = true,
        interactive = true,
        label = 'Drop files here or click to upload',
        description,
        icon = icons.upload,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        variant = config.defaultVariants.variant,
        layout = config.defaultVariants.layout,
        disabled = false,
        loading = false,
        loadingIcon = icons.loading,
        preview = true,
        highlight = false,
        required = false,
        fileIcon = icons.file,
        imagePreview = true,
        name,
        leadingSlot,
        labelSlot,
        descriptionSlot,
        actionsSlot,
        filesSlot,
        fileSlot,
        children,
        class: className,
        ui,
        ...restProps
    }: Props = $props()

    const autoId = useId()

    let inputRef = $state<HTMLInputElement | null>(null)
    let dragCounter = $state(0)
    let previewOpen = $state(false)
    let previewFile = $state<File | null>(null)

    // Stable file identity key with separator to avoid collisions
    const fileKey = (f: File) => `${f.name}:${f.size}:${f.lastModified}`

    // Plain Map intentionally — urlCache is an internal optimization cache, not reactive UI
    // state. SvelteMap mutations would cascade re-renders every time a URL is cached/evicted.
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const urlCache = new Map<string, string>()

    const isDisabled = $derived(disabled || loading)
    const isDragging = $derived(dragCounter > 0)
    const showFilesInside = $derived(
        layout === 'grid' && !multiple && value.length > 0 && preview && variant === 'area'
    )

    // Pass booleans directly so compound variants with `false` values match correctly
    const slots = $derived(
        fileUploadVariants({
            color,
            size,
            variant,
            layout,
            dropzone,
            interactive: interactive && !isDisabled,
            highlight,
            multiple,
            disabled: isDisabled
        })
    )

    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: slots.root({ class: [config.slots.root, className, u.root] }),
            base: slots.base({ class: [config.slots.base, u.base] }),
            wrapper: slots.wrapper({ class: [config.slots.wrapper, u.wrapper] }),
            icon: slots.icon({ class: [config.slots.icon, u.icon] }),
            label: slots.label({ class: [config.slots.label, u.label] }),
            description: slots.description({ class: [config.slots.description, u.description] }),
            actions: slots.actions({ class: [config.slots.actions, u.actions] }),
            files: slots.files({ class: [config.slots.files, u.files] }),
            file: slots.file({ class: [config.slots.file, u.file] }),
            fileLeading: slots.fileLeading({ class: [config.slots.fileLeading, u.fileLeading] }),
            fileWrapper: slots.fileWrapper({ class: [config.slots.fileWrapper, u.fileWrapper] }),
            fileName: slots.fileName({ class: [config.slots.fileName, u.fileName] }),
            fileSize: slots.fileSize({ class: [config.slots.fileSize, u.fileSize] }),
            fileTrailing: slots.fileTrailing({
                class: [config.slots.fileTrailing, u.fileTrailing]
            }),
            previewContent: slots.previewContent({
                class: [config.slots.previewContent, u.previewContent]
            }),
            previewBody: slots.previewBody({ class: [config.slots.previewBody, u.previewBody] })
        }
    })

    // Revoke blob URLs for files no longer in value (handles external bind:value resets)
    $effect(() => {
        const current = new Set(value.map(fileKey))
        // Close preview if its file was removed externally — untrack to avoid subscribing to previewFile
        const pf = untrack(() => previewFile)
        if (pf && !current.has(fileKey(pf))) {
            previewOpen = false
            previewFile = null
        }
        for (const [key, url] of urlCache) {
            if (!current.has(key)) {
                URL.revokeObjectURL(url)
                urlCache.delete(key)
            }
        }
    })

    export function open() {
        if (isDisabled) return
        inputRef?.click()
    }

    function isFileAccepted(file: File): boolean {
        if (!accept) return true
        return accept
            .split(',')
            .map((s) => s.trim())
            .some((token) => {
                if (!token || token === '*') return true
                if (token.startsWith('.'))
                    return file.name.toLowerCase().endsWith(token.toLowerCase())
                if (token.endsWith('/*')) return file.type.startsWith(token.slice(0, -1))
                return file.type === token
            })
    }

    function addFiles(newFiles: File[]) {
        if (isDisabled) return
        const filtered = accept ? newFiles.filter(isFileAccepted) : newFiles
        if (!filtered.length) return
        if (!multiple) {
            value = [filtered[0]]
        } else {
            const existing = new Set(value.map(fileKey))
            value = [...value, ...filtered.filter((f) => !existing.has(fileKey(f)))]
        }
        onValueChange?.(value)
    }

    function removeFile(index: number) {
        const removed = value[index]
        const key = fileKey(removed)
        if (previewFile && fileKey(previewFile) === key) {
            previewOpen = false
            previewFile = null
        }
        if (urlCache.has(key)) {
            URL.revokeObjectURL(urlCache.get(key)!)
            urlCache.delete(key)
        }
        value = value.filter((_, i) => i !== index)
        onValueChange?.(value)
    }

    export function clearAll() {
        previewOpen = false
        previewFile = null
        for (const [, url] of urlCache) URL.revokeObjectURL(url)
        urlCache.clear()
        value = []
        onValueChange?.(value)
    }

    function handleInputChange(e: Event) {
        const input = e.target as HTMLInputElement
        if (input.files?.length) {
            addFiles(Array.from(input.files))
            input.value = ''
        }
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault()
        dragCounter = 0
        if (!dropzone || isDisabled) return
        const files = e.dataTransfer?.files
        if (files?.length) addFiles(Array.from(files))
    }

    function handleDragEnter(e: DragEvent) {
        e.preventDefault()
        if (dropzone && !isDisabled) dragCounter++
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault()
    }

    function handleDragLeave() {
        dragCounter = Math.max(0, dragCounter - 1)
    }

    function handleAreaClick() {
        if (interactive && !isDisabled) open()
    }

    function handleKeydown(e: KeyboardEvent) {
        if (!interactive) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            open()
        }
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
    }

    function isImageFile(file: File): boolean {
        return file.type.startsWith('image/')
    }

    function openPreview(file: File) {
        previewFile = file
        previewOpen = true
    }

    function getObjectUrl(file: File): string {
        const key = fileKey(file)
        if (!urlCache.has(key)) {
            urlCache.set(key, URL.createObjectURL(file))
        }
        return urlCache.get(key)!
    }
</script>

<div {...restProps} bind:this={ref} class={classes.root}>
    <!-- Hidden file input — uses auto-generated id internally -->
    <input
        bind:this={inputRef}
        type="file"
        id={autoId}
        {name}
        {accept}
        {multiple}
        {required}
        disabled={isDisabled}
        onchange={handleInputChange}
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
    />

    {#if variant === 'area'}
        <!-- Area / Dropzone -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
            class={classes.base}
            data-dragging={isDragging || undefined}
            role={interactive ? 'button' : undefined}
            tabindex={interactive && !isDisabled ? 0 : undefined}
            aria-disabled={isDisabled || undefined}
            aria-label={interactive ? label : undefined}
            onclick={handleAreaClick}
            ondragenter={handleDragEnter}
            ondragover={handleDragOver}
            ondragleave={handleDragLeave}
            ondrop={handleDrop}
            onkeydown={handleKeydown}
        >
            {#if showFilesInside}
                <!-- Grid single: file fills the area as overlay -->
                {#each value as file, i (fileKey(file))}
                    <div class={classes.file} role="none" onclick={(e) => e.stopPropagation()}>
                        {#if isImageFile(file)}
                            {#if imagePreview}
                                <button
                                    class="group relative size-full cursor-zoom-in overflow-hidden rounded-[7px]"
                                    onclick={() => openPreview(file)}
                                    aria-label="Preview {file.name}"
                                >
                                    <img
                                        src={getObjectUrl(file)}
                                        alt={file.name}
                                        class="size-full object-cover transition-[filter] duration-200 group-hover:brightness-75"
                                    />
                                    <div
                                        class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                    >
                                        <Icon
                                            name={icons.zoomIn}
                                            class="size-6 text-white drop-shadow-md"
                                        />
                                    </div>
                                </button>
                            {:else}
                                <div class="size-full overflow-hidden rounded-[7px]">
                                    <img
                                        src={getObjectUrl(file)}
                                        alt={file.name}
                                        class="size-full object-cover"
                                    />
                                </div>
                            {/if}
                        {:else}
                            <div
                                class="flex size-full flex-col items-center justify-center gap-1 p-4 text-on-surface-variant"
                            >
                                <Icon name={fileIcon} class="size-10 shrink-0" />
                                <span class="w-full truncate text-center text-xs">{file.name}</span>
                            </div>
                        {/if}
                        <div
                            class={classes.fileTrailing}
                            role="none"
                            onclick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="solid"
                                color="error"
                                size="xs"
                                icon={icons.close}
                                square
                                ui={{
                                    base: 'size-5 rounded-full border-2 border-surface p-0 shadow-sm'
                                }}
                                onclick={() => removeFile(i)}
                                aria-label="Remove {file.name}"
                            />
                        </div>
                    </div>
                {/each}
            {:else}
                <!-- Normal area content -->
                <div class={classes.wrapper}>
                    {#if leadingSlot}
                        {@render leadingSlot()}
                    {:else}
                        <Icon name={loading ? loadingIcon : icon} class={classes.icon} />
                    {/if}

                    {#if labelSlot}
                        {@render labelSlot()}
                    {:else if label}
                        <p class={classes.label}>{label}</p>
                    {/if}

                    {#if descriptionSlot}
                        {@render descriptionSlot()}
                    {:else if description}
                        <p class={classes.description}>{description}</p>
                    {/if}

                    {#if actionsSlot}
                        <div
                            class={classes.actions}
                            role="none"
                            onclick={(e) => e.stopPropagation()}
                        >
                            {@render actionsSlot({ open })}
                        </div>
                    {/if}

                    {#if children}
                        {@render children()}
                    {/if}
                </div>
            {/if}
        </div>
    {:else}
        <!-- Button variant -->
        <Button
            {color}
            {size}
            disabled={isDisabled}
            {loading}
            {loadingIcon}
            leadingIcon={loading ? undefined : icon}
            {label}
            onclick={handleAreaClick}
        />
    {/if}

    <!-- File list (outside the zone) -->
    {#if preview && value.length > 0 && !showFilesInside}
        {#if filesSlot}
            {@render filesSlot({ files: value })}
        {:else}
            <div class="flex items-center justify-between gap-2">
                <span class="text-sm text-on-surface-variant">
                    {value.length}
                    {value.length === 1 ? 'file' : 'files'}
                </span>
                <Button
                    variant="ghost"
                    color="error"
                    size="xs"
                    label="Clear all"
                    leadingIcon={icons.trash}
                    onclick={clearAll}
                />
            </div>
            <div class={classes.files}>
                {#each value as file, i (fileKey(file))}
                    {#if fileSlot}
                        {@render fileSlot({ file, index: i, remove: () => removeFile(i) })}
                    {:else if layout === 'grid'}
                        <!-- Grid item: no overflow-hidden on outer so close button can escape -->
                        <div class={classes.file}>
                            {#if isImageFile(file)}
                                {#if imagePreview}
                                    <button
                                        class="group relative size-full cursor-zoom-in overflow-hidden rounded-[7px]"
                                        onclick={() => openPreview(file)}
                                        aria-label="Preview {file.name}"
                                    >
                                        <img
                                            src={getObjectUrl(file)}
                                            alt={file.name}
                                            class="size-full object-cover transition-[filter] duration-200 group-hover:brightness-75"
                                        />
                                        <div
                                            class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                        >
                                            <Icon
                                                name={icons.zoomIn}
                                                class="size-6 text-white drop-shadow-md"
                                            />
                                        </div>
                                    </button>
                                {:else}
                                    <div class="size-full overflow-hidden rounded-[7px]">
                                        <img
                                            src={getObjectUrl(file)}
                                            alt={file.name}
                                            class="size-full object-cover"
                                        />
                                    </div>
                                {/if}
                            {:else}
                                <div
                                    class="flex size-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[7px] bg-surface-container-low p-3 text-on-surface-variant"
                                >
                                    <Icon name={fileIcon} class="size-8 shrink-0" />
                                    <span class="w-full truncate text-center text-xs"
                                        >{file.name}</span
                                    >
                                </div>
                            {/if}
                            <div class={classes.fileTrailing}>
                                <Button
                                    variant="solid"
                                    color="error"
                                    size="xs"
                                    icon={icons.close}
                                    square
                                    ui={{
                                        base: 'size-5 rounded-full border-2 border-surface p-0 shadow-sm'
                                    }}
                                    onclick={() => removeFile(i)}
                                    aria-label="Remove {file.name}"
                                />
                            </div>
                        </div>
                    {:else}
                        <!-- List item -->
                        <div class={classes.file}>
                            <div class={classes.fileLeading}>
                                {#if isImageFile(file)}
                                    <img
                                        src={getObjectUrl(file)}
                                        alt={file.name}
                                        class="size-8 shrink-0 rounded object-cover"
                                    />
                                {:else}
                                    <Icon
                                        name={fileIcon}
                                        class="size-4 shrink-0 text-on-surface-variant"
                                    />
                                {/if}
                            </div>
                            <div class={classes.fileWrapper}>
                                <span class={classes.fileName}>{file.name}</span>
                                <span class={classes.fileSize}>{formatFileSize(file.size)}</span>
                            </div>
                            <div class={classes.fileTrailing}>
                                <div class="flex items-center gap-0.5">
                                    {#if isImageFile(file) && imagePreview}
                                        <Button
                                            variant="ghost"
                                            {size}
                                            icon={icons.zoomIn}
                                            square
                                            onclick={() => openPreview(file)}
                                            aria-label="Preview {file.name}"
                                        />
                                    {/if}
                                    <Button
                                        variant="ghost"
                                        {size}
                                        icon={icons.close}
                                        square
                                        onclick={() => removeFile(i)}
                                        aria-label="Remove {file.name}"
                                    />
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    {/if}
</div>

{#if imagePreview}
    <Modal
        bind:open={previewOpen}
        onOpenChange={(v) => {
            if (!v) previewFile = null
        }}
        title={previewFile?.name ?? ''}
        description={previewFile ? formatFileSize(previewFile.size) : ''}
        ui={{
            content: ['max-w-3xl overflow-hidden', classes.previewContent],
            body: ['p-0', classes.previewBody]
        }}
    >
        {#snippet body()}
            {#if previewFile}
                <div class="flex items-center justify-center bg-surface-container-low">
                    <img
                        src={getObjectUrl(previewFile)}
                        alt={previewFile.name}
                        class="max-h-[75vh] max-w-full"
                    />
                </div>
            {/if}
        {/snippet}
    </Modal>
{/if}
