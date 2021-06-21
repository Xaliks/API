const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(800, 700);

module.exports = {
  examples: [
    "/demotivator?title=123&text=456&image=https://site.com/image.png",
  ],
  async run(queries, resp) {
    const { title, text, image } = queries;

    if (!title) return { error: "Missing title queries" };
    if (!text) return { error: "Missing text queries" };
    if (!image) return { error: "Missing image queries" };

    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./assets/demotivator.png");
    ctx.drawImage(bg, 0, 0);

    const img = await loadImage(image);
    ctx.drawImage(img, 45, 45, 705, 475);

    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "50px Times New Roman";
    ctx.fillText(title, 375, 590);

    ctx.font = "normal 35px Times New Roman";
    ctx.fillText(text, 375, 660);

    resp.end(canvas.toBuffer());
  },
};
