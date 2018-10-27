import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBox from './SearchBox';

export default function App() {
  const [selectedSearchItem, setSearchItemSelected] = useState({});

  return <div className="App">
    <SearchBox onSearchItemSelected={setSearchItemSelected}/>
    You selected: 
    {
      selectedSearchItem.login
    }
  </div>
}

