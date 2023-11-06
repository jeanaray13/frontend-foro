import './App.css';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Welcome from './Views/Welcome';
import Forum from './Views/Forum';

function App() {
  return (
    <div className="App">
      {/*Establecimiento de rutas*/}
      <BrowserRouter>
        <Routes>
          <Route path='' element={<Welcome />} />
          <Route path='/foro' element={<Forum />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
