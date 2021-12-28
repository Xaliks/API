module.exports = (resp, text, usage, examples) => {
  return resp.send({
    error: text,
    usage,
    examples,
  });
};
