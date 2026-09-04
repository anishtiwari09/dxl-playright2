import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MegaMenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Helper to click a mega menu top navigation item using accessible role as primary
   */
  private async clickMenuRoleLink(nameRegex: RegExp, fallbackSelectors: string[]): Promise<void> {
    await this.dismissAnyBlockingOverlays();

    const mainNav = this.page.getByRole('navigation').or(this.page.locator('nav')).first();
    const menuLink = mainNav.getByRole('link', { name: nameRegex })
      .or(this.page.locator(fallbackSelectors.join(', ')))
      .first();

    await menuLink.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await menuLink.scrollIntoViewIfNeeded().catch(() => {});
    await menuLink.click({ force: true }).catch(async () => {
      await this.healer.safeClick(fallbackSelectors);
    });

    await this.waitForPageLoaded();
  }

  /**
   * Helper to click a header button/modal trigger using accessible role as primary
   */
  private async clickHeaderRoleButton(nameRegex: RegExp, fallbackSelectors: string[]): Promise<void> {
    await this.dismissAnyBlockingOverlays();

    const header = this.page.getByRole('banner').or(this.page.locator('header, nav')).first();
    const btn = header.getByRole('button', { name: nameRegex })
      .or(header.getByRole('link', { name: nameRegex }))
      .or(this.page.locator(fallbackSelectors.join(', ')))
      .first();

    await btn.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await btn.click({ force: true }).catch(async () => {
      await this.healer.safeClick(fallbackSelectors);
    });

    await this.page.waitForTimeout(1000);
  }

  /**
   * Click Mega Menu Item: NEW
   */
  async clickNewMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^new$/i, this.locators.megaMenu.newMenuItem);
  }

  /**
   * Click Mega Menu Item: SHIRTS
   */
  async clickShirtsMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^shirts$/i, this.locators.megaMenu.shirtsMenuItem);
  }

  /**
   * Click Mega Menu Item: BRANDS
   */
  async clickBrandsMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^brands$/i, this.locators.megaMenu.brandsMenuItem);
  }

  /**
   * Click Mega Menu Item: TRENDING
   */
  async clickTrendingMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^trending$/i, this.locators.megaMenu.trendingMenuItem);
  }

  /**
   * Click Mega Menu Item: PANTS + SHORTS
   */
  async clickPantsShortsMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/pants\s*\+\s*shorts/i, this.locators.megaMenu.pantsShortsMenuItem);
  }

  /**
   * Click Mega Menu Item: OUTERWEAR
   */
  async clickOuterwearMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^outerwear$/i, this.locators.megaMenu.outerwearMenuItem);
  }

  /**
   * Click Mega Menu Item: ACTIVEWEAR
   */
  async clickActivewearMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^activewear$/i, this.locators.megaMenu.activewearMenuItem);
  }

  /**
   * Click Mega Menu Item: TEAMS
   */
  async clickTeamsMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^teams$/i, this.locators.megaMenu.teamsMenuItem);
  }

  /**
   * Click Mega Menu Item: SUIT SHOP
   */
  async clickSuitShopMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/suit\s*shop/i, this.locators.megaMenu.suitShopMenuItem);
  }

  /**
   * Click Mega Menu Item: UNDERWEAR + LOUNGE
   */
  async clickUnderwearLoungeMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/underwear\s*\+\s*lounge/i, this.locators.megaMenu.underwearLoungeMenuItem);
  }

  /**
   * Click Mega Menu Item: SHOES
   */
  async clickShoesMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^shoes$/i, this.locators.megaMenu.shoesMenuItem);
  }

  /**
   * Click Mega Menu Item: ACCESSORIES
   */
  async clickAccessoriesMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^accessories$/i, this.locators.megaMenu.accessoriesMenuItem);
  }

  /**
   * Click Mega Menu Item: SALE
   */
  async clickSaleMenuItem(): Promise<void> {
    await this.clickMenuRoleLink(/^sale$/i, this.locators.megaMenu.saleMenuItem);
  }

  /**
   * Hover over SHIRTS menu item and click Graphic Tees
   */
  async hoverShirtsAndClickGraphicTees(): Promise<void> {
    await this.dismissAnyBlockingOverlays();

    const mainNav = this.page.getByRole('navigation').or(this.page.locator('nav')).first();
    const shirtsItem = mainNav.getByRole('link', { name: /^shirts$/i })
      .or(this.page.locator(this.locators.megaMenu.shirtsMenuItem.join(', ')))
      .first();

    await shirtsItem.scrollIntoViewIfNeeded().catch(() => {});
    await shirtsItem.hover();
    await this.page.waitForTimeout(600);

    const graphicTeesItem = this.page.getByRole('link', { name: /graphic tees/i })
      .or(this.page.locator(this.locators.megaMenu.graphicTeesSubMenuItem.join(', ')))
      .first();

    await graphicTeesItem.waitFor({ state: 'visible', timeout: 6000 }).catch(async () => {
      await shirtsItem.hover();
    });

    await graphicTeesItem.click({ force: true }).catch(async () => {
      await this.healer.safeClick(this.locators.megaMenu.graphicTeesSubMenuItem);
    });

    await this.waitForPageLoaded();
  }

  /**
   * Click Find a Store button
   */
  async clickFindAStoreButton(): Promise<void> {
    await this.clickHeaderRoleButton(/find a store|store/i, this.locators.headerModals.findAStoreBtn);
  }

  /**
   * Click Order Status button
   */
  async clickOrderStatusButton(): Promise<void> {
    await this.clickHeaderRoleButton(/order status/i, this.locators.headerModals.orderStatusBtn);
  }

  /**
   * Click Account button (title=Account)
   */
  async clickAccountButton(): Promise<void> {
    await this.clickHeaderRoleButton(/sign in|account/i, this.locators.headerModals.accountBtn);
  }

  /**
   * Click Wishlist button
   */
  async clickWishlistButton(): Promise<void> {
    await this.clickHeaderRoleButton(/wishlist/i, this.locators.headerModals.wishlistBtn);
  }

  /**
   * Click Bag button (#my-shopping-bag)
   */
  async clickShoppingBagButton(): Promise<void> {
    await this.clickHeaderRoleButton(/bag|cart|shopping bag/i, this.locators.headerModals.cartBtn);
  }

  /**
   * Validate modal is displayed with expected title or text
   */
  async validateModalOpened(expectedTitle: string): Promise<void> {
    const modal = this.page.getByRole('dialog')
      .or(this.page.locator(this.locators.headerModals.modalDialog.join(', ')))
      .first();

    await expect(modal).toBeVisible({ timeout: 10000 });

    const modalText = await modal.textContent();
    expect(modalText).toContain(expectedTitle);
  }

  /**
   * Validate PLP page opened and products/content are loaded with scroll down
   */
  async validatePLPOpened(expectedSubpath: string): Promise<void> {
    try {
      await this.page.waitForURL(new RegExp(expectedSubpath), { timeout: 25000 });
    } catch {
      await this.verifyUrlContains(expectedSubpath);
    }

    await this.waitForPageLoaded();

    const plpIndicator = this.page.locator(
      `${this.locators.plp.plpHeader.join(', ')}, ${this.locators.plp.productTile.join(', ')}, main table, main img`
    ).first();

    await plpIndicator.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {
      console.warn(`[PLP Notice] Header/product tile locator did not finish rendering within 20s for ${expectedSubpath}`);
    });

    console.log(`[PLP Action] Scrolling down product listing page...`);
    await this.scrollToLoadProducts();

    await expect(this.page).toHaveURL(new RegExp(expectedSubpath), { timeout: 25000 });
    console.log(`[PLP Validation] Confirmed page loaded for: ${expectedSubpath}`);
  }

  /**
   * Validate breadcrumb displays on PLP page
   * Expected format: Home / Category Name
   */
  async validateBreadcrumb(expectedCategoryName: string): Promise<void> {
    const breadcrumb = this.page.getByRole('navigation', { name: /breadcrumb/i })
      .or(this.page.locator((this.locators.search?.breadcrumb || ['.breadcrumb']).join(', ')))
      .first();

    await breadcrumb.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.warn(`[Breadcrumb Notice] Breadcrumb not visible within timeout`);
    });

    const breadcrumbText = await breadcrumb.textContent();

    const homeLink = breadcrumb.getByRole('link', { name: /^home$/i })
      .or(this.page.locator((this.locators.search?.breadcrumbHomeLink || ['a:has-text("Home")']).join(', ')))
      .first();

    await expect(homeLink).toBeVisible({ timeout: 8000 });

    expect(breadcrumbText).toContain('Home');
    expect(breadcrumbText).toContain(expectedCategoryName);

    console.log(`[Breadcrumb Validation] Confirmed breadcrumb: ${breadcrumbText?.trim()}`);
  }
}
