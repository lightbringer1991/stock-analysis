/**
 * node index.js --code ASX:CBA
 * node index.js --code ASX-CBA
 */

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const minimist = require('minimist');

const URL = 'https://www.tradingview.com/symbols';

(async () => {

  const argv = minimist(process.argv.slice(2));

  if (!argv.code) {
    console.error('missing stock code argument (--code)');
    process.exit(1);
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${URL}/${argv.code}`);

    const htmlCode = await page.content();
    const $ = cheerio.load(htmlCode);

    const financialsData = {};
    $('.tv-widget-fundamentals__item').each(function() {
      const title = $(this).find('.tv-widget-fundamentals__title').text().trim();
      financialsData[title] = {};
      $(this).find('.tv-widget-fundamentals__row').each(function() {
        financialsData[title][$(this).find('.tv-widget-fundamentals__label').text().trim()] = $(this).find('.tv-widget-fundamentals__value').text().trim();
      });
    });

    console.log(financialsData);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }

})();
