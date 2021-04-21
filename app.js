const express = require('express');
const app = express();

global.random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
global.fetch = require('node-fetch')
global.cheerio = require('cheerio')


app.get('/', (req, resp) => {
    resp.send(require('./start.json'));
});

app.get('/random/animal/:animal', async (req, resp) => {
    try {
        resp.send({ "success": true, "image": await require(`./pages/random/animal/${req.params.animal}`)() });
    } catch (e) {
        resp.send({ "success": false, "error": "Не найдено!" })
    }
});

app.listen(3000, (error) => {
    if (error) return console.log(`Ошибка: ${error}`);
 
    console.log(`Запущен! Порт: 3000`);
});


app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
