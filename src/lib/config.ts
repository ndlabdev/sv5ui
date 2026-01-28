/**
 * SV5UI Global Configuration
 *
 * @example
 * ```ts
 * import { defineConfig } from 'sv5ui'
 *
 * defineConfig({
 *     button: {
 *         defaultVariants: { variant: 'outline', color: 'secondary' },
 *         slots: { base: 'shadow-md', label: 'font-bold' }
 *     },
 *     avatar: {
 *         defaultVariants: { size: 'lg' },
 *         slots: { root: 'ring-2 ring-primary' }
 *     },
 *     icons: { loading: 'svg-spinners:ring-resize' }
 * })
 * ```
 */

// ==================== IMPORTS ====================

import { buttonDefaults } from './Button/button.variants.js'
import { avatarDefaults } from './Avatar/avatar.variants.js'
import { avatarGroupDefaults } from './AvatarGroup/avatar-group.variants.js'
import { alertDefaults } from './Alert/alert.variants.js'
import { cardDefaults } from './Card/card.variants.js'
import { linkDefaults } from './Link/link.variants.js'
import { separatorDefaults } from './Separator/separator.variants.js'
import { chipDefaults } from './Chip/chip.variants.js'

// ==================== COMPONENT DEFAULTS (user-configurable) ====================

/**
 * Registry of user-configurable component defaults
 * To add a new component, just add its defaults here
 */
/**
 * Default icons used across components
 * Add new icons here as needed - no type changes required
 */
const iconsDefaults = {
    // Default icons used across components
    loading: 'lucide:loader-2',
    chevronDown: 'lucide:chevron-down',
    chevronRight: 'lucide:chevron-right',
    close: 'lucide:x',
    check: 'lucide:check'
    // ...add more as needed
}

const componentDefaults = {
    button: buttonDefaults,
    avatar: avatarDefaults,
    avatarGroup: avatarGroupDefaults,
    alert: alertDefaults,
    card: cardDefaults,
    link: linkDefaults,
    separator: separatorDefaults,
    chip: chipDefaults,
    icons: iconsDefaults
}

// ==================== DERIVED TYPES ====================

type ComponentDefaults = typeof componentDefaults
type ComponentName = keyof ComponentDefaults

/** Deep partial type for component config */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** Config for each component - derived from its defaults */
export type UIConfig = {
    [K in ComponentName]?: DeepPartial<ComponentDefaults[K]>
}

/** Re-export component config types for external use */
export type ButtonConfig = UIConfig['button']
export type AvatarConfig = UIConfig['avatar']
export type AvatarGroupConfig = UIConfig['avatarGroup']
export type AlertConfig = UIConfig['alert']
export type CardConfig = UIConfig['card']
export type LinkConfig = UIConfig['link']
export type SeparatorConfig = UIConfig['separator']
export type ChipConfig = UIConfig['chip']
export type IconsConfig = UIConfig['icons']

// ==================== GLOBAL STATE ====================

let globalConfig: UIConfig = {}
let cachedConfigs: Partial<Record<ComponentName, ComponentDefaults[ComponentName]>> = {}

// ==================== PUBLIC API ====================

/**
 * Define global configuration for SV5UI components
 */
export function defineConfig(config: UIConfig): void {
    globalConfig = config
    cachedConfigs = {} // Invalidate cache
}

/**
 * Get the current global configuration
 */
export function getConfig(): UIConfig {
    return globalConfig
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): void {
    globalConfig = {}
    cachedConfigs = {}
}

// ==================== COMPONENT CONFIG GETTER ====================

/**
 * Deep merge utility for config objects
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: DeepPartial<T>): T {
    const result = { ...target } as T
    for (const key in source) {
        const sourceValue = source[key]
        const targetValue = target[key]
        if (
            sourceValue !== undefined &&
            typeof sourceValue === 'object' &&
            sourceValue !== null &&
            !Array.isArray(sourceValue) &&
            typeof targetValue === 'object' &&
            targetValue !== null &&
            !Array.isArray(targetValue)
        ) {
            result[key] = deepMerge(
                targetValue as Record<string, unknown>,
                sourceValue as DeepPartial<Record<string, unknown>>
            ) as T[Extract<keyof T, string>]
        } else if (sourceValue !== undefined) {
            result[key] = sourceValue as T[Extract<keyof T, string>]
        }
    }
    return result
}

/**
 * Get merged config for any component (memoized)
 * @internal
 */
export function getComponentConfig<K extends ComponentName>(component: K): ComponentDefaults[K] {
    if (!(component in cachedConfigs)) {
        const defaults = componentDefaults[component]
        const userConfig = globalConfig[component]
        cachedConfigs[component] = userConfig
            ? deepMerge(defaults as Record<string, unknown>, userConfig as DeepPartial<Record<string, unknown>>) as ComponentDefaults[K]
            : defaults
    }
    return cachedConfigs[component] as ComponentDefaults[K]
}
