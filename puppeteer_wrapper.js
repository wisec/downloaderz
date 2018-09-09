const puppeteer = require('puppeteer');
var path = require('path');

//const bcutils = require('./bcdetect-utils.js');

async function createInstance(config, puppeteer_options, chrome_args) {
  //const baseDir = config.bcdetect_install_dir;
  //const homeDir = config.bcdetect_home_dir;
  //var themeExtension = path.join(baseDir, 'libs', 'chrome-theme-BCDetect');
  //var chromeExtension = path.join(baseDir, 'libs', 'chromeExtension');
  var custom_args = ["--no-first-run", "--no-default-browser-check", "--disable-hang-monitor", "--disable-background-networking",
    "--disable-client-side-phishing-detection",
    //  "--allow-insecure-localhost",
    "--test-type",
    // "--disable-xss-auditor", '--load-extension=' + chromeExtension + ',' + themeExtension, "--user-data-dir=" + homeDir,
    "--ignore-certificate-errors"
  ];

  if (chrome_args) {
    custom_args = custom_args.concat(chrome_args);
  }

  puppeteer_options = Object.assign(puppeteer_options || {}, {
    ignoreDefaultArgs: true,
    headless: !config.show ? true : false,
    args: custom_args
  });

  if(config.userAgent){
    custom_args.push(`--user-agent='${config.userAgent.replace(/'/g,"")}'`);
  }

  if (!config.show)
    custom_args.push("--headless");

  const browser = await puppeteer.launch(puppeteer_options);
  return browser;
}


module.exports = {
  launch: createInstance
};
