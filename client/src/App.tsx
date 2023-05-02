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
import { useRef, useEffect } from 'react';
import Footer from './Footer';
import useToFetchSongs from './hooks/useToFetchSongs';

export default function App() {
  document.title = "Ranked Records"

  const leftDivRef = useRef(null);
  const rightDivRef = useRef(null);

  useEffect(() => {
    if (leftDivRef.current && rightDivRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === leftDivRef.current) {
            rightDivRef.current.style.height = `${entry.contentRect.height}px`;
          }
        }
      });

      resizeObserver.observe(leftDivRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);
  
  return (
    <Provider store={store}>
      <div id="app">
        <LoginModal/>
        <div id="leftBox" ref={leftDivRef}>
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
        <div id="rightBox" ref={rightDivRef}>
          <SongTable/>
        </div>
      </div>
    </Provider>
  );
}