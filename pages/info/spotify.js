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

      let top10tracks = [];

      await client.artists.getTopTracks(result.items[0].id).then((tracks) => {
        tracks.forEach(async (track) => {
          const {
            id,
            name,
            externalUrls,
            duration,
            uri,
            popularity,
            previewUrl,
          } = track;

          top10tracks.push({
            id,
            name,
            url: externalUrls.spotify,
            uri,
            preview: previewUrl,
            duration,
            popularity,
          });
        });
      });

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
        top10tracks,
      };
    }
    if (par === "track") {
      const result = await client.tracks.search(other);
      if (!result.items[0]) return { error: "Track not found!" };
      const { id, name, externalUrls, duration, uri, popularity, previewUrl } =
        result.items[0];

      let found = true;
      const album_data = await client.albums
        .search(other)
        .then((alb) => alb.items[0]);
      let album;
      if (!album_data) {
        album = {
          found: false,
        };
      } else
        album = {
          found,
          id: album_data.id,
          name: album_data.name,
          url: album_data.externalUrls.spotify,
          uri: album_data.uri,
          releaseDate: album_data.releaseDate,
          images: album_data.images,
        };

      return {
        id,
        name,
        url: externalUrls.spotify,
        uri,
        preview: previewUrl,
        duration,
        popularity,
        album,
      };
    }
    if (par === "album") {
      const result = await client.albums.search(other);
      if (!result.items[0]) return { error: "Album not found!" };

      let tracks = [];

      await client.albums.getTracks(result.items[0].id).then((tr) => {
        tr.items.forEach(async (track) => {
          const {
            id,
            name,
            externalUrls,
            duration,
            uri,
            popularity,
            previewUrl,
          } = track;

          tracks.push({
            id,
            name,
            url: externalUrls.spotify,
            uri,
            preview: previewUrl,
            duration,
            popularity,
          });
        });
      });

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
        tracks,
      };
    }
  },
};
