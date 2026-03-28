<script lang="ts">
    import { FileUpload, Button } from '$lib/index.js'

    const colors = [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info',
        'surface'
    ] as const

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    let basicFiles = $state<File[]>([])
    let multipleFiles = $state<File[]>([])
    let gridSingleFile = $state<File[]>([])
    let gridMultipleFiles = $state<File[]>([])
    let buttonFiles = $state<File[]>([])
    let actionsFiles = $state<File[]>([])
    let highlightFiles = $state<File[]>([])
    let noDropzoneFiles = $state<File[]>([])
    let noPreviewFiles = $state<File[]>([])
    let imageFiles = $state<File[]>([])
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">FileUpload</h1>
        <p class="text-on-surface-variant">
            Upload files via drag-and-drop or file dialog with preview and removal.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <FileUpload bind:value={basicFiles} />
            <p class="mt-3 text-sm text-on-surface-variant">
                Selected: {basicFiles.length ? basicFiles.map((f) => f.name).join(', ') : 'none'}
            </p>
        </div>
    </section>

    <!-- Multiple Files -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Multiple Files</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <FileUpload
                bind:value={multipleFiles}
                multiple
                label="Drop multiple files here"
                description="Upload as many files as you need"
            />
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Area (default)</p>
                <FileUpload label="Drop files here" description="Supports drag & drop" />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Button</p>
                <FileUpload variant="button" label="Upload file" bind:value={buttonFiles} />
                {#if buttonFiles.length > 0}
                    <p class="text-sm text-on-surface-variant">
                        {buttonFiles.map((f) => f.name).join(', ')}
                    </p>
                {/if}
            </div>
        </div>
    </section>

    <!-- Layout -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Layout</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">List (default)</p>
                <FileUpload
                    bind:value={multipleFiles}
                    multiple
                    layout="list"
                    label="Upload files"
                    description="Files shown as list"
                />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Grid · Multiple</p>
                <FileUpload
                    bind:value={gridMultipleFiles}
                    multiple
                    layout="grid"
                    label="Upload images"
                    description="Files shown as grid thumbnails"
                    accept="image/*"
                />
            </div>
        </div>
    </section>

    <!-- Grid Single File -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Grid · Single File Preview</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-xs">
                <FileUpload
                    bind:value={gridSingleFile}
                    layout="grid"
                    label="Upload image"
                    description="Preview fills the area"
                    accept="image/*"
                    ui={{ base: 'min-h-48' }}
                />
            </div>
        </div>
    </section>

    <!-- Dropzone vs No Dropzone -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Dropzone</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">With dropzone (default)</p>
                <FileUpload label="Drag & drop or click" description="Drag files anywhere on this area" />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">No dropzone · click only</p>
                <FileUpload
                    bind:value={noDropzoneFiles}
                    dropzone={false}
                    label="Click to upload"
                    description="No drag-and-drop"
                />
            </div>
        </div>
    </section>

    <!-- Custom Actions Slot -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Actions</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <FileUpload
                bind:value={actionsFiles}
                multiple
                interactive={false}
                label="Drag files here"
                description="or click the button below"
            >
                {#snippet actionsSlot({ open })}
                    <Button
                        size="sm"
                        variant="outline"
                        color="primary"
                        leadingIcon="lucide:folder-open"
                        label="Browse files"
                        onclick={open}
                    />
                {/snippet}
            </FileUpload>
        </div>
    </section>

    <!-- Highlight -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Highlight</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Normal</p>
                <FileUpload bind:value={basicFiles} label="No highlight" />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Highlighted</p>
                <FileUpload bind:value={highlightFiles} highlight label="Highlighted border" />
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <FileUpload
                    {color}
                    highlight
                    label={color}
                    description="Drop files or click to browse"
                    ui={{ wrapper: 'py-2' }}
                />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="flex items-start gap-4">
                    <span class="w-6 pt-3 text-xs text-on-surface-variant">{size}</span>
                    <FileUpload
                        {size}
                        label="Upload file"
                        description="Drag & drop or click"
                        class="flex-1"
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Disabled & Loading -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">States</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Disabled</p>
                <FileUpload disabled label="Disabled upload" description="Cannot interact" />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Loading</p>
                <FileUpload loading label="Processing files…" description="Please wait" />
            </div>
        </div>
    </section>

    <!-- No Preview -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Preview Disabled</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <FileUpload
                bind:value={noPreviewFiles}
                multiple
                preview={false}
                label="Upload without preview"
                description="Files are selected but not listed"
            />
            <p class="mt-3 text-sm text-on-surface-variant">
                {noPreviewFiles.length} file(s) selected
            </p>
        </div>
    </section>

    <!-- Accept Filter -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Accept Filter</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Images only</p>
                <FileUpload
                    bind:value={imageFiles}
                    multiple
                    accept="image/*"
                    color="tertiary"
                    icon="lucide:image"
                    label="Drop images here"
                    description="Only image files accepted"
                />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">PDF only</p>
                <FileUpload
                    accept=".pdf"
                    color="error"
                    icon="lucide:file-text"
                    label="Drop PDF here"
                    description="Only .pdf files accepted"
                />
            </div>
        </div>
    </section>

    <!-- Image Preview -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Image Preview</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Preview enabled (default)</p>
                <FileUpload
                    bind:value={imageFiles}
                    multiple
                    accept="image/*"
                    icon="lucide:image"
                    label="Drop images here"
                    description="Click the zoom icon to preview"
                />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Preview disabled</p>
                <FileUpload
                    multiple
                    accept="image/*"
                    icon="lucide:image"
                    label="Drop images here"
                    description="No preview button shown"
                    imagePreview={false}
                />
            </div>
        </div>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <FileUpload multiple bind:value={basicFiles} color="success">
                {#snippet leadingSlot()}
                    <div
                        class="flex size-12 items-center justify-center rounded-full bg-success-container text-on-success-container"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="size-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                {/snippet}
                {#snippet labelSlot()}
                    <span class="mt-2 block text-sm font-semibold text-success">
                        Drag & drop your files
                    </span>
                {/snippet}
                {#snippet descriptionSlot()}
                    <span class="mt-1 block text-xs text-on-surface-variant">
                        PNG, JPG, GIF up to 10MB each
                    </span>
                {/snippet}
            </FileUpload>
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-6 rounded-lg bg-surface-container-high p-4">
            <!-- Avatar Upload -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Avatar Upload</p>
                <div class="max-w-xs">
                    <FileUpload
                        layout="grid"
                        accept="image/*"
                        icon="lucide:user-round"
                        label="Upload photo"
                        description="PNG or JPG up to 2MB"
                        color="primary"
                        ui={{ base: 'min-h-40 rounded-full', wrapper: 'py-4' }}
                    />
                </div>
            </div>

            <!-- Document Upload -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Document Upload</p>
                <div
                    class="max-w-lg space-y-4 rounded-lg border border-outline-variant bg-surface-container p-4"
                >
                    <div>
                        <p class="mb-1 text-sm font-medium text-on-surface">Resume *</p>
                        <FileUpload
                            accept=".pdf,.doc,.docx"
                            icon="lucide:file-text"
                            label="Upload your resume"
                            description="PDF, DOC, DOCX up to 5MB"
                            size="sm"
                            color="primary"
                        />
                    </div>
                    <div>
                        <p class="mb-1 text-sm font-medium text-on-surface">Portfolio (optional)</p>
                        <FileUpload
                            multiple
                            accept="image/*,.pdf"
                            icon="lucide:briefcase"
                            label="Upload portfolio files"
                            description="Images or PDFs"
                            size="sm"
                            color="secondary"
                        />
                    </div>
                </div>
            </div>

            <!-- Gallery Upload -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Gallery Upload</p>
                <FileUpload
                    multiple
                    layout="grid"
                    accept="image/*"
                    icon="lucide:images"
                    label="Upload gallery images"
                    description="Drop multiple images to create a gallery"
                    color="tertiary"
                />
            </div>
        </div>
    </section>
</div>
