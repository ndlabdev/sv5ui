<script lang="ts">
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import InputTags from './InputTags.svelte'
    import { z } from 'zod'

    const schema = z.object({
        skills: z.array(z.string()).min(1, 'At least one skill is required')
    })

    let formState = $state<{ skills: string[] }>({ skills: [] })
</script>

<Form {schema} bind:state={formState}>
    <FormField name="skills" label="Skills">
        <InputTags bind:value={formState.skills} />
    </FormField>
</Form>
