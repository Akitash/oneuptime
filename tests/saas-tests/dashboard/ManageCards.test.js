const puppeteer = require('puppeteer');
const utils = require('../../test-utils');
const init = require('../../test-init');

let browser, page;
// parent user credentials
const email = utils.generateRandomBusinessEmail();
const password = '1234567890';
const user = {
    email,
    password,
};

describe('Stripe cards API', () => {
    const operationTimeOut = init.timeout;

    beforeAll(async done => {
        jest.setTimeout(init.timeout);

        browser = await puppeteer.launch(utils.puppeteerLaunchConfig);
        page = await browser.newPage();
        await page.setUserAgent(utils.agent);
        // user
        await init.registerUser(user, page);
        done();
    });

    afterAll(async done => {
        await browser.close();
        done();
    });

    test(
        'should add a valid card',
        async done => {
            await page.goto(`${utils.DASHBOARD_URL}/dashboard/profile/billing`);
            await page.waitForSelector('#addCardButton');
            await init.pageClick(page, '#addCardButton');
            await page.waitForSelector(
                '.__PrivateStripeElement > iframe[title="Secure card payment input frame"]',
                {
                    visible: true,
                    timeout: operationTimeOut,
                }
            );
            const stripeIframe = await page.$(
                '.__PrivateStripeElement > iframe[title="Secure card payment input frame"]'
            );
            const frame = await stripeIframe.contentFrame();
            frame.waitForSelector('input[name=cardnumber]');
            await frame.type('input[name=cardnumber]', '42424242424242424242', {
                delay: 200,
            });
            frame.waitForSelector('input[name=exp-date]');
            await frame.type('input[name=exp-date]', '11/23');
            frame.waitForSelector('input[name=cvc]');
            await frame.type('input[name=cvc]', '100');
            frame.waitForSelector('input[name=postal]');
            await frame.type('input[name=postal]', '11234');
            await init.pageClick(page, '#addCardButtonSubmit');
            await page.waitForSelector('#addCardButtonSubmit', {
                hidden: true,
                timeout: operationTimeOut,
            });

            const cardsCount = await page.$eval(
                '#cardsCount',
                el => el.textContent
            );

            expect(cardsCount).toEqual('2 Cards');

            done();
        },
        operationTimeOut
    );

    test(
        'should delete card',
        async done => {
            await page.goto(`${utils.DASHBOARD_URL}/dashboard/profile/billing`);
            await page.waitForSelector('#deleteCard1');
            await init.pageClick(page, '#deleteCard1');
            await page.waitForSelector('#deleteCardButton');
            await init.pageClick(page, '#deleteCardButton');
            await page.waitForSelector('#deleteCardButton', {
                hidden: true,
            });

            const cardsCount = await page.$eval(
                '#cardsCount',
                el => el.textContent
            );

            expect(cardsCount).toEqual('1 Card');

            done();
        },
        operationTimeOut
    );

    test(
        'should not delete card when there is only one card left',
        async done => {
            await page.goto(`${utils.DASHBOARD_URL}/dashboard/profile/billing`);
            await page.waitForSelector('#deleteCard0');
            await init.pageClick(page, '#deleteCard0');
            await page.waitForSelector('#deleteCardButton');
            await init.pageClick(page, '#deleteCardButton');
            const deleteError = await page.waitForSelector('#deleteCardError', {
                visible: true,
                timeout: operationTimeOut,
            });
            expect(deleteError).toBeDefined();
            await init.pageClick(page, '#deleteCardCancel');

            const cardsCount = await page.$eval(
                '#cardsCount',
                el => el.textContent
            );

            expect(cardsCount).toEqual('1 Card');
            done();
        },
        operationTimeOut
    );

    test(
        'should not add an invalid card',
        async done => {
            await page.goto(`${utils.DASHBOARD_URL}/dashboard/profile/billing`);
            await page.waitForSelector('#addCardButton');
            await init.pageClick(page, '#addCardButton');
            await page.waitForSelector(
                '.__PrivateStripeElement > iframe[title="Secure card payment input frame"]',
                {
                    visible: true,
                    timeout: operationTimeOut,
                }
            );
            const stripeIframe = await page.$(
                '.__PrivateStripeElement > iframe[title="Secure card payment input frame"]'
            );

            const frame = await stripeIframe.contentFrame();
            frame.waitForSelector('input[name=cardnumber]');
            await frame.type('input[name=cardnumber]', '42424242424242424242', {
                delay: 200,
            });
            frame.waitForSelector('input[name=exp-date]');
            await frame.type('input[name=exp-date]', '11/23');
            frame.waitForSelector('input[name=cvc]');
            await frame.type('input[name=cvc]', '100');
            frame.waitForSelector('input[name=postal]');
            await frame.type('input[name=postal]', '11234');
            await init.pageClick(page, '#addCardButtonSubmit');
            const error = await page.waitForSelector('#cardError', {
                visible: true,
                timeout: init.timeout,
            });
            expect(error).toBeDefined();
            done();
        },
        operationTimeOut
    );
});
