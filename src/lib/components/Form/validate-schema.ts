import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { FormError, FormSchema, JoiSchema } from './form.types.js'

// ==================== TYPE GUARDS ====================

export function isStandardSchema(schema: unknown): schema is StandardSchemaV1 {
    return (
        typeof schema === 'object' &&
        schema !== null &&
        '~standard' in schema &&
        typeof (schema as { '~standard'?: unknown })['~standard'] === 'object'
    )
}

export function isJoiSchema(schema: unknown): schema is JoiSchema {
    if (typeof schema !== 'object' || schema === null) return false
    const s = schema as Record<string, unknown>
    return (
        typeof s.validate === 'function' &&
        typeof s.validateAsync === 'function' &&
        '$_root' in s &&
        typeof s.type === 'string'
    )
}

// ==================== RESULT TYPE ====================

export interface ValidateResult<T = unknown> {
    errors: FormError[] | null
    value: T | null
}

// ==================== NORMALIZE STANDARD SCHEMA PATH ====================

function normalizePath(
    path: ReadonlyArray<PropertyKey | { key: PropertyKey }> | undefined
): string {
    if (!path || path.length === 0) return ''
    return path
        .map((segment) => {
            if (typeof segment === 'object' && segment !== null && 'key' in segment) {
                return String(segment.key)
            }
            return String(segment)
        })
        .join('.')
}

// ==================== STANDARD SCHEMA VALIDATOR ====================
// Handles Zod 3.24+, Valibot 1.0+, Yup 1.7+ (and any other library
// implementing the Standard Schema spec).

export async function validateStandardSchema<T>(
    state: unknown,
    schema: StandardSchemaV1<unknown, T>
): Promise<ValidateResult<T>> {
    let result = schema['~standard'].validate(state)
    if (result instanceof Promise) result = await result

    if ('issues' in result && result.issues) {
        return {
            errors: result.issues.map((issue) => ({
                name: normalizePath(issue.path),
                message: issue.message
            })),
            value: null
        }
    }

    return {
        errors: null,
        value: (result as { value: T }).value
    }
}

// ==================== JOI VALIDATOR ====================

export async function validateJoiSchema<T>(
    state: unknown,
    schema: JoiSchema
): Promise<ValidateResult<T>> {
    // abortEarly: false → collect all errors, not just the first.
    const result = schema.validate(state, { abortEarly: false })

    if (result.error) {
        return {
            errors: result.error.details.map((detail) => ({
                name: detail.path.map(String).join('.'),
                message: detail.message
            })),
            value: null
        }
    }

    return {
        errors: null,
        value: (result.value ?? null) as T | null
    }
}

// ==================== DISPATCH ====================

export function validateSchema<T>(state: unknown, schema: FormSchema): Promise<ValidateResult<T>> {
    // Joi is checked first, even though Joi 18+ also implements Standard Schema:
    // Joi's Standard Schema impl defaults to `abortEarly: true` (stopping at the
    // first error), whereas we want to surface ALL errors per field so the user
    // can see every invalid field at once. The dedicated Joi adapter passes
    // `{ abortEarly: false }` explicitly.
    if (isJoiSchema(schema)) {
        return validateJoiSchema<T>(state, schema)
    }
    if (isStandardSchema(schema)) {
        return validateStandardSchema<T>(state, schema as StandardSchemaV1<unknown, T>)
    }
    throw new Error('Form validation failed: Unsupported form schema')
}

// ==================== PATH UTILITIES (nested form support) ====================

export function getAtPath<T extends Record<string, unknown>>(data: T, path?: string): unknown {
    if (!path) return data
    return path.split('.').reduce<unknown>((value, key) => {
        if (value === null || value === undefined) return undefined
        return (value as Record<string, unknown>)[key]
    }, data)
}

export function setAtPath<T extends Record<string, unknown>>(
    data: T,
    path: string,
    value: unknown
): T {
    if (!path) {
        return Object.assign(data, value as Record<string, unknown>)
    }
    if (!data) return data

    const keys = path.split('.')
    let current = data as Record<string, unknown>

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i] as string
        if (current[key] === undefined || current[key] === null) {
            const nextKey = keys[i + 1] as string
            current[key] = !Number.isNaN(Number(nextKey)) ? [] : {}
        }
        current = current[key] as Record<string, unknown>
    }

    const lastKey = keys[keys.length - 1] as string
    current[lastKey] = value
    return data
}
