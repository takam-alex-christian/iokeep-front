import { defineConfig, devices } from "@playwright/test";

// End-to-end test config for the iokeep frontend (Next.js).
//
// The app reaches the backend through `/be/*`, rewritten by next.config.js to
// `BE_DEV_LOCAL_URL` (development NODE_ENV) — so the iokeep-be-v2 backend must
// be running at that URL before `npx playwright test`. Override with `BE_URL`:
//
//   BE_URL=http://localhost:4000 npx playwright test

const backendUrl = process.env.BE_URL ?? "http://localhost:4000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx next dev -p 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { BE_DEV_LOCAL_URL: backendUrl },
  },
});
