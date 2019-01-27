import React from "react";
import ImageDisplay from '../components/ImageDisplay'

export default class Images extends React.Component {

  constructor() {
    super();
    this.state = {  
                    images: [], 
                    count:10, 
                    offset:0,
                    keyword: '' 
                };
  }

  componentWillMount () {
    socket.on('imageResponse', this.updateState);
    socket.on('nextOffset', this.updateOffset)    
  }

  componentWillUnmount () {
    socket.emit('stopStream')
    socket.removeListener('imageResponse', this.updateState);
    socket.removeListener('nextOffset', this.updateOffset)   }

  handleChange = (event) => {
    this.setState({keyword: event.target.value});
    //console.log('handleChange called', this.state.value)
  }

  updateState = (image) => {
    console.log('Images update state called')
    const { images } = this.state;
    images.push(image);
    this.setState({'images': images})
  }

  updateOffset = (offset) => {
    console.log('updateOffset', offset);
    this.setState({offset: offset})
  }


  searchImages = () => {
    console.log('searchImages called');
    socket.emit('imageRequest', {keyword: this.state.keyword, offset: this.state.offset, count: this.state.count})
  }

  handleSearch = (event) => {
    event.preventDefault();
    console.log('searchNext called');
    this.setState({keyword: this.state.keyword, images: [], offset: 0},    
      this.searchImages()
    );
  }

  handleNext = (e) => {
    e.preventDefault();
    this.setState({ offset: this.state.offset + this.state.count}, this.searchImages());
  }

  render() {
    const { images, offset } = this.state;
    
    const imageStream = images.map( (image, i) => {
      return <ImageDisplay image={image} key={i} type="search" idx={i+1} />
    })

    //let nextButton = null;
    //if(offset > 0) {
      let nextButton = <button onClick={this.handleNext}>Next {this.state.count}</button>
    //}

    return (
      <div>
        <h1>Image Search, Bing</h1>
        <div className='panel'>
          <form onSubmit={this.searchImages}>
            <input type="text" value={this.state.keyword} onChange={this.handleChange} /><button>search</button>
          </form>
        </div>
        <div id='images'>
        {imageStream}
        {nextButton}
        </div>
     </div>
    );
  }
}
