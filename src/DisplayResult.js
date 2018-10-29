import React from 'react';

// I just wanted to export this to lazy load it in App.js
export default function DisplayResult({result}) {
  return <div>
    You selected: 
    {
      result.login
    }
  </div>
};
