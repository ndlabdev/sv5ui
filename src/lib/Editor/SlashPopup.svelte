<script lang="ts">
    import type { SlashCommand } from './editor.types.js'
    import Icon from '../Icon/Icon.svelte'

    interface Props {
        items: SlashCommand[]
        selectedIndex: number
        onPick: (index: number) => void
        listboxId: string
        optionIdPrefix: string
    }

    let { items, selectedIndex, onPick, listboxId, optionIdPrefix }: Props = $props()

    let listEl: HTMLDivElement | null = $state(null)

    $effect(() => {
        if (!listEl) return
        const active = listEl.querySelector(`[data-index="${selectedIndex}"]`)
        if (!active) return
        requestAnimationFrame(() => {
            ;(active as HTMLElement).scrollIntoView({ block: 'nearest' })
        })
    })
</script>

<div
    bind:this={listEl}
    id={listboxId}
    role="listbox"
    aria-label="Slash commands"
    data-editor-slash-popup
    class="max-h-72 max-w-80 min-w-64 overflow-y-auto rounded-lg border border-outline-variant bg-surface py-1 shadow-lg"
>
    {#if items.length === 0}
        <div class="px-3 py-2 text-sm text-on-surface-variant">No matches</div>
    {:else}
        {#each items as cmd, i (cmd.id)}
            {@const active = i === selectedIndex}
            <button
                type="button"
                role="option"
                id={`${optionIdPrefix}${i}`}
                aria-selected={active}
                data-slash-item
                data-id={cmd.id}
                data-index={i}
                class="flex w-full items-start gap-3 px-3 py-2 text-start hover:bg-surface-container-high {active
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface'}"
                onmousedown={(e) => {
                    e.preventDefault()
                    onPick(i)
                }}
            >
                {#if cmd.icon}
                    <span
                        class="flex size-7 shrink-0 items-center justify-center rounded border border-outline-variant"
                    >
                        <Icon name={cmd.icon} class="size-4" />
                    </span>
                {/if}
                <span class="flex min-w-0 flex-col">
                    <span class="truncate text-sm font-medium">{cmd.label}</span>
                    {#if cmd.description}
                        <span class="truncate text-xs text-on-surface-variant"
                            >{cmd.description}</span
                        >
                    {/if}
                </span>
            </button>
        {/each}
    {/if}
</div>
