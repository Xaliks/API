const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = (app) => {
  const examples = ["/render/drake?top=hahahaha&bottom=HAHAHAHAHAHA"];
  const usage = "/render/drake?top=String(1-100)&bottom=String(1-100)";

  app.get("/render/drake", async (req, resp) => {
    const top = req.query.top;
    const bottom = req.query.bottom;

    if (!top) return utils.error(resp, "Пропущен параметр 'top'", usage, examples);
    if (!bottom) return utils.error(resp, "Пропущен параметр 'bottom'", usage, examples);

    if (top.length > 100) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 100 символов!", usage, examples);
    if (bottom.length > 100) return utils.error(resp, "Параметр 'title' не может содержать в себе больше 100 символов!", usage, examples);

    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage(path.join(__dirname, "../..", "./assets/images/drake.jpg"));
    ctx.drawImage(bg, 0, 0);

    registerFont(path.join(__dirname, "../..", "./assets/fonts/Verdana Edited.ttf"), { family: "Verdana" });

    ctx.fillStyle = "#000000";
    ctx.font = "23px Verdana";

    utils.fillTextWidth(ctx, top, 245, 27, 244);
    utils.fillTextWidth(ctx, bottom, 245, 285, 244);

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
