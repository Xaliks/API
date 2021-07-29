const cheerio = require("cheerio");
const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");

module.exports = {
  examples: ["/lyric?query=SONG"],
  async run(queries) {
    const { query } = queries;
    if (!query) return { error: "Missing query queries" };

    const song = await getSong(query);
    if (!song || song.type != "song") return { error: "Song not found" };

    let lyrics;
    if (song.result.path) {
      const lyricsData = await fetch("https://genius.com" + song.result.path, {
        agent: new HttpsProxyAgent("http://51.159.154.37:3128"),
      }).then((resp) => resp.text());

      lyrics = getLyrics(lyricsData);
    }

    return {
      title: song.result.title,
      full_title: song.result.full_title,
      header_image_url: song.result.header_image_url,
      url: song.result.url,
      author: {
        name: song.result.name,
        header_image_url: song.result.header_image_url,
        url: song.result.url,
      },
      lyrics: lyrics ? lyrics : null,
    };
  },
};

async function getSong(query) {
  const config = require("../../config.json");
  const data = await fetch(
    `https://api.genius.com/search?q=${encodeURIComponent(query)}`,
    {
      "Content-Type": "application/json",
      headers: {
        Authorization: `Bearer ${config.GENIUS_CLIENT_ACCESS_TOKEN}`,
      },
    }
  ).then((resp) => resp.json());

  if (!data.response.hits[0]) return;

  return data.response.hits[0];
}

function getLyrics(data) {
  const $ = cheerio.load(data);

  let lyrics = $('div[class="lyrics"]').text().trim();
  if (!lyrics) {
    lyrics = "";
    $("div[class*='Lyrics__Container']").each((i, elem) => {
      if ($(elem).text().length !== 0) {
        let snippet = $(elem)
          .html()
          .replace(/<br>/g, "\n")
          .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
        lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
      }
    });
    lyrics = lyrics.trim();
  }
  if (!lyrics) {
    lyrics = JSON.parse(
      $("meta")
        .toArray()
        .filter((m) => m.attribs && m.attribs.itemprop)[0].attribs.content
    )
      .lyrics_data.body.html.replace(/<\/?a|p|i|br.*?>/g, "")
      .trim();
  }
  return lyrics;
}
