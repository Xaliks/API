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
  resp.send(require("./pages/start")());
});

readdirSync("pages")
  .filter((page) => !page.endsWith(".js"))
  .forEach((page) => {
    readdirSync(`pages/${page}`).forEach((file) => {
      require(`./pages/${page}/${file}`)(app);
    });
  });
readdirSync("utils").forEach((file) => {
  global.utils[file.slice(0, -3)] = require(`./utils/${file}`);
});

app.use((req, resp) => resp.status(404).send({ status: 404, error: "Not Found" }));

app.listen(1001, (error) => {
  if (error) return console.error(error);

  console.log("API Запущен!");
});
