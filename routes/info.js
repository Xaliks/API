module.exports = (app, check) => {
  app.get("/info/:name", async (req, resp) => {
    if (!check("info", req.params.name))
      return resp.send({
        error: "Not Found!",
      });

    const examples = require(`../pages/info/${req.params.name}`).examples;
    const types = require(`../pages/info/${req.params.name}`).types;

    if (!types.includes(req.query.type))
      return resp.send({
        error: `Invalid type! Available types: < ${types.join(" / ")} >`,
        examples,
      });

    const data = await require(`../pages/info/${req.params.name}`).run(
      req.query
    );
    if (data.error)
      return resp.send({
        error: data.error,
        examples,
      });

    resp.send(data);
  });
};
