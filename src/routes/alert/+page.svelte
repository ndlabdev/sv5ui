<script lang="ts">
    import { Alert, type AlertProps } from '$lib/index.js'

    type Color = NonNullable<AlertProps['color']>
    type Variant = NonNullable<AlertProps['variant']>

    const colors: Color[] = [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info',
        'surface'
    ]
    const variants: Variant[] = ['solid', 'outline', 'soft', 'subtle']
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Alert</h1>
        <p class="text-on-surface-variant">
            Callout component to draw user's attention with customizable styling and interactive
            elements.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert
                title="Information"
                description="This is a basic alert with title and description."
            />
            <Alert description="Alert with description only." />
            <Alert title="Alert with title only" />
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert
                variant="solid"
                title="Solid"
                description="Filled background with contrasting text."
            />
            <Alert
                variant="outline"
                title="Outline"
                description="Border only with transparent background."
            />
            <Alert variant="soft" title="Soft" description="Light colored background." />
            <Alert variant="subtle" title="Subtle" description="Light background with border." />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert color="primary" title="Primary" description="Primary color alert." />
            <Alert color="secondary" title="Secondary" description="Secondary color alert." />
            <Alert color="tertiary" title="Tertiary" description="Tertiary color alert." />
            <Alert
                color="success"
                title="Success"
                description="Operation completed successfully."
            />
            <Alert color="warning" title="Warning" description="Please review before proceeding." />
            <Alert color="error" title="Error" description="Something went wrong." />
            <Alert color="info" title="Info" description="Here's some useful information." />
            <Alert color="surface" title="Surface" description="Neutral surface color alert." />
        </div>
    </section>

    <!-- With Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icons</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert
                color="info"
                icon="lucide:info"
                title="Information"
                description="This alert includes an icon for visual emphasis."
            />
            <Alert
                color="success"
                icon="lucide:check-circle"
                title="Success"
                description="Your changes have been saved."
            />
            <Alert
                color="warning"
                icon="lucide:alert-triangle"
                title="Warning"
                description="Your session will expire in 5 minutes."
            />
            <Alert
                color="error"
                icon="lucide:x-circle"
                title="Error"
                description="Failed to connect to server."
            />
        </div>
    </section>

    <!-- With Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Avatar</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert
                avatar={{ src: 'https://i.pravatar.cc/150?img=1', alt: 'John' }}
                title="John Doe"
                description="Sent you a message: 'Hey, are you available for a quick call?'"
            />
            <Alert
                color="success"
                avatar={{ alt: 'System' }}
                title="System Update"
                description="A new version is available."
            />
        </div>
    </section>

    <!-- With Close Button -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Close Button</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert
                icon="lucide:bell"
                title="Notification"
                description="You have 3 new messages."
                close
            />
            <Alert
                color="warning"
                icon="lucide:alert-triangle"
                title="Dismissible Warning"
                description="This alert can be dismissed."
                close
            />
        </div>
    </section>

    <!-- With Actions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Actions</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert
                icon="lucide:download"
                title="Update Available"
                description="A new version of the app is ready to install."
                actions={[{ label: 'Update Now' }, { label: 'Later', variant: 'ghost' }]}
            />
            <Alert
                color="error"
                icon="lucide:trash-2"
                title="Delete Item?"
                description="This action cannot be undone."
                actions={[
                    { label: 'Delete', color: 'error' },
                    { label: 'Cancel', variant: 'ghost' }
                ]}
            />
        </div>
    </section>

    <!-- Vertical Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Vertical Orientation</h2>
        <div class="grid gap-3 rounded-lg bg-surface-container-high p-4 md:grid-cols-2">
            <Alert
                orientation="vertical"
                icon="lucide:cloud-upload"
                title="Upload Complete"
                description="Your files have been uploaded successfully."
                actions={[{ label: 'View Files' }]}
            />
            <Alert
                orientation="vertical"
                color="warning"
                icon="lucide:shield-alert"
                title="Security Alert"
                description="Unusual login activity detected on your account."
                actions={[{ label: 'Review Activity' }, { label: 'Ignore', variant: 'ghost' }]}
                close
            />
        </div>
    </section>

    <!-- Variants x Colors Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants x Colors</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-2 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Variant</th
                        >
                        {#each colors as color (color)}
                            <th
                                class="px-2 py-3 text-center text-sm font-medium text-on-surface-variant capitalize"
                                >{color}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant (variant)}
                        <tr class="border-b border-outline-variant/50">
                            <td
                                class="px-2 py-3 text-sm font-medium text-on-surface-variant capitalize"
                                >{variant}</td
                            >
                            {#each colors as color (color)}
                                <td class="px-2 py-3">
                                    <Alert {variant} {color} title={color} class="min-w-48" />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Alert
                variant="subtle"
                icon="lucide:cookie"
                title="We use cookies"
                description="This website uses cookies to ensure you get the best experience."
                actions={[{ label: 'Accept All' }, { label: 'Customize', variant: 'outline' }]}
            />
            <Alert
                color="warning"
                variant="soft"
                icon="lucide:clock"
                title="Trial Ending Soon"
                description="Your free trial expires in 3 days. Upgrade now to keep your data."
                actions={[{ label: 'Upgrade', color: 'warning' }]}
                close
            />
            <Alert
                color="success"
                variant="soft"
                icon="lucide:check-circle"
                title="Payment Successful"
                description="Thank you for your purchase! A confirmation email has been sent."
                close
            />
            <Alert
                color="error"
                variant="outline"
                icon="lucide:wifi-off"
                title="Connection Lost"
                description="Unable to connect to the server. Please check your internet connection."
                actions={[
                    { label: 'Retry', leadingIcon: 'lucide:refresh-cw' },
                    { label: 'Work Offline', variant: 'ghost' }
                ]}
            />
        </div>
    </section>
</div>
