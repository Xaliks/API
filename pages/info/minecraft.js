const fetch = require("node-fetch");
const { stat, writeFileSync } = require("fs");

module.exports = {
  types: ["player", "server"],
  examples: [
    "/minecraft?type=player&query=NICKNAME",
    "/minecraft?type=server&query=SERVER_IP",
  ],
  async run(queries) {
    const { type, query } = queries;
    if (!type) return { error: "Missing type queries" };
    if (!query) return { error: "Missing query queries" };

    if (type === "player") {
      const username = encodeURIComponent(query);
      const data = await fetch(
        `https://some-random-api.ml/mc?username=${username}`
      ).then((resp) => resp.json());
      if (data.error)
        return {
          error: "Player Not Found!",
        };
      const uuid = data.uuid;

      return {
        username: data.username,
        uuid,
        name_history: data.name_history,
        skins: {
          face: skins("face", uuid),
          front: skins("front", uuid),
          front_full: skins("frontfull", uuid),
          head: skins("head", uuid),
          bust: skins("bust", uuid),
          full: skins("full", uuid),
          skin: skins("skin", uuid),
        },
      };
    }
    if (type === "server") {
      const server_ip = encodeURIComponent(query);
      const data = await fetch(`https://api.mcsrvstat.us/2/${server_ip}`).then(
        (resp) => resp.json()
      );
      const data2 = await fetch(
        `https://mcapi.xdefcon.com/server/${server_ip}/full/json`
      ).then((resp) => resp.json());
      if (
        data.ip === "127.0.0.1" ||
        !data.online ||
        data2.serverStatus === "offline"
      )
        return {
          error: "Server Not Found!",
        };

      if (data.online) {
        let icon = null;
        if (data2.icon != null) {
          writeFileSync(
            `./img/${data.ip}.png`,
            data2.icon.replace(/^data:image\/png;base64,/, ""),
            "base64"
          );
          icon = `http://api.xaliks.xyz/img/${data.ip}.png`;
        }
        return {
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
          icon,
        };
      } else {
        let icon;
        stat(`../../img/${data.ip}.png`, (err) => {
          if (err) icon = null;
          else icon = `http://api.xaliks.xyz/img/${data.ip}.png`;
        });
        return {
          status: data2.serverStatus,
          host: data.hostname,
          ip: data.ip,
          icon,
        };
      }
    }
  },
};

function skins(name, uuid) {
  return `https://visage.surgeplay.com/${name}/2048/${uuid}.png`;
}
