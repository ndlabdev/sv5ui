// Components
export * from './Icon/index.js'
export * from './Button/index.js'

// Configuration
export { defineConfig, getConfig, resetConfig } from './config.js'
export type { UIConfig, ButtonConfig, IconsConfig } from './config.js'

// Re-export mode-watcher for convenience
export { ModeWatcher, toggleMode, setMode, resetMode, mode } from 'mode-watcher'
