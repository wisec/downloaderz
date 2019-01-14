(async function () {
  var requested_url = options.url;


  await page.goto(requested_url);
  try {

    var elem = await page.waitFor('#vplayer > div > div.container > video');
                                   
    var url = await elem.getProperty('src');
    url = await url.jsonValue();
    console.log("THE URL:", url);
    if (options.save)
      fs.writeFileSync(options.save, url);

  } catch (exc) {
    found = (await page.content()).match(/File Not Found/gi);
    console.log(exc, found);
    if (!found) {
      if (options.save)
        fs.writeFileSync(options.save, "Error was found, it probably does not exists");
    }
  }
  await browser.close();
  return;
})();
