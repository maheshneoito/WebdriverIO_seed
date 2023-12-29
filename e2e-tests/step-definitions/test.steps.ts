import { Given, When } from "@wdio/cucumber-framework";



Given('User is successfully navigated to google home page', async ()=>{
    const baseurl = browser.options.baseUrl!;
    await browser.url('/');

    // await browser.url('https://google.com/');
    // await browser.pause(4000)


})

