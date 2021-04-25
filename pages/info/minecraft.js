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
            const server_ip = encodeURIComponent(other)
            const data = await fetch(`https://api.mcsrvstat.us/2/${server_ip}`).then(resp => resp.json())
            const data2 = await fetch(`https://mcapi.xdefcon.com/server/${server_ip}/full/json`).then(resp => resp.json())
            if (data.ip === '127.0.0.1' && !data2.serverip && data2.serverStatus === 'offline') return {
                "error": "Server Not Found!"
            }

            if (data2.serverStatus === 'online') return {
                "status": data2.serverStatus,
                "host": data.hostname,
                "ip": data.ip,
                "port": data.port,
                "version": data.version,
                "players": {
                    "now": data.players.online,
                    "max": data.players.max
                },
                "motd": data2.motd.text,
                "icon": data2.icon
            }
            else return {
                "status": data2.serverStatus,
                "host": data.hostname,
                "ip": data.ip,
            }
        }
    }
}

function skins(name, uuid) {
    return `https://visage.surgeplay.com/${name}/2048/${uuid}.png`
}
