const { createCanvas, loadImage, registerFont } = require("canvas");
const { readdirSync } = require("fs");
const path = require("path");
const icons = readdirSync(path.join(__dirname, "../..", "./assets/images/achievement")).filter((file) => Number(file.slice(0, -4)));

module.exports = (app) => {
  const examples = [
    "/render/achievement?text=Minecraft!",
    `/render/achievement?text=Minecraft!&icon=${random(1, icons.length)}&title=Достижение получено!`,
  ];
  const usage = `/render/achievement?text=String(1-300)[&icon=Number(1-${icons.length})][&title=String(1-100)]`;

  app.get("/render/achievement", async (req, resp) => {
    const text = req.query.text;
    const title = req.query.title || "Achievement Get!";
    const icon = parseInt(Number(req.query.icon || random(1, icons.length)));

    if (!text) return utils.error(resp, "Пропущен параметр 'text'", usage, examples);
    if (text.length > 300) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 300 символов!", usage, examples);
    if (title.length > 100) return utils.error(resp, "Параметр 'title' не может содержать в себе больше 100 символов!", usage, examples);
    if (isNaN(icon) || icon < 1 || icon > icons.length)
      return utils.error(resp, `Параметр 'image' должен быть числом от 1 до ${icons.length}!`, usage, examples);

    const front = await loadImage(path.join(__dirname, "../..", `./assets/images/achievement/${icon}.png`));
    const end = await loadImage(path.join(__dirname, "../..", "./assets/images/achievement/end.png"));

    const canvas = createCanvas(0, 64);
    const ctx = canvas.getContext("2d");
  
    registerFont(path.join(__dirname, "../..", "./assets/fonts/Minecraft.ttf"), { family: "Minecraft" });
    ctx.font = "15px Minecraft";
  
    const textWidth = ctx.measureText(text).width;
    const titleWidth = ctx.measureText(title).width;
    canvas.width = 8 + front.width + end.width + (titleWidth > textWidth ? titleWidth : textWidth);

    ctx.drawImage(front, 0, 0);
    ctx.drawImage(end, canvas.width - end.width, 0);

    ctx.fillStyle = "#000000";
    ctx.fillRect(front.width, 0, canvas.width - end.width - front.width, 64);

    ctx.fillStyle = "#555555";
    ctx.fillRect(front.width, 2, canvas.width - end.width - front.width, 60);

    ctx.fillStyle = "#212121";
    ctx.fillRect(front.width, 6, canvas.width - end.width - front.width, 52);

    ctx.font = "15px Minecraft";

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(text, 60, 48);

    ctx.fillStyle = "#FFFF00";
    ctx.fillText(title, 60, 29);

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
