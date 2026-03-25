/* eslint-env browser */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Toastle from './index.js'

// Mirrors index.js SPACING for stack offset assertions.
const SPACING = 9

// Must stay aligned with `REGISTRY_KEY` in index.js.
const TOASTLE_REGISTRY_KEY = Symbol.for('toastle.registry.v1')

function clearToastleRegistryInTestScope () {
  const reg = globalThis[TOASTLE_REGISTRY_KEY]
  if (reg?.stacks instanceof Map) {
    reg.stacks.clear()
  }
}

beforeEach(() => {
  clearToastleRegistryInTestScope()
  document.body.innerHTML = ''
  vi.stubGlobal('requestAnimationFrame', cb => {
    cb()
    return 0
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function stubToastRects (height = 50) {
  return vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function () {
      if (!this.classList?.contains('toastle')) {
        return {
          height: 0,
          width: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          x: 0,
          y: 0,
          toJSON () {
            return {}
          }
        }
      }
      return {
        height,
        width: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: height,
        x: 0,
        y: 0,
        toJSON () {
          return {}
        }
      }
    }
  )
}

describe('Toastle (DOM)', () => {
  it('creates a toast with base class, type class, and text', () => {
    Toastle({ text: 'Hello' })
    const el = document.querySelector('.toastle')
    expect(el).not.toBeNull()
    expect(el.textContent).toBe('Hello')
    expect(el.classList.contains('toastle-success')).toBe(true)
  })

  it('uses known type classes', () => {
    Toastle({ text: 'x', type: 'error' })
    const el = document.querySelector('.toastle')
    expect(el.classList.contains('toastle-error')).toBe(true)
  })

  it('falls back to success for unknown type', () => {
    Toastle({ text: 'x', type: 'nope' })
    const el = document.querySelector('.toastle')
    expect(el.classList.contains('toastle-success')).toBe(true)
    expect(el.classList.contains('toastle-nope')).toBe(false)
  })

  it('sets live region attributes', () => {
    Toastle({ text: 'a11y' })
    const el = document.querySelector('.toastle')
    expect(el.getAttribute('role')).toBe('status')
    expect(el.getAttribute('aria-live')).toBe('polite')
    expect(el.getAttribute('aria-atomic')).toBe('true')
    expect(el.getAttribute('aria-relevant')).toBe('additions')
  })

  it('stacks later toasts below earlier ones when height is known', () => {
    stubToastRects(50)

    Toastle({ text: 'first', top: 10 })
    Toastle({ text: 'second', top: 10 })
    const toasts = document.querySelectorAll('.toastle')
    expect(toasts.length).toBe(2)
    const firstTop = Number.parseFloat(toasts[0].style.top)
    const secondTop = Number.parseFloat(toasts[1].style.top)
    expect(secondTop).toBeGreaterThan(firstTop)
  })

  it('does not stack toasts that use different top offsets', () => {
    stubToastRects(50)

    Toastle({ text: 'high', top: 10 })
    Toastle({ text: 'low', top: 200 })
    const toasts = document.querySelectorAll('.toastle')
    expect(toasts.length).toBe(2)
    expect(Number.parseFloat(toasts[0].style.top)).toBe(10)
    expect(Number.parseFloat(toasts[1].style.top)).toBe(200)
  })

  it('uses one global stack per top so duplicate bundles would share that queue', () => {
    stubToastRects(40)

    Toastle({ text: 'one', top: 30 })
    Toastle({ text: 'two', top: 30 })
    const toasts = document.querySelectorAll('.toastle')
    expect(toasts.length).toBe(2)
    expect(Number.parseFloat(toasts[0].style.top)).toBe(30)
    expect(Number.parseFloat(toasts[1].style.top)).toBe(30 + 40 + SPACING)
  })

  it('ignores unknown option keys and still stacks by top', () => {
    stubToastRects(28)

    Toastle({ text: 'a', top: 18, stackId: 'ignored', lane: 'ignored' })
    Toastle({ text: 'b', top: 18 })
    const toasts = document.querySelectorAll('.toastle')
    expect(toasts.length).toBe(2)
    expect(Number.parseFloat(toasts[1].style.top)).toBe(18 + 28 + SPACING)
  })

  it('clearing the global registry lets a new toast reuse base top after prior stack', () => {
    vi.useFakeTimers()
    stubToastRects(50)

    Toastle({ text: 'a', top: 12, duration: 999999 })
    Toastle({ text: 'b', top: 12, duration: 999999 })
    clearToastleRegistryInTestScope()
    Toastle({ text: 'c', top: 12, duration: 999999 })

    const toasts = document.querySelectorAll('.toastle')
    expect(toasts.length).toBe(3)
    expect(Number.parseFloat(toasts[2].style.top)).toBe(12)
  })

  it('completes fade-in, fade-out, and removal on timers without throwing', () => {
    vi.useFakeTimers()
    Toastle({ text: 'bye', duration: 1000 })
    expect(document.querySelectorAll('.toastle').length).toBe(1)
    vi.advanceTimersByTime(100)
    vi.advanceTimersByTime(1000)
    vi.advanceTimersByTime(500)
    expect(document.querySelector('.toastle')).toBeNull()
  })

  it('treats null options as empty options', () => {
    Toastle(null)
    expect(document.querySelector('.toastle')).not.toBeNull()
  })
})
