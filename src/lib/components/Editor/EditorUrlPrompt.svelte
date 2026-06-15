<script lang="ts">
    import { untrack } from 'svelte'
    import Modal from '../Modal/Modal.svelte'
    import Input from '../Input/Input.svelte'
    import Button from '../Button/Button.svelte'
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import type { FormApi, FormError, FormSubmitEvent } from '../Form/form.types.js'
    import { httpUrlSchema, type UrlSchema } from './editor.schemas.js'

    interface Props {
        open: boolean
        title?: string
        description?: string
        placeholder?: string
        initialValue?: string
        confirmLabel?: string
        schema?: UrlSchema
        onConfirm?: (value: string) => void
        onCancel?: () => void
    }

    let {
        open = $bindable(false),
        title = 'Enter URL',
        description,
        placeholder = 'https://',
        initialValue = '',
        confirmLabel = 'Insert',
        schema,
        onConfirm,
        onCancel
    }: Props = $props()

    type UrlFormState = { url: string }

    let formApi = $state<FormApi<UrlFormState>>()
    let formState = $state<UrlFormState>({ url: '' })
    let inputRef: HTMLInputElement | null = $state(null)
    let settled = $state(false)

    const resolvedSchema = $derived(schema ?? httpUrlSchema)

    $effect(() => {
        if (open) {
            const initial = untrack(() => initialValue)
            formState = { url: initial }
            settled = false
            untrack(() => formApi?.reset())
            requestAnimationFrame(() => inputRef?.focus())
        } else if (!settled) {
            settled = true
            onCancel?.()
        }
    })

    async function validate(state: object): Promise<FormError[]> {
        const url = (state as Partial<UrlFormState>).url ?? ''
        const result = await resolvedSchema['~standard'].validate(url)
        if (result.issues) {
            return [{ name: 'url', message: result.issues[0]?.message ?? 'Invalid value' }]
        }
        return []
    }

    function handleSubmit(event: FormSubmitEvent<unknown>): void {
        const data = event.data as UrlFormState
        settled = true
        onConfirm?.(data.url.trim())
        open = false
    }

    function cancel(): void {
        settled = true
        onCancel?.()
        open = false
    }
</script>

<Modal bind:open {title} {description} size="sm">
    {#snippet body()}
        <Form
            bind:api={formApi}
            bind:state={formState}
            {validate}
            onsubmit={handleSubmit}
            class="py-1"
        >
            <FormField name="url">
                <Input
                    bind:ref={inputRef}
                    bind:value={formState.url}
                    {placeholder}
                    class="w-full"
                />
            </FormField>
        </Form>
    {/snippet}
    {#snippet footer()}
        <div class="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" label="Cancel" onclick={cancel} />
            <Button
                color="primary"
                size="sm"
                label={confirmLabel}
                loading={formApi?.loading}
                onclick={() => void formApi?.submit()}
            />
        </div>
    {/snippet}
</Modal>
