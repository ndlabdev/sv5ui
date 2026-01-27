/** Rotation angles supported by Iconify (in degrees) */
export type IconRotation = 0 | 90 | 180 | 270

export interface IconProps {
    /**
     * Icon name in Iconify format: "collection:icon-name"
     * @example "lucide:home", "mdi:account", "heroicons:star"
     * @see https://icon-sets.iconify.design/
     */
    name: string

    /**
     * Icon size (applied to both width and height)
     * @default "1em"
     * @example 24, "1.5rem", "20px"
     */
    size?: number | string

    /**
     * Icon color (CSS color value)
     * @example "red", "#ff0000", "rgb(255, 0, 0)", "currentColor"
     */
    color?: string

    /**
     * Flip icon horizontally
     * @default false
     */
    flipH?: boolean

    /**
     * Flip icon vertically
     * @default false
     */
    flipV?: boolean

    /**
     * Rotate icon by specified degrees
     * @default 0
     */
    rotate?: IconRotation

    /** Additional CSS classes */
    class?: string
}
