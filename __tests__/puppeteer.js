// const { isTransitionDefined } = require('framer-motion/types/animation/utils/transitions');
const puppeteer = require('puppeteer');

const APP = `http://localhost:${process.env.PORT || 3000}`;

describe('Front-end Integration/Features', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    // console.log('browser', browser);
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(APP);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(() => {
    browser.close();
  });

  describe('Initial display', () => {
    it('loads successfuly', async () => {
      // console.log('running first test');
      await page.waitForSelector('#app');
      const app = await page.$eval('#app', (el) => el);
      // console.log('app', app);
      expect(app).toBeTruthy();
    });

    // it('properly filters requests', async () => {
    //   await page.waitForSelector('#app');

    // })
  });
});
