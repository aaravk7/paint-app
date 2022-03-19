import React from 'react'
import Login from './components/Login'
import { Routes, Route } from "react-router-dom";
import Paint from './components/Paint';
import Paintings from './components/Paintings';
import { CanvasProvider } from './context/CanvasContext';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Paintings />} />
        <Route path="/paint"
          element={
            <CanvasProvider>
              <Paint />
            </CanvasProvider>
          } />
      </Routes>
    </>
  )
}

export default App