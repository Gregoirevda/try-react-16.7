import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { delay } from './utils';

const ACCESS_TOKEN = "165290768989c789c92bec860280fa00f26af836";
const GITHUB_SEARCH_API = `https://api.github.com/search/users?access_token=${ACCESS_TOKEN}&q=`;
const SEARCH_LIMIT = 10;


function SearchResultItem({index, item, onSearchItemSelected, setHoveredId, hoveredId}) {
  return  <div 
    onClick={() => onSearchItemSelected(item)}
    onMouseEnter={() => setHoveredId({index, item})}
    onMouseLeave={() => setHoveredId({})}
    style={{ backgroundColor: (hoveredId === index) ? 'red' : 'transparent' }}
  >
    {item.login}
  </div>
}


function SearchInput({onSearchChange}) {
  const [searchText, setSearchText] = useState(""); 
  const delayOnSeach = delay(1000, onSearchChange);

  function _onSearchChange(e) {
    setSearchText(e.target.value);
    e.target.value !== "" && delayOnSeach(e.target.value);
  }

  return <input 
          label="Search github user"
          value={searchText}
          onChange={_onSearchChange}
        />
}


export default function SeachBox({onSearchItemSelected}) {
  const [searchResult, setSearchResult] = useState([]);
  const [{index: hoveredId, item: hoveredItem}, setHoveredId] = useState({});
  
  useEffect(() => {
    const handler = (e) => {
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
    setHoveredId({})
    try {
      const { data: {items = []} = {}} = await axios.get(`${GITHUB_SEARCH_API}${searchTerm}`);
      console.log('items :', items)
      setSearchResult(items);
    } catch(e) {
       console.warn("error", e)
    }
    
  } 

  return <div>
    <SearchInput 
      onSearchChange={onSearchChange}
      onSearchItemSelected={onSearchItemSelected}
    />
    {
    searchResult
    .slice(0, SEARCH_LIMIT)
    .map((resultItem, index) => 
    <SearchResultItem
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
