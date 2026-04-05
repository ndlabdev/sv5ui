import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import * as v from 'valibot'
import * as yup from 'yup'
import Joi from 'joi'
import { FormContext, type FormContextOptions } from './form.context.svelte.js'
import type { FormSchema, JoiSchema } from './form.types.js'

/**
 * Integration tests using REAL schema libraries (Zod, Valibot, Yup, Joi) to
 * prove the four officially supported libraries work end-to-end. The first
 * three go through the Standard Schema path; Joi uses its dedicated adapter
 * (Joi does not implement Standard Schema as of v18). Unit tests in
 * form.context.svelte.spec.ts use hand-rolled mocks to stay decoupled.
 */

function makeOpts(
    schema: FormSchema,
    state: unknown,
    overrides: Partial<FormContextOptions<unknown>> = {}
): FormContextOptions<unknown> {
    return {
        getState: () => state,
        getSchema: () => schema,
        getCustomValidate: () => undefined,
        getValidateOn: () => ['input', 'blur', 'change'],
        getValidateOnInputDelay: () => 300,
        getDisabled: () => false,
        getLoadingAuto: () => true,
        getTransform: () => false,
        getName: () => undefined,
        getOnSubmit: () => undefined,
        getOnError: () => undefined,
        ...overrides
    }
}

function makeCtx(schema: FormSchema, state: unknown) {
    let ctx: FormContext<unknown>
    const cleanup = $effect.root(() => {
        ctx = new FormContext(makeOpts(schema, state), 'integration-form')
    })
    return { ctx: ctx!, cleanup }
}

// ============================================================
// ZOD
// ============================================================

describe('Integration — Zod', () => {
    const zodSchema = z.object({
        email: z.string().email('Invalid email'),
        age: z.number().min(18, 'Must be 18+')
    })

    it('rejects invalid data with Zod errors', async () => {
        const { ctx, cleanup } = makeCtx(zodSchema, { email: 'bad', age: 10 })
        const result = await ctx.validate({ silent: true })
        expect(result).toBe(false)
        expect(ctx.errors).toHaveLength(2)
        expect(ctx.errors.find((e) => e.name === 'email')?.message).toBe('Invalid email')
        expect(ctx.errors.find((e) => e.name === 'age')?.message).toBe('Must be 18+')
        cleanup()
    })

    it('accepts valid data with Zod', async () => {
        const { ctx, cleanup } = makeCtx(zodSchema, { email: 'a@b.com', age: 30 })
        const result = await ctx.validate({ silent: true })
        expect(result).toEqual({ email: 'a@b.com', age: 30 })
        expect(ctx.errors).toEqual([])
        cleanup()
    })

    it('normalizes Zod nested paths to dotted names', async () => {
        const nested = z.object({
            address: z.object({
                street: z.string().min(1, 'Street required')
            })
        })
        const { ctx, cleanup } = makeCtx(nested, { address: { street: '' } })
        await ctx.validate({ silent: true })
        expect(ctx.errors[0]?.name).toBe('address.street')
        expect(ctx.errors[0]?.message).toBe('Street required')
        cleanup()
    })
})

// ============================================================
// VALIBOT
// ============================================================

describe('Integration — Valibot', () => {
    const valibotSchema = v.object({
        email: v.pipe(v.string(), v.email('Invalid email')),
        age: v.pipe(v.number(), v.minValue(18, 'Must be 18+'))
    })

    it('rejects invalid data with Valibot errors', async () => {
        const { ctx, cleanup } = makeCtx(valibotSchema, { email: 'bad', age: 10 })
        const result = await ctx.validate({ silent: true })
        expect(result).toBe(false)
        expect(ctx.errors.find((e) => e.name === 'email')?.message).toBe('Invalid email')
        expect(ctx.errors.find((e) => e.name === 'age')?.message).toBe('Must be 18+')
        cleanup()
    })

    it('accepts valid data with Valibot', async () => {
        const { ctx, cleanup } = makeCtx(valibotSchema, { email: 'a@b.com', age: 30 })
        const result = await ctx.validate({ silent: true })
        expect(result).toEqual({ email: 'a@b.com', age: 30 })
        cleanup()
    })

    it('normalizes Valibot nested paths', async () => {
        const nested = v.object({
            address: v.object({
                street: v.pipe(v.string(), v.minLength(1, 'Street required'))
            })
        })
        const { ctx, cleanup } = makeCtx(nested, { address: { street: '' } })
        await ctx.validate({ silent: true })
        expect(ctx.errors[0]?.name).toBe('address.street')
        cleanup()
    })
})

// ============================================================
// YUP
// ============================================================

describe('Integration — Yup', () => {
    const yupSchema = yup.object({
        email: yup.string().required().email('Invalid email'),
        age: yup.number().required().min(18, 'Must be 18+')
    })

    it('rejects invalid data with Yup errors', async () => {
        const { ctx, cleanup } = makeCtx(yupSchema, { email: 'bad', age: 10 })
        const result = await ctx.validate({ silent: true })
        expect(result).toBe(false)
        expect(ctx.errors.find((e) => e.name === 'email')?.message).toBe('Invalid email')
        expect(ctx.errors.find((e) => e.name === 'age')?.message).toBe('Must be 18+')
        cleanup()
    })

    it('accepts valid data with Yup', async () => {
        const { ctx, cleanup } = makeCtx(yupSchema, { email: 'a@b.com', age: 30 })
        const result = await ctx.validate({ silent: true })
        expect(result).toEqual({ email: 'a@b.com', age: 30 })
        cleanup()
    })
})

// ============================================================
// JOI
// ============================================================

describe('Integration — Joi', () => {
    const joiSchema = Joi.object({
        email: Joi.string().email().required(),
        age: Joi.number().min(18).required()
    }) as unknown as JoiSchema

    it('rejects invalid data with Joi errors', async () => {
        const { ctx, cleanup } = makeCtx(joiSchema, { email: 'bad', age: 10 })
        const result = await ctx.validate({ silent: true })
        expect(result).toBe(false)
        // Joi's default messages mention the field — assert they contain it.
        expect(ctx.errors.find((e) => e.name === 'email')?.message).toMatch(/email/i)
        expect(ctx.errors.find((e) => e.name === 'age')?.message).toMatch(/18/)
        cleanup()
    })

    it('accepts valid data with Joi', async () => {
        const { ctx, cleanup } = makeCtx(joiSchema, { email: 'a@b.com', age: 30 })
        const result = await ctx.validate({ silent: true })
        expect(result).toEqual({ email: 'a@b.com', age: 30 })
        expect(ctx.errors).toEqual([])
        cleanup()
    })

    it('collects all errors (abortEarly: false)', async () => {
        const { ctx, cleanup } = makeCtx(joiSchema, { email: 'bad', age: 10 })
        await ctx.validate({ silent: true })
        expect(ctx.errors).toHaveLength(2)
        cleanup()
    })

    it('normalizes Joi nested paths to dotted names', async () => {
        const nested = Joi.object({
            address: Joi.object({
                street: Joi.string().required()
            }).required()
        }) as unknown as JoiSchema

        const { ctx, cleanup } = makeCtx(nested, { address: { street: '' } })
        await ctx.validate({ silent: true })
        expect(ctx.errors[0]?.name).toBe('address.street')
        cleanup()
    })
})

// ============================================================
// CROSS-LIB PARITY
// ============================================================

describe('Integration — cross-library parity', () => {
    it('produces the same error field names across Zod, Valibot, Yup, Joi', async () => {
        const zodS = z.object({ email: z.string().email(), age: z.number().min(18) })
        const valS = v.object({
            email: v.pipe(v.string(), v.email()),
            age: v.pipe(v.number(), v.minValue(18))
        })
        const yupS = yup.object({
            email: yup.string().required().email(),
            age: yup.number().required().min(18)
        })
        const joiS = Joi.object({
            email: Joi.string().email().required(),
            age: Joi.number().min(18).required()
        }) as unknown as JoiSchema

        const bad = { email: 'bad', age: 10 }
        const collect = async (schema: FormSchema) => {
            const { ctx, cleanup } = makeCtx(schema, bad)
            await ctx.validate({ silent: true })
            const names = new Set(ctx.errors.map((e) => e.name))
            cleanup()
            return names
        }

        const [zodNames, valNames, yupNames, joiNames] = await Promise.all([
            collect(zodS),
            collect(valS),
            collect(yupS),
            collect(joiS)
        ])

        expect(zodNames).toEqual(valNames)
        expect(valNames).toEqual(yupNames)
        expect(yupNames).toEqual(joiNames)
        expect(zodNames.has('email')).toBe(true)
        expect(zodNames.has('age')).toBe(true)
    })
})
