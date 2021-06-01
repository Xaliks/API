const cheerio = require("cheerio");
const fetch = require("node-fetch");

module.exports = {
  name: "wyr",
  async run() {
    const data = await fetch("http://either.io").then((resp) => resp.text());
    const $ = cheerio.load(data);

    const title = $('h2[id="question-title"]').text();
    const wyr = $('div[class="option"] a').text().split(" \n");
    const votes = [
      $(
        'div[class="result result-1"] div[class="total-votes"] span[class="count"]'
      ).html(),
      $(
        'div[class="result result-2"] div[class="total-votes"] span[class="count"]'
      ).html(),
    ];
    const total_votes = $('span[class="contents"]').text().split(" votes")[0];
    const description = $('p[class="more-info"]').text() || null;
    const author = $('span[id="question-author"] a').text();
    const tag = $('ul[class="tags"] li a').text();

    return {
      title,
      questions: [wyr[1], wyr[2]],
      votes,
      total_votes,
      description,
      author,
      tag,
    };
  },
};
