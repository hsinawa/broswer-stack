// src/App.js
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import LogViewer from './components/LogViewer';
import Browser from './components/broswer';

function App() {
  return (
    <BrowserRouter>
       <Routes>
       <Route path="/log" element={<LogViewer/>} />
       <Route path="/browse" element={<Browser/>} />
        
       </Routes>
     </BrowserRouter>

);
}

export default App;
