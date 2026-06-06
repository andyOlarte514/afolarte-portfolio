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
    await expect(page.locator("#hero").getByText("NVIDIA", { exact: true })).toBeVisible();
  });

  test("displays Mekan role badge", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero").getByText("Mekan", { exact: true })).toBeVisible();
  });

  test("displays bio text containing '10+'", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero").getByText(/10\+/)).toBeVisible();
  });

  test("displays profile photo in hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero img")).toBeVisible();
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

test.describe("Experience section content", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("displays Experience section heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("#experience").getByRole("heading", { level: 2 }),
    ).toContainText("Experience");
  });

  test("displays NVIDIA as first experience entry", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#experience").getByText("NVIDIA").first()).toBeVisible();
  });

  test("displays Tech Lead badge for NVIDIA entry", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#experience").getByText("Tech Lead")).toBeVisible();
  });

  test("displays NVIDIA ESLint plugin differentiator bullet", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#experience").getByText(/ESLint plugin/)).toBeVisible();
  });

  test("displays Mekan entry with impact bullet text", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#experience").getByText("Mekan").first()).toBeVisible();
    await expect(page.locator("#experience").getByText(/2,100\+/)).toBeVisible();
  });

  test("displays company avatar elements for visual differentiation", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("#experience").locator("[data-testid='company-avatar']").first(),
    ).toBeVisible();
  });
});

test.describe("Skills section content", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("displays Skills section heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#skills").getByRole("heading", { level: 2 })).toContainText(
      "Skills",
    );
  });

  test("displays all five domain group headers", async ({ page }) => {
    await page.goto("/");
    const skillsSection = page.locator("#skills");
    await expect(skillsSection.getByRole("heading", { level: 3, name: "Frontend" })).toBeVisible();
    await expect(skillsSection.getByRole("heading", { level: 3, name: "Backend" })).toBeVisible();
    await expect(skillsSection.getByRole("heading", { level: 3, name: "Mobile" })).toBeVisible();
    await expect(
      skillsSection.getByRole("heading", { level: 3, name: "DevOps/CI" }),
    ).toBeVisible();
    await expect(skillsSection.getByRole("heading", { level: 3, name: "Testing" })).toBeVisible();
  });

  test("displays primary skill badges for each domain", async ({ page }) => {
    await page.goto("/");
    const skillsSection = page.locator("#skills");
    await expect(skillsSection.getByText("React").first()).toBeVisible();
    await expect(skillsSection.getByText("Python").first()).toBeVisible();
    await expect(skillsSection.getByText("React Native").first()).toBeVisible();
    await expect(skillsSection.getByText("GitHub Actions").first()).toBeVisible();
    await expect(skillsSection.getByText("Jest").first()).toBeVisible();
  });

  test("displays secondary skill badges alongside primary skills", async ({ page }) => {
    await page.goto("/");
    const skillsSection = page.locator("#skills");
    await expect(skillsSection.getByText("Angular").first()).toBeVisible();
  });
});

test.describe("Contact section content", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("displays contact headline", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#contact").getByText(/Let's build something great/)).toBeVisible();
  });

  test("displays location 'Medellín, Colombia'", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#contact").getByText("Medellín, Colombia")).toBeVisible();
  });

  test("displays availability status", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("#contact").getByText("Open to remote opportunities"),
    ).toBeVisible();
  });

  test("displays all three contact icon links", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: "Send Andy an email" })).toBeVisible();
    await expect(contact.getByRole("link", { name: "Andy's GitHub profile" })).toBeVisible();
    await expect(contact.getByRole("link", { name: "Andy's LinkedIn profile" })).toBeVisible();
  });

  test("mail link has correct mailto href", async ({ page }) => {
    await page.goto("/");
    const mailLink = page
      .locator("#contact")
      .getByRole("link", { name: "Send Andy an email" });
    await expect(mailLink).toHaveAttribute("href", "mailto:andy.olarte514@gmail.com");
  });

  test("GitHub link opens in new tab", async ({ page }) => {
    await page.goto("/");
    const githubLink = page
      .locator("#contact")
      .getByRole("link", { name: "Andy's GitHub profile" });
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("href", "https://github.com/andyOlarte514");
  });
});

test.describe("OG / Social metadata", () => {
  test("og:title meta tag has correct content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Andy Olarte — Senior Frontend Engineer",
    );
  });

  test("og:description meta tag has correct content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      /10\+ years/,
    );
  });

  test("og:type is website", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  });

  test("twitter:card is summary_large_image", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("opengraph-image route returns HTTP 200 with content-type image/png", async ({ page }) => {
    const response = await page.request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("og:image meta tag content matches opengraph-image route", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
  });
});

test.describe("Keyboard navigation accessibility", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("NavLink is reachable via keyboard Tab", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Experience" }).first().focus();
    await expect(page.getByRole("link", { name: "Experience" }).first()).toBeFocused();
  });

  test("CTAButton is reachable via keyboard Tab", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get in touch" }).focus();
    await expect(page.getByRole("button", { name: "Get in touch" })).toBeFocused();
  });

  test("ContactIconButton anchor is single focus stop — Tab skips inner button", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Send Andy an email" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Andy's GitHub profile" })).toBeFocused();
  });

  test("ThemeToggle is reachable via keyboard Tab", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).focus();
    await expect(page.getByRole("button", { name: "Toggle dark mode" })).toBeFocused();
  });
});

test.describe("Download CV button", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("Download CV button is visible in the navbar on desktop", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Download CV as PDF" })).toBeVisible();
  });

  test("Download CV button triggers a file download with correct filename", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/");
    const button = page.getByRole("button", { name: "Download CV as PDF" });
    await expect(button).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await button.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("andy-olarte-cv.pdf");
  });

  test("Download CV button is accessible via keyboard", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Download CV as PDF" }).focus();
    await expect(page.getByRole("button", { name: "Download CV as PDF" })).toBeFocused();
  });
});
