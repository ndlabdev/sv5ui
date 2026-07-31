import type { ButtonProps } from '../Button/button.types.js'
import type { SidebarApi, SidebarBreakpoint } from './sidebar.types.js'

export type SidebarTriggerProps = ButtonProps & {
    /**
     * The Sidebar's `bind:api` handle. Preferred over the individual props
     * below: it already knows the breakpoint, so nothing is repeated.
     */
    api?: SidebarApi

    /**
     * Bindable desktop collapsed state to toggle. Toggled when the viewport is
     * at or above `breakpoint`. Ignored when `api` is provided.
     */
    collapsed?: boolean

    /**
     * Bindable mobile overlay open state to toggle. Toggled when the viewport
     * is below `breakpoint`. Ignored when `api` is provided.
     */
    open?: boolean

    /**
     * Breakpoint deciding whether the trigger toggles `open` (below) or
     * `collapsed` (at or above). Ignored when `api` is provided.
     * @default 'lg'
     */
    breakpoint?: SidebarBreakpoint
}
