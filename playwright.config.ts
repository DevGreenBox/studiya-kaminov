import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3100);

/**
 * По умолчанию тесты сами собирают проект и поднимают сервер.
 * Если задан E2E_BASE_URL — гоняем по уже развёрнутому адресу, например:
 *   E2E_BASE_URL=https://studiya-kaminov.netlify.app npm run test:e2e
 */
const externalURL = process.env.E2E_BASE_URL;
const baseURL = externalURL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  use: {
    baseURL,
    locale: 'ru-RU',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  ...(externalURL
    ? {}
    : {
        webServer: {
          command: `npm run build && npx next start -p ${PORT}`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
