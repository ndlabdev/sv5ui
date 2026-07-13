<script lang="ts">
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import DatePicker from './DatePicker.svelte'
    import { z } from 'zod'
    import type { DateValue } from '@internationalized/date'

    const schema = z.object({
        birthday: z.custom<DateValue>((v) => v !== null && v !== undefined, {
            message: 'Birthday is required'
        })
    })

    let formState = $state<{ birthday: DateValue | undefined }>({ birthday: undefined })
</script>

<Form {schema} bind:state={formState}>
    <FormField name="birthday" label="Birthday">
        <DatePicker bind:value={formState.birthday} initialFocus={false} />
    </FormField>
</Form>
