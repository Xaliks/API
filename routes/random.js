module.exports = (app, check) => {
  app.get("/random/:query", async (req, resp) => {
    if (!check("random", req.params.query))
      return resp.send({
        error: "Not Found!",
      });

    const data = await require(`../pages/random/${req.params.query}`).run(
      random
    );

    resp.send(data);
  });
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
