import 'semantic-ui-css/semantic.min.css'
import './styles/App.css';

import ControlBox from './ControlBox';
import Title from './Title'
import store from './app/store';

import { Provider } from 'react-redux';
import SongTable from './SongTable';
import ArtistBox from './ArtistBox';
import RecArtistBox from './RecArtistBox';
import LoginModal from './LoginModal';
import Footer from './Footer';
import ScrollToTop from 'react-scroll-to-top';

export default function App() {
  document.title = "Ranked Records"
  
  return (
    <Provider store={store}>
      <div id="app">
        <LoginModal/>
        <div id="leftBox">
        <header>
          <Title/>
          <ControlBox/>
          <div id="artistDivs">
            <ArtistBox/>
            <RecArtistBox/>
          </div>
          <Footer/>
        </header>
        </div>
        <div id="rightBox">
          <SongTable/>
        </div>
      </div>
      <ScrollToTop smooth color="white" className="customScroll"/>
    </Provider>
  );
}