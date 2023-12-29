import * as domainData from './data/domainData';
import * as waitFor from '../support/waitHelpers';
import { promisedExpect } from './chai';
import * as elmList from '../support/elementList';
import * as mobElmList from '../support/mobElementList';
import * as geoLocHelpers from './geoLocHelpers';


/**
 * Deletes browser cookies, session storage and local storage.
 */
export const deleteAllBrowserData = async (): Promise<void> => {
    try {
        await browser.execute(`var cookies = document.cookie.split("; ");
                for (var c = 0; c < cookies.length; c++) {
                    var d = window.location.hostname.split(".");
                    while (d.length > 0) {
                        var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + d.join('.') + ' ;path=';
                        var p = location.pathname.split('/');
                        document.cookie = cookieBase + '/';
                        while (p.length > 0) {
                            document.cookie = cookieBase + p.join('/');
                            p.pop();
                        };
                        d.shift();
                    }
                }`);
        await browser.deleteCookies();
        await browser.execute('window.sessionStorage.clear();');
        await browser.execute('window.localStorage.clear();');
        await browser.execute('document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"); });');
    } catch (error) { }
};

// /**
//  * Get current domain name.
//  * Default domain is "com"
//  */
// export const getCurrentDomain = async (): Promise<string> => {
//     let domain: string = "com";
//     if (__vars[browser.sessionId + ".domainName"]) {
//         if (__vars[browser.sessionId + ".domainName"] !== "") {
//             domain = __vars[browser.sessionId + ".domainName"];
//         }
//     }
//     return domain;
// }

// /**
//  * Get current environment name. Expected values: dev, stage, prod.
//  */
// export const getEnv = (): string => {
//     const baseUrl: string = browser.options.baseUrl!;
//     let env: string = 'stage';
//     if (baseUrl.includes("://buy.electroluxprofessional.com")) {
//         env = 'prod';
//     }
//     else if (baseUrl.includes("://elx-dev.partstown") || baseUrl.includes("://elx-dev.partstown")) {
//         env = 'dev';
//     }
//     else if (baseUrl.includes("://elx-test.partstown") || baseUrl.includes("://elx-test.partstown")) {
//         env = 'test';
//     }
//     return env;
// }

// /**
//  * Function to check if a step should be skipped or not based on tag array.
//  */
// export const skipStep = async (tagArray: any): Promise<boolean> => {
//     const domain: string = await getCurrentDomain();
//     const env: string = getEnv();
//     let predefinedList: any = domainData.skipTagList[domain][env];
//     if (__vars[browser.sessionId + ".mobileWeb"]) {
//         predefinedList = [...domainData.mobileSkipTagList, ...predefinedList];
//     }
//     const filteredArray: any = tagArray.filter((element: any) => predefinedList.includes(element));
//     return filteredArray.length > 0 ? true : false;
// };

/**
 * Plain JavaScript function to click on an element.
 * 
 * @param selector Selector value as string. Ex: div[class="name"]
 * @param elmNo Default 0.
 */
export const jsClickElm = async (selector: string, elmNo: number = 0): Promise<void> => {
    await browser.execute(`document.querySelectorAll('${selector}')[${elmNo}].click()`).catch((err: Error) => { throw new Error("Click Error!\n" + err.message); });;
}

/**
 * Retrieve current page URL.
 * 
 * Parameters:
 * 
 * lowerCase => To get URl in lowercase. Default value is FALSE.
 */
export const getPageUrl = async (lowerCase: boolean = false): Promise<string> => {
    let currentUrl = await browser.getUrl();
    return lowerCase ? currentUrl.toLowerCase() : currentUrl;
}

/**
 * Chai assertion to check if user is navigated to given link.
 * 
 * Parameters:
 * 
 * link => stage.partstown.com/my-account/address-book
 */
export const checkRedirectionToLink = async (link: string) => {
    await waitFor.UrlContains(link);
    const url: string = await getPageUrl();
    expect(url.includes(link), `${link} does not exists in URL ${url}`).to.be.true;
}



/**
 * Get the first element visible in viewport/screen.
 * @param elmName Element Name. Value = 'input[class="wishlists__input"]'.
 * @param expectedElmNo The nth element of all visible elements, expected to get back. Default = 0.
 * @returns Element
 */
export const getVisibleElement = async (elmName: string, expectedElmNo: number = 0): Promise<any> => {
    const elements = await $$(elmName);
    const retrievedElmNos: number[] = [];
    for (let i = 0; i < elements.length; ++i) {
        const elmVisible = await elements[i].isDisplayed();
        if (elmVisible) {
            retrievedElmNos.push(i);
        }
    }
    return expectedElmNo <= retrievedElmNos.length ? elements[retrievedElmNos[expectedElmNo]] : elements[0];
}

/**
 * Scroll to the element using element's class attribute.
 * @param elm lass name. Example : "wishlists__input".
 * @param elmNumber Element number. Default value is 0.
 */
export const scrollToViewClass = async (elm: string, elmNumber: number = 0): Promise<void> => {
    try {
        if (__vars[browser.sessionId + ".browserName"] === 'ie') {
            await browser.execute(`document.getElementsByClassName('${elm}')[${elmNumber}].scrollIntoView(false)`);
        }
        else {
            await browser.execute(`document.getElementsByClassName('${elm}')[${elmNumber}].scrollIntoView({ behavior: '${__vars[browser.sessionId + ".browserName"] === 'chrome' ? 'smooth' : 'auto'}', block: 'nearest', inline: 'start' })`);
        }
        await browser.pause(1000);
    } catch (error) { }
};

/**
 * Scroll the element to center
 * @param elm :Element 
 */
export const scrollElmTocenter = async (elm: WebdriverIO.Element): Promise<void> => {
    await elm.scrollIntoView({ block: 'center', inline: 'center' });
}

/**
 * Scroll to the element using element's ID attribute.
 * @param elm ID name. Example : "eq-equipmentName".
 * @param elmNumber Element number. Default value is 0.
 */
export const scrollToViewID = async (elm: string, elmNumber: number = 0): Promise<void> => {
    try {
        if (__vars[browser.sessionId + ".browserName"] === 'ie') {
            await browser.execute(`document.getElementById('${elm}').scrollIntoView(false)`);
        }
        else {
            await browser.execute(`document.getElementById('${elm}').scrollIntoView({ behavior: '${__vars[browser.sessionId + ".browserName"] === 'chrome' ? 'smooth' : 'auto'}', block: 'nearest', inline: 'start' })`);
        }
        await browser.pause(1000);
    } catch (error) { }
};

/**
 * Scroll to the element using protractor tag name.
 * @param elm  Element/Tag name. Example : 'input[class="wishlists__input"]'.
 * @param elmNumber Element number. Default value is 0.
 */
export const scrollToView = async (elm: string, elmNumber: number = 0): Promise<void> => {
    try {
        if (__vars[browser.sessionId + ".browserName"] === 'ie') {
            await browser.execute(`document.getElementsByTagName('${elm}')[${elmNumber}].scrollIntoView(false)`);
        }
        else {
            await browser.execute(`document.getElementsByTagName('${elm}')[${elmNumber}].scrollIntoView({ behavior: '${__vars[browser.sessionId + ".browserName"] === 'chrome' ? 'smooth' : 'auto'}', block: 'nearest', inline: 'start' })`);
        }
        await browser.pause(1000);
    } catch (error) { }
};

/**
 * Function to click element.
 * 
 * For macOS/OS X, vanilla javascript functionality will be used to click.
 * 
 * @param elm Element. Ex. $$('#btn").first()
 */
export const clickElm = async (elm: WebdriverIO.Element): Promise<void> => {
    if (__vars[browser.sessionId + ".browserName"] === 'safari') {
        await browser.execute('arguments[0].click()', elm).catch((err: Error) => { throw new Error("Click Error!\n" + err.message); });
    }
    else {
        await elm.click();
    }
}

/**
 * Function to wait, scroll to, assert and click the defined element.
 * @param elm Element identifier string. Example: 'button[type="submit"]'
 * @param elmNo Element number. Default: 0
 * @param assertType present | enabled | displayed. Default: enabled
 * @param elmClassName Element HTML class name. Default: ''
 * @param elmID Element HTML ID name. Default: ''
 * @param clickElement Should click the element. Default: true
 * @param assertElement Should do assertion. Default: true
 * @param elementName Name of element to be used during failed assertion. Default: "" 
 */
export const elementAssertClick = async (elm: string, elmNo: number = 0, assertType: string = 'enabled', elmClassName: string = '', elmID: string = '', clickElement: boolean = true, assertElement: boolean = true, elementName: string = ''): Promise<void> => {
    await waitFor.Element(elm, elmNo);
    elementName = elementName === "" ? `Element [${elm}]` : elementName;
    // Scroll to element
    if (elmClassName !== '') {
        await scrollToViewClass(elmClassName, elmNo);
    }
    else if (elmID !== '') {
        await scrollToViewID(elmID, elmNo);
    }
    else {
        await scrollToView(elm, elmNo);
    }
    await waitFor.loaderDisappear();

    // Assertion. No assertion if assertType value is set to ''(empty)
    if (assertType === 'enabled') {
        await waitFor.ElementEnabled(elm, elmNo);
        if (assertElement) {
            await promisedExpect((await $$(elm))[elmNo].isExisting(), `${elementName} not present!`).to.eventually.equal(true);
            await promisedExpect((await $$(elm))[elmNo].isEnabled(), `${elementName} not enabled!`).to.eventually.equal(true);
        }
    }
    else if (assertType === 'displayed') {
        await waitFor.ElementVisible(elm, elmNo);
        if (assertElement) {
            await promisedExpect((await $$(elm))[elmNo].isExisting(), `${elementName} not present!`).to.eventually.equal(true);
            await promisedExpect((await $$(elm))[elmNo].isDisplayed(), `${elementName} not visible!`).to.eventually.equal(true);
        }
    }
    else if (assertType === 'present') {
        await promisedExpect((await $$(elm))[elmNo].isExisting(), `${elementName} not present!`).to.eventually.equal(true);
    }

    //Click element if condition true
    if (clickElement) {
        try {
            if (__vars[browser.sessionId + ".browserName"] === 'safari') {
                await jsClickElm(elm, elmNo);
            }
            else {
                await clickElm((await $$(elm))[elmNo]);
            }
        } catch (error) { console.log(`Unable to click: ${elm}\n`); }
    }
}

/**
 * Removes keyboard focus from the current element.
 */
export const blurActiveElement = async (): Promise<void> => {
    await browser.execute('document.activeElement.blur()').catch(err => { });
    await browser.pause(1000);
}

/**
 * Function to execute mouse actions on an element.
 * 
 * @param elm Element
 * @param actionType "up", "down", "move"
 * @param shouldClick true or false, Default-false
 * @param removeAllFocus Remove focus from all the elements? Default: true
 */
export const mouseAction = async (elm: WebdriverIO.Element, actionType: string = "move", shouldClick: boolean = false, removeAllFocus: boolean = true): Promise<void> => {
    if (removeAllFocus) {
        await blurActiveElement();
    }
    const isElmPresent: boolean = await elm.isExisting();
    if (!isElmPresent) {
        return;
    }
    // const location: any = await elm.getLocation();
    await browser.pause(1000);
    switch (actionType) {
        case "down":
            try { await elm.buttonDown(); } catch (err) { }
            break;

        case "up":
            try { await elm.buttonUp(); } catch (err) { }
            break;

        default:
            try { await elm.moveTo(); } catch (err) { }
    }

    if (shouldClick) {
        await clickElm(elm);
    }
}




/**
 * Function to get element based on the text provided.
 * 
 * @param elmVal 
 * @param matchText 
 * @param elmNo 
 * @param includesText
 * @param visibility
 * @returns element
 */
export const getElementByText = async (elmVal: string, matchText: string, elmNo: number = 0, includesText: boolean = false, visibility: boolean = true): Promise<any> => {
    matchText = matchText.trim().toLowerCase();
    return (await $$(elmVal).filter(async (elm) => {
        const name: string = (await elm.getText()).trim().toLowerCase();
        const isNameMatched = includesText ? name.includes(matchText) : name === matchText;
        if (visibility) {
            const elmDisplayed = await elm.isDisplayed();
            return elmDisplayed && isNameMatched;
        }
        else {
            return isNameMatched;
        }
    }))[elmNo];
}

/**
 * Creates a custom ID using timestamp and random text.
 */
export const makeid = (): Promise<any> => {
    let result: string = '';
    result = Math.random().toString(36).substring(2, 9);
    result = new Date().getTime().toString() + result;
    return result as any;
}

/**
 * Function to disintegrate a string and then push it into an input field.
 */
export const crumbledInput = async (elm: WebdriverIO.Element, customText: string): Promise<void> => {
    const arr = Array.from(customText);
    for (let i = 0; i < arr.length; i++) {
        await elm.addValue(arr[i]);
    }
    await browser.pause(1000);
}


/**
 * Function to get keys for different keyboard functions.
 * @param keyType "cut", "copy","paste"
 * @returns An object containing 2 keys for protractor
 */
export const getKeyboardKeys = async (keyType: string): Promise<any> => {
    interface Controls {
        key1: any
        key2: any
    }
    const controls: Controls = { key1: '', key2: '' }
    if (__vars[browser.sessionId + ".osx"]) {
        switch (keyType.toLowerCase()) {
            case "copy": controls.key1 = "Control", controls.key2 = "Insert";
                break;
            case "paste": controls.key1 = "Shift", controls.key2 = "Insert";
                break;
            case "cut": controls.key1 = "Shift", controls.key2 = "Delete";
                break;
        }
    }
    else {
        switch (keyType.toLowerCase()) {
            case "copy": controls.key1 = "Control", controls.key2 = 'c';
                break;
            case "paste": controls.key1 = "Control", controls.key2 = 'v';
                break;
            case "cut": controls.key1 = "Control", controls.key2 = 'x';
                break;
        }
    }
    return controls;
}

