import React from "react";
import TweetList from '../components/TweetList'

export default class Search extends React.Component {

  constructor() {
    super();
    this.state = {value : ''};
  }

  ComponentDidMount () {
    socket.on('searchResponse', this.updateState.bind(this))
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log('handleChange called', this.state.value)
  }

  updateState(tweets) {
    console.log('updatestate called')
    
    if(tweets) {
      this.setState('tweets': tweets)
    }
  }

  searchTweets(event) {
    console.log('searchTweets called', this.state.value);
    event.preventDefault();
    socket.emit('searchRequest', this.state.value)
  }

  render() {
    let list=null;
    if (this.state.tweets) {
      list= <TweetList tweets={this.state.tweets} />
    }

    return (
      <div>
        <h1>Search the sorry state of Twitter</h1>
        <form onSubmit={this.searchTweets.bind(this)}>
          <input type="text" value={this.state.searchTerms} onChange={this.handleChange.bind(this)} /><button>search</button>
        </form>
        {list}
        
      </div>
    );
  }
}
