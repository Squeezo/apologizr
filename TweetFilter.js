const blocked = [
/Oh I'm sorry, are you annoyed by perfection/i,
/I'm sorry I lied to you Martin/i,
/I'm sorry (Mrs|Miss|Ms)\.?\s*Jackson/i,
/not a single girl intimidates me and i'm sorry if you think you do/i,
/if we're dating, your "sorry I'm taken" game better be strong af/i,
/IF YOU CANT HANDLE ME AT MY WORST THEN YOU SURE AS HELL DON'T DESERVE this kind of treatment/i,
/^I'?m sorry$/i,
/^sorry\,? not sorry$/i,
/I'm sorry, delegitimizing the press is unAmerican/i,
/hey sorry i'm late i didn't wanna come/i,
/Little Jared complaining about me cuz I get under/i,
/I left how much I care in the back pocket of the jeans I'm never going to wear/i,
/So annoying when ppl r like "ur always laughing" "U laugh at everything" "It's not that funny"/i,
/elcome to your tape*/i
];

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