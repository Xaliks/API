const fetch = require("node-fetch");

const links = [
  "https://dog.ceo/api/breeds/image/random", // 0 .message
  "https://some-random-api.ml/img/dog", // 1 .link
  "http://shibe.online/api/shibes", // 2 [0]
  "https://random.dog/woof.json", // 3 .url
];

module.exports = {
  name: "dog",
  async run(random) {
    const rand = random(0, links.length - 1);
    const data = await fetch(links[rand]).then((resp) => resp.json());
    let image;

    if (rand === 0) image = data.message;
    if (rand === 1) image = data.link;
    if (rand === 2) image = data[0];
    if (rand === 3) image = data.url;

    return {
      image,
    };
  },
};
