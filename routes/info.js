module.exports = (app, check) => {
  app.get("/info/:name", (req, resp) => {
    if (!check("info", req.params.name))
      return resp.send({
        error: "Not Found!",
      });

    const endpoints =
      require(`../pages/info/${req.params.name}`).firstEndpoints;

    resp.send({
      endpoints,
    });
  });

  app.get("/info/:name/:type", (req, resp) => {
    if (!check("info", req.params.name))
      return resp.send({
        error: "Not Found!",
      });

    const endpoints =
      require(`../pages/info/${req.params.name}`).secondEndpoints;

    resp.send({
      endpoints,
    });
  });

  app.get("/info/:name/:type/:other", async (req, resp) => {
    if (!check("info", req.params.name))
      return resp.send({
        error: "Not Found!",
      });

    const data = await require(`../pages/info/${req.params.name}`).run(
      req.params.type,
      req.params.other
    );
    const { types } = await require(`../pages/info/${req.params.name}`);

    if (!types.includes(req.params.type.toString()))
      return resp.send({ error: "Invalid type!" });
    if (data.error) return resp.send(data);

    resp.send(data);
  });
};
