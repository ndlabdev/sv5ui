import { describe, expect, it, vi } from 'vitest'
import { FormContext, type FormContextOptions } from './form.context.svelte.js'
import { FormValidationException, type StandardSchemaV1 } from './form.types.js'

// ==================== TEST HELPERS ====================

function makeSchema(): StandardSchemaV1<
    { email: string; age: number },
    { email: string; age: number }
> {
    return {
        '~standard': {
            version: 1,
            vendor: 'test',
            validate(value: unknown) {
                const v = value as Partial<{ email: string; age: number }>
                const issues: Array<{ message: string; path: PropertyKey[] }> = []
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

function makeOpts(
    overrides: Partial<FormContextOptions<unknown>> = {}
): FormContextOptions<unknown> {
    return {
        getState: () => ({ email: 'a@b.com', age: 30 }),
        getSchema: () => undefined,
        getCustomValidate: () => undefined,
        getValidateOn: () => ['input', 'blur', 'change'],
        getValidateOnInputDelay: () => 300,
        getDisabled: () => false,
        getLoadingAuto: () => true,
        getTransform: () => true,
        getName: () => undefined,
        getOnSubmit: () => undefined,
        getOnError: () => undefined,
        ...overrides
    }
}

function makeCtx(overrides: Partial<FormContextOptions<unknown>> = {}) {
    // Tests wrap ctx creation in $effect.root so $state inside the class is allowed
    let ctx: FormContext<unknown>
    const cleanup = $effect.root(() => {
        ctx = new FormContext(makeOpts(overrides), 'test-form')
    })
    return { ctx: ctx!, cleanup }
}

// ==================== TESTS ====================

describe('FormContext — construction & initial state', () => {
    it('initializes with empty state', () => {
        const { ctx, cleanup } = makeCtx()
        expect(ctx.errors).toEqual([])
        expect(ctx.loading).toBe(false)
        expect(ctx.dirty).toBe(false)
        expect(ctx.disabled).toBe(false)
        expect(ctx.dirtyFields.size).toBe(0)
        expect(ctx.touchedFields.size).toBe(0)
        expect(ctx.blurredFields.size).toBe(0)
        cleanup()
    })

    it('exposes formId', () => {
        const { ctx, cleanup } = makeCtx()
        expect(ctx.formId).toBe('test-form')
        cleanup()
    })
})

describe('FormContext — schema validation', () => {
    it('populates errors from schema on full validate()', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: -1 }),
            getSchema: () => makeSchema()
        })
        const result = await ctx.validate({ silent: true })
        expect(result).toBe(false)
        expect(ctx.errors).toHaveLength(2)
        expect(ctx.errors.map((e) => e.name)).toEqual(['email', 'age'])
        cleanup()
    })

    it('returns state when valid', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getTransform: () => false
        })
        const result = await ctx.validate()
        expect(result).toEqual({ email: 'a@b.com', age: 30 })
        expect(ctx.errors).toEqual([])
        cleanup()
    })

    it('throws FormValidationException when silent=false and errors exist', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: 30 }),
            getSchema: () => makeSchema()
        })
        await expect(ctx.validate({ silent: false })).rejects.toThrow(FormValidationException)
        cleanup()
    })
})

describe('FormContext — custom validate prop', () => {
    it('runs custom validate alongside schema', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getCustomValidate: () => () => [{ name: 'email', message: 'Blocked by custom' }]
        })
        await ctx.validate({ silent: true })
        expect(ctx.errors.some((e) => e.message === 'Blocked by custom')).toBe(true)
        cleanup()
    })

    it('runs custom validate alone (no schema)', async () => {
        const { ctx, cleanup } = makeCtx({
            getCustomValidate: () => () => [{ name: 'email', message: 'Required' }]
        })
        await ctx.validate({ silent: true })
        expect(ctx.errors).toHaveLength(1)
        cleanup()
    })
})

describe('FormContext — submit lifecycle', () => {
    it('calls onsubmit with validated data', async () => {
        const onSubmit = vi.fn()
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getOnSubmit: () => onSubmit
        })
        await ctx.submit()
        expect(onSubmit).toHaveBeenCalledOnce()
        const arg = onSubmit.mock.calls[0]?.[0] as { data: unknown }
        expect(arg.data).toEqual({ email: 'a@b.com', age: 30 })
        cleanup()
    })

    it('calls onerror on validation failure', async () => {
        const onSubmit = vi.fn()
        const onError = vi.fn()
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: 30 }),
            getSchema: () => makeSchema(),
            getOnSubmit: () => onSubmit,
            getOnError: () => onError
        })
        await ctx.submit()
        expect(onSubmit).not.toHaveBeenCalled()
        expect(onError).toHaveBeenCalledOnce()
        cleanup()
    })

    it('clears dirtyFields after successful submit', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema()
        })
        ctx.dirtyFields.add('email')
        await ctx.submit()
        expect(ctx.dirtyFields.size).toBe(0)
        cleanup()
    })

    it('ignores double submit while loading', async () => {
        const onSubmit = vi.fn((): Promise<void> => new Promise<void>((r) => setTimeout(r, 20)))
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getOnSubmit: () => onSubmit
        })
        const first = ctx.submit()
        const second = ctx.submit()
        await Promise.all([first, second])
        expect(onSubmit).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('toggles loading state during submit when loadingAuto=true', async () => {
        let loadingDuringSubmit = false
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getOnSubmit: () => async () => {
                loadingDuringSubmit = ctx.loading
            }
        })
        await ctx.submit()
        expect(loadingDuringSubmit).toBe(true)
        expect(ctx.loading).toBe(false)
        cleanup()
    })

    it('does not touch loading when loadingAuto=false', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getLoadingAuto: () => false,
            getOnSubmit: () => async () => {
                expect(ctx.loading).toBe(false)
            }
        })
        await ctx.submit()
        expect(ctx.loading).toBe(false)
        cleanup()
    })
})

describe('FormContext — event handlers', () => {
    it('onBlur adds to blurredFields and touchedFields', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.onBlur('email')
        expect(ctx.blurredFields.has('email')).toBe(true)
        expect(ctx.touchedFields.has('email')).toBe(true)
        cleanup()
    })

    it('onChange adds to dirtyFields and touchedFields', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.onChange('email')
        expect(ctx.dirtyFields.has('email')).toBe(true)
        expect(ctx.touchedFields.has('email')).toBe(true)
        cleanup()
    })

    it('onFocus adds to touchedFields', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.onFocus('email')
        expect(ctx.touchedFields.has('email')).toBe(true)
        expect(ctx.blurredFields.has('email')).toBe(false)
        cleanup()
    })

    it('onInput before first blur does NOT validate (eager-after-blur)', async () => {
        vi.useFakeTimers()
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: -1 }),
            getSchema: () => makeSchema(),
            getValidateOnInputDelay: () => 100
        })
        ctx.onInput('email')
        vi.advanceTimersByTime(200)
        // Not blurred yet — no validation happens
        expect(ctx.errors).toEqual([])
        cleanup()
        vi.useRealTimers()
    })

    it('onInput after blur validates (debounced)', async () => {
        vi.useFakeTimers()
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: -1 }),
            getSchema: () => makeSchema(),
            getValidateOnInputDelay: () => 100
        })
        ctx.onBlur('email') // triggers one silent validate synchronously (still resolves later)
        await vi.advanceTimersByTimeAsync(0)
        await Promise.resolve()
        await Promise.resolve()
        ctx.onInput('email')
        await vi.advanceTimersByTimeAsync(150)
        await Promise.resolve()
        expect(ctx.errors.some((e) => e.name === 'email')).toBe(true)
        cleanup()
        vi.useRealTimers()
    })

    it('dispose clears pending timers', () => {
        vi.useFakeTimers()
        const { ctx, cleanup } = makeCtx({
            getSchema: () => makeSchema(),
            getValidateOnInputDelay: () => 100
        })
        ctx.blurredFields.add('email')
        ctx.onInput('email')
        ctx.dispose()
        // Advancing should not throw or call validate
        expect(() => vi.advanceTimersByTime(200)).not.toThrow()
        cleanup()
        vi.useRealTimers()
    })
})

describe('FormContext — error querying (getErrors / setErrors / clear)', () => {
    it('getErrors with no name returns all', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.setErrors([
            { name: 'email', message: 'a' },
            { name: 'age', message: 'b' }
        ])
        expect(ctx.getErrors()).toHaveLength(2)
        cleanup()
    })

    it('getErrors by exact name', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.setErrors([
            { name: 'email', message: 'a' },
            { name: 'age', message: 'b' }
        ])
        expect(ctx.getErrors('email')).toEqual([{ name: 'email', message: 'a', id: undefined }])
        cleanup()
    })

    it('getErrors by prefix (dotted path)', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.setErrors([
            { name: 'address.street', message: 'a' },
            { name: 'address.city', message: 'b' },
            { name: 'email', message: 'c' }
        ])
        expect(ctx.getErrors('address')).toHaveLength(2)
        cleanup()
    })

    it('getErrors by regex', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.setErrors([
            { name: 'items.0.name', message: 'a' },
            { name: 'items.1.name', message: 'b' },
            { name: 'email', message: 'c' }
        ])
        expect(ctx.getErrors(/^items\.\d+\.name$/)).toHaveLength(2)
        cleanup()
    })

    it('setErrors scoped by name replaces only matching', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.setErrors([
            { name: 'email', message: 'e1' },
            { name: 'age', message: 'a1' }
        ])
        ctx.setErrors([{ name: 'email', message: 'e2' }], 'email')
        expect(ctx.getErrors('email')[0]?.message).toBe('e2')
        expect(ctx.getErrors('age')[0]?.message).toBe('a1')
        cleanup()
    })

    it('clear removes all errors', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.setErrors([{ name: 'email', message: 'a' }])
        ctx.clear()
        expect(ctx.errors).toEqual([])
        cleanup()
    })

    it('clear by name removes only matching', () => {
        const { ctx, cleanup } = makeCtx()
        ctx.setErrors([
            { name: 'email', message: 'a' },
            { name: 'age', message: 'b' }
        ])
        ctx.clear('email')
        expect(ctx.errors).toHaveLength(1)
        expect(ctx.errors[0]?.name).toBe('age')
        cleanup()
    })
})

describe('FormContext — field registry & error id resolution', () => {
    it('resolves error id from registered field', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: 30 }),
            getSchema: () => makeSchema()
        })
        ctx.registerField('email', { id: 'email-input' })
        await ctx.validate({ silent: true })
        const emailErr = ctx.getErrors('email')[0]
        expect(emailErr?.id).toBe('email-input')
        cleanup()
    })

    it('unregisterField removes field from registry', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: 30 }),
            getSchema: () => makeSchema()
        })
        ctx.registerField('email', { id: 'email-input' })
        ctx.unregisterField('email')
        await ctx.validate({ silent: true })
        expect(ctx.getErrors('email')[0]?.id).toBeUndefined()
        cleanup()
    })
})

describe('FormContext — reset()', () => {
    it('clears errors, all field sets, and submitCount', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: 30 }),
            getSchema: () => makeSchema()
        })
        ctx.dirtyFields.add('email')
        ctx.touchedFields.add('email')
        ctx.blurredFields.add('email')
        await ctx.submit() // invalid → errors populated, submitCount = 1
        expect(ctx.errors.length).toBeGreaterThan(0)
        expect(ctx.submitCount).toBe(1)

        ctx.reset()

        expect(ctx.errors).toEqual([])
        expect(ctx.dirtyFields.size).toBe(0)
        expect(ctx.touchedFields.size).toBe(0)
        expect(ctx.blurredFields.size).toBe(0)
        expect(ctx.submitCount).toBe(0)
        expect(ctx.dirty).toBe(false)
        cleanup()
    })

    it('does not modify state (caller owns it)', () => {
        const state = { email: 'a@b.com', age: 30 }
        const { ctx, cleanup } = makeCtx({ getState: () => state })
        ctx.reset()
        expect(state).toEqual({ email: 'a@b.com', age: 30 })
        cleanup()
    })
})

describe('FormContext — submitCount', () => {
    it('starts at 0', () => {
        const { ctx, cleanup } = makeCtx()
        expect(ctx.submitCount).toBe(0)
        cleanup()
    })

    it('increments on each submit() call', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema()
        })
        await ctx.submit()
        expect(ctx.submitCount).toBe(1)
        await ctx.submit()
        expect(ctx.submitCount).toBe(2)
        cleanup()
    })

    it('increments even on validation failure', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'bad', age: 30 }),
            getSchema: () => makeSchema()
        })
        await ctx.submit()
        expect(ctx.submitCount).toBe(1)
        cleanup()
    })

    it('does not increment when submit is blocked (double-submit guard)', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getOnSubmit: () => () => new Promise((r) => setTimeout(r, 30))
        })
        const first = ctx.submit()
        const second = ctx.submit() // blocked by loading guard
        await Promise.all([first, second])
        expect(ctx.submitCount).toBe(1)
        cleanup()
    })

    it('blocks concurrent submit() even when loadingAuto=false', async () => {
        // Regression test: under loadingAuto:false, `loading` stays false
        // during an in-flight submit, so the guard must use a separate
        // #submitting flag. Without it, rapid clicks would both run.
        const onSubmit = vi.fn(() => new Promise<void>((r) => setTimeout(r, 30)))
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getLoadingAuto: () => false,
            getOnSubmit: () => onSubmit
        })
        const first = ctx.submit()
        const second = ctx.submit()
        const third = ctx.submit()
        await Promise.all([first, second, third])
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(ctx.submitCount).toBe(1)
        expect(ctx.loading).toBe(false) // loadingAuto is off
        cleanup()
    })
})

describe('FormContext — nested form state fallback', () => {
    it('falls back to {} when parent does not pre-initialize the sub-object', async () => {
        // Parent state intentionally omits `address` — previously this would
        // crash schema validators when they tried to read an undefined sub-tree.
        let parentCtx: FormContext<unknown>
        const parentCleanup = $effect.root(() => {
            parentCtx = new FormContext(
                makeOpts({
                    getState: () => ({ name: 'Alice' })
                    // no `address` key at all
                }),
                'parent'
            )
        })

        // Simulate a child form attached to the parent with name='address'.
        let childCtx: FormContext<unknown>
        const childCleanup = $effect.root(() => {
            childCtx = new FormContext(
                makeOpts({
                    getState: () => undefined as unknown, // unused for nested
                    getName: () => 'address',
                    getCustomValidate: () => (state) => {
                        // This runs and must receive `{}`, not undefined/null
                        expect(state).toEqual({})
                        return []
                    }
                }),
                'child',
                parentCtx!
            )
        })

        // Access `state` getter — should return {} not crash
        expect(childCtx!.state).toEqual({})

        // Validate should run successfully against the {} fallback
        const result = await childCtx!.validate({ silent: true })
        expect(result).toEqual({})

        childCleanup()
        parentCleanup()
    })
})

describe('FormContext — disabled getter', () => {
    it('reflects disabled option', () => {
        const { ctx, cleanup } = makeCtx({ getDisabled: () => true })
        expect(ctx.disabled).toBe(true)
        cleanup()
    })

    it('is true when loading', async () => {
        const { ctx, cleanup } = makeCtx({
            getState: () => ({ email: 'a@b.com', age: 30 }),
            getSchema: () => makeSchema(),
            getOnSubmit: () => async () => {
                expect(ctx.disabled).toBe(true)
            }
        })
        await ctx.submit()
        cleanup()
    })
})
