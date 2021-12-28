const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = (app) => {
  const examples = ["/render/didyoumean?top=LEGO&bottom=Roblox"];
  const usage = "/render/didyoumean?top=String(1-50)&bottom=String(1-50)";

  app.get("/render/didyoumean", async (req, resp) => {
    const top = req.query.top;
    const bottom = req.query.bottom;

    if (!top)
      return utils.error(resp, "Пропущен параметр 'top'", usage, examples);
    if (!bottom)
      return utils.error(resp, "Пропущен параметр 'bottom'", usage, examples);

    if (top.length > 40)
      return utils.error(
        resp,
        "Параметр 'top' не может содержать в себе больше 40 символов!",
        usage,
        examples
      );
    if (bottom.length > 40)
      return utils.error(
        resp,
        "Параметр 'bottom' не может содержать в себе больше 40 символов!",
        usage,
        examples
      );

    const canvas = createCanvas(1302, 316);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage(
      path.join(__dirname, "../..", "./assets/images/didyoumean.png")
    );
    ctx.drawImage(bg, 0, 0);

    registerFont(path.join(__dirname, "../..", "./assets/fonts/Arial.ttf"), {
      family: "Arial",
    });
    registerFont(path.join(__dirname, "../..", "./assets/fonts/ArialBI.ttf"), {
      family: "ArialBI",
    });

    ctx.fillStyle = "#000000";
    ctx.font = "39px Arial";
    ctx.fillText(top, 40, 77);

    ctx.fillStyle = "#1A0DAB";
    ctx.font = "35px ArialBI";
    ctx.fillText(bottom, 295, 282);

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
