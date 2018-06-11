// Create an Twitter object to connect to Twitter API
// npm install twit
var Twit = require('twit');
// Pulling all my twitter account info from another file
var config = require('./config.js');
// Making a Twit object for connection to the API
var T = new Twit(config);

var params = {
  q: '#kitty', // REQUIRED
  result_type: 'recent',
  lang: 'en'
}

T.get('search/tweets', params, gotData);

function gotData(err, data) {
  console.log('Entered gotdata');
  if (!err) {
    var tweets = data.statuses;
    console.log('tweets length: ', tweets.length);
    for (var i = 0; i < tweets.length; i++) {
      // grab ID of tweet to retweet
      var retweetId = data.statuses[0].id_str;
      if (data.entities.media != undefined) {
        var media = data.entities.media;
        console.log('Found media');
      }
      // Tell TWITTER to retweet
      T.post('statuses/retweet/:id', {
          id: 0
      }, function(err, response) {
          if (response) {
              console.log('Retweeted!!!');
          }
          // if there was an error while tweeting
          if (err) {
              console.log('Something went wrong while RETWEETING... Duplication maybe...');
          }
        });
    }
  }
  // if unable to Search a tweet
  else {
    console.log('Something went wrong while SEARCHING...');
  }
  /*var tweets = data.statuses;
  for (var i = 0; i < tweets.length; i++) {
    console.log(tweets[i].text);
  }*/
}
