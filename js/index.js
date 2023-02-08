window.onSpotifyWebPlaybackSDKReady = () => {

    const token = 'BQDwjiXDWu1S0iOqCbRRE42a1STE4hxWb38L1b7AypFcHQdNaD1g5BeqpM0Vm1EoYvakZqSX_AyFeuhMzj37CiJ7BDE7RskODGGwouSmb603agXePYdt8CLkkAHgUrwVNy1M0Aqta75jVijjD0xbuzqTYeRLW7n5RWl2Y4uGc-ybbQ-KQmdqwNYB838iAbfYVdXaoqpscFHNtEHbhnRFEeib';
    const player = new Spotify.Player({

      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
      };
}

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // listeners to get notified in case something happens during the SDK initialization
  player.addListener('initialization_error', ({ message }) => { 
    console.error(message);
});

player.addListener('authentication_error', ({ message }) => {
    console.error(message);
});

player.addListener('account_error', ({ message }) => {
    console.error(message);
});

// call connect method to perform the connection of our new Spotify instance
player.connect();