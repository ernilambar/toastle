/* eslint-env browser */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Toastle from './index.js'

beforeEach(() => {
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
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
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
          height: 50,
          width: 100,
          top: 0,
          left: 0,
          right: 100,
          bottom: 50,
          x: 0,
          y: 0,
          toJSON () {
            return {}
          }
        }
      }
    )

    Toastle({ text: 'first', top: 10 })
    Toastle({ text: 'second', top: 10 })
    const toasts = document.querySelectorAll('.toastle')
    expect(toasts.length).toBe(2)
    const firstTop = Number.parseFloat(toasts[0].style.top)
    const secondTop = Number.parseFloat(toasts[1].style.top)
    expect(secondTop).toBeGreaterThan(firstTop)
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
