import { describe, expect, it } from 'vitest'

import { app } from './app.js'

describe('GET /health', () => {
  it('returns a successful health response', async () => {
    const response = await app.request('/health')

    expect(response.status).toBe(200)

    await expect(response.json()).resolves.toEqual({
      status: 'ok',
    })
  })
})
