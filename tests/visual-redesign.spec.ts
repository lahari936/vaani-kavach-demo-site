import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/architecture", "/try-model", "/team", "/simulation"];

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

async function accessible(page: Page) {
  // Check final colours after disclosure and state transitions finish.
  await page.waitForTimeout(400);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(n => n.html) }))).toEqual([]);
}

for (const width of [375, 768, 1024, 1440]) {
  test(`routes, contrast and layout at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      // Allow the existing page entrance animations and web fonts to settle.
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await noOverflow(page);
      await accessible(page);
      await page.screenshot({ path: testInfo.outputPath(`${route === "/" ? "home" : route.slice(1)}-${width}.png`), fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

for (const width of [375, 1440]) {
  test(`complete simulation and replay at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/simulation");
    await page.getByRole("button", { name: "Mute voice announcements", exact: true }).click();
    await page.getByRole("button", { name: "Answer call", exact: true }).click();
    await page.getByRole("button", { name: "Mute microphone", exact: true }).click();
    await expect(page.getByRole("button", { name: "Unmute microphone", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Unmute microphone", exact: true }).click();
    await page.getByRole("button", { name: "Skip to Security Alert" }).click();
    await expect(page.getByRole("heading", { name: "Verification Required" })).toBeVisible();
    await page.getByRole("button", { name: "View Why" }).click();
    await expect(page.getByText("Bank Identity Not Verified")).toBeVisible();
    await noOverflow(page);
    await page.screenshot({ path: testInfo.outputPath(`alert-expanded-${width}.png`), fullPage: true });
    await page.getByRole("button", { name: "Hide Timeline" }).click();
    await accessible(page);
    await page.getByRole("button", { name: "Replay Conversation" }).click();
    await expect(page.getByRole("button", { name: "Skip to Security Alert" })).toBeVisible();
    await expect(page.getByText("Verification Required")).toHaveCount(0);
    await page.getByRole("button", { name: "Skip to Security Alert" }).click();
    await page.getByRole("button", { name: "Verify Caller", exact: true }).click();
    await expect(page.getByRole("button", { name: "Attempt Transfer" })).toBeDisabled();
    await page.getByRole("button", { name: "Request Voice Challenge" }).click();
    await expect(page.getByText("7294")).toBeVisible();
    await expect(page.getByText('"Seven... two... I cannot hear the rest."')).toBeVisible();
    await expect(page.getByText("Liveness Failed")).toBeVisible();
    await noOverflow(page);
    await accessible(page);
    await page.screenshot({ path: testInfo.outputPath(`verification-${width}.png`), fullPage: true });
    await page.getByRole("button", { name: "Attempt Transfer" }).click();
    await expect(page.getByText("₹25,000", { exact: true })).toBeVisible();
    await noOverflow(page);
    await page.screenshot({ path: testInfo.outputPath(`payment-${width}.png`), fullPage: true });
    await page.getByRole("button", { name: "Confirm Transfer" }).click();
    await expect(page.getByText("Call Risk Check")).toBeVisible();
    await expect(page.getByText("Risk Receipt", { exact: true })).toBeVisible();
    await expect(page.getByText("Action Protection API", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Transaction Safeguarded" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("API: BLOCK")).toBeVisible();
    await expect(page.getByRole("link", { name: "Understand How It Works" })).toHaveAttribute("href", "/architecture");
    await expect(page.getByRole("link", { name: "Test the Technology" })).toHaveAttribute("href", "/try-model");
    await noOverflow(page);
    await accessible(page);
    await page.screenshot({ path: testInfo.outputPath(`protection-${width}.png`), fullPage: true });
    await page.getByRole("button", { name: "Restart Experience" }).click();
    await expect(page.getByRole("button", { name: "Answer call", exact: true })).toBeVisible();
  });
}

test("timed transcript and automatic security alert", async ({ page }) => {
  await page.goto("/simulation");
  await page.getByRole("button", { name: "Mute voice announcements", exact: true }).click();
  await page.getByRole("button", { name: "Answer call", exact: true }).click();
  await expect(page.getByText("Hello, am I speaking with the account holder?")).toBeVisible();
  await expect(page.getByText("Analyzing Risk...")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Verification Required" })).toBeVisible({ timeout: 20_000 });
});

test("architecture details and original workbench controls", async ({ page }) => {
  await page.goto("/architecture");
  const nodes = page.locator(".architecture-node");
  await expect(nodes).toHaveCount(8);
  for (let index = 0; index < 8; index++) {
    const title = await nodes.nth(index).locator("strong").innerText();
    await nodes.nth(index).click();
    const disclosure = page.locator(".technical-explanation > button");
    // AnimatePresence retains the previous module until its exit finishes.
    await expect(disclosure).toContainText(title);
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await disclosure.click();
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".technical-explanation li").first()).toBeVisible();
    await disclosure.click();
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  }
  await page.goto("/try-model");
  await page.getByRole("button", { name: "Record", exact: true }).click();
  await expect(page.getByText("Recording...")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send to Inference Engine" })).toBeDisabled();
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.getByRole("button", { name: "Upload", exact: true }).click()]);
  await chooser.setFiles({ name: "voice.wav", mimeType: "audio/wav", buffer: Buffer.from("RIFF-test-audio") });
  await expect(page.getByRole("button", { name: "Change File" })).toBeVisible();
  await page.getByRole("button", { name: "Send to Inference Engine" }).click();
  await expect(page.getByText("API Disconnected")).toBeVisible();
  await expect(page.getByText("Real AI model integration is in progress. API endpoint not yet available.")).toBeVisible();
  await page.getByRole("button", { name: "B. API Exchange" }).click();
  await expect(page.getByText("API Logs Unavailable")).toBeVisible();
  await page.getByRole("button", { name: "C. Receipt Security" }).click();
  await expect(page.getByText("Cryptographic Playground Unavailable")).toBeVisible();
});

test("mobile navigation, keyboard focus and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByText("Suspected fraud call", { exact: true })).toBeVisible();
  await expect(page.getByText("Citizen's phone", { exact: true })).toBeVisible();
  await expect(page.locator(".voice-graphic")).not.toContainText(/payment/i);
  await expect(page.locator(".voice-graphic")).not.toContainText(/incoming call/i);
  await expect(page.getByText("Call in progress", { exact: true })).toHaveCount(2);
  expect(await page.locator(".graphic-warning").evaluate(el => getComputedStyle(el).opacity)).toBe("1");
  expect(await page.locator(".graphic-phone").first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Vaani Kavach", exact: true })).toBeFocused();
  expect(await page.locator(":focus").evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#mobile-navigation").getByRole("link", { name: "System Overview" }).click();
  await expect(page).toHaveURL(/\/architecture$/);
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
});
