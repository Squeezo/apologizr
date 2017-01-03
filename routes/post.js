const express = require('express'),
      router = express.Router(),
      twitterClient = require('../twitterClient')

router.get('/post', (req, res) => {
  res.render('post', {label: 'Write it', create:'Post it'})

})

router.post('/post', (req, res) => {

  let newTweet = req.body.newTweet;
  req.sanitize('newTweet').escape();
  console.log('santized input', req.body.newTweet)

  twitterClient.post('statuses/update', {status: newTweet}, (error, tweet, response) => {
    if(error) {
      console.log(error);
      return res.render('post', {message: error[0].message, label: 'Write it', create:'Post it'})
    }
    
    //console.log(tweet);  // Tweet body.
    //console.log(response);  // Raw response object.
    return res.redirect('/post')

  });

})

module.exports = router