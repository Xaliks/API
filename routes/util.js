module.exports = (app, check) => {
  app.get("/util/:name", async (req, resp) => {
    if (!check("util", req.params.name))
      return resp.send({
        error: "Not Found!",
      });
    const examples = require(`../pages/util/${req.params.name}`).examples;

    const data = await require(`../pages/util/${req.params.name}`).run(
      req.query,
      resp
    );
    if (typeof data === "object" && data.error)
      return resp.send({
        error: data.error,
        examples,
      });
  });
};
