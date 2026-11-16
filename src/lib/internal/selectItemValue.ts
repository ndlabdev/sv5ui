const EMPTY_ITEM_VALUE = '@@sv5ui/select/empty-item'

export function toPrimitiveValue(value: string): string {
    return value === '' ? EMPTY_ITEM_VALUE : value
}

export function fromPrimitiveValue(value: string): string {
    return value === EMPTY_ITEM_VALUE ? '' : value
}
