const links = [
    "https://nekos.life/api/v2/img/meow", // 0 .url
    "https://cataas.com/cat?json=true", // 1 domain + .url
    "https://api.thecatapi.com/v1/images/search", // 2 [0].url
    "https://aws.random.cat/meow", // 3 .file
    "https://some-random-api.ml/img/cat" // 4 .link
]

module.exports = {
    name: "cat",
    async run(fetch, random) {
        const rand = random(0, links.length - 1)
        const data = await fetch(links[rand])
            .then(resp => resp.json())
        let image;

        if (rand === 0) image = data.url
        if (rand === 1) image = "https://cataas.com" + data.url
        if (rand === 2) image = data[0].url
        if (rand === 3) image = data.file
        if (rand === 4) image = data.link

        return image
    }
}
