const puppeteer = require('puppeteer');
const utils = require('../../test-utils');
const init = require('../../test-init');

let browser, page;
const user = {
    email: utils.generateRandomBusinessEmail(),
    password: '1234567890',
};
const componentName = utils.generateRandomString();
const performanceTrackerName = utils.generateRandomString();

/** This is a test to check:
 * No errors on page reload
 * It stays on the same page on reload
 */

describe('Fyipe Page Reload', () => {
    const operationTimeOut = init.timeout;

    beforeAll(async done => {
        jest.setTimeout(init.timeout);

        browser = await puppeteer.launch(utils.puppeteerLaunchConfig);
        page = await browser.newPage();
        await page.setUserAgent(utils.agent);

        await init.registerUser(user, page); // This automatically routes to dashboard page
        await init.addComponent(componentName, page);
        done();
    });

    afterAll(async done => {
        await browser.close();
        done();
    });

    test(
        'Should reload the performance tracker page and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#performanceTracker', {
                visible: true,
                timeout: init.timeout,
            });
            await init.pageClick(page, '#performanceTracker');
            await page.waitForSelector('#form-new-performance-tracker', {
                visible: true,
                timeout: init.timeout,
            });
            await page.waitForSelector('input[name=name]', {
                visible: true,
                timeout: init.timeout,
            });
            await init.pageType(
                page,
                'input[name=name]',
                performanceTrackerName
            );
            await page.waitForSelector('#addPerformanceTrackerButton', {
                visible: true,
                timeout: init.timeout,
            });
            await init.pageClick(page, '#addPerformanceTrackerButton');
            let spanElement;
            spanElement = await page.waitForSelector(
                `#performance-tracker-title-${performanceTrackerName}`,
                { visible: true, timeout: init.timeout }
            );
            expect(spanElement).toBeDefined();

            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
                timeout: init.timeout,
            });
            await page.waitForSelector('#cbPerformanceTracker', {
                visible: true,
                timeout: init.timeout,
            });
            await page.waitForSelector(`#cb${performanceTrackerName}`, {
                visible: true,
                timeout: init.timeout,
            });

            spanElement = await page.waitForSelector(
                `#performance-tracker-title-${performanceTrackerName}`,
                { visible: true, timeout: init.timeout }
            );
            expect(spanElement).toBeDefined();
            done();
        },
        operationTimeOut
    );
});
