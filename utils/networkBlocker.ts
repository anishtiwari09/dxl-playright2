import { Page } from '@playwright/test';

export const THIRD_PARTY_NOISE = new RegExp(
  [
    'tealiumiq\\.com',
    'tiqcdn\\.com',
    'yottaa\\.com',
    'monetate\\.(net|com)',
    'onetrust\\.com',
    'cookielaw\\.org',
    'zendesk\\.com',
    'salesfloor\\.net',
    'googletagmanager\\.com',
    'snapchat\\.com',
    'reddit\\.com',
    'bluecore\\.com',
    'gepi\\.global-e\\.com',
    'intgepi\\.bglobale\\.com',
  ].join('|'),
);

/**
 * Blocks 3rd party tracker, cookie consent, and country selector network requests
 */
export async function blockThirdPartyNoise(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const url = route.request().url();

    if (url.includes('global-e.com') || url.includes('bglobale.com')) {
      console.log('BLOCKING GLOBAL-E:', url);
      await route.abort();
      return;
    }

    if (THIRD_PARTY_NOISE.test(url)) {
      console.log('BLOCKING THIRD PARTY:', url);
      await route.abort();
      return;
    }

    await route.continue();
  });
}
