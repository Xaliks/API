const cheerio = require("cheerio");
const fetch = require("node-fetch");

module.exports = (app) => {
  const examples = ["/info/lyrics?query=Rickroll"];
  const usage = "/info/lyrics?query=String";

  app.get("/info/lyrics", async (req, resp) => {
    const query = req.query.query;
    if (!query) return utils.error(resp, "Пропущен параметр 'query'", usage, examples);

    const song = await getSong(query);
    if (!song || song.type != "song") return utils.error(resp, "Песня не найдена!", usage, examples);

    let lyrics;
    if (song.result.path) {
      const lyricsData = await fetch("https://genius.com" + song.result.path).then((resp) => resp.text());

      lyrics = getLyrics(lyricsData);
    }
    if (!lyrics) {
      const data = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(query)}`).then((resp) => resp.json());
      if (!data || data.error) return;

      lyrics = data.lyrics;
    }

    return resp.send({
      title: song.result.title,
      full_title: song.result.full_title,
      header_image_url: song.result.header_image_url,
      url: song.result.url,
      artist: {
        name: song.result.primary_artist.name,
        header_image_url: song.result.primary_artist.header_image_url,
        url: song.result.primary_artist.url,
      },
      lyrics: lyrics ? lyrics : null,
    });
  });
};

async function getSong(query) {
  const config = require("../../config.json");
  const data = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
    "Content-Type": "application/json",
    headers: {
      Authorization: `Bearer ${config.GENIUS_CLIENT_ACCESS_TOKEN}`,
    },
  }).then((resp) => resp.json());

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
        .filter((m) => m.attribs && m.attribs.itemprop)[0].attribs.content,
    )
      .lyrics_data.body.html.replace(/<\/?.*?>/gimsu, "")
      .trim();
  }
  return lyrics;
}
