import * as EC from 'wdio-wait-for';

/**
 * Function to wait for browser to be navigated to expected URL.
 * @param expectedUrl Expected URL
 * @param timeout Default: 30000
 */
export const Url = async (expectedUrl: string, timeout: number = 30000): Promise<void> => {
    try {
        await browser.waitUntil(async () => {
            const baseUrl = await browser.getUrl();
            return baseUrl === expectedUrl;
        },
            { timeout, timeoutMsg: '[URL] Timeout!!! Condition not satisfied.' });
    } catch (err) { }
}

/**
 * Function to wait for browser to be navigated to the URL which contains the expected URL.
 * @param expectedUrl Expected URL
 * @param timeout Default: 30000
 */
export const UrlContains = async (expectedUrl: string, timeout: number = 30000): Promise<void> => {
    try {
        await browser.waitUntil(async () => (await browser.getUrl()).includes(expectedUrl),
            { timeout, timeoutMsg: '[URL] Timeout!!! Condition not satisfied.' });
    } catch (err) { }
}

/**
 * Function to wait for an element to be present.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const Element = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    try {
        await (await $$(expectedElement))[elmNo].waitForExist({ timeout: timeout });
    } catch (error) { }
}

/**
 * Function to wait for an element to be visible.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const ElementVisible = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    try {
        await (await $$(expectedElement))[elmNo].waitForDisplayed({ timeout: timeout });
    } catch (error) { }
}

/**
 * Function to wait for an element to be enabled.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const ElementEnabled = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    try {
        await (await $$(expectedElement))[elmNo].waitForEnabled({ timeout: timeout });
    } catch (error) { }
}

/**
 * Function to wait for an element to be not visible.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const ElementNotVisible = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    try {
        await (await $$(expectedElement))[elmNo].waitForDisplayed({ timeout: timeout, reverse: true });
    } catch (error) { }
}


/**
 * Function to wait for a specific element to be not visible.
 * @param expectedElement Element identifier
 * @param timeout Default: 10000
 */
export const specElementNotVisible = async (expectedElement: string, timeout: number = 10000): Promise<void> => {
    try {
        await browser.waitUntil(
            EC.visibilityOf(expectedElement),
            {
                timeout: timeout,
                timeoutMsg: '[Element][' + expectedElement + '] Timeout!!! Condition not satisfied.'
            }
        );
    } catch (err) { }
}

/**
 * Function to wait for spinner/loader to disappear.
 * @param timeout Default 10000 (10s)
 */
export const loaderDisappear = async (timeout: number = 10000): Promise<void> => {
    await ElementNotVisible('div[id="loader"]', 0, false, timeout);
}


/**
 * Funcction to check if an element contains an expected string.
 * @param elm Element. Ex: $('p[class="label"]')
 * @param expectedText Expected string in a given element 
 * @param timeout Default: 20000 (20s)
 */
export const elementContainsText = async (elm: WebdriverIO.Element, expectedText: string, timeout: number = 20000): Promise<void> => {
    try {
        await browser.waitUntil(
            async () => (await elm.getText()) === expectedText,
            {
                timeout: timeout,
                timeoutMsg: `Element do not have text "${expectedText}"`
            }
        );
    } catch (err) { }
}
