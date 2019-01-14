const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs');
const child_process = require('child_process');
var urlparse = require("url").parse;


var opts = "help:binary:".split(':');

var args = process.argv;

function getArg(arg, hasoption) {
  var idx = args.indexOf("--" + arg);
  hasoption = hasoption || opts[opts.indexOf(arg) + 1] === ''
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
  if (opt) {
    var arg = getArg(opt);
    if (arg != null)
      options[opt] = arg;
  }
});
/////////////////////////////////
const app = express()

const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');


app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((request, response, next) => {
  //console.log(request.headers);
  next();
});

app.use((request, response, next) => {
  request.chance = Math.random();
  next();
});

const crypto = require("crypto");
var getSHA1ofJSON = function(input) {
  return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
}
function getFileNameFromURL(url) {
  return path.join(__dirname, getSHA1ofJSON(url) + ".url");
}
// param /findurl?url=
app.get('/findurl', (request, response) => {
  var reqUrl = request.query.url;

  var userAgent = request.headers['user-agent'];
  console.log("FindURL: ", request.query.url, getFileNameFromURL(reqUrl));
  var host = urlparse(reqUrl).host;
  const USE_JSDOM = "--jsdom";
  var host_script = {
    'openload.co': "./openload.js",
    'vidcloud.co': "./vidcloud.js",
    'streamango.com': ["./streamango.js", USE_JSDOM]
  };

  //  const sub_proc = child_process.spawn("node", ["index.js", "--url", reqUrl, "--agent", userAgent, "--save", getFileNameFromURL(reqUrl),"--script"].concat(host_script[host]), {

  // var host_script = {
  //   'openload.co': "./openload.js",
  //   'vidcloud.co': "./vidcloud.js",
  //   'wstream.video':"./wstream.js"
  // };
  console.log(host, host_script)
  if (pathExists(options.binary)) {
    console.log(options.binary);
    var binary = ["--binary", options.binary]
  }
  const sub_proc = child_process.spawn("node", [].concat.apply(["index.js", "--url", reqUrl, "--agent", userAgent, "--save", getFileNameFromURL(reqUrl), "--script"].concat(host_script[host]), binary), {
    detached: true,
    stdio: ['ignore', out, err],
    cwd: __dirname + "/../"
  });
  sub_proc.unref();
  response.json({
    result: request.chance
  });
});

// params: /isready?url=http...
app.get('/isready', (request, response) => {
  var reqUrl = request.query.url;
  var file = getFileNameFromURL(reqUrl);
  console.log("isReady", reqUrl, file);
  var retrieved = false;
  if (pathExists(file)) {
    retrieved = fs.readFileSync(file) + '';
  }
  response.json({
    found: retrieved
  });
});

app.get('/', (request, response) => {
  var reqUrl = request.query.url || "";

  response.render('main', {
    reqUrl: reqUrl
  })
})

function pathExists(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}


app.listen(3000);
