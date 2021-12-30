const { createCanvas, loadImage } = require("canvas");

module.exports = (app) => {
	const examples = ["/render/demotivator?title=LEGO&text=Minecraft&image=https://i.xaliks.xyz/7ZovC.png"];
	const usage = "/render/demotivator?title=String(1-100)&text=String(1-100)&image=String";

	app.get("/render/demotivator", async (req, resp) => {
		const text = req.query.text || "";
		const title = req.query.title || "";
		const image = req.query.image;

		if (!title && !text) return utils.error(resp, "Пропущен параметр 'title' или 'text'", usage, examples);
		if (!image) return utils.error(resp, "Пропущен параметр 'image'", usage, examples);

		if (text.length > 100) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 100 символов!", usage, examples);
		if (title.length > 100) return utils.error(resp, "Параметр 'title' не может содержать в себе больше 100 символов!", usage, examples);

		const canvas = createCanvas(800, 700);
		const ctx = canvas.getContext("2d");

		const bg = await loadImage("./assets/images/demotivator.png");
		ctx.drawImage(bg, 0, 0);

		try {
			const img = await loadImage(image);
			ctx.drawImage(img, 45, 45, 705, 475);
		} catch (e) {
			return utils.error(resp, "Параметр 'image' должен быть прямой ссылкой на картинку!", usage, examples);
		}

		ctx.textAlign = "center";
		ctx.fillStyle = "#FFFFFF";

		ctx.font = "50px Times New Roman";
		ctx.fillText(title, 375, 590);

		ctx.font = "normal 35px Times New Roman";
		ctx.fillText(text, 375, 660);

		resp.setHeader("Content-Type", "image/png");
		return canvas.pngStream().pipe(resp);
	});
};
