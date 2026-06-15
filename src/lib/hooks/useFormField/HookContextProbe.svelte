<script lang="ts">
    import { useFormField } from './useFormField.svelte.js'

    const ctx = useFormField()
</script>

<div data-name={ctx?.name ?? 'none'} data-has={String(!!ctx)}>probe</div>
