import { describe, expect, it } from 'vitest'
import {
    isStandardSchema,
    isJoiSchema,
    validateStandardSchema,
    validateJoiSchema,
    validateSchema,
    getAtPath,
    setAtPath
} from './validate-schema.js'
import type { StandardSchemaV1, JoiSchema } from './form.types.js'

// ==================== MOCK SCHEMAS ====================

/**
 * Hand-rolled Standard Schema v1 — matches Zod/Valibot/ArkType shape.
 * Requires { email: string (contains @), age: number }.
 */
function makeStandardSchema(): StandardSchemaV1<
    { email: string; age: number },
    { email: string; age: number }
> {
    return {
        '~standard': {
            version: 1,
            vendor: 'test',
            validate(value: unknown) {
                const v = value as Partial<{ email: string; age: number }>
                const issues: Array<{ message: string; path?: PropertyKey[] }> = []
                if (typeof v?.email !== 'string' || !v.email.includes('@')) {
                    issues.push({ message: 'Invalid email', path: ['email'] })
                }
                if (typeof v?.age !== 'number' || v.age < 0) {
                    issues.push({ message: 'Invalid age', path: ['age'] })
                }
                if (issues.length > 0) return { issues }
                return { value: v as { email: string; age: number } }
            }
        }
    }
}

/** Async variant — validate returns a Promise. */
function makeAsyncStandardSchema(): StandardSchemaV1<{ name: string }, { name: string }> {
    return {
        '~standard': {
            version: 1,
            vendor: 'test-async',
            async validate(value: unknown) {
                const v = value as { name?: string }
                await new Promise((r) => setTimeout(r, 5))
                if (!v?.name) {
                    return { issues: [{ message: 'Name required', path: ['name'] }] }
                }
                return { value: { name: v.name } }
            }
        }
    }
}

/** Nested-path variant. */
function makeNestedSchema(): StandardSchemaV1 {
    return {
        '~standard': {
            version: 1,
            vendor: 'test',
            validate(value: unknown) {
                const v = value as { address?: { street?: string } }
                if (!v?.address?.street) {
                    return {
                        issues: [
                            {
                                message: 'Street required',
                                path: ['address', 'street']
                            }
                        ]
                    }
                }
                return { value: v }
            }
        }
    }
}

/** Path with object-segment form { key }. */
function makeObjectPathSchema(): StandardSchemaV1 {
    return {
        '~standard': {
            version: 1,
            vendor: 'test',
            validate() {
                return {
                    issues: [
                        {
                            message: 'error',
                            path: [{ key: 'items' }, { key: 0 }, { key: 'name' }]
                        }
                    ]
                }
            }
        }
    }
}

/**
 * Hand-rolled Joi-shaped schema (structural duck-typing).
 * We use a mock here rather than importing real Joi to keep unit tests decoupled
 * from the library. Real-Joi integration is covered in form.integration.svelte.spec.ts.
 */
function makeJoiMock(): JoiSchema {
    return {
        $_root: {},
        type: 'object',
        validateAsync: async (value: unknown) => value,
        validate(value: unknown) {
            const v = value as { name?: string; age?: number }
            const details: Array<{ message: string; path: Array<string | number> }> = []
            if (!v?.name) {
                details.push({ message: '"name" is required', path: ['name'] })
            }
            if (typeof v?.age !== 'number' || v.age < 0) {
                details.push({ message: '"age" must be >= 0', path: ['age'] })
            }
            if (details.length > 0) {
                return { value: v, error: { details } }
            }
            return { value: v }
        }
    }
}

// ==================== TESTS ====================

describe('isStandardSchema', () => {
    it('returns true for a Standard Schema object', () => {
        expect(isStandardSchema(makeStandardSchema())).toBe(true)
    })

    it('returns false for non-standard objects', () => {
        expect(isStandardSchema({})).toBe(false)
        expect(isStandardSchema(null)).toBe(false)
        expect(isStandardSchema(undefined)).toBe(false)
        expect(isStandardSchema('string')).toBe(false)
        expect(isStandardSchema(42)).toBe(false)
    })

    it('returns false for a Joi-shaped object', () => {
        expect(isStandardSchema(makeJoiMock())).toBe(false)
    })
})

describe('isJoiSchema', () => {
    it('returns true for a Joi-shaped object', () => {
        expect(isJoiSchema(makeJoiMock())).toBe(true)
    })

    it('returns false for a Standard Schema object', () => {
        expect(isJoiSchema(makeStandardSchema())).toBe(false)
    })

    it('returns false for plain objects', () => {
        expect(isJoiSchema({})).toBe(false)
        expect(isJoiSchema({ validate: () => undefined })).toBe(false)
    })
})

describe('validateStandardSchema', () => {
    it('returns errors for invalid data', async () => {
        const result = await validateStandardSchema({ email: 'bad', age: -1 }, makeStandardSchema())
        expect(result.errors).toHaveLength(2)
        expect(result.errors?.[0]).toEqual({ name: 'email', message: 'Invalid email' })
        expect(result.errors?.[1]).toEqual({ name: 'age', message: 'Invalid age' })
        expect(result.value).toBeNull()
    })

    it('returns value for valid data', async () => {
        const result = await validateStandardSchema(
            { email: 'a@b.com', age: 30 },
            makeStandardSchema()
        )
        expect(result.errors).toBeNull()
        expect(result.value).toEqual({ email: 'a@b.com', age: 30 })
    })

    it('handles async schemas', async () => {
        const result = await validateStandardSchema({ name: 'ok' }, makeAsyncStandardSchema())
        expect(result.errors).toBeNull()
        expect(result.value).toEqual({ name: 'ok' })
    })

    it('normalizes nested paths with dots', async () => {
        const result = await validateStandardSchema({}, makeNestedSchema())
        expect(result.errors?.[0]?.name).toBe('address.street')
    })

    it('normalizes object-form path segments ({ key })', async () => {
        const result = await validateStandardSchema({}, makeObjectPathSchema())
        expect(result.errors?.[0]?.name).toBe('items.0.name')
    })
})

describe('validateJoiSchema', () => {
    it('returns errors from details[] with abortEarly: false', async () => {
        const result = await validateJoiSchema({}, makeJoiMock())
        expect(result.errors).toHaveLength(2)
        expect(result.errors?.[0]).toEqual({ name: 'name', message: '"name" is required' })
        expect(result.errors?.[1]).toEqual({ name: 'age', message: '"age" must be >= 0' })
    })

    it('returns value on success', async () => {
        const result = await validateJoiSchema({ name: 'ok', age: 20 }, makeJoiMock())
        expect(result.errors).toBeNull()
        expect(result.value).toEqual({ name: 'ok', age: 20 })
    })
})

describe('validateSchema (dispatch)', () => {
    it('dispatches to Standard Schema', async () => {
        const result = await validateSchema({ email: 'bad', age: -1 }, makeStandardSchema())
        expect(result.errors).not.toBeNull()
    })

    it('dispatches to Joi', async () => {
        const result = await validateSchema({}, makeJoiMock())
        expect(result.errors).not.toBeNull()
    })

    it('throws on unsupported schema', () => {
        expect(() =>
            validateSchema({}, {} as unknown as ReturnType<typeof makeStandardSchema>)
        ).toThrow('Unsupported')
    })
})

describe('getAtPath', () => {
    it('returns root when path is empty', () => {
        expect(getAtPath({ a: 1 }, '')).toEqual({ a: 1 })
        expect(getAtPath({ a: 1 }, undefined)).toEqual({ a: 1 })
    })

    it('reads shallow paths', () => {
        expect(getAtPath({ a: 1 }, 'a')).toBe(1)
    })

    it('reads nested paths', () => {
        expect(getAtPath({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42)
    })

    it('returns undefined for missing paths', () => {
        expect(getAtPath({ a: 1 }, 'b.c')).toBeUndefined()
        expect(getAtPath({} as Record<string, unknown>, 'a.b')).toBeUndefined()
    })
})

describe('setAtPath', () => {
    it('sets shallow properties', () => {
        const obj: Record<string, unknown> = {}
        setAtPath(obj, 'name', 'Alice')
        expect(obj.name).toBe('Alice')
    })

    it('creates nested objects when missing', () => {
        const obj: Record<string, unknown> = {}
        setAtPath(obj, 'a.b.c', 42)
        expect(obj).toEqual({ a: { b: { c: 42 } } })
    })

    it('creates arrays when next key is numeric', () => {
        const obj: Record<string, unknown> = {}
        setAtPath(obj, 'items.0', 'first')
        expect(Array.isArray((obj as { items: unknown }).items)).toBe(true)
        expect((obj as { items: unknown[] }).items[0]).toBe('first')
    })

    it('overwrites existing values', () => {
        const obj = { a: { b: 1 } } as Record<string, unknown>
        setAtPath(obj, 'a.b', 99)
        expect((obj.a as { b: number }).b).toBe(99)
    })
})
