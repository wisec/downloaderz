const repl = require('repl');

const r = repl.start('> ');
r.on('exit', () => {
    browser.close().then(() => {
      process.exit()
    });
  });
r.context.browser = browser;
r.context.page = page;
//await browser.close();
