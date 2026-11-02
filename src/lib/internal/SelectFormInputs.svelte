<script lang="ts">
    let {
        name,
        selectedValues,
        multiple,
        disabled,
        required,
        isKnownValue,
        onValueChange
    }: {
        name: string
        selectedValues: string[]
        multiple: boolean
        disabled: boolean
        required: boolean
        isKnownValue: (value: string) => boolean
        onValueChange: (value: string | string[]) => void
    } = $props()

    let inputEl = $state<HTMLInputElement | null>(null)

    function getValue() {
        return selectedValues.join(',')
    }

    $effect(() => {
        getValue()
        if (required) inputEl?.dispatchEvent(new Event('input'))
    })

    function setValue(next: string) {
        if (multiple) {
            if (next === '' && selectedValues.length > 0) onValueChange([])
        } else if (next !== getValue() && (next === '' || isKnownValue(next))) {
            onValueChange(next)
        }
    }

    function focusControl(event: FocusEvent) {
        const input = event.currentTarget as HTMLInputElement
        input.parentElement
            ?.querySelector<HTMLElement>('[data-select-trigger], input[role="combobox"]')
            ?.focus()
    }
</script>

{#if multiple}
    {#each selectedValues as selectedValue (selectedValue)}
        <input type="hidden" {name} value={selectedValue} {disabled} />
    {/each}
{/if}
<input
    bind:this={inputEl}
    bind:value={getValue, setValue}
    name={multiple ? undefined : name}
    class="sr-only bottom-0 left-0"
    tabindex={-1}
    aria-hidden="true"
    autocomplete="off"
    {disabled}
    {required}
    onfocus={focusControl}
/>
