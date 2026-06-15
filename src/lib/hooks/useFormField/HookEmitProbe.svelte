<script lang="ts">
    import { useFormFieldEmit } from './useFormField.svelte.js'

    const emit = useFormFieldEmit()

    function fireAll() {
        emit.onBlur()
        emit.onFocus()
        emit.onChange()
        emit.onInput()
    }
</script>

<button data-testid="fire" onclick={fireAll}>fire</button>
