(async function () {

  var urlparse = require("url").parse;
  
  const downloaderURL = "oloadcdn.net/dl";
  const downloaderExt = ".mp4";
  var arhosts = ['openload.co',
      'oloadcdn.net'];


  var requested_url = options.url.replace('/embed/', "/f/");


  await page.setRequestInterception(true);

  page.on("request", function(req) {
    var requestedURL = req.url();
    var host = urlparse(requestedURL).host;

    if (arhosts.some((host_el) => {
        return host.endsWith(host_el)
      })) {
      console.error("[II] CONTINUE", requestedURL, req.resourceType());
      if (requestedURL.indexOf(downloaderURL) != -1 || requestedURL.endsWith(downloaderExt)) {
        console.log("THE URL:", requestedURL);
        if(options.save)
        	fs.writeFileSync(options.save,requestedURL);
        browser.close();
        return;
      }
      req.continue();
    } else {
      console.error("[II] ABORT!", req.url(), req.resourceType());
      req.abort();
    }
  });


  await page.goto(requested_url);
  try{
  await page.click('#btnDl');
  } catch(exc){
  	found = (await page.content()).match(/Download this file/gi);
  	if(!found){
		if(options.save)
	  		fs.writeFileSync(options.save,"Error was found, it probably does not exists");
	  	await browser.close();
	}
  }
  await page.waitFor(6000);
  await page.click('#downloadTimer > a.main-button.dlbutton');
  await page.waitFor(6000);
  await page.click('#realdl');

})();