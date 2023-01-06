import './styles/SearchBar.css';

import { Dropdown } from 'semantic-ui-react';
import { spotifyApi } from './constants';
import { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { addtoEnd } from './features/artistList';

export default function SearchBar() {
    const errorStr = `Please try refreshing the page - your session may have timed out. If the problem persists, please contact the developer.`;

    const [disableEntering, setDisableEntering] = useState(false);
    const [defaultDropVal, setDefaultDropVal] = useState(undefined);
    const [searchValue, setSearchValue] = useState("");

    const [artistResults, setArtistResults] = useState([]);

    const artistDispatch = useDispatch();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, data :any) {
        resetFields();

        let selectedArtist = data.options.filter((x : ArtistObj) => x.value === data.value);

        artistDispatch(addtoEnd(selectedArtist));
        
        setDefaultDropVal(undefined);
    }
    
    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(e.target.value);
    }
    
    function handleClose() {
        setSearchValue(undefined);
    }
    
    function resetFields() {
        setArtistResults([]);
        setSearchValue(undefined);
        setDefaultDropVal(undefined);
    }
    
    function customSearch(options:any, query:string) {
        if(query === "") return [];
        return options;
    }

    useEffect(() => {
        if(disableEntering) return;
        if(!searchValue || searchValue === "") return;

        spotifyApi.searchArtists(searchValue, {limit: 5}).then((res:SpotifyResponse) => {            
            if(!res.body) return;

            let filteringArtists = [];
            
            res.body.artists.items.forEach((item : SpotifyArtistObj) => {
                let currentArtist = (({name, id}) => ({name, id}))(item);

                const new_obj : ArtistObj = { 
                                image: {src: item.images[0] === undefined ? "" : item.images[0].url},
                                text: currentArtist.name, 
                                key: currentArtist.id + currentArtist.name,
                                value: currentArtist.id
                }

                filteringArtists.push(new_obj);
            });
            
            setArtistResults(filteringArtists);
        }).catch((err: ErrorMessage) => {
            console.log({err})
            alert(errorStr)
        })

    }, [disableEntering, searchValue]);


	return <Dropdown fluid selection deburr closeOnChange
                    selectOnBlur={false}
                    search={customSearch}
                    options={artistResults} 
                    placeholder={"Search for an artist..."}
                    onChange={handleChange}
                    onSearchChange={handleSearchChange}
                    onClose={handleClose}
                    id={"searchDropdown"}
                    disabled={disableEntering}
                    selectOnNavigation={false}
                    searchQuery={searchValue}
                    value={defaultDropVal}
                    label={"search-artists"}
	/>;
}