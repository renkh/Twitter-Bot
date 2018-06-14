// Create an Twitter object to connect to Twitter API
// npm install twit
var Twit = require('twit');
// Pulling all my twitter account info from another file
var config = require('./config.js');
// Making a Twit object for connection to the API
var T = new Twit(config);

// For reading image files
var fs = require('fs');

// Setting up a user stream
var stream = T.stream('user');

// Anytime someone follows me
stream.on('follow', followed);

// Just looking at the event but I could tweet back!
function followed(event) {
  var name = event.source.name;
  var screenName = event.source.screen_name;
  console.log('I was followed by: ' + name + ' ' + screenName);
}

// Now looking for tweet events
// See: https://dev.twitter.com/streaming/userstreams
stream.on('tweet', tweetEvent);

// Here a tweet event is triggered!
function tweetEvent(tweet) {

  // If we wanted to write a file out
  // to look more closely at the data
  // var fs = require('fs');
  // var json = JSON.stringify(tweet,null,2);
  // fs.writeFile("tweet.json", json, output);

  // Who is this in reply to?
  var reply_to = tweet.in_reply_to_screen_name;
  // Who sent the tweet?
  var name = tweet.user.screen_name;
  // What is the text?
  var txt = tweet.text;
  // If we want the conversation thread
  var id = tweet.id_str;

  // Ok, if this was in reply to me
  // Tweets by me show up here too
  if (reply_to === 'catbot488') {

    // Get rid of the @ mention
    txt = txt.replace(/@catbot488/g,'');

    // Read the file made by Processing
    var b64content = fs.readFileSync('cat_pics/' + Math.floor(Math.random()*14) + '.jpg', { encoding: 'base64' })

    // Upload the media
    T.post('media/upload', { media_data: b64content }, uploaded);

    function uploaded(err, data, response) {

      // Now we can reference the media and post a tweet
      // with the media attached
      var mediaIdStr = data.media_id_string;

      // Start a reply back to the sender
      var replyText = '@'+name + 'Here is your #kitty pic!';

      console.log(replyText);

      // Post that tweet
      T.post('statuses/update', { status: replyText, media_ids: [mediaIdStr], in_reply_to_status_id: id}, tweeted);
    };

    // Make sure it worked!
    function tweeted(err, reply) {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Tweeted: ' + reply.text);
      }
    }
  }
}
