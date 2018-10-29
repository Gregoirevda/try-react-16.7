import React, { Component, useState, lazy, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
import Typeahead from './Typeahead';
// No real need, just wanted to try
const DisplayResult = lazy(() => import('./DisplayResult'));


export default function App() {
  const [selectedSearchItem, setSearchItemSelected] = useState({});

  return <div className="App">
    <Typeahead onSearchItemSelected={setSearchItemSelected}/>
    <Suspense fallback={<div> Loading ... </div>}>
      <DisplayResult result={selectedSearchItem} />
    </Suspense>
  </div>
}

