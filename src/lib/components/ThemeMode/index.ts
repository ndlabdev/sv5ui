export { default as ThemeMode } from './ThemeMode.svelte'
export type { ThemeModeProps } from './theme-mode.types.js'
export {
    toggleMode,
    setMode,
    resetMode,
    mode,
    userPrefersMode,
    systemPrefersMode
} from 'mode-watcher'
