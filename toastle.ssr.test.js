// @vitest-environment node
/* eslint-env node */

import { describe, expect, it } from 'vitest'

describe('Toastle (no DOM)', () => {
  it('does not throw when document is missing', async () => {
    const { default: Toastle } = await import('./index.js')
    expect(() => Toastle({ text: 'x' })).not.toThrow()
  })
})
