(async function () {
  var requested_url = options.url;

  // var urlparse = require("url").parse;

  // const downloaderURL = "oloadcdn.net/dl";
  // const downloaderExt = ".mp4";
  // var arhosts = ['openload.co',
  //     'oloadcdn.net'];
  // await page.setRequestInterception(true);
  // page.on("request", function(req) {
  //   var requestedURL = req.url();
  //   var host = urlparse(requestedURL).host;

  //   if (arhosts.some((host_el) => {
  //       return host.endsWith(host_el)
  //     })) {
  //     console.error("[II] CONTINUE", requestedURL, req.resourceType());
  //     if (requestedURL.indexOf(downloaderURL) != -1 || requestedURL.endsWith(downloaderExt)) {
  //       console.log("THE URL:", requestedURL);
  //       if(options.save)
  //       	fs.writeFileSync(options.save,requestedURL);
  //       browser.close();
  //       return;
  //     }
  //     req.continue();
  //   } else {
  //     console.error("[II] ABORT!", req.url(), req.resourceType());
  //     req.abort();
  //   }
  // });

  await page.goto(requested_url);
  try {

    await page.evaluate(() => {
      document.querySelector('#btn-download').click();
    });

    var elem = await page.waitFor('#main > div > div > div.file-tools > div > ul > li > a');
                                   
    var url = await elem.getProperty('href');
    url = await url.jsonValue();
    console.log("THE URL:", url);
    if (options.save)
      fs.writeFileSync(options.save, url);

  } catch (exc) {
    found = (await page.content()).match(/404. PAGE NOT FOUND/gi);
    console.log(exc, found);
    if (!found) {
      if (options.save)
        fs.writeFileSync(options.save, "Error was found, it probably does not exists");
    }
  }
  await browser.close();
  return;
})();
