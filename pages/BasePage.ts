import { Page, Locator, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { AutoHealer } from '../utils/autoHealer';
import { blockThirdPartyNoise } from '../utils/networkBlocker';
import locatorsData from '../locators/locators.json';
import testData from '../data/testData.json';

export class BasePage {
  readonly page: Page;
  readonly healer: AutoHealer;
  readonly locators = locatorsData;
  readonly data = testData;
  readonly screenshotsDir: string;

  constructor(page: Page) {
    this.page = page;
    this.healer = new AutoHealer(page);
    this.screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  /**
   * Block third-party tracking, cookie banners, and global-e country selection
   */
  async blockThirdPartyNoise(): Promise<void> {
    await blockThirdPartyNoise(this.page);
  }

  /**
   * Navigate to target URL with resilient timeout & state check
   */
  async navigateTo(pathUrl: string = ''): Promise<void> {
    const targetUrl = pathUrl || this.data.baseUrl;
    let retries = 2;
    while (retries > 0) {
      try {
        await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
        break;
      } catch (err: any) {
        retries--;
        if (retries === 0) {
          try {
            await this.page.goto(targetUrl, { waitUntil: 'commit', timeout: 35000 });
          } catch {
            // Ignore if commit succeeds partially
          }
        } else {
          await this.page.waitForTimeout(1500);
        }
      }
    }
    await this.page.waitForSelector('nav, header, [role="menubar"], a', { timeout: 15000 }).catch(() => {});
  }

  /**
   * Wait for page and DOM network activity to settle
   */
  async waitForPageLoaded(): Promise<void> {
    if (this.page.isClosed()) return;
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
      // Wait for network to be idle so dynamic hydration is finished
      await this.page.waitForLoadState('networkidle', { timeout: 7000 }).catch(() => {});
      if (!this.page.isClosed()) {
        await this.page.waitForTimeout(500).catch(() => {});
      }
    } catch {
      // Ignore if page closed during teardown
    }
  }

  /**
   * Scroll down the page by a specific pixel amount or percentage
   * @param pixels Number of pixels to scroll down (defaults to 600)
   */
  async scrollDown(pixels: number = 600): Promise<void> {
    await this.page.evaluate((px) => {
      window.scrollBy({ top: px, behavior: 'smooth' });
    }, pixels);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Scroll smoothly through the product listing to trigger lazy-loaded product tiles
   */
  async scrollToLoadProducts(): Promise<void> {
    await this.scrollDown(500);
    await this.page.waitForTimeout(800);
    await this.scrollDown(500);
    await this.page.waitForTimeout(800);
  }

  /**
   * Capture a screenshot and save it in the screenshots folder
   * @param screenshotName Name identifier for the screenshot file
   */
  async captureScreenshot(screenshotName: string): Promise<string> {
    const sanitized = screenshotName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(this.screenshotsDir, `${sanitized}.png`);
    try {
      if (!this.page.isClosed()) {
        await this.page.screenshot({ path: filePath, fullPage: false, timeout: 5000 });
        console.log(`[Screenshot Captured] Saved to: ${filePath}`);
      }
    } catch (e: any) {
      console.warn(`[Screenshot Notice] Could not capture screenshot "${screenshotName}": ${e.message}`);
    }
    return filePath;
  }

  /**
   * Scroll element into view and safe click
   */
  async scrollAndClick(selectors: string[]): Promise<void> {
    const element = await this.healer.getHealedLocator(selectors);
    await element.scrollIntoViewIfNeeded().catch(() => {});
    await this.healer.safeClick(selectors);
  }

  /**
   * Get an auto-healed locator
   */
  async getLocator(selectors: string[]): Promise<Locator> {
    return this.healer.getHealedLocator(selectors);
  }

  /**
   * Dismiss any unexpected overlays, popups, or backdrops that block interactions
   */
  async dismissAnyBlockingOverlays(): Promise<void> {
    try {
      // 1. Close any OneTrust cookie popup if still in DOM
      await this.page.evaluate(() => {
        const acceptBtn = document.querySelector<HTMLElement>(
          '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, .save-preference-btn-handler, button[id*="accept"]'
        );
        if (acceptBtn && acceptBtn.offsetParent !== null) acceptBtn.click();
      }).catch(() => {});

      // 2. Close Global-E modal or click Proceed as US customer if open
      await this.page.evaluate(() => {
        const proceedUs = Array.from(document.querySelectorAll<HTMLElement>('button, a')).find(el =>
          el.innerText && el.innerText.toLowerCase().includes('proceed as u.s')
        );
        if (proceedUs && proceedUs.offsetParent !== null) proceedUs.click();

        const closeBtn = document.querySelector<HTMLElement>('[aria-describedby="GE_modal_welcome_label"] button, .gl-close-btn');
        if (closeBtn && closeBtn.offsetParent !== null) closeBtn.click();
      }).catch(() => {});

      // 3. Remove blocking modal backdrop overlays if any remain
      await this.page.evaluate(() => {
        const overlays = document.querySelectorAll('.chakra-modal__overlay, .gl-overlay');
        overlays.forEach(el => el.remove());
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }

  /**
   * Verify URL contains expected path or match
   */
  async verifyUrlContains(expectedSubstr: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedSubstr), { timeout: 20000 });
  }
}
