const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = (app) => {
	const examples = ["/render/captcha?text=Captcha"];
	const usage = "/render/captcha?text=String(1-350)";

	app.get("/render/captcha", async (req, resp) => {
		const text = req.query.text;

		if (!text) return utils.error(resp, "Пропущен параметр 'text'", usage, examples);
		if (text.length > 350) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 350 символов!", usage, examples);

		const tmp = createCanvas(0, 189).getContext("2d");
		registerFont(path.join(__dirname, "../..", "./assets/fonts/Roboto.ttf"), {
			family: "Roboto",
		});
		tmp.font = "32px Roboto";

		const x = tmp.measureText(text).width + 370;
		const canvas = createCanvas(x, 189);
		const ctx = canvas.getContext("2d");

		const front = await loadImage(path.join(__dirname, "../..", "./assets/images/captcha/start.png"));
		ctx.drawImage(front, 0, 0);

		const end = await loadImage(path.join(__dirname, "../..", "./assets/images/captcha/end.png"));
		ctx.drawImage(end, x - 201, 0);

		const mid = await loadImage(path.join(__dirname, "../..", "./assets/images/captcha/mid.png"));

		// BG
		let i = 122;
		while (i <= x - 201) {
			ctx.drawImage(mid, i, 0);
			++i;
		}

		ctx.font = "32px Roboto";
		ctx.fillStyle = "#000000";
		ctx.fillText(text, 125, 105);

		resp.setHeader("Content-Type", "image/png");
		return canvas.pngStream().pipe(resp);
	});
};
