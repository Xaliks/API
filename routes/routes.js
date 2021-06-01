const { readdirSync } = require("fs");

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
      require(`./${req.params.category}`)(app, check);
      return resp.send({
        endpoints: getEndpoints(req.params.category),
      });
    } else return resp.send(require("../start.json"));
  });

  readdirSync(`./pages/`).forEach((dir) => {
    require(`./${dir}`)(app, check);
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
