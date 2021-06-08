module.exports = (app, check) => {
  app.get("/info/:name", async (req, resp) => {
    if (!check("info", req.params.name))
      return resp.send({
        error: "Not Found!",
      });

    const errors = [];

    if (!req.query.type) {
      errors.push("Missing type queries");
    }
    if (!req.query.query) {
      errors.push("Missing query queries");
    }
    if (errors[0]) {
      return resp.send({
        errors,
        "Example:": "/spotify?type=track&query=Амома",
      });
    }

    const types = require(`../pages/info/${req.params.name}`).types;
    if (!types.includes(req.query.type))
      return resp.send({
        error: `Invalid type! Available types: < ${types.join(" / ")} >`,
      });

    const data = await require(`../pages/info/${req.params.name}`).run(
      req.query
    );
    if (data.error) return resp.send(data);

    resp.send(data);
  });
};
