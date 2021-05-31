const cheerio = require("cheerio");

module.exports = {
  name: "wyr",
  async run(fetch) {
    const data = await fetch("http://either.io").then((resp) => resp.text());
    const $ = cheerio.load(data);

    const wyr = $('div[class="option"] a').text().split(" \n");
    const votes = $('span[class="contents"]').text().split(" votes")[0];
    const tag = $('ul[class="tags"] li a').text();
    const author = $('span[id="question-author"] a').text()

    return {
      questions: [wyr[1], wyr[2]],
      votes,
      tag,
      author
    };
  },
};
