const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = (app) => {
	app.get("/random/joke", async (req, resp) => {
		const data_en = await fetch("https://fungenerators.com/random/joke").then((resp) => resp.text());
		const data_ru = await fetch("https://anekdotov.me/random/").then((resp) => resp.text());

		const $_ru = cheerio.load(data_ru);
		const $_en = cheerio.load(data_en);

		const category_ru = $_ru('span[class="bord"] a').toArray()[0].children[0].data;
		const joke_ru = $_ru('textarea[type="text"]')
			.toArray()[0]
			.children[0].data.replace(/<br \/>+/g, "\n"); // это можно сделать как-то проще, но я не знаю как

		const category_en = $_en('h3[class="text-muted"]').text().split("category ")[1];
		let joke_en = $_en('div[class="text-center"] p').text().replace(" Powered by jokes.one Jokes API.", "");
		if (joke_en === "") joke_en = $_en('div[class="text-left head-room"] p').text().replace(" Powered by jokes.one Jokes API.", "");

		return resp.send({
			en: {
				category: category_en,
				joke: joke_en,
			},
			ru: {
				category: category_ru,
				joke: joke_ru,
			},
		});
	});
};
