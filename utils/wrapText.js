module.exports = (ctx, text, x, y, width = 0, options = { draw: true }) => {
  if (width <= 0) return ctx.fillText(text, x, y);

  const result = [];
  const heigth = Number(ctx.measureText(text).emHeightAscent) + 1.5;
  let args = text.split(/ /g);
  let currentLine = 0;
  let i = 0;

  while (i <= args.length) {
    if (ctx.measureText(args.slice(0, i).join(" ")).width > width) {
      if (i === 1) ++i;

      let text = args.slice(0, i - 1).join(" ").trim();

      if (ctx.measureText(text).width > width) {
        let idx = 0;

        while (idx < text.length) {
          if (ctx.measureText(text.slice(0, idx)).width > width) {
            if (idx === 1) ++idx;

            args.splice(i - 1, 0, text.slice(idx));
            text = text.slice(0, idx);
          } else ++idx;
        }
      }

      result.push({ text, y: y + heigth * currentLine });

      ++currentLine;
      args = args.splice(i - 1);
      i = 1;
    } else ++i;
  }

  if (i > 0) result.push({ text: args.join(" "), y: y + heigth * currentLine });

  if (options.draw === true) result.forEach((str) => {
    ctx.fillText(str.text, x, str.y);
  })

  return result;
};
