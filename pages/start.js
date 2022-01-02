const { readdirSync } = require("fs");
const apis = [
  "https://nekos.life/",
  "https://thatcopy.pw/",
  "https://cataas.com/",
  "https://api.thecatapi.com/",
  "https://aws.random.cat/",
  "https://some-random-api.ml/",
  "https://shibe.online/",
  "https://dog.ceo/",
  "https://random.dog/",
  "https://fungenerators.com/random/joke",
  "https://anekdotov.me/random/",
  "https://random-word-api.herokuapp.com/word",
  "https://calculator888.ru/random-generator/sluchaynoye-slovo",
  "https://api.mcsrvstat.us/",
  "https://mcapi.xdefcon.com/",
  "https://visage.surgeplay.com/",
  "https://genius.com/",
];

module.exports = () => {
  const endpoints = {};
  readdirSync("pages")
    .filter((c) => !c.endsWith(".js"))
    .forEach((cat) => {
      endpoints[cat] = [];
      readdirSync(`pages/${cat}`).forEach((endpont) => {
        endpoints[cat].push("/" + endpont.slice(0, -3));
      });
    });

  return {
    endpoints,
    author: {
      vk: "https://vk.com/xaliksss",
      discord: "Xaliks#5501",
      github: "https://github.com/Xaliks",
    },
    apis,
  };
};
