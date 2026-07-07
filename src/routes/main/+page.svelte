<script lang="ts">
    import { Main } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Main</h1>
        <p class="text-on-surface-variant">
            A content container that fills the viewport height remaining below your header. Pairs
            with the --ui-header-height CSS variable, the same contract used by the Error component.
        </p>
    </div>

    <!-- How it works -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">How it works</h2>
        <p class="text-sm text-on-surface-variant">
            Main renders a main element with min-h-[calc(100svh-var(--ui-header-height,0px))]. The
            variable defaults to 4rem in theme.css, matching the standard header height, so Main and
            a var-driven header compose out of the box. Apps without a header set the variable to
            0px once and Main (and Error) fill the full viewport. This docs site sizes its header
            with h-(--ui-header-height), and the page you are reading is rendered inside a Main.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <pre class="overflow-x-auto text-sm"><code
                    >{`<header class="h-(--ui-header-height) ...">...</header>

<Main>
    <Container>...</Container>
</Main>

/* no header? override the default once */
:root {
    --ui-header-height: 0px;
}`}</code
                ></pre>
        </div>
    </section>

    <!-- Scaled preview -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Scaled preview</h2>
        <p class="text-sm text-on-surface-variant">
            A miniature layout using a local --ui-header-height override so the effect is visible
            inside the docs.
        </p>
        <div
            class="overflow-hidden rounded-lg ring ring-outline-variant"
            style="--ui-header-height: 40px"
        >
            <div
                class="flex h-10 items-center border-b border-outline-variant bg-surface-container px-4 text-sm font-medium"
            >
                Header (40px)
            </div>
            <Main class="min-h-64 bg-surface-container-low p-4 text-sm text-on-surface-variant">
                Main content area. In a real app this fills calc(100svh - 40px); here the height is
                constrained with a class for preview purposes.
            </Main>
        </div>
    </section>

    <!-- Custom element -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom element</h2>
        <p class="text-sm text-on-surface-variant">
            Use the as prop when the page already has a main landmark.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Main
                as="div"
                class="min-h-0 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant"
            >
                Rendered as a div via as="div", with min-h-0 overriding the viewport height.
            </Main>
        </div>
    </section>
</div>
