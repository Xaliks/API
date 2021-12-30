const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = (app) => {
	app.get("/random/word", async (req, resp) => {
		const word_en = await fetch("https://random-word-api.herokuapp.com/word?number=1")
			.then((resp) => resp.json())
			.then((word) => word[0][0].toUpperCase() + word[0].slice(1));
		const word_ru = await fetch("https://calculator888.ru/random-generator/sluchaynoye-slovo")
			.then((resp) => resp.text())
			.then((resp) => cheerio.load(resp)("div[class=blok_otvet]").text());

		return resp.send({
			en: word_en,
			ru: word_ru,
		});
	});
};
