const Spotify = require("spotify-api.js");
const client = new Spotify.Client();

module.exports = {
  name: "spotify",
  firstEndpoints: ["/artist/:name", "/track/:name", "/album/:name"],
  secondEndpoints: ["ARTIST: /:name", "TRACK: /:name", "ALBUM: /:name"],
  async run(par, other) {
    await client.login(
      process.env.SPOTIFY_CLIENT_ID,
      process.env.SPOTIFY_CLIENT_SECRET
    );

    if (par === "artist") {
      const result = await client.artists.search(other);
      if (!result.items[0]) return { error: "Artist not found!" };
      const {
        id,
        name,
        externalUrls,
        uri,
        totalFollowers,
        images,
        popularity,
      } = result.items[0];

      return {
        id,
        name,
        url: externalUrls.spotify,
        uri,
        followers: totalFollowers,
        popularity,
        images,
      };
    }
    if (par === "track") {
      const result = await client.tracks.search(other);
      if (!result.items[0]) return { error: "Track not found!" };
      const { id, name, externalUrls, duration, uri, popularity, previewUrl } =
        result.items[0];

      return {
        id,
        name,
        url: externalUrls.spotify,
        uri,
        preview: previewUrl,
        duration,
        popularity,
      };
    }
    if (par === "album") {
      const result = await client.albums.search(other);
      if (!result.items[0]) return { error: "Album not found!" };
      const {
        id,
        name,
        externalUrls,
        duration,
        uri,
        releaseDate,
        totalTracks,
        images,
      } = result.items[0];

      return {
        id,
        name,
        url: externalUrls.spotify,
        uri,
        duration,
        releaseDate,
        totalTracks,
        images,
      };
    }
  },
};
