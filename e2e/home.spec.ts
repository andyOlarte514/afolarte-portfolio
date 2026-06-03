import { test, expect } from "@playwright/test";

test.describe("Homepage structure", () => {
  test("has correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Andy Olarte — Senior Frontend Engineer");
  });

  test("contains required semantic elements", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("contains all four section ids", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero")).toBeAttached();
    await expect(page.locator("#experience")).toBeAttached();
    await expect(page.locator("#skills")).toBeAttached();
    await expect(page.locator("#contact")).toBeAttached();
  });
});

test.describe("Smooth scroll navigation", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("clicking Experience link scrolls to experience section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Experience" }).first().click();
    await expect(page.locator("#experience")).toBeInViewport();
  });

  test("clicking Skills link scrolls to skills section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Skills" }).first().click();
    await expect(page.locator("#skills")).toBeInViewport();
  });

  test("clicking Contact link scrolls to contact section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Contact" }).first().click();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});

test.describe("Dark mode toggle", () => {
  test.use({ colorScheme: "dark" });

  test("page starts with dark class on html element", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("clicking toggle removes dark class", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("clicking toggle again restores dark class", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Responsive layout", () => {
  test("renders without horizontal scroll on 320px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 });
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(320);
  });

  test("hamburger button is visible on 320px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
  });

  test("hamburger button is not visible on 1280px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Open navigation menu" }),
    ).not.toBeVisible();
  });

  test("desktop nav links are visible on 1280px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Experience" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Skills" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" }).first()).toBeVisible();
  });

  test("hamburger opens mobile nav sheet on 320px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});

test.describe("Navbar transparent/solid transition", () => {
  test("navbar starts transparent at top of page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).not.toHaveClass(/bg-background/);
  });

  test("navbar becomes solid after scrolling past 80px", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 100));
    await expect(page.locator("header")).toHaveClass(/bg-background/);
  });
});

test.describe("Hero section content", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("displays Andy's full name in h1 heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Andy Francisco Olarte Cardona",
    );
  });

  test("displays Senior Frontend / Full-Stack Engineer title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Senior Frontend / Full-Stack Engineer")).toBeVisible();
  });

  test("displays NVIDIA role badge", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("NVIDIA")).toBeVisible();
  });

  test("displays Mekan role badge", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Mekan")).toBeVisible();
  });

  test("displays bio text containing '10+'", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/10\+/)).toBeVisible();
  });

  test("displays photo placeholder or image in hero section", async ({ page }) => {
    await page.goto("/");
    // AO initials placeholder is visible when no real photo is provided
    await expect(page.locator("#hero").getByText("AO")).toBeVisible();
  });
});

test.describe("Hero CTA behavior", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("Get in touch button is visible in hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Get in touch" })).toBeVisible();
  });

  test("clicking Get in touch scrolls to contact section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get in touch" }).click();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
