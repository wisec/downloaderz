const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs');
const child_process = require('child_process');

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
  console.log(request.headers);
  next();
});

app.use((request, response, next) => {
  request.chance = Math.random();
  next();
});

const crypto = require("crypto");
var getSHA1ofJSON = function(input){
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
}
function getFileNameFromURL(url) {
	return path.join(__dirname,getSHA1ofJSON(url)+".url");
}
// param /findurl?url=
app.get('/findurl', (request, response) => {
  var reqUrl = request.query.url;
  var userAgent = request.headers['user-agent'];
  console.log("FindURL: ",request.query.url,getFileNameFromURL(reqUrl));
  
  const sub_proc = child_process.spawn("node", ["index.js", "--script", "./openload.js", "--url", reqUrl, "--agent", userAgent, "--save", getFileNameFromURL(reqUrl)], {
  detached: true, 
  stdio: [ 'ignore', out, err ],
  cwd: __dirname+"/../"
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
  console.log("isReady",reqUrl,file);
  var retrieved = false;
  if(pathExists(file)){
    retrieved = fs.readFileSync(file)+'';
  } 
  response.json({
    found: retrieved
  });
});

app.get('/', (request, response) => {
  response.render('main'/*, {
    
  }*/)
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
