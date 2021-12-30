const { createCanvas, loadImage } = require("canvas");

module.exports = (app) => {
  const examples = ["/render/demotivator?top=LEGO&text=Minecraft&image=https://i.xaliks.xyz/7ZovC.png"];
  const usage = "/render/demotivator?top=String(1-100)&text=String(1-100)&image=String";

  app.get("/render/demotivator", async (req, resp) => {
    const text = req.query.text || "";
    const top = req.query.top || "";
    const image = req.query.image;

    if (!top && !text) return utils.error(resp, "Пропущен параметр 'top' или 'text'", usage, examples);
    if (!image) return utils.error(resp, "Пропущен параметр 'image'", usage, examples);

    if (text.length > 200) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 200 символов!", usage, examples);
    if (top.length > 100) return utils.error(resp, "Параметр 'top' не может содержать в себе больше 150 символов!", usage, examples);

    // y
    const tmp = createCanvas(900, 650);
    const tmpctx = tmp.getContext("2d");
    tmpctx.font = "65px Times New Roman";
    let y = utils.fillTextWidth(tmpctx, top, 0, 0, 860) + tmpctx.measureText(top).emHeightAscent + 50;
    tmpctx.font = "30px Times New Roman";
    y += utils.fillTextWidth(tmpctx, text, 0, 0, 860);

    const canvas = createCanvas(900, 730 + y);
    const ctx = canvas.getContext("2d");

    // BG
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(20, 20, 860, 570);
    ctx.fillStyle = "black";
    ctx.fillRect(22, 22, 856, 566);

    // IMG
    try {
      const img = await loadImage(image);
      ctx.drawImage(img, 23, 23, 854, 564);
    } catch (e) {
      return utils.error(resp, "Параметр 'image' должен быть прямой ссылкой на картинку!", usage, examples);
    }

    // Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "65px Times New Roman";
    utils.fillTextWidth(ctx, top, canvas.width / 2, 675, 860);

    ctx.font = "32px Times New Roman";
    utils.fillTextWidth(ctx, text, canvas.width / 2, y + 660, 860);

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
