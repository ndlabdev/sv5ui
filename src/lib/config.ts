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

// ==================== ICONS DEFAULTS ====================

/**
 * Default icons used across components
 */
export const iconsDefaults = {
    loading: 'lucide:loader-2',
    chevronDown: 'lucide:chevron-down',
    chevronRight: 'lucide:chevron-right',
    close: 'lucide:x',
    check: 'lucide:check'
}

// ==================== TYPES ====================

/** Deep partial type for config objects */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** Generic component config shape */
export type UIConfig = {
    [key: string]: DeepPartial<Record<string, unknown>> | undefined
    icons?: DeepPartial<typeof iconsDefaults>
}

// ==================== GLOBAL STATE ====================

let globalConfig: UIConfig = {}
let cachedConfigs: Record<string, unknown> = {}

// ==================== PUBLIC API ====================

/**
 * Define global configuration for SV5UI components
 */
export function defineConfig(config: UIConfig): void {
    globalConfig = config
    cachedConfigs = {}
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
 * Get merged config for a component (memoized).
 * Each component passes its own defaults, so config.ts doesn't import any variant files.
 * This enables proper tree-shaking: unused components are excluded from the bundle.
 * @internal
 */
export function getComponentConfig<T extends Record<string, unknown>>(component: string, defaults: T): T {
    if (!(component in cachedConfigs)) {
        const userConfig = globalConfig[component]
        cachedConfigs[component] = userConfig
            ? deepMerge(defaults as Record<string, unknown>, userConfig as DeepPartial<Record<string, unknown>>) as T
            : defaults
    }
    return cachedConfigs[component] as T
}
