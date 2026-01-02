import { test, expect } from "@playwright/test";

test.describe("Learn JQ App", () => {
  test("should load the application", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // ページタイトルを確認
    await expect(page).toHaveTitle("learn-jq");
  });

  test("should have main content", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // メインコンテンツが表示されているか確認
    const content = page.locator("body");
    await expect(content).toBeVisible();
  });
});
