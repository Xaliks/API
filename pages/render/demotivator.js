const { createCanvas, loadImage } = require("canvas");

module.exports = (app) => {
  const examples = ["/render/demotivator?top=LEGO&text=Minecraft&image=https://i.xaliks.xyz/7ZovC.png"];
  const usage = "/render/demotivator?top=String(1-100)&text=String(1-100)&image=String";

  app.get("/render/demotivator", async (req, resp) => {
    const text = req.query.text;
    const top = req.query.top;
    const image = req.query.image;

    if (!top) return utils.error(resp, "Пропущен параметр 'top'", usage, examples);
    if (!image) return utils.error(resp, "Пропущен параметр 'image'", usage, examples);

    if (text && text.length > 200)
      return utils.error(resp, "Параметр 'text' не может содержать в себе больше 200 символов!", usage, examples);
    if (top.length > 100) return utils.error(resp, "Параметр 'top' не может содержать в себе больше 150 символов!", usage, examples);

    const canvas = createCanvas(1050, 0);
    const ctx = canvas.getContext("2d");

    let y;
    let textLimit;
    let imageHeight;

    // IMG
    try {
      const img = await loadImage(image);

      if (img.width > 2000) canvas.width = 2000;
      else if (img.width > canvas.width) canvas.width = img.width;
      textLimit = canvas.width - 50;

      ctx.font = "65px Times New Roman";
      y = utils.fillTextWidth(ctx, top, 0, 0, textLimit) + ctx.measureText(top).emHeightAscent;
      if (text) {
        ctx.font = "36px Times New Roman";
        y += utils.fillTextWidth(ctx, text, 0, 0, textLimit) + ctx.measureText(top).emHeightAscent;
      }

      canvas.height = 550 + y;
      if (img.height > 1000) canvas.height += 1000;
      else if (img.height > 500) canvas.height += img.height;
      imageHeight = canvas.height - y - 120;

      // BG
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(20, 20, canvas.width - 40, imageHeight + 6);
      ctx.fillStyle = "black";
      ctx.fillRect(22, 22, canvas.width - 44, imageHeight + 2);
      ctx.drawImage(img, 23, 23, canvas.width - 46, imageHeight);
    } catch (e) {
      return utils.error(resp, "Параметр 'image' должен быть прямой ссылкой на картинку!", usage, examples);
    }

    // Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "65px Times New Roman";
    const first = utils.fillTextWidth(ctx, top, canvas.width / 2, imageHeight + 100, textLimit);

    if (text) {
      ctx.font = "36px Times New Roman";
      utils.fillTextWidth(ctx, text, canvas.width / 2, first + 70, textLimit);
    }

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
