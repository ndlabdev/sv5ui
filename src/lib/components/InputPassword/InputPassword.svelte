<script lang="ts" module>
    import type { InputPasswordProps } from './input-password.types.js'

    export type Props = InputPasswordProps

    const autocompleteFor = {
        login: 'current-password',
        signup: 'new-password',
        change: 'new-password'
    } as const
</script>

<script lang="ts">
    import { inputPasswordVariants, inputPasswordDefaults } from './input-password.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { inputDefaults } from '../Input/input.variants.js'
    import type { InputProps } from '../Input/input.types.js'
    import Input from '../Input/Input.svelte'
    import Button from '../Button/Button.svelte'
    import Icon from '../Icon/Icon.svelte'
    import Progress from '../Progress/Progress.svelte'

    const config = getComponentConfig('inputPassword', inputPasswordDefaults)
    const inputConfig = getComponentConfig('input', inputDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(''),
        visible = $bindable(false),
        purpose = 'login',
        toggle = true,
        showIcon = icons.passwordShow,
        hideIcon = icons.passwordHide,
        showLabel = 'Show password',
        hideLabel = 'Hide password',
        capsLockWarning = true,
        capsLockMessage = 'Caps Lock is on',
        strength = null,
        strengthLevels = config.strengthLevels,
        size,
        disabled = false,
        loading = false,
        footer,
        ui,
        class: className,
        onkeydown,
        onkeyup,
        onblur,
        ...restProps
    }: Props = $props()

    const ownSlots = ['root', 'toggle', 'meter', 'caps', 'capsIcon', 'footer'] as const

    const inputUi = $derived.by(() => {
        if (!ui) return undefined

        const rest = { ...ui } as Record<string, unknown>
        for (const slot of ownSlots) delete rest[slot]

        return rest as InputProps<string>['ui']
    })

    let capsLockOn = $state(false)
    let announcedLevel = $state<string | null>(null)

    const classes = $derived.by(() => {
        const slots = inputPasswordVariants()
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            toggle: slots.toggle({ class: [config.slots.toggle, ui?.toggle] }),
            meter: slots.meter({ class: [config.slots.meter, ui?.meter] }),
            caps: slots.caps({ class: [config.slots.caps, ui?.caps] }),
            capsIcon: slots.capsIcon({ class: [config.slots.capsIcon, ui?.capsIcon] }),
            footer: slots.footer({ class: [config.slots.footer, ui?.footer] })
        }
    })

    const resolvedSize = $derived(size ?? inputConfig.defaultVariants.size)
    const isInert = $derived(disabled || loading)
    const hasMeter = $derived(strength !== null && strength !== undefined)
    const clampedStrength = $derived(
        hasMeter ? Math.max(0, Math.min(strengthLevels.length - 1, strength as number)) : null
    )
    const meterColor = $derived(
        clampedStrength === null
            ? 'primary'
            : (config.strengthColors[Math.min(config.strengthColors.length - 1, clampedStrength)] ??
                  'primary')
    )
    const currentLevel = $derived(
        clampedStrength === null ? null : (strengthLevels[clampedStrength] ?? null)
    )

    function readCapsLock(event: KeyboardEvent) {
        if (!capsLockWarning) return
        if (typeof event.getModifierState !== 'function') return

        capsLockOn = event.getModifierState('CapsLock')
    }

    function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
        readCapsLock(event)
        onkeydown?.(event)
    }

    function handleKeyup(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
        readCapsLock(event)
        onkeyup?.(event)
    }

    function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        capsLockOn = false
        onblur?.(event)
    }

    $effect(() => {
        const level = currentLevel
        if (level === announcedLevel) return

        const id = setTimeout(() => {
            announcedLevel = level
        }, 400)
        return () => clearTimeout(id)
    })
</script>

<div class={classes.root}>
    {#snippet toggleButton()}
        <Button
            variant="ghost"
            color="surface"
            size={resolvedSize}
            square
            disabled={isInert}
            icon={visible ? hideIcon : showIcon}
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            class={classes.toggle}
            onclick={() => (visible = !visible)}
        />
    {/snippet}

    <Input
        bind:ref
        bind:value
        type={visible ? 'text' : 'password'}
        autocomplete={autocompleteFor[purpose]}
        size={resolvedSize}
        {disabled}
        {loading}
        ui={inputUi}
        trailingSlot={toggle ? toggleButton : undefined}
        onkeydown={handleKeydown}
        onkeyup={handleKeyup}
        onblur={handleBlur}
        {...restProps}
    />

    {#if hasMeter}
        <div class={classes.meter}>
            <Progress
                value={clampedStrength}
                max={strengthLevels}
                color={meterColor}
                size="sm"
                aria-label="Password strength"
            />
        </div>
    {/if}

    {#if capsLockWarning && capsLockOn}
        <p class={classes.caps}>
            <Icon name="lucide:triangle-alert" class={classes.capsIcon} />
            {capsLockMessage}
        </p>
    {/if}

    {#if hasMeter}
        <span class="sr-only" role="status" aria-live="polite">
            {announcedLevel ? `Password strength: ${announcedLevel}` : ''}
        </span>
    {/if}

    {#if footer}
        <div class={classes.footer}>
            {@render footer({ value: value ?? '', strength: clampedStrength })}
        </div>
    {/if}
</div>
