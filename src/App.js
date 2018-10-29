import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Typeahead from './Typeahead';

export default function App() {
  const [selectedSearchItem, setSearchItemSelected] = useState({});

  return <div className="App">
    <Typeahead onSearchItemSelected={setSearchItemSelected}/>
    You selected: 
    {
      selectedSearchItem.login
    }
  </div>
}

