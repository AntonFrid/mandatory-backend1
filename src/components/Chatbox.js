import React from 'react';
import io from 'socket.io-client';

import Roompicker from './Roompicker.js';

class Chatbox extends React.Component {
  constructor(props) {
    super(props);

    this.socket = io('http://localhost:8080');

    this.state = { messages: [], msg: '', room: 'global' };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
  }

  componentDidMount() {
    if(!this.props.username) return;

    this.socket.emit('join', this.state.room);

    this.socket.on('messages', (data) => {
      this.setState({ messages: JSON.parse(data) });
    });

    this.socket.on('message', (data) => {
      this.setState({ messages: this.state.messages.concat(JSON.parse(data))});
    });
  }

  componentWillUnmount() {
    this.socket.off('message');
    this.socket.off('messages');
  }

  onSubmit(e) {
    e.preventDefault();

    this.socket.emit('new_message', JSON.stringify({ room: this.state.room, user: this.props.username, msg: this.state.msg }));
    this.setState({
      messages: this.state.messages.concat({ room: this.state.room, user: this.props.username, msg: this.state.msg}),
      msg: ''
    });
  }

  onChange(e) {
    this.setState({ msg: e.target.value });
  }

  changeRoom(room) {
    this.setState({ room: room });
    this.socket.emit('join', room);
  }

  render() {
    return (
      <div className="Chatbox">
        <Roompicker currRoom={ this.state.room } sendRoom={ this.changeRoom }/>
        <div className='Chatbox__display'>
          { this.state.messages.map((value, index) => {
              return <p key={ value + index }>{ value.user + ': ' + value.msg }</p>
            })
          }
        </div>
        <form className='Chatbox__form' onSubmit={ this.onSubmit }>
          <input type='text' required value={ this.state.msg } onChange={ this.onChange }/>
          <input type='submit' value='Send'/>
        </form>
      </div>
    );
  }
}

export default Chatbox;
