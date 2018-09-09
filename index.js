const bc_puppeteer = require('./puppeteer_wrapper.js');
const fs = require('fs');

var args = process.argv.slice(2);


var opts = "help:script::show:agent::url::save:".split(':');

function getArg(arg, hasoption) {
  var idx = args.indexOf("--"+arg);
  hasoption = hasoption || opts[opts.indexOf(arg)+1]===''
  if (idx === -1) {
    return null;
  } else if (!hasoption) {
    return true;
  } else {
    return args[idx + 1];
  }
}

var options = {};
opts.forEach(opt => {
	if(opt){
		var arg = getArg(opt);
		if(arg!=null)
			options[opt]=arg;
	}
});
///////////////////////////////////////////////////////////////

if (options.help || !options.script || !options.url) {
  console.error(`Usage:
node ${process.argv[1]} path/to/script.js
Example: node ${process.argv[1]} scripts/openload.js --url url --show --agent "user agent string" [--save fileurl]`);
  process.exit();
} else {
  var script_content = fs.readFileSync(options.script) + '';
}

var userAgent = options.agent;
var show = options.show;

(async () => {

  const browser = await bc_puppeteer.launch({show:show,userAgent:userAgent});
  const page = await browser.newPage();

  await eval("(async ()=> {\n" + script_content + ";\n})()");
// script example:
//await page.goto('http://www.domxss.com/domxss/01_Basics/00_simple_noHead.html?13133862'
//await page.evaluate('_rw_.fuzzPage();');
//await browser.close();
})();
