<script lang="ts">
    import { setContext } from 'svelte'
    import { FORM_FIELD_CONTEXT_KEY } from './useFormField.svelte.js'
    import HookContextProbe from './HookContextProbe.svelte'

    setContext(FORM_FIELD_CONTEXT_KEY, { name: 'email', size: 'md', ariaId: 'ff' })
</script>

<HookContextProbe />
