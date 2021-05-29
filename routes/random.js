module.exports = (app, check, getEndpoints, random) => {
  app.get("/random/:query", async (req, resp) => {
    if (!check("random", req.params.query))
      return resp.send({
        success: false,
        error: "Not Found!",
      });

    const data = await require(`../pages/random/${req.params.query}`).run(
      require("node-fetch"),
      random
    );
    resp.send({
      success: true,
      data,
    });
  });
};
