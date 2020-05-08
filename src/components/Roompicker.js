import React from 'react';
import io from 'socket.io-client';

class Roompicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { rooms: [], newRoom: '' };

    this.socket = io('http://localhost:8080');

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.socket.on('rooms', (data) => {
      this.setState({ rooms: JSON.parse(data) });
    });
  }

  componentWillUnmount() {
    this.socket.off('rooms');
  }

  onSubmit(e) {
    e.preventDefault();

    for (let obj of this.state.rooms) {
      if(obj.name === this.state.newRoom) return;
    }

    this.socket.emit('new_room', JSON.stringify({ name: this.state.newRoom }));
    this.props.sendRoom(this.state.newRoom);
    this.setState({ rooms: this.state.rooms.concat({ name: this.state.newRoom }), newRoom: '' });
  }

  deleteRoom(room) {
    let index = this.state.rooms.findIndex(x => x.name === room);
    let newArr = this.state.rooms;
    newArr.splice(index, 1);
    this.setState({ rooms: newArr });

    this.socket.emit('delete_room', room);
    if(this.props.currRoom === room) {
      this.props.sendRoom('global');
    }
  }

  render() {
    return (
      <div className="Roompicker">
        { this.state.rooms.map((value, index) => {
          return (
            <div key={'room-' + index}>
              <button key={'room-' + index} onClick={ () => this.props.sendRoom(value.name) }>{ value.name }</button>
              { value.name !== 'global' ? <button onClick={ () => this.deleteRoom(value.name) }>x</button> : null }
            </div>
          );
        })}
        <form onSubmit={ this.onSubmit }>
          <input type="text" required value={ this.state.newRoom } onChange={ (e) => {
            this.setState({ newRoom: e.target.value })
          }}/>
          <input type="submit" value='Create'/>
        </form>
      </div>
    );
  }
}

export default Roompicker;
