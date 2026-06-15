import { toast as sonnerToast } from 'svelte-sonner'
import { mount, unmount } from 'svelte'
import type { Component } from 'svelte'
import type { ExternalToast } from 'svelte-sonner'
import Icon from '../Icon/Icon.svelte'
import Avatar from '../Avatar/Avatar.svelte'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { ToastColor } from './toast.variants.js'

type ToastAvatarOptions = Pick<AvatarProps, 'src' | 'alt' | 'text' | 'icon' | 'size'>

type SV5UIToastOptions = Omit<ExternalToast, 'icon'> & {
    /**
     * Semantic color for the toast.
     * Works with all Toaster variants (outline, soft, subtle, solid, accent).
     * @example toast('Message', { color: 'primary' })
     */
    color?: ToastColor

    /**
     * Iconify icon name to display in the toast.
     * Replaces the default type icon (success checkmark, error X, etc.)
     * @example toast('Launched!', { icon: 'lucide:rocket' })
     */
    icon?: string | ExternalToast['icon']

    /**
     * Avatar to display in the icon slot.
     * Pass an object with Avatar props (src, alt, text, icon, size).
     * @example toast('John commented', { avatar: { src: '/avatar.jpg', alt: 'John' } })
     */
    avatar?: ToastAvatarOptions
}

function createIconComponent(name: string): Component {
    function SvelteSonnerIcon(anchor: Node) {
        if (!anchor.parentNode) return { destroy() {} }
        const instance = mount(Icon, {
            target: anchor.parentNode as Element,
            anchor,
            props: { name, size: '18' }
        })
        return {
            destroy() {
                unmount(instance)
            }
        }
    }
    return SvelteSonnerIcon as unknown as Component
}

function createAvatarComponent(props: ToastAvatarOptions): Component {
    function SvelteSonnerAvatar(anchor: Node) {
        if (!anchor.parentNode) return { destroy() {} }
        const instance = mount(Avatar, {
            target: anchor.parentNode as Element,
            anchor,
            props: { size: 'sm', ...props }
        })
        return {
            destroy() {
                unmount(instance)
            }
        }
    }
    return SvelteSonnerAvatar as unknown as Component
}

function resolveOptions(data?: SV5UIToastOptions): ExternalToast | undefined {
    if (!data) return data

    const { color, icon, avatar, ...rest } = data
    const resolved: ExternalToast = { ...rest }

    // Color -> class
    if (color) {
        const existing = resolved.class ?? ''
        resolved.class = `${existing} sv5ui-color-${color}`.trim()
    }

    // Avatar takes priority over icon
    if (avatar) {
        resolved.icon = createAvatarComponent(avatar)
    } else if (typeof icon === 'string') {
        resolved.icon = createIconComponent(icon)
    } else if (icon !== undefined) {
        resolved.icon = icon
    }

    return resolved
}

function toastFn(message: string, data?: SV5UIToastOptions) {
    return sonnerToast(message, resolveOptions(data))
}

toastFn.success = (message: string, data?: SV5UIToastOptions) =>
    sonnerToast.success(message, resolveOptions(data))

toastFn.error = (message: string, data?: SV5UIToastOptions) =>
    sonnerToast.error(message, resolveOptions(data))

toastFn.warning = (message: string, data?: SV5UIToastOptions) =>
    sonnerToast.warning(message, resolveOptions(data))

toastFn.info = (message: string, data?: SV5UIToastOptions) =>
    sonnerToast.info(message, resolveOptions(data))

toastFn.loading = (message: string, data?: SV5UIToastOptions) =>
    sonnerToast.loading(message, resolveOptions(data))

toastFn.promise = sonnerToast.promise

toastFn.dismiss = sonnerToast.dismiss

toastFn.custom = sonnerToast.custom

toastFn.message = sonnerToast.message

export { toastFn as toast }
export type { SV5UIToastOptions as ToastOptions }
