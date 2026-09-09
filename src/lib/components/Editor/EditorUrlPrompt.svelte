<script lang="ts">
    import { untrack } from 'svelte'
    import Modal from '../Modal/Modal.svelte'
    import Input from '../Input/Input.svelte'
    import Button from '../Button/Button.svelte'
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import type { FormApi, FormError, FormSubmitEvent } from '../Form/form.types.js'
    import { httpUrlSchema, type UrlSchema } from './editor.schemas.js'

    export interface UrlPromptResult {
        url: string
        text: string
    }

    interface Props {
        open: boolean
        title?: string
        description?: string
        placeholder?: string
        initialValue?: string
        confirmLabel?: string
        schema?: UrlSchema
        urlLabel?: string
        urlHelp?: string
        urlIcon?: string
        textField?: boolean
        textLabel?: string
        textPlaceholder?: string
        textHelp?: string
        initialText?: string
        onConfirm?: (result: UrlPromptResult) => void
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
        urlLabel = 'URL',
        urlHelp,
        urlIcon = 'lucide:link',
        textField = false,
        textLabel = 'Display text',
        textPlaceholder = 'The text people will see',
        textHelp = 'Leave empty to show the link itself.',
        initialText = '',
        onConfirm,
        onCancel
    }: Props = $props()

    type UrlFormState = { url: string; text: string }

    let formApi = $state<FormApi<UrlFormState>>()
    let formState = $state<UrlFormState>({ url: '', text: '' })
    let inputRef: HTMLInputElement | null = $state(null)
    let settled = $state(false)

    const resolvedSchema = $derived(schema ?? httpUrlSchema)

    $effect(() => {
        if (open) {
            const initial = untrack(() => initialValue)
            const initialLabel = untrack(() => initialText)
            formState = { url: initial, text: initialLabel }
            settled = false
            untrack(() => formApi?.reset())
        } else if (!settled) {
            settled = true
            onCancel?.()
        }
    })

    function focusInput(event: Event): void {
        // Take over the dialog's own opening focus. Focusing the input on the
        // side, while the dialog moves focus to its first element, blurs the
        // input again and the form validates an untouched field.
        event.preventDefault()
        inputRef?.focus()
    }

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
        onConfirm?.({ url: data.url.trim(), text: (data.text ?? '').trim() })
        open = false
    }

    function cancel(): void {
        settled = true
        onCancel?.()
        open = false
    }
</script>

<Modal bind:open {title} {description} size="sm" onOpenAutoFocus={focusInput}>
    {#snippet body()}
        <Form
            bind:api={formApi}
            bind:state={formState}
            {validate}
            onsubmit={handleSubmit}
            class="flex flex-col gap-4 py-1"
        >
            <FormField name="url" label={urlLabel} help={urlHelp} required>
                <Input
                    bind:ref={inputRef}
                    bind:value={formState.url}
                    {placeholder}
                    leadingIcon={urlIcon}
                    type="url"
                    autocomplete="off"
                    spellcheck={false}
                    class="w-full"
                />
            </FormField>

            {#if textField}
                <FormField name="text" label={textLabel} hint="Optional" help={textHelp}>
                    <Input
                        bind:value={formState.text}
                        placeholder={textPlaceholder}
                        leadingIcon="lucide:type"
                        class="w-full"
                    />
                </FormField>
            {/if}
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
