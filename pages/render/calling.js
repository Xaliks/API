const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = (app) => {
  const examples = ["/render/calling?text=Hello?"];
  const usage = "/render/calling?text=String(1-250)";

  app.get("/render/calling", async (req, resp) => {
    const text = req.query.text;

    if (!text) return utils.error(resp, "Пропущен параметр 'text'", usage, examples);
    if (text.length > 200) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 200 символов!", usage, examples);

    const canvas = createCanvas(667, 480);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage(path.join(__dirname, "../..", "./assets/images/calling.jpg"));
    ctx.drawImage(bg, 0, 0);

    registerFont(path.join(__dirname, "../..", "./assets/fonts/Verdana Edited.ttf"), { family: "Verdana" });

    ctx.fillStyle = "#000000";
    ctx.font = "27px Verdana";
    utils.fillTextWidth(ctx, text, 5, 30, 655);

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
