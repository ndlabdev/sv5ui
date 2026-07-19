<script lang="ts">
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import TimeField from './TimeField.svelte'
    import { z } from 'zod'
    import type { TimeValue } from 'bits-ui'

    const schema = z.object({
        meeting: z.custom<TimeValue>((v) => v !== null && v !== undefined, {
            message: 'Meeting time is required'
        })
    })

    let formState = $state<{ meeting: TimeValue | undefined }>({ meeting: undefined })
</script>

<Form {schema} bind:state={formState}>
    <FormField name="meeting" label="Meeting time">
        <TimeField bind:value={formState.meeting} />
    </FormField>
</Form>
