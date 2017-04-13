import React from "react";
import TweetDisplay from '../components/TweetDisplay'
import FilterItem from '../components/FilterItem'

export default class Filters extends React.Component {

  constructor() {
    super();
    this.state = {filters: []};

    this.addFilter = this.addFilter.bind(this)
    this.editFilter = this.editFilter.bind(this)
    this.deleteFilter = this.deleteFilter.bind(this)
    this.updateAddField = this.updateAddField.bind(this)
    this.updateEditField = this.updateEditField.bind(this)
    this.updateState = this.updateState.bind(this)
    this.console = this.console.bind(this)
  }

  componentWillMount () {
    socket.on('filtersResponse', this.updateState);
    socket.on('addFilterResponse', this.console('addFilterResponse'));
    socket.on('editFilterResponse', this.console('editFilterResponse'));   
    socket.on('deleteFilterResponse', this.console('deleteFilterResponse'));
  }

  componentDidMount () {
    socket.emit('fetchFilters')
  }

  componentWillUnmount () {
    socket.removeListener('filtersResponse')
    socket.removeListener('addFilterResponse')
    socket.removeListener('editFilterResponse')
    socket.removeListener('deleteFilterResponse')       
  }

  console(ev,response) {
    console.log(ev, response)
  }

  addFilter() {
    console.log('addFilter called', this.state.addValue)
    event.preventDefault();
    socket.emit('addFilter', this.state.addValue)
    this.setState({addValue: ''})
  }

  editFilter() {
    console.log('editFilter called ', this.props.fid)
    event.preventDefault();
    socket.emit('editFilter', {fid: this.props.fid, value: this.state.editValue})
    this.setState({editValue: ''})
  }

  deleteFilter(item) {
    console.log('deleteFilter called')
    console.dir(item)
    //socket.emit('deleteFilter', item)
  }

  updateAddField(event) {
    this.setState({addValue: event.target.value});
    //console.log('handleChange called', this.state.value)
  }

  updateEditField(event) {
    this.setState({editValue: event.target.value});
    //console.log('handleChange called', this.state.value)
  }

  updateState(newFilters) {
    console.log('update state called')
    console.dir(newFilters)
    this.setState({'filters': newFilters})
  }

  render() {
    const filterList = this.state.filters.map( (filter, i) => {
      return <FilterItem key={i} text={filter.text} onEdit={this.editFilter} onRemove={this.deleteFilter} />
    })

    return (
      <div>
        <h1>Filters</h1>
        <div className='panel'>
          <form onSubmit={this.addFilter.bind(this)}>
            <input type="text" onChange={this.updateAddField} /><button>Add</button>
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
