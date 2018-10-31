import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { delay } from './utils';

const ACCESS_TOKEN = "";
const GITHUB_SEARCH_API = `https://api.github.com/search/users?access_token=${ACCESS_TOKEN}&q=`;
const SEARCH_LIMIT = 10;

const delayOnSearch = delay(200);

function TypeaheadResultItem({index, item, onSearchItemSelected, setHoveredId, hoveredId}) {
  return  <div 
    onClick={() => onSearchItemSelected(item)}
    onMouseEnter={() => setHoveredId(index)}
    onMouseLeave={() => setHoveredId(-1)}
    style={{ backgroundColor: (hoveredId === index) ? 'red' : 'transparent' }}
  >
    {item.login}
  </div>
}



function TypeaheadInput({onSearchChange}) {
  const [searchText, setSearchText] = useState(""); 

  function _onSearchChange({target: {value}}) {
    setSearchText(value);
    delayOnSearch(onSearchChange, value);
  }

  return <input 
          label="Search github user"
          value={searchText}
          onChange={_onSearchChange}
        />
}



export default function Typeahead({onSearchItemSelected}) {
  const [searchResult, setSearchResult] = useState([]);
  const [hoveredId, setHoveredId] = useState(-1);
  let searchIsCancelled = false;

  // Listen for keycode events to change hovered item in search list
  useEffect(() => {
    const handler = (e) => {
      if(e.keyCode === 38 && hoveredId > 0) setHoveredId(hoveredId - 1)
      else if(e.keyCode === 40 && hoveredId < (SEARCH_LIMIT - 1)) setHoveredId(hoveredId + 1)
      else if(e.keyCode === 13 && hoveredId !== -1) onSearchItemSelected(searchResult[hoveredId])
    }

    window.addEventListener('keydown', handler) 

    return () => {
      window.removeEventListener('keydown', handler)
    }
  })

  async function onSearchChange(searchTerm) {
    // When the user types in the search bar, don't hover anything
    setHoveredId(-1)

    // If user deletes search, don't ask the server.
    // there can be a race condition between this sync setSearchResult and a response we can get back from server in try catch block
    // to prevent this, we set a searchIsCancelled flag
    if(!searchTerm) {
      searchIsCancelled = true;
      setSearchResult([]);
      return;
    }
    try {
      searchIsCancelled = false;
      const { data: {items = []} = {}} = await axios.get(`${GITHUB_SEARCH_API}${searchTerm}`);
      if(!searchIsCancelled)
        setSearchResult(items);
    } catch(e) {
      setSearchResult([]);
    }
  } 

  return <div>
    <TypeaheadInput 
      onSearchChange={onSearchChange}
      onSearchItemSelected={onSearchItemSelected}
    />
    {
    searchResult
    .slice(0, SEARCH_LIMIT)
    .map((resultItem, index) => 
    <TypeaheadResultItem
      key={resultItem.id}
      index={index}
      item={resultItem}
      onSearchItemSelected={onSearchItemSelected} 
      setHoveredId={setHoveredId}
      hoveredId={hoveredId}
    />)
    }
  </div>
}
