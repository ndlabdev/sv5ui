<script lang="ts">
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import InputNumber from './InputNumber.svelte'
    import { z } from 'zod'

    const schema = z.object({
        quantity: z
            .number()
            .min(1, 'Quantity must be at least 1')
            .nullable()
            .refine((v) => v !== null, 'Quantity is required')
    })

    let formState = $state<{ quantity: number | null }>({ quantity: null })
</script>

<Form {schema} bind:state={formState}>
    <FormField name="quantity" label="Quantity">
        <InputNumber bind:value={formState.quantity} />
    </FormField>
</Form>
