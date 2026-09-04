import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Initial Setup required for all test cases:
   * 1. Go to website link
   * 2. Click on Accept all Cookies and wait for dismissal
   * 3. Click on "Change your shipping country" link from the Pop up (aria-describedby="GE_modal_welcome_label")
   * 4. Click on "Proceed as U.S Customer" and wait for change to complete
   */
  async performInitialSetup(): Promise<void> {
    await this.navigateTo();

    // 1. Accept Cookies and wait for dismissal
    await this.acceptCookies();

    // 2. Handle Global-E Country Switcher Modal and wait for completion
    await this.handleShippingCountryModal();

    // 3. Ensure any residual overlays are dismissed
    await this.dismissAnyBlockingOverlays();

    // Ensure page stability before running test assertions
    await this.waitForPageLoaded();
  }

  /**
   * Click Accept All Cookies if banner appears and wait for it to disappear
   * NOTE: Commented out - network blocker prevents cookie banner from loading
   */
  async acceptCookies(): Promise<void> {
    // Cookie banner blocked by network blocker - no action needed
    return;
    // try {
    //   const selectors = this.locators.cookies.acceptButton;
    //   const acceptBtn = this.page.locator(selectors.join(', ')).first();
    //   const appeared = await acceptBtn.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
    //   if (appeared) {
    //     await acceptBtn.click({ timeout: 4000 }).catch(async () => {
    //       await this.page.evaluate(() => {
    //         const btn = document.querySelector<HTMLElement>(
    //           '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, .save-preference-btn-handler, button[id*="accept"]'
    //         );
    //         if (btn) btn.click();
    //       });
    //     });
    //     const banner = this.page.locator(this.locators.cookies.cookieBanner.join(', ')).first();
    //     await banner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    //   } else {
    //     const handledViaDom = await this.page.evaluate(() => {
    //       const btn = document.querySelector<HTMLElement>(
    //         '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, .save-preference-btn-handler, button[id*="accept"]'
    //       );
    //       if (btn) {
    //         btn.click();
    //         return true;
    //       }
    //       return false;
    //     }).catch(() => false);
    //   }
    // } catch (e: any) {
    //   // Silent catch - banner may not be present
    // }
  }

  /**
   * Handle Change your shipping country popup (GE_modal_welcome_label)
   * NOTE: Commented out - network blocker prevents Global-E modal from loading
   */
  async handleShippingCountryModal(): Promise<void> {
    // Global-E modal blocked by network blocker - no action needed
    return;
    // try {
    //   const modalLocator = this.page.locator(this.locators.globalEModal.modal.join(', ')).first();
    //   const linkLocator = this.page.locator(this.locators.globalEModal.changeCountryLink.join(', ')).first();
    //   const modalOrLink = this.page.locator(
    //     `${this.locators.globalEModal.modal.join(', ')}, ${this.locators.globalEModal.changeCountryLink.join(', ')}`
    //   ).first();
    //   const appeared = await modalOrLink.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    //   if (appeared) {
    //     if (await linkLocator.isVisible().catch(() => false)) {
    //       await linkLocator.click({ timeout: 3000 }).catch(async () => {
    //         await this.healer.safeClick(this.locators.globalEModal.changeCountryLink);
    //       });
    //       await this.page.waitForTimeout(800);
    //     }
    //     const proceedBtn = this.page.locator(this.locators.globalEModal.proceedAsUsCustomerBtn.join(', ')).first();
    //     const proceedVisible = await proceedBtn.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    //     if (proceedVisible) {
    //       await proceedBtn.click({ timeout: 3000 }).catch(async () => {
    //         await this.healer.safeClick(this.locators.globalEModal.proceedAsUsCustomerBtn);
    //       });
    //     }
    //     await modalLocator.waitFor({ state: 'hidden', timeout: 4000 }).catch(async () => {
    //       await this.dismissAnyBlockingOverlays();
    //     });
    //   }
    // } catch (e: any) {
    //   // Silent catch - modal may not be present
    // }
  }
}
