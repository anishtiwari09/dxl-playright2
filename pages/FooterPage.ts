import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FooterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Scroll down to the bottom of the page / footer
   */
  async scrollToFooter(): Promise<void> {
    await this.dismissAnyBlockingOverlays();
    await this.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await this.page.waitForSelector('footer, [aria-label*="Footer" i]', { timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(600);
  }

  /**
   * Helper to click a footer link using getByRole('link') as primary
   */
  private async clickFooterRoleLink(namePattern: string | RegExp, fallbackSelectors: string[]): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer, nav[aria-label*="Footer" i]')).first();
    const link = footer.getByRole('link', { name: namePattern })
      .or(this.page.locator(fallbackSelectors.join(', ')))
      .first();

    await link.waitFor({ state: 'attached', timeout: 8000 }).catch(() => {});
    await link.scrollIntoViewIfNeeded().catch(() => {});
    await link.click({ force: true }).catch(async () => {
      await this.scrollAndClick(fallbackSelectors);
    });

    await this.waitForPageLoaded();
  }

  /**
   * Test Case 1: Click on DXL Rewards link from Footer
   */
  async clickDxlRewards(): Promise<void> {
    await this.clickFooterRoleLink(/dxl rewards|rewards/i, this.locators.footer.dxlRewardsLink);
  }

  /**
   * Test Case 2: Click on DXL Sustainability link from Footer
   */
  async clickDxlSustainability(): Promise<void> {
    await this.clickFooterRoleLink(/sustainability/i, this.locators.footer.dxlSustainabilityLink);
  }

  /**
   * Test Case 3: Click on alt="Wear What You Want" banner
   */
  async clickWearWhatYouWantBanner(): Promise<void> {
    await this.scrollToFooter();
    const bannerImg = this.page.getByRole('img', { name: /wear what you want/i })
      .or(this.page.locator(this.locators.footer.wearWhatYouWantBanner.join(', ')))
      .first();

    await bannerImg.scrollIntoViewIfNeeded().catch(() => {});
    await bannerImg.click({ force: true }).catch(async () => {
      await this.scrollAndClick(this.locators.footer.wearWhatYouWantBanner);
    });
    await this.waitForPageLoaded();
  }

  /**
   * Test Case 4: Click on link name: Gift Cards from footer-banner
   */
  async clickGiftCardsBanner(): Promise<void> {
    await this.clickFooterRoleLink(/gift cards/i, this.locators.footer.giftCardsBanner);
  }

  /**
   * Test Case 5: Click on link name: Reward Your Style from footer-banner
   */
  async clickRewardYourStyleBanner(): Promise<void> {
    await this.clickFooterRoleLink(/reward your style/i, this.locators.footer.rewardYourStyleBanner);
  }

  /**
   * Click on FiTMAP link
   */
  async clickFitmap(): Promise<void> {
    await this.clickFooterRoleLink(/fitmap/i, this.locators.footer.fitmapLink);
  }

  /**
   * Click on Curbside Pickup link
   */
  async clickCurbsidePickup(): Promise<void> {
    await this.clickFooterRoleLink(/curbside pickup/i, this.locators.footer.curbsidePickupLink);
  }

  /**
   * Click on DXL Deals link
   */
  async clickDxlDeals(): Promise<void> {
    await this.clickFooterRoleLink(/dxl deals|deals/i, this.locators.footer.dxlDealsLink);
  }

  /**
   * Click on Heroes Discount link
   */
  async clickHeroesDiscount(): Promise<void> {
    await this.clickFooterRoleLink(/heroes discount/i, this.locators.footer.heroesDiscountLink);
  }

  /**
   * Click on Product Collections link
   */
  async clickProductCollections(): Promise<void> {
    await this.clickFooterRoleLink(/product collections/i, this.locators.footer.productCollectionsLink);
  }

  /**
   * Click on Price Match Guarantee link
   */
  async clickPriceMatchGuarantee(): Promise<void> {
    await this.clickFooterRoleLink(/price match guarantee/i, this.locators.footer.priceMatchGuaranteeLink);
  }

  /**
   * Click on Shipping & Delivery link
   */
  async clickShippingDelivery(): Promise<void> {
    await this.clickFooterRoleLink(/shipping & delivery|shipping/i, this.locators.footer.shippingDeliveryLink);
  }

  /**
   * Click on Returns & Exchanges link
   */
  async clickReturnsExchanges(): Promise<void> {
    await this.clickFooterRoleLink(/returns & exchanges|returns/i, this.locators.footer.returnsExchangesLink);
  }

  /**
   * Click Order Status and validate modal opens, then close modal
   */
  async clickOrderStatusAndHandleModal(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const orderStatusLink = footer.getByRole('link', { name: /order status/i })
      .or(this.page.locator(this.locators.footer.orderStatusLink.join(', ')))
      .first();

    await orderStatusLink.scrollIntoViewIfNeeded().catch(() => {});
    await orderStatusLink.click({ force: true }).catch(async () => {
      await this.scrollAndClick(this.locators.footer.orderStatusLink);
    });
    await this.page.waitForTimeout(1000);

    const modal = this.page.getByRole('dialog')
      .or(this.page.locator(this.locators.headerModals.modalDialog.join(', ')))
      .first();
    await expect(modal).toBeVisible({ timeout: 10000 });

    const closeBtn = modal.getByRole('button', { name: /close/i })
      .or(this.page.locator(this.locators.headerModals.modalCloseBtn.join(', ')))
      .first();
    await closeBtn.click({ force: true }).catch(() => {});
    await this.page.waitForTimeout(800);
  }

  /**
   * Click on Help Center link
   */
  async clickHelpCenter(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const link = footer.getByRole('link', { name: /help center/i })
      .or(this.page.locator(this.locators.footer.helpCenterLink.join(', ')))
      .first();

    const href = await link.getAttribute('href').catch(() => null);
    if (href && href.startsWith('http')) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } else {
      await link.click({ force: true }).catch(async () => {
        await this.scrollAndClick(this.locators.footer.helpCenterLink);
      });
    }
    await this.waitForPageLoaded();
  }

  /**
   * Click on Find a Store link and handle store popup / navigation
   */
  async clickFindAStoreAndHandleModal(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const link = footer.getByRole('link', { name: /find a store/i })
      .or(this.page.locator(this.locators.footer.findAStoreLink.join(', ')))
      .first();

    await link.scrollIntoViewIfNeeded().catch(() => {});
    await link.click({ force: true }).catch(async () => {
      await this.scrollAndClick(this.locators.footer.findAStoreLink);
    });
    await this.page.waitForTimeout(1000);

    const modal = this.page.getByRole('dialog')
      .or(this.page.locator(this.locators.headerModals.modalDialog.join(', ')))
      .first();
    if (await modal.isVisible({ timeout: 4000 }).catch(() => false)) {
      const closeBtn = modal.getByRole('button', { name: /close/i })
        .or(this.page.locator(this.locators.headerModals.modalCloseBtn.join(', ')))
        .first();
      await closeBtn.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(800);
    }
  }

  /**
   * Click on Email Us link and handle modal / dismiss by outside click
   */
  async clickEmailUsAndCloseByOutsideClick(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const link = footer.getByRole('link', { name: /email us/i })
      .or(this.page.locator(this.locators.footer.emailUsLink.join(', ')))
      .first();

    await link.scrollIntoViewIfNeeded().catch(() => {});
    await link.click({ force: true }).catch(async () => {
      await this.scrollAndClick(this.locators.footer.emailUsLink);
    });
    await this.page.waitForTimeout(1000);

    await this.page.mouse.click(10, 10);
    await this.page.waitForTimeout(800);
    await this.dismissAnyBlockingOverlays();
  }

  /**
   * Click on Call Us link and handle select app modal / dismiss by outside click
   */
  async clickCallUsAndCloseByOutsideClick(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const link = footer.getByRole('link', { name: /call us/i })
      .or(this.page.locator(this.locators.footer.callUsLink.join(', ')))
      .first();

    await link.scrollIntoViewIfNeeded().catch(() => {});
    await link.click({ force: true }).catch(async () => {
      await this.scrollAndClick(this.locators.footer.callUsLink);
    });
    await this.page.waitForTimeout(1000);

    await this.page.mouse.click(10, 10);
    await this.page.waitForTimeout(800);
    await this.dismissAnyBlockingOverlays();
  }

  /**
   * Click on About Us link
   */
  async clickAboutUs(): Promise<void> {
    await this.clickFooterRoleLink(/about us/i, this.locators.footer.aboutUsLink);
  }

  /**
   * Click on Careers link
   */
  async clickCareers(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const link = footer.getByRole('link', { name: /careers/i })
      .or(this.page.locator(this.locators.footer.careersLink.join(', ')))
      .first();

    const href = await link.getAttribute('href').catch(() => null);
    if (href && href.startsWith('http')) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } else {
      await link.click({ force: true }).catch(async () => {
        await this.scrollAndClick(this.locators.footer.careersLink);
      });
    }
    await this.waitForPageLoaded();
  }

  /**
   * Click on Contact Us link
   */
  async clickContactUs(): Promise<void> {
    await this.clickFooterRoleLink(/contact us/i, this.locators.footer.contactUsLink);
  }

  /**
   * Click on Accessibility Statement link
   */
  async clickAccessibilityStatement(): Promise<void> {
    await this.clickFooterRoleLink(/accessibility statement/i, this.locators.footer.accessibilityStatementLink);
  }

  /**
   * Click on Privacy Policy link
   */
  async clickPrivacyPolicy(): Promise<void> {
    await this.clickFooterRoleLink(/privacy policy/i, this.locators.footer.privacyPolicyLink);
  }

  /**
   * Click on Security Policy link
   */
  async clickSecurityPolicy(): Promise<void> {
    await this.clickFooterRoleLink(/security policy/i, this.locators.footer.securityPolicyLink);
  }

  /**
   * Click on Terms of Use link
   */
  async clickTermsOfUse(): Promise<void> {
    await this.clickFooterRoleLink(/terms of use/i, this.locators.footer.termsOfUseLink);
  }

  /**
   * Click on California Privacy Rights link
   */
  async clickCaliforniaPrivacyRights(): Promise<void> {
    await this.clickFooterRoleLink(/california privacy rights/i, this.locators.footer.californiaPrivacyRightsLink);
  }

  /**
   * Click on Do Not Sell My Data link
   */
  async clickDoNotSellMyData(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const link = footer.getByRole('link', { name: /do not sell my data/i })
      .or(this.page.locator(this.locators.footer.doNotSellMyDataLink.join(', ')))
      .first();

    const href = await link.getAttribute('href').catch(() => null);
    if (href && href.startsWith('http')) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } else {
      await link.click({ force: true }).catch(async () => {
        await this.scrollAndClick(this.locators.footer.doNotSellMyDataLink);
      });
    }
    await this.waitForPageLoaded();
  }

  /**
   * Click California Transparency Act, check privacy modal if opened and close via 'X'
   */
  async clickCaliforniaTransparencyActAndCloseModal(): Promise<void> {
    await this.scrollToFooter();
    const footer = this.page.getByRole('contentinfo').or(this.page.locator('footer')).first();
    const link = footer.getByRole('link', { name: /california transparency act/i })
      .or(this.page.locator(this.locators.footer.californiaTransparencyActLink.join(', ')))
      .first();

    await link.scrollIntoViewIfNeeded().catch(() => {});
    await link.click({ force: true }).catch(async () => {
      await this.scrollAndClick(this.locators.footer.californiaTransparencyActLink);
    });
    await this.page.waitForTimeout(1000);

    const otCloseBtn = this.page.getByRole('button', { name: /close/i })
      .or(this.page.locator(this.locators.footer.otCloseBtn.join(', ')))
      .first();

    if (await otCloseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await otCloseBtn.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(500);
    }

    await this.waitForPageLoaded();
  }

  /**
   * Click on UGC Terms & Conditions link
   */
  async clickUgcTerms(): Promise<void> {
    await this.clickFooterRoleLink(/ugc terms/i, this.locators.footer.ugcTermsLink);
  }

  /**
   * Validate navigation to expected static page URL and content load
   */
  async validateStaticPageOpened(expectedSubpath: string): Promise<void> {
    await this.verifyUrlContains(expectedSubpath);
    await this.waitForPageLoaded();
  }
}
