import './styles/SearchBar.css';

import { Dropdown } from 'semantic-ui-react';

function customSearch(options, query) {
	if(query === "") return [];
	return options;
}

export default function SearchBar() {
	return <Dropdown fluid selection deburr closeOnChange
                    selectOnBlur={false}
                    search={customSearch}
                    // options={artistResults} 
                    placeholder={"Search for an artist..."}
                    // onChange={(e, data) => handleChange(e, data)}
                    // onSearchChange={(e, data) => handleSearchChange(e, data)}
                    // onClose={(e, data) => handleClose(e, data)}
                    id={"searchDropdown"}
                    // disabled={disableEntering}
                    // selectOnNavigation={false}
                    // searchQuery={searchValue}
                    // value={defaultDropVal}
                    label={"search-artists"}
	/>;
}