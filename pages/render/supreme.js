const { createCanvas, registerFont } = require("canvas");
const path = require("path");

module.exports = (app) => {
  const examples = ["/render/supreme?text=Supreme"];
  const usage = "/render/supreme?text=String(1-300)";

  app.get("/render/supreme", async (req, resp) => {
    const text = req.query.text;

    if (!text) return utils.error(resp, "Пропущен параметр 'text'", usage, examples);
    if (text.length > 300) return utils.error(resp, "Параметр 'text' не может содержать в себе больше 300 символов!", usage, examples);

    const tmp = createCanvas(0, 0).getContext("2d");
    registerFont(path.join(__dirname, "../..", "./assets/fonts/Futura Heavy.ttf"), { family: "Futura Heavy" });
    tmp.font = "100px Futura Heavy";

    const canvas = createCanvas(tmp.measureText(text).width + 200, tmp.measureText(text).emHeightAscent + 50);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "100px Futura Heavy";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(text, 87, 98);

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
