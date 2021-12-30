const fetch = require("node-fetch");

module.exports = (app) => {
	const examples = ["/minecraft?type=player&query=Xaliksss", "/minecraft?type=server&query=mc.hypixel.net"];
	const usage = "/info/spotify?type=String(player|server)&query=String";

	app.get("/info/minecraft", async (req, resp) => {
		const type = req.query.type;
		const query = req.query.query;

		if (!type) return utils.error(resp, "Пропущен параметр 'type'", usage, examples);
		if (!query) return utils.error(resp, "Пропущен параметр 'query'", usage, examples);

		if (type === "player") {
			const username = encodeURIComponent(query);
			const data = await fetch(`https://some-random-api.ml/mc?username=${username}`).then((resp) => resp.json());
			if (data.error) return utils.error(resp, "Игрок не найден!", usage, examples);

			return resp.send({
				username: data.username,
				uuid: data.uuid,
				name_history: data.name_history,
				skins: {
					face: skins("face", data.uuid),
					front: skins("front", data.uuid),
					front_full: skins("frontfull", data.uuid),
					head: skins("head", data.uuid),
					bust: skins("bust", data.uuid),
					full: skins("full", data.uuid),
					skin: skins("skin", data.uuid),
				},
			});
		}

		if (type === "server") {
			const server_ip = encodeURIComponent(query);
			const data = await fetch(`https://api.mcsrvstat.us/2/${server_ip}`).then((resp) => resp.json());
			const data2 = await fetch(`https://mcapi.xdefcon.com/server/${server_ip}/full/json`).then((resp) => resp.json());
			if (data.ip === "127.0.0.1") return utils.error(resp, "Сервер не найден!", usage, examples);

			if (data.online) {
				return resp.send({
					status: data2.serverStatus,
					host: data.hostname,
					ip: data.ip,
					port: data.port,
					version: data.version,
					players: {
						now: data.players.online,
						max: data.players.max,
					},
					motd: data2.motd.text,
					icon: data2.icon,
				});
			} else {
				return resp.send({
					status: data2.serverStatus,
					host: data.hostname,
					ip: data.ip,
				});
			}
		}
	});
};

function skins(name, uuid) {
	return `https://visage.surgeplay.com/${name}/2048/${uuid}.png`;
}
