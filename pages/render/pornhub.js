const { createCanvas, registerFont } = require("canvas");
const path = require("path");

module.exports = (app) => {
  const examples = [
    "/render/pornhub?left=Git&right=Hub",
  ];
  const usage = "/render/pornhub?left=String(1-75)&right=String(1-75)";

  app.get("/render/pornhub", async (req, resp) => {
    const left = req.query.left;
    const right = req.query.right;

    if (!left) return utils.error(resp, "Пропущен параметр 'left'", usage, examples);
    if (!right) return utils.error(resp, "Пропущен параметр 'right'", usage, examples);
    if (left.length > 75) return utils.error(resp, "Параметр 'left' не может содержать в себе больше 75 символов!", usage, examples);
    if (right.length > 75) return utils.error(resp, "Параметр 'right' не может содержать в себе больше 75 символов!", usage, examples);

    const tmp = createCanvas(0, 0).getContext("2d");
    registerFont(path.join(__dirname, "../..", "./assets/fonts/Roboto Bold.ttf"), { family: "Roboto Bold" });
    tmp.font = "120px Roboto Bold";

    const canvas = createCanvas(tmp.measureText(right + left).width + 60, tmp.measureText(left + right).emHeightAscent + 80);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "120px Roboto Bold";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(left, 10, canvas.height / 1.355)

    const w = ctx.measureText(right).width + 20;
    const h = canvas.height - 35;
    const x = ctx.measureText(left).width + 27;
    const y = canvas.height - 175;
    const rad = 38

    ctx.fillStyle = "#f7971e";
    ctx.beginPath();
    ctx.arc(x+rad, y+rad, rad, Math.PI, Math.PI+Math.PI/2 , false);
    ctx.lineTo(x+w - rad, y);
    ctx.arc(x + w - rad, y+rad, rad, Math.PI+Math.PI/2, Math.PI*2 , false);
    ctx.lineTo(x+w,y+h - rad);
    ctx.arc(x+w-rad,y+h-rad,rad,Math.PI*2,Math.PI/2,false);
    ctx.lineTo(x+rad,y+h);
    ctx.arc(x+rad,y+h-rad,rad,Math.PI/2,Math.PI,false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.fillText(right, ctx.measureText(left).width + 34, canvas.height / 1.355)

    resp.setHeader("Content-Type", "image/png");
    return canvas.pngStream().pipe(resp);
  });
};
