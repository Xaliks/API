const links = [
    "https://nekos.life/api/v2/img/meow", // 0 .url
    "https://thatcopy.pw/catapi/rest/", // 1 .url
    "https://cataas.com/cat?json=true", // 1 domain + .url
    "https://api.thecatapi.com/v1/images/search", // 2 [0].url
    "https://aws.random.cat/meow", // 3 .file
    "https://some-random-api.ml/img/cat", // 4 .link
    "https://shibe.online/api/cats" // 5 [0]
]

module.exports = {
    name: "cat",
    async run(fetch, random) {
        const rand = random(0, links.length - 1)
        const data = await fetch(links[rand])
            .then(resp => resp.json())
        let image;

        if (rand === 0 || rand === 1) image = data.url
        if (rand === 2) image = "https://cataas.com" + data.url
        if (rand === 3) image = data[0].url
        if (rand === 4) image = data.file
        if (rand === 5) image = data.link
        if (rand === 6) image = data[0]

        return image
    }
}
