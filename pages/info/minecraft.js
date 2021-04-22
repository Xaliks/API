module.exports = {
    name: "minecraft",
    firstEndpoints: ["/player/:nickname", "/server/:server_ip"],
    secondEndpoints: ["PLAYER: /:nickname", "SERVER: /:server_ip"],
    async run(fetch, par, other) {
        if (par === 'player') {
            const username = encodeURIComponent(other)
            const data = await fetch(`https://some-random-api.ml/mc?username=${username}`).then(resp => resp.json())
            if (data.error) return {
                "error": "Player Not Found!"
            }
            const uuid = data.uuid
    
            return {
                "username": data.username,
                "uuid": uuid,
                "name_history": data.name_history,
                "skins": {
                    "face": skins("face", uuid),
                    "front": skins("front", uuid),
                    "front_full": skins("frontfull", uuid),
                    "head": skins("head", uuid),
                    "bust": skins("bust", uuid),
                    "full": skins("full", uuid),
                    "skin": skins("skin", uuid)
                }
            }
        }
        if (par === 'server') {
            return {
                "Hello!": ":)"
            }
        }
    }
}

function skins(name, uuid) {
    return `https://visage.surgeplay.com/${name}/2048/${uuid}.png`
}
