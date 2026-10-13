/**
 * A mode the user can choose. `system` follows the operating system preference.
 */
export type ColorMode = 'light' | 'dark' | 'system'

/**
 * A resolved mode, or `undefined` while it cannot be known (during SSR).
 */
export type ResolvedColorMode = 'light' | 'dark' | undefined

/**
 * Colors written to `<meta name="theme-color">` for each resolved mode.
 */
export type ThemeColors = { light: string; dark: string } | undefined

/**
 * Settings shared by the head script and `createInitialModeExpression`.
 */
export type InitialModeConfig = {
    /**
     * Mode used when nothing valid is stored.
     * @default 'system'
     */
    defaultMode?: ColorMode

    /**
     * Colors written to `<meta name="theme-color">` for each resolved mode.
     */
    themeColors?: ThemeColors

    /**
     * Classes added to the root `html` element in dark mode.
     * @default ['dark']
     */
    darkClassNames?: string[]

    /**
     * Classes added to the root `html` element in light mode.
     * @default []
     */
    lightClassNames?: string[]

    /**
     * Value written to the `data-theme` attribute of the root `html` element when none is stored.
     * @default ''
     */
    defaultTheme?: string

    /**
     * `localStorage` key holding the chosen mode.
     * @default 'mode-watcher-mode'
     */
    modeStorageKey?: string

    /**
     * `localStorage` key holding the theme.
     * @default 'mode-watcher-theme'
     */
    themeStorageKey?: string
}

export type ThemeModeProps = InitialModeConfig & {
    /**
     * Follow operating system changes while the mode is `system`.
     * @default true
     */
    track?: boolean

    /**
     * Suppress CSS transitions while the mode switches.
     * @default true
     */
    disableTransitions?: boolean

    /**
     * Apply a switch in the same frame instead of the next one.
     * Only applies while `disableTransitions` is `true`.
     * @default false
     */
    synchronousModeChanges?: boolean

    /**
     * CSP nonce added to the injected head script. Only base64 characters are accepted;
     * any other value is dropped with a warning.
     */
    nonce?: string

    /**
     * Skip the injected head script, for apps that add it themselves with
     * `createInitialModeExpression`.
     * @default false
     */
    disableHeadScriptInjection?: boolean
}
