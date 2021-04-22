module.exports = (app, check, getEndpoints, random) => {
    app.get('/animal/:query', async (req, resp) => {
        if (!check('animal', req.params.query)) return resp.send({ 
            "success": false,
            "error": "Not Found!"
        });
    
        const image = await require(`../pages/animal/${req.params.query}`).run(require('node-fetch'), random)
        resp.send({ 
            "success": true,
            "image": image
        });
    });
}