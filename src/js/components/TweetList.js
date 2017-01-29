import React from "react";
import TweetDisplay from '../components/TweetDisplay';

export default class TweetList extends React.Component {
  render() {
    const { tweets } = this.props.tweets;
    
    return (
      tweets.map(function(tweet) {
         <TweetDisplay tweet={tweet} />
      })
    );
  }
}
