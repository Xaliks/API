const { readdirSync } = require("fs");

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = (app, express) => {
  app.get("/", (req, resp) => {
    resp.send(require("../start.json"));
  });
  app.get("/:category", (req, resp) => {
    let r = false;
    readdirSync(`./pages/`).forEach((file) => {
      if (file === req.params.category) r = true;
    });
    if (r) {
      require(`./${req.params.category}`)(app, check, getEndpoints, random);
      return resp.send({
        Author: "Xaliks#5991",
        endpoints: getEndpoints(req.params.category),
      });
    } else return resp.send(require("../start.json"));
  });

  readdirSync(`./pages/`).forEach((dir) => {
    require(`./${dir}`)(app, check, getEndpoints, random);
  });

  app.listen(1001, (error) => {
    if (error) return console.log(`Ошибка: ${error}`);

    console.log("Запущен!");
  });

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
};

function check(category, param) {
  let r = false;
  readdirSync(`./pages/${category}`).forEach((file) => {
    if (file.startsWith(param)) r = true;
  });
  return r;
}
function getEndpoints(category) {
  let endpoints = [];
  readdirSync(`./pages/${category}`)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => endpoints.push(`/${file.slice(0, -3)}`));

  return endpoints;
}
