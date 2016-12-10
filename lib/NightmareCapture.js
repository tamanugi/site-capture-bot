const Nightmare = require('nightmare')

module.exports = function(url, callback){
  let nightmare = Nightmare();
  nightmare
  .goto(url)
  .evaluate(() => {
    const body = document.querySelector('body');

    return {
      height: body.scrollHeight,
      width: body.scrollWidth
    };
  })
  .then(function(dimensions) {
    console.log(dimensions)
    return nightmare
      .viewport(dimensions.width, dimensions.height)
      .wait(1000)
      .screenshot(require('path').join(__dirname, '../screenshot.png'))
  })
  .then(() => {
    callback();
  })
  .then(function() {
    nightmare.end(function() {
      console.log('done');
    });
  });
}
