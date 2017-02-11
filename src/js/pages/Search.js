import React from "react";
import TweetDisplay from '../components/TweetDisplay'

export default class Search extends React.Component {

  constructor() {
    super();
    this.state = {value : '', tweets: []};
    this.updateState = this.updateState.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount () {
    socket.on('searchResponse', this.updateState);
  }

  componentWillUnmount () {
    socket.emit('stopStream')
    socket.removeListener('searchResponse')
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    //console.log('handleChange called', this.state.value)
  }

  updateState(tweets) {
    console.log('updatestate called')
    let newTweets = this.state.tweets
    newTweets.push(tweets);
    this.setState({'tweets': newTweets})
    
  }

  searchTweets(event) {
    console.log('searchTweets called', this.state.value);
    event.preventDefault();
    socket.emit('searchRequest', this.state.value)
  }

  render() {
    const myTweets = this.state.tweets;
    
    const tweetStream = myTweets.map( (myTweet, i) => {
      return <TweetDisplay tweet={myTweet} key={i} type="search" />
    })

    return (
      <div>
        <h1>Search the sorry state of Twitter</h1>
        <div className='panel'>
          <form onSubmit={this.searchTweets.bind(this)}>
            <input type="text" value={this.state.searchTerms} onChange={this.handleChange} /><button>search</button>
          </form>
        </div>
        <div id='results'>
        {tweetStream}

        </div>
     </div>
    );
  }
}
