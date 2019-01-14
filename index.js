const bc_puppeteer = require('./puppeteer_wrapper.js');
const fs = require('fs');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


var args = process.argv.slice(2);


var opts = "help:script::show:agent::url::save::binary:jsdom".split(':');

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
Example: node ${process.argv[1]} --script scripts/openload.js [--jsdom] --url url --show --agent "user agent string" [--save fileurl] [--binary /path/to/chrome]`);
  process.exit();
} else {
  var script_content = fs.readFileSync(options.script) + '';
}

var userAgent = options.agent;
var show = options.show;

(async () => {

  if(!options.jsdom){
    const browser = await bc_puppeteer.launch({show:show,userAgent:userAgent},{'executablePath':options.binary});
    const page = await browser.newPage();

    await eval("(async ()=> {\n" + script_content + ";\n})()");

  }else{
    var  dom = await JSDOM.fromURL(options.url, {});
    await eval("(async ()=> {\n" + script_content + ";\n})()");
  }
})();
