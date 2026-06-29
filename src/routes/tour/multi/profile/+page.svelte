<script lang="ts">
    import { Badge, Avatar } from '$lib/index.js'
</script>

<div class="space-y-4">
    <div class="space-y-1">
        <Badge color="tertiary">Profile</Badge>
        <h2 class="text-xl font-semibold">Your account</h2>
    </div>
    <div
        id="m-profile-card"
        class="flex items-center gap-3 rounded-lg bg-surface-container-high p-4"
    >
        <Avatar text="ND" />
        <div>
            <p class="text-sm font-medium">Nguyen Dang</p>
            <p class="text-xs text-on-surface-variant">longdang0412@gmail.com</p>
        </div>
    </div>
</div>
