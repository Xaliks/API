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

  app.get("/info/:name/:par", (req, resp) => {
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

  app.get("/info/:name/:par/:other", async (req, resp) => {
    if (!check("info", req.params.name))
      return resp.send({
        error: "Not Found!",
      });

    const data = await require(`../pages/info/${req.params.name}`).run(
      req.params.par,
      req.params.other
    );

    if (data.error) return resp.send(data);

    resp.send(data);
  });
};
