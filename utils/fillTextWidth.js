module.exports = (ctx, text, x, y, width) => {
	let temp = [];
	let first = true;

	text
		.split("")
		.map((t) => {
			let result = "";
			temp.push(t);

			if (ctx.measureText(temp.join("")).width > width) {
				temp = [];
				result += "\n" + t.trim();
			} else result += t;

			return result;
		})
		.join("")
		.split("\n")
		.forEach((str) => {
			if (!first) y += Number(ctx.measureText(str).emHeightAscent);

			first = false;
			ctx.fillText(str, x, y);
		});

	return true;
};
