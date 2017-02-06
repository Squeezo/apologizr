import React from "react";

export default class Post extends React.Component {
  constructor() {
    super();
  
    this.state = {value: '', message: '', alertStyle: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }


  componentWillMount() {
    socket.on('postResponse', this.handleResponse)
  }

  componentWillUnmount() {
    socket.removeListener('postResponse')
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({message: ''})
    this.setState({alertStyle: ''})
    socket.emit('postTweet', this.state.value)
  }

  handleResponse(response) {
    this.setState({alertStyle : 'alert alert-dismissable alert-danger'})   
    this.setState({message: response})

    let message = response
    if((typeof response) === "number") {
      let content = this.refs.content
      content.value = ''
      this.setState({message: 'Tweet posted.'})
      this.setState({alertStyle : 'alert alert-dismissable alert-success'})
    } 
  }

  render() {
    
    const isMessage = this.state.message ? true : false;
    const alertStyle = this.state.alertStyle
    console.log('isMesssage ', isMessage)
    return (
      <div>
      	<h1>Post your regrets</h1>
        <div className='panel'>
          
            <div className={alertStyle}>{this.state.message}</div>
        	
          <form onSubmit={this.handleSubmit} className='form-horizontal'>
            <textarea ref='content' onChange={this.handleChange} className='form-control'></textarea> 
       	    <input type='submit' value='Post' />
            
          </form>
        </div>  
      </div>	
    );
  }
}
