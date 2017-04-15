import React from "react";
import TweetDisplay from '../components/TweetDisplay'
import FilterItem from '../components/FilterItem'

export default class Filters extends React.Component {

  constructor() {
    super();
    this.state = {filters: []};

    this.addFilter = this.addFilter.bind(this)
    this.updateAddField = this.updateAddField.bind(this)
    this.updateState = this.updateState.bind(this)
    this.console = this.console.bind(this)
  }

  componentWillMount () {
    socket.on('filtersResponse', this.updateState);
    // socket.on('addFilterResponse', this.console('addFilterResponse'));
    // socket.on('editFilterResponse', this.console('editFilterResponse'));   
    // socket.on('deleteFilterResponse', this.console('deleteFilterResponse'));
  }

  componentDidMount () {
    socket.emit('fetchFilters')
  }

  componentWillUnmount () {
    socket.removeListener('filtersResponse')
  }

  console(ev,response) {
    console.log(ev, response)
  }

  addFilter() {
    console.log('addFilter called', this.state.addValue)
    event.preventDefault();

    socket.emit('addFilter', this.state.addValue)
    this.setState({addValue: ''})
    this.refs.addFilter.value = '';
  }



  updateAddField(event) {
    this.setState({addValue: event.target.value});
    //console.log('handleChange called', this.state.value)
  }

  updateState(newFilters) {
    console.log('update state called')
    console.dir(newFilters)
    this.setState({'filters': newFilters})
  }

  render() {
    const filterList = this.state.filters.map( (filter, i) => {
      return <FilterItem key={i} {...filter} onEdit={this.editFilter} onRemove={this.deleteFilter} />
    })

    return (
      <div>
        <h1>Filters</h1>
        <div className='panel'>
          <form onSubmit={this.addFilter.bind(this)}>
            <input type="text" ref='addFilter' onChange={this.updateAddField} /><button>Add</button>
          </form>
        </div>
        <div id='results'>
          <ul>
            {filterList}
          </ul>
        </div>
     </div>
    );
  }
}
