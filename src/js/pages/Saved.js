import React from "react";
import TweetDisplay from '../components/TweetDisplay'

export default class Saved extends React.Component {

  constructor() {
    super();
    this.state = {tweets: []};
    this.updateState = this.updateState.bind(this)
  }

  componentWillMount () {
    socket.on('savedResponse', this.updateState);
  }

  componentDidMount () {
    socket.emit('savedRequest')
  }

  componentWillUnmount () {
    socket.removeListener('savedResponse')
  }

  updateState(newTweets) {
    console.log('updatestate called')
    this.setState({'tweets': newTweets})
  }

  render() {
    const myTweets = this.state.tweets;
    
    const storedTweets = myTweets.map( (myTweet, i) => {
      return <TweetDisplay tweet={myTweet} key={i} type="view" />
    })

    return (
      <div>
        <h1>Regretfully, these have been stored</h1>
        <div id='results'>
        {storedTweets}

        </div>
     </div>
    );
  }
}
