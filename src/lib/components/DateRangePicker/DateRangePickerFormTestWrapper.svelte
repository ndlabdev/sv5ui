<script lang="ts">
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import DateRangePicker from './DateRangePicker.svelte'
    import { z } from 'zod'
    import type { DateRange } from 'bits-ui'

    const schema = z.object({
        stay: z.custom<DateRange>((v) => {
            const range = v as DateRange | undefined
            return range?.start !== undefined && range?.end !== undefined
        }, 'Stay range is required')
    })

    let formState = $state<{ stay: DateRange | undefined }>({ stay: undefined })
</script>

<Form {schema} bind:state={formState}>
    <FormField name="stay" label="Stay">
        <DateRangePicker bind:value={formState.stay} />
    </FormField>
</Form>
