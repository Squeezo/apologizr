import React from "react";


export default class FilterItem extends React.Component {
  constructor() {
    super();
    this.state = {editing: false, };
    this.updateEditField = this.updateEditField.bind(this)
    this.editFilter = this.editFilter.bind(this)
    this.deleteFilter = this.deleteFilter.bind(this)
    this.editMode = this.editMode.bind(this)
  }
  
  componentWillMount() {
    this.setState({editValue: this.props.text})
    //socket.on('editFilterResponse', console.log('editFilterResponse')); 
  } 

  updateEditField(event) {
    this.setState({editValue: event.target.value});
    //console.log('handleChange called', this.state.value)
  }

  editMode(item) {
    console.log('editMode')
    this.setState({editing : !this.state.editing});
  }

  editFilter() {
    console.log('editFilter called ', this.props.hash)
    event.preventDefault();
    socket.emit('editFilter', {hash: this.props.hash, value: this.state.editValue})
    this.setState({editValue: '', editing: false})
  }

  deleteFilter() {
    console.log('deleteFilter called')
    socket.emit('deleteFilter', {hash: this.props.hash})
  }

  render() {
    if(!this.state.editing) {
      return ( <li>{this.props.text} {this.props.hits.count} <button onClick={this.editMode}>edit</button><button onClick={this.deleteFilter}>delete</button></li> );
    } else {
      return ( <li><form id='editFilter' onSubmit={this.editFilter}><input type="text" onChange={this.updateEditField} value={this.state.editValue} /><button>Edit</button> <button onClick={this.editMode}>X</button></form></li> );
    }
  } 
}