import React, { Component } from 'react';
import axios from 'axios';
import { isEmpty } from 'lodash';

import { GlobalStyle, Button } from './layout/global.js';
import { spotifyWebApiURL, spotifyProfileURL } from './constants/app_secrets';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: '',
      profile: [],
      deviceId: null,
      user: {},
      gifUrl: '',
      gifUrls: [],
      searchTerm: ''
    };
  }

  componentDidMount = () => {
    this.checkToken();
    let url = window.location.href;
    if (url.indexOf('token=') > -1) {
      let authToken = url
        .split('token=')[1]
        .split('&')[0]
        .trim();
      const expiresIn = parseInt(url.split('expires_in=')[1]);
      let expiresAt = new Date().getTime() + expiresIn * 1000;
      console.log(expiresAt);
      window.location.assign('/');
      this.setState({ authToken });
      window.localStorage.setItem('authToken', authToken);
      window.localStorage.setItem('expiresAt', expiresAt);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.authToken && this.state.authToken) {
      this.getUserInfo();
    }
  }

  checkToken() {
    const authToken = window.localStorage.getItem('authToken');
    const expiresAt = window.localStorage.getItem('expiresAt');
    if (!authToken || expiresAt < new Date().getTime()) {
      window.location.assign(spotifyWebApiURL);
    } else {
      this.setState({ authToken });
    }
  }

  handleAuthFlow = () => {
    if (!this.state.authToken) {
      window.location.assign(spotifyWebApiURL);
    }
  };

  getUserInfo = async () => {
    const resp = await axios.get(spotifyProfileURL + this.state.authToken);
    this.setState({ user: { ...resp.data } });
    console.log(resp.data);
  };

  render() {
    return (
      <React.Fragment>
        <GlobalStyle />

        {this.state.authToken && !isEmpty(this.state.user) ? (
          <div>Logged in</div>
        ) : (
          <Button type='button' color='#1DB954' onClick={this.handleAuthFlow}>
            Sign in with Spotify
          </Button>
        )}
      </React.Fragment>
    );
  }
}

export default App;
