const blocked = [];

const TweetFilter = {
  check(tweet) {
    let text = tweet.text
    //console.log('\n\nTEXT:: ', text, ':::::\n')
    
    for(let t=0;t<blocked.length;t++) {
      //console.log(blocked[t], '\n')
      if(text.match(blocked[t])) {
        console.log('found a match, returning false', text)
        return false;
      }
    }

    return true;
  }

}

module.exports = TweetFilter;