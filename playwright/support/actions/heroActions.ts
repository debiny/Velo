import { type Page } from '@playwright/test'

export function createHeroActions(page: Page) {

    return {
        clickPrimaryCta: async () => {
            await page.goto('/')
            await page.getByRole('link', { name: /Configure agora/i }).click()
        },
    }
}
