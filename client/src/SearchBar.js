import './styles/SearchBar.css';

import { Dropdown } from 'semantic-ui-react';
import { spotifyApi } from './constants';
import { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { addtoEnd } from './features/artistlist';

export default function SearchBar() {
    const errorStr = `Please try refreshing the page - your session may have timed out. If the problem persists, please contact the developer.`;

    const [disableEntering, setDisableEntering] = useState(false);
    const [defaultDropVal, setDefaultDropVal] = useState(undefined);
    const [searchValue, setSearchValue] = useState("");

    const [artistResults, setArtistResults] = useState([]);

    const artistDispatch = useDispatch();

    function handleChange(e, data) {
        resetFields();
        // setDisableEntering(true);

        let selectedArtist = data.options.filter(x => x.value === data.value);

        console.log({selectedArtist});
        artistDispatch(addtoEnd(selectedArtist));
        
        setDefaultDropVal(undefined);
    }
    
    function handleSearchChange(e, data) {
        setSearchValue(e.target.value);
    }
    
    function handleClose(e, data) {
        setSearchValue(undefined);
    }
    
    function resetFields() {
        // setArtistResults([]);
    }
    
    function customSearch(options, query) {
        if(query === "") return [];
        return options;
    }

    useEffect(() => {
        if(disableEntering) return;
        if(!searchValue || searchValue === "") return;

        spotifyApi.searchArtists(searchValue, {limit: 5}).then(res => {            
            if(res === [] || !res.body) return;

            let filteringArtists = [];
            
            res.body.artists.items.forEach((item) => {
                let currentArtist = (({name, id}) => ({name, id}))(item);
                    
                const { name: key, name: text, id: value, ...rest } = currentArtist;
                const new_obj = { key, text, value, ...rest }

                new_obj.image = {};
                new_obj.image.src = item.images[0] === undefined ? "" : item.images[0].url;

                new_obj.key = new_obj.key + item.id;

                filteringArtists.push(new_obj);
            });
            
            setArtistResults(filteringArtists);
        }).catch((err) => {
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