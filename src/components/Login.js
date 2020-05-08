import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { username: '' };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ username: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.setUsername(this.state.username);
  }

  render() {
    return (
      <div className="Login">
        <form className='Login__form' onSubmit={ this.onSubmit }>
          <input type='text' required value={ this.state.username } onChange={ this.onChange }/>
          <input type='submit' value='Login'/>
        </form>
      </div>
    );
  }
}

export default Login;
