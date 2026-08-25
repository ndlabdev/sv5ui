<script lang="ts">
    import { z } from 'zod'
    import Form from '../Form/Form.svelte'
    import FormField from '../FormField/FormField.svelte'
    import ColorPicker from './ColorPicker.svelte'

    const schema = z.object({
        brand: z.string().refine((value) => value !== '#ffffff', {
            message: 'Pick a color other than white'
        })
    })

    let formState = $state({ brand: '#ffffff' })
</script>

<Form {schema} bind:state={formState} validateOn={['blur']}>
    <FormField name="brand" label="Brand color" description="Pick your brand color">
        <ColorPicker bind:value={formState.brand} />
    </FormField>
</Form>

<button type="button" data-outside>Outside</button>
