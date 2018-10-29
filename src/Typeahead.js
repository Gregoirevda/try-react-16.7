import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { delay } from './utils';

const ACCESS_TOKEN = "165290768989c789c92bec860280fa00f26af836";
const GITHUB_SEARCH_API = `https://api.github.com/search/users?access_token=${ACCESS_TOKEN}&q=`;
const SEARCH_LIMIT = 10;

const delayOnSearch = delay(400);

function TypeaheadResultItem({index, item, onSearchItemSelected, setHoveredId, hoveredId}) {
  return  <div 
    onClick={() => onSearchItemSelected(item)}
    onMouseEnter={() => setHoveredId({index, item})}
    onMouseLeave={() => setHoveredId({})}
    style={{ backgroundColor: (hoveredId === index) ? 'red' : 'transparent' }}
  >
    {item.login}
  </div>
}


function TypeaheadInput({onSearchChange}) {
  const [searchText, setSearchText] = useState(""); 

  function _onSearchChange(e) {
    setSearchText(e.target.value);
    e.target.value !== "" && delayOnSearch(onSearchChange, e.target.value);
  }

  return <input 
          label="Search github user"
          value={searchText}
          onChange={_onSearchChange}
        />
}


export default function Typeahead({onSearchItemSelected}) {
  const [searchResult, setSearchResult] = useState([]);
  const [{index: hoveredId, item: hoveredItem}, setHoveredId] = useState({});

  // Listen for keycode events to change hovered item in search list
  useEffect(() => {
    const handler = (e) => {
      console.log('in here', searchResult, hoveredId)
      if(e.keyCode === 38 && hoveredId > 0) setHoveredId({index: hoveredId - 1, item: searchResult[hoveredId - 1]})
      else if(e.keyCode === 40 && hoveredId < (SEARCH_LIMIT - 1)) setHoveredId({index: hoveredId + 1, item: searchResult[hoveredId + 1]})
      else if(e.keyCode === 13) onSearchItemSelected(hoveredItem)
    }

    window.addEventListener('keydown', handler) 

    return () => {
      window.removeEventListener('keydown', handler)
    }
  })

  async function onSearchChange(searchTerm) {
    // When the user types in the search bar, don't hover anything
    setHoveredId({})
    try {
      const { data: {items = []} = {}} = await axios.get(`${GITHUB_SEARCH_API}${searchTerm}`);
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
