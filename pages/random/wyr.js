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
      Number(
        $(
          'div[class="result result-1"] div[class="total-votes"] span[class="count"]'
        )
          .html()
          .replace(/,+/g, "")
      ),
      Number(
        $(
          'div[class="result result-2"] div[class="total-votes"] span[class="count"]'
        )
          .html()
          .replace(/,+/g, "")
      ),
    ];
    const total_votes = Number(
      $('span[class="contents"]').text().split(" votes")[0].replace(/,+/g, "")
    );
    const percentage = [
      ((votes[0] / total_votes) * 100).toFixed(2),
      ((votes[1] / total_votes) * 100).toFixed(2),
    ];
    const description = $('p[class="more-info"]').text() || null;
    const author = $('span[id="question-author"] a').text();
    const tag = $('ul[class="tags"] li a').text();

    return {
      title,
      questions: [
        {
          question: wyr[1],
          votes: votes[0],
          percentage: percentage[0],
        },
        {
          question: wyr[2],
          votes: votes[1],
          percentage: percentage[1],
        },
      ],
      total_votes,
      description,
      author,
      tag,
    };
  },
};
