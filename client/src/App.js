import 'semantic-ui-css/semantic.min.css'
import './styles/App.css';

import ControlBox from './ControlBox';
import Title from './Title'
import store from './app/store';

import { Provider } from 'react-redux';
import { useEffect } from 'react';
import useAuth from './hooks/useAuth';
import { spotifyApi } from './constants';

export default function App() {
  useEffect(() => {
    document.title = "Ranked Records"
  }, []);

  spotifyApi.setAccessToken(useAuth(false));

  return (
    <Provider store={store}>
      <div id="app">
        <header>
          <Title/>
          <ControlBox/>
        </header>
      </div>
    </Provider>
  );
}