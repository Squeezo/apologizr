import React from "react";

export default class Post extends React.Component {
  constructor() {
    super();
  
    this.state = {value: '', message: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }


  componentWillMount() {
    socket.on('response', this.handleResponse)
  }

  componentWillUnmount() {
    socket.removeListener('response')
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    socket.emit('postTweet', this.state.value)
  }

  handleResponse(response) {
    let message = response
    if((typeof response) === "number") {
      let content = this.refs.content
      content.value = ''
      message = 'Tweet posted.'
    }
    
    this.setState({message: message})
  }

  render() {
    return (
      <div>
      	<h1>Post your regrets</h1>
        <div>{this.state.message}</div>
      	<form onSubmit={this.handleSubmit}>
      		<textarea ref='content' onChange={this.handleChange}></textarea> 
     	    <input type='submit' value='Post' />
        </form>
      </div>	
    );
  }
}
