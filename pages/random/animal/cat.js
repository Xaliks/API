const links = [
    "https://aws.random.cat/meow",
    "https://thatcopy.pw/catapi/rest/",
    "https://nekos.life/api/v2/img/meow",
    "https://api.thecatapi.com/v1/images/search",
    "https://cataas.com/cat?json=true",
    "http://shibe.online/api/cats",
    
    "https://mimimi.ru/random"
]

module.exports = async () => {
    const rand = random(0, links.length - 1)
    let image;
    let data;

    if (rand === 6)  data = await fetch(links[rand]).then(resp => resp.text())
    else             data = await fetch(links[rand]).then(resp => resp.json())

    if (rand === 0) image = data.file
    if (rand === 1 || rand === 2) image = data.url
    if (rand === 3) image = data[0].url
    if (rand === 4) image = "https://cataas.com" + data.url
    if (rand === 5) image = data[0]
    if (rand === 6) image = cheerio.load(data)('a[href="/random"] img').attr('src')

    return image
}
