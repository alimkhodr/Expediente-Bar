import { defineConfig, devices } from '@playwright/test'

/**
 * E2E contra um build de produção local (preset node-server) ou contra
 * uma URL externa (ex.: deploy preview do Netlify) via BASE_URL.
 */
const baseURL = process.env.BASE_URL || 'http://localhost:3100'
const usarServidorLocal = !process.env.BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: usarServidorLocal
    ? {
      command: 'npm run test:e2e:server',
      url: baseURL,
      reuseExistingServer: true,
      timeout: 300_000,
      stdout: 'ignore',
      stderr: 'pipe'
    }
    : undefined
})
