const cheerio = require("cheerio");
const fetch = require("node-fetch");

module.exports = (app) => {
  app.get("/random/wyr", async (req, resp) => {
    const data = await fetch("http://either.io").then((resp) => resp.text());
    const $ = cheerio.load(data);

    const title = $("#question-title").text();
    const wyr = $(".option a").text().split(" \n");
    const votes = [Number($(".result-1 .count").html().replace(/,+/g, "")), Number($(".result-2 .count").html().replace(/,+/g, ""))];
    const total_votes = votes[0] + votes[1];
    const percentage = [((votes[0] / total_votes) * 100).toFixed(2), ((votes[1] / total_votes) * 100).toFixed(2)];
    const description = $(".more-info").text() || null;
    const author = $("#question-author a").text();
    const tag = $(".tags li a").text();

    return resp.send({
      title,
      description,
      author,
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
      tag,
    });
  });
};
