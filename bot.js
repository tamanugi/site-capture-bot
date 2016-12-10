if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
let capture = require('./lib/NightmareCapture')
let fs = require('fs')

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


controller.hears(['capture <(https?://.*)>'], 'direct_message,direct_mention,mention', function(bot, message) {

    // reaction robot face
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    // url extract
    let url = message.match[1] + ''

    let callback = () => {
      const messageObj = {
        file: fs.createReadStream('./screenshot.png'),
        filename: 'screenshot.png',
        title: 'screenshot.png',
        channels: message.channel
      };

      // post screenshot.png to slack
      bot.api.files.upload(messageObj, function(err, res){
        if(err){
            console.log(err);
        }
      });

      // remove screenshot.png
      fs.unlink('./screenshot.png', function (err) {
        if (err) throw err;
        console.log('successfully deleted');
      });

      // reaction check mark
      bot.api.reactions.add({
          timestamp: message.ts,
          channel: message.channel,
          name: 'heavy_check_mark',
      }, function(err, res) {
          if (err) {
              bot.botkit.log('Failed to add emoji reaction :(', err);
          }
      });
    }
    capture(url, callback)

});
