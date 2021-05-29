const cheerio = require("cheerio");

module.exports = {
  name: "wyr",
  async run(fetch) {
    const data = await fetch("http://either.io").then((resp) => resp.text());
    const $ = cheerio.load(data);

    const wyr = String($('div[class="option"] a').text()).split("\n");
    return [wyr[1].trim(), wyr[2].trim()];
  },
};
