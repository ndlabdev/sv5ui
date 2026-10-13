import type { InitialModeConfig } from './theme-mode.types.js'

export const SCRIPT_SIGNATURE = 'sv5uiInitialMode'

const NONCE_PATTERN = /^[A-Za-z0-9+/_-]+={0,2}$/

const INITIAL_MODE_SOURCE = `function ${SCRIPT_SIGNATURE}(c) {
    var root = document.documentElement;
    var modeKey = c.modeStorageKey || 'mode-watcher-mode';
    var themeKey = c.themeStorageKey || 'mode-watcher-theme';
    var dark = c.darkClassNames || ['dark'];
    var light = c.lightClassNames || [];
    var isMode = function (v) { return v === 'light' || v === 'dark' || v === 'system'; };
    var storage = null;
    try { storage = window.localStorage; } catch (e) { storage = null; }
    var read = function (k) { try { return storage ? storage.getItem(k) : null; } catch (e) { return null; } };
    var stored = read(modeKey);
    var mode = isMode(stored) ? stored : isMode(c.defaultMode) ? c.defaultMode : 'system';
    var resolved = mode === 'system' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : mode;
    (resolved === 'light' ? dark : light).forEach(function (n) { if (n) root.classList.remove(n); });
    (resolved === 'light' ? light : dark).forEach(function (n) { if (n) root.classList.add(n); });
    root.style.colorScheme = resolved;
    var meta = c.themeColors ? document.querySelector('meta[name="theme-color"]') : null;
    if (meta) meta.setAttribute('content', resolved === 'light' ? c.themeColors.light : c.themeColors.dark);
    var storedTheme = read(themeKey);
    var theme = storedTheme === null ? c.defaultTheme || '' : storedTheme;
    if (theme) root.setAttribute('data-theme', theme);
    try {
        if (storage && theme) storage.setItem(themeKey, theme);
        if (storage) storage.setItem(modeKey, mode);
    } catch (e) {
        storage = null;
    }
}`

const serialize = (config: InitialModeConfig) => JSON.stringify(config).replace(/</g, '\\u003c')

export function createInitialModeExpression(config: InitialModeConfig = {}): string {
    return `(${INITIAL_MODE_SOURCE})(${serialize(config)});`
}

export function isValidNonce(nonce: string | undefined): nonce is string {
    return typeof nonce === 'string' && NONCE_PATTERN.test(nonce)
}

export function createHeadScript(config: InitialModeConfig, nonce?: string): string {
    const nonceAttribute = isValidNonce(nonce) ? ` nonce="${nonce}"` : ''
    return `<script${nonceAttribute}>${createInitialModeExpression(config)}</script>`
}
