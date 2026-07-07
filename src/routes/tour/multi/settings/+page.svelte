<script lang="ts">
    import { Badge, Switch } from '$lib/index.js'

    let notifications = $state(true)
</script>

<div class="space-y-4">
    <div class="space-y-1">
        <Badge color="secondary">Settings</Badge>
        <h2 class="text-xl font-semibold">Preferences</h2>
    </div>
    <label id="m-settings-toggle" class="flex items-center gap-3 text-sm">
        <Switch bind:checked={notifications} /> Enable notifications
    </label>
</div>
