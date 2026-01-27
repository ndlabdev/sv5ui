/**
 * SV5UI Global Configuration
 *
 * @example
 * ```ts
 * import { defineConfig } from 'sv5ui'
 *
 * defineConfig({
 *     button: { variant: 'outline', color: 'secondary' },
 *     icons: { loading: 'svg-spinners:ring-resize' }
 * })
 * ```
 */

// ==================== IMPORTS ====================

import { buttonDefaults } from './Button/button.variants.js'

// ==================== COMPONENT DEFAULTS (user-configurable) ====================

/**
 * Registry of user-configurable component defaults
 * To add a new component, just add its defaults here
 */
/**
 * Default icons used across components
 * Add new icons here as needed - no type changes required
 */
const iconsDefaults: Record<string, string> = {
    loading: 'lucide:loader-2',
    chevronDown: 'lucide:chevron-down',
    chevronRight: 'lucide:chevron-right',
    close: 'lucide:x',
    check: 'lucide:check'
    // ...add more as needed
}

const componentDefaults = {
    button: buttonDefaults,
    icons: iconsDefaults
    // accordion: accordionDefaults,
    // alert: alertDefaults,
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

// ==================== INTERNAL: GENERIC CONFIG GETTER ====================

/**
 * Get merged config for any component (memoized)
 * @internal
 */
function getComponentConfig<K extends ComponentName>(component: K): ComponentDefaults[K] {
    if (!(component in cachedConfigs)) {
        cachedConfigs[component] = {
            ...componentDefaults[component],
            ...globalConfig[component]
        } as ComponentDefaults[K]
    }
    return cachedConfigs[component] as ComponentDefaults[K]
}

// ==================== COMPONENT CONFIG GETTERS ====================

/** @internal */
export const getButtonConfig = () => getComponentConfig('button')

/** @internal */
export const getIconsConfig = () => getComponentConfig('icons')
