const fetch = require("node-fetch");
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = require("../../config.json");

module.exports = {
  name: "spotify",
  firstEndpoints: ["/artist/:name", "/track/:name", "/album/:name"],
  secondEndpoints: ["ARTIST: /:name", "TRACK: /:name", "ALBUM: /:name"],
  async run(par, other) {
    if (par === "artist") {
      const data = await search("artist", other);
      if (!data) return { error: "Artist not found!" };

      let top10tracks = [await getTop10ArtistTracks(data.id), []];
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
    if (par === "track") {
      const data = await search(par, other);
      if (!data) return { error: "Track not found!" };

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
    if (par === "album") {
      const data = await search(par, other);
      if (!data) return { error: "Album not found!" };

      let artists = [];
      data.artists.forEach((artist) => {
        artists.push({
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
          url: artist.external_urls.spotify,
        });
      });

      let tracks = [await getAlbumTracks(data.id), []];
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
  },
};

async function search(type, query) {
  const token = await getApiToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);
  const resp = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=${type}`,
    {
      "Content-Type": "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((resp) => resp.json());

  return resp[type + "s"].items[0];
}
async function getTop10ArtistTracks(artistId) {
  const token = await getApiToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);
  const resp = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    {
      "Content-Type": "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((resp) => resp.json());

  return resp.tracks;
}
async function getAlbumTracks(albumId) {
  const token = await getApiToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);
  const resp = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      "Content-Type": "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((resp) => resp.json());

  return resp.items;
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
