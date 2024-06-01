const SpotifyWebApi = require('spotify-web-api-node');
const spotifyId = process.env.SPOTIFY_CLIENT_ID
const spotifySecret = process.env.SPOTIFY_CLIENT_SECRET

async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(spotifyId + ':' + spotifySecret).toString('base64')),
    },
  });

  return await response.json();
}

async function getTrackInfo(access_token) {
  const response = await fetch("https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  return await response.json();
}

module.exports.getSpotifyAccessToken = async function() {
  token = await getToken()
  return token.access_token
}

