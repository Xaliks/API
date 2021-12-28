module.exports = (app) => {
  const examples = [
    "/info/spotify?type=artist&query=Geoxor",
    "/info/spotify?type=track&query=Cheese",
    "/info/spotify?type=album&query=ALBUM",
    "/info/spotify?type=playlist&query=PLAYLIST",
    "/info/spotify?type=user&query=USER_ID",
  ];
  const usage =
    "/info/spotify?type=String(artist|track|album|playlist|user)&query=String";

  app.get("/info/spotify", async (req, resp) => {
    const type = req.query.type;
    const query = req.query.query;

    if (!type)
      return utils.error(resp, "Пропущен параметр 'type'", usage, examples);
    if (!query)
      return utils.error(resp, "Пропущен параметр 'query'", usage, examples);

    const data = (await get(type, query)) || (await search(type, query));
    if (!data) return utils.error(resp, "Не найдено!", usage, examples);

    if (type === "artist") {
      const albums = [
        await fetch(
          `https://api.spotify.com/v1/artists/${data.id}/albums`
        ).then((resp) => resp.items),
        [],
      ];
      albums[0].forEach((album) => {
        const artists = [];
        album.artists.forEach((artist) => {
          artists.push({
            id: artist.id,
            name: artist.name,
            uri: artist.uri,
            url: artist.external_urls.spotify,
          });
        });
        albums[1].push({
          id: album.id,
          name: album.name,
          uri: album.uri,
          url: album.external_urls.spotify,
          release_date: album.release_date,
          total_tracks: album.total_tracks,
          images: album.images,
          artists: artists,
        });
      });
      const top10tracks = [
        await fetch(
          `https://api.spotify.com/v1/artists/${data.id}/top-tracks?market=US`
        ).then((resp) => resp.tracks),
        [],
      ];
      top10tracks[0].forEach((track) => {
        top10tracks[1].push({
          id: track.id,
          name: track.name,
          uri: track.uri,
          url: track.external_urls.spotify,
          duration: msToTime(track.duration_ms),
          duration_ms: track.duration_ms,
          preview: track.preview_url,
          popularity: track.popularity,
        });
      });

      return resp.send({
        id: data.id,
        name: data.name,
        uri: data.uri,
        url: data.external_urls.spotify,
        genres: data.genres,
        followers: data.followers.total,
        popularity: data.popularity,
        images: data.images,
        albums: albums[1],
        top10tracks: top10tracks[1],
      });
    }
    if (type === "track") {
      let artists = [[], []];
      data.artists.forEach((artist) => {
        artists[0].push({
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
          url: artist.external_urls.spotify,
        });
      });
      data.album.artists.forEach((artist) => {
        artists[1].push({
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
          url: artist.external_urls.spotify,
        });
      });

      return resp.send({
        id: data.id,
        name: data.name,
        uri: data.uri,
        url: data.external_urls.spotify,
        duration: msToTime(data.duration_ms),
        duration_ms: data.duration_ms,
        preview: data.preview_url,
        popularity: data.popularity,
        artists: artists[0],
        album: {
          id: data.album.id,
          name: data.album.name,
          uri: data.album.uri,
          url: data.album.external_urls.spotify,
          release_date: data.album.release_date,
          images: data.album.images,
          artists: artists[1],
        },
      });
    }
    if (type === "album") {
      let artists = [];
      data.artists.forEach((artist) => {
        artists.push({
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
          url: artist.external_urls.spotify,
        });
      });

      let tracks = [
        await fetch(`https://api.spotify.com/v1/albums/${data.id}/tracks`).then(
          (resp) => resp.items
        ),
        [],
      ];
      tracks[0].forEach((track) => {
        tracks[1].push({
          id: track.id,
          name: track.name,
          uri: track.uri,
          url: track.external_urls.spotify,
          duration: msToTime(track.duration_ms),
          duration_ms: track.duration_ms,
          preview: track.preview_url,
          popularity: track.popularity,
        });
      });

      return resp.send({
        id: data.id,
        name: data.name,
        uri: data.uri,
        url: data.external_urls.spotify,
        release_date: data.release_date,
        total_tracks: data.total_tracks,
        images: data.images,
        artists: artists,
        tracks: tracks[1],
      });
    }
    if (type === "playlist") {
      let tracks = [];
      data.tracks.items.forEach((track) => {
        let artists = [[], []];
        track = track.track;

        track.artists.forEach((artist) => {
          artists[0].push({
            id: artist.id,
            name: artist.name,
            uri: artist.uri,
            url: artist.external_urls.spotify,
          });
        });
        track.album.artists.forEach((artist) => {
          artists[1].push({
            id: artist.id,
            name: artist.name,
            uri: artist.uri,
            url: artist.external_urls.spotify,
          });
        });

        tracks.push({
          id: track.id,
          name: track.name,
          uri: track.uri,
          url: track.external_urls.spotify,
          duration: msToTime(track.duration_ms),
          duration_ms: track.duration_ms,
          preview: track.preview_url,
          popularity: track.popularity,
          artists: artists[0],
          album: {
            id: track.album.id,
            name: track.album.name,
            uri: track.album.uri,
            url: track.album.external_urls.spotify,
            release_date: track.album.release_date,
            images: track.album.images,
            artists: artists[1],
          },
        });
      });

      const owner = await get("user", data.owner.id);

      return resp.send({
        id: data.id,
        name: data.name,
        uri: data.uri,
        url: data.external_urls.spotify,
        description: data.description.replace(
          /(\<a href=spotify:playlist:.{22}>)|(\<\/a>)/g,
          ""
        ),
        public: data.public,
        collaborative: data.collaborative,
        followers: data.followers.total,
        owner: {
          id: owner.id,
          name: owner.display_name,
          uri: owner.uri,
          url: owner.external_urls.spotify,
          followers: owner.followers.total,
          images: owner.images,
        },
        images: data.images,
        total_tracks_duration: tracks.reduce(
          (a, b) => a.duration_ms + b.duration_ms
        ),
        total_tracks: data.tracks.total,
        tracks: tracks,
      });
    }
    if (type === "user") {
      return resp.send({
        id: data.id,
        name: data.display_name,
        uri: data.uri,
        url: data.external_urls.spotify,
        followers: data.followers.total,
        images: data.images,
      });
    }
  });
};

async function fetch(URL) {
  return require("node-fetch")(URL, {
    "Content-Type": "application/json",
    headers: {
      Authorization: `Bearer ${await getApiToken()}`,
    },
  }).then((resp) => resp.json());
}
async function getApiToken() {
  const config = require("../../config.json");

  const data = await require("node-fetch")(
    `https://accounts.spotify.com/api/token?grant_type=client_credentials&token=NO_TOKEN&client_id=${config.SPOTIFY_CLIENT_ID}&client_secret=${config.SPOTIFY_CLIENT_SECRET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  ).then((resp) => resp.json());

  return data.access_token;
}
async function search(type, query) {
  const resp = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=${type}`
  );

  if (resp.error) return undefined;

  return resp[type + "s"].items[0];
}
async function get(type, id) {
  const resp = await fetch(
    `https://api.spotify.com/v1/${type + "s"}/${encodeURIComponent(
      getIDbyURI(id)
    )}`
  );

  if (resp.error) return undefined;

  return resp;

  function getIDbyURI(URI) {
    if (URI.startsWith("https://open.spotify.com/"))
      return URI.split("/")[4].split("?")[0];
    if (URI.split(":").length === 3) return URI.split(":")[2];

    return URI;
  }
}
function msToTime(ms) {
  const temp = [];
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor((ms / 1000 / 60 / 60) % 24);

  if (hours > 0) temp.push(hours);
  if (minutes > 0)
    temp.push(minutes.toString().length === 1 ? "0" + minutes : minutes);
  if (seconds > 0)
    temp.push(seconds.toString().length === 1 ? "0" + seconds : seconds);

  return temp.join(":");
}
