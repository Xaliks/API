const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = (app) => {
  const examples = ["/render/changemymind?text=CMM"];
  const usage = "/render/changemymind?text=String(1-150)";

  app.get("/render/changemymind", async (req, resp) => {
    const text = req.query.text;

    if (!text) return utils.error(resp, "Пропущен параметр 'text'", usage, examples);
    if (text.length > 150) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 200 символов!", usage, examples);

    const bg = await loadImage(path.join(__dirname, "../..", "./assets/images/changemymind.png"));
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    registerFont(path.join(__dirname, "../..", "./assets/fonts/Arial.ttf"), { family: "Arial" });
    ctx.font = "32px Arial";

    ctx.rotate(-0.398);

    ctx.fillStyle = "#000000";
    utils.wrapText(ctx, text, 255, 740, 405);

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
