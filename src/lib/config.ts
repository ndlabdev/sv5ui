/**
 * SV5UI Global Configuration
 *
 * @example
 * ```ts
 * import { defineConfig } from 'sv5ui'
 *
 * defineConfig({
 *     button: { variant: 'outline', color: 'secondary' },
 *     avatar: { size: 'lg' },
 *     avatarGroup: { size: 'lg' },
 *     icons: { loading: 'svg-spinners:ring-resize' }
 * })
 * ```
 */

// ==================== IMPORTS ====================

import { buttonDefaults } from './Button/button.variants.js'
import { avatarDefaults } from './Avatar/avatar.variants.js'
import { avatarGroupDefaults } from './AvatarGroup/avatar-group.variants.js'
import { alertDefaults } from './Alert/alert.variants.js'

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
    icons: iconsDefaults
}

// ==================== DERIVED TYPES ====================

type ComponentDefaults = typeof componentDefaults
type ComponentName = keyof ComponentDefaults

/** Config for each component - derived from its defaults */
export type UIConfig = {
    [K in ComponentName]?: Partial<ComponentDefaults[K]>
}

/** Re-export component config types for external use */
export type ButtonConfig = UIConfig['button']
export type AvatarConfig = UIConfig['avatar']
export type AvatarGroupConfig = UIConfig['avatarGroup']
export type AlertConfig = UIConfig['alert']
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
 * Get merged config for any component (memoized)
 * @internal
 */
export function getComponentConfig<K extends ComponentName>(component: K): ComponentDefaults[K] {
    if (!(component in cachedConfigs)) {
        cachedConfigs[component] = {
            ...componentDefaults[component],
            ...globalConfig[component]
        } as ComponentDefaults[K]
    }
    return cachedConfigs[component] as ComponentDefaults[K]
}
