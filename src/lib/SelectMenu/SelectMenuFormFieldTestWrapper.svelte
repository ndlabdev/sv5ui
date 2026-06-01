<script lang="ts">
    import FormField from '../FormField/FormField.svelte'
    import SelectMenu from './SelectMenu.svelte'
    import type { SelectMenuItemType } from './select-menu.types.js'

    let { items = [] }: { items?: SelectMenuItemType[] } = $props()
</script>

<FormField name="fruit" label="Fruit">
    <SelectMenu open {items} placeholder="Pick" />
</FormField>
