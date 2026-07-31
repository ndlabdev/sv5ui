import type { ButtonProps } from '../Button/button.types.js'
import type { SidebarBreakpoint } from './sidebar.types.js'

export type SidebarTriggerProps = ButtonProps & {
    /**
     * Bindable desktop collapsed state to toggle. Toggled when the viewport is at
     * or above `breakpoint`.
     */
    collapsed?: boolean

    /**
     * Bindable mobile overlay open state to toggle. Toggled when the viewport is
     * below `breakpoint`.
     */
    open?: boolean

    /**
     * Breakpoint deciding whether the trigger toggles `open` (below) or
     * `collapsed` (at or above). Should match the Sidebar's `breakpoint`.
     * @default 'lg'
     */
    breakpoint?: SidebarBreakpoint
}
