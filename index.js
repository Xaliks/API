const express = require("express");
const { readdirSync } = require("fs");
const app = express();

global.utils = {};

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.get("/", (req, resp) => {
	resp.send(require("./start.json"));
});

readdirSync("pages").forEach((page) => {
	readdirSync(`pages/${page}`).forEach((file) => {
		require(`./pages/${page}/${file}`)(app);
	});
});
readdirSync("utils").forEach((file) => {
	global.utils[file.slice(0, -3)] = require(`./utils/${file}`);
});

app.listen(1001, (error) => {
	if (error) return console.error(error);

	console.log("API Запущен!");
});
