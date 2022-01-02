const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const path = require("path");
const frames = require("fs").readdirSync("./assets/images/petpet");

module.exports = (app) => {
  const examples = ["/render/petpet?image=https://i.xaliks.xyz/Ce9un.png&delay=25"];
  const usage = "/render/petpet?image=String[&delay=Number(1-500)]";

  app.get("/render/petpet", async (req, resp) => {
    const delay = Math.abs(parseInt(Number(req.query.delay || 25)));
    const image = req.query.image;

    if (!image) return utils.error(resp, "Пропущен параметр 'image'", usage, examples);
    if (isNaN(delay) || delay > 500) return utils.error(resp, "Параметр 'delay' должен быть числом не больше 500", usage, examples);

    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext("2d");

    const encoder = new GIFEncoder(canvas.width, canvas.height);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(delay + 25);
    encoder.setTransparent();

    // IMG
    let img;
    try {
      img = await loadImage(image);
      ctx.drawImage(img, 23, 23, 854, 564);
    } catch (e) {
      return utils.error(resp, "Параметр 'image' должен быть прямой ссылкой на картинку!", usage, examples);
    }

    for (let i = 0; i < frames.length; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const j = i < frames.length / 2 ? i : frames.length - i;

      const width = 0.8 + j * 0.02;
      const height = 0.8 - j * 0.05;
      const offsetX = (1 - width) * 0.5 + 0.1;
      const offsetY = 1 - height - 0.08;

      ctx.drawImage(img, canvas.width * offsetX, canvas.height * offsetY, canvas.width * width, canvas.height * height);
      ctx.drawImage(
        await loadImage(path.join(__dirname, "../..", `./assets/images/petpet/${frames[i]}`)),
        0,
        -3,
        canvas.width,
        canvas.height,
      );

      encoder.addFrame(ctx);
    }
    encoder.finish();

    resp.setHeader("Content-Type", "image/png");
    return resp.send(encoder.out.getData());
  });
};
