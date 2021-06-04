const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = require("../../config.json");

module.exports = {
  types: ["artist", "track", "album", "playlist"],
  async run(type, query) {
    const data = await search(type, query);
    if (!data)
      return { error: `${type[0].toUpperCase() + type.slice(1)} not found!` };

    if (type === "artist") {
      let top10tracks = [
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
          duration: track.duration_ms,
          preview: track.preview_url,
          popularity: track.popularity,
        });
      });

      return {
        id: data.id,
        name: data.name,
        uri: data.uri,
        url: data.external_urls.spotify,
        genres: data.genres,
        followers: data.followers.total,
        popularity: data.popularity,
        images: data.images,
        top10tracks: top10tracks[1],
      };
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

      return {
        id: data.id,
        name: data.name,
        uri: data.uri,
        url: data.external_urls.spotify,
        duration: data.duration_ms,
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
      };
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
          duration: track.duration_ms,
          preview: track.preview_url,
          popularity: track.popularity,
        });
      });

      return {
        id: data.id,
        name: data.name,
        uri: data.uri,
        url: data.external_urls.spotify,
        release_date: data.release_date,
        total_tracks: data.total_tracks,
        images: data.images,
        artists: artists,
        tracks: tracks[1],
      };
    }
    if (type === "playlist") {
      const playlist = await getPlaylist(data.id);
      if (!playlist) return { error: "Playlist not found!" };

      let tracks = [];
      playlist.tracks.items.forEach((track) => {
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
          duration: track.duration_ms,
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

      const owner = await fetch(
        `https://api.spotify.com/v1/users/${playlist.owner.id}`
      );

      return {
        id: playlist.id,
        name: playlist.name,
        uri: playlist.uri,
        url: playlist.external_urls.spotify,
        description: playlist.description,
        public: playlist.public,
        collaborative: playlist.collaborative,
        followers: playlist.followers.total,
        owner: {
          id: owner.id,
          name: owner.display_name,
          uri: owner.uri,
          url: owner.external_urls.spotify,
          followers: owner.followers.total,
          images: owner.images,
        },
        images: playlist.images,
        total_tracks: playlist.tracks.total,
        tracks: tracks,
      };
    }
  },
};

async function fetch(URL) {
  return require("node-fetch")(URL, {
    "Content-Type": "application/json",
    headers: {
      Authorization: `Bearer ${await getApiToken(
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET
      )}`,
    },
  }).then((resp) => resp.json());
}
async function getApiToken(clientID, clientSecret) {
  const { data } = await require("axios").default({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    params: {
      grant_type: "client_credentials",
      token: "NO_TOKEN",
      client_id: clientID,
      client_secret: clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return data.access_token;
}
async function search(type, query) {
  const resp = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=${type}`
  );

  return resp[type + "s"].items[0];
}

async function getPlaylist(playlistId) {
  const resp = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId.toString()}`
  );

  if (resp.error) return undefined;

  return resp;
}
