import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProductView from './pages/ProductView'
import Header from './components/Header'

function App() {

  return (
    <>
<Header/>
<Routes>
        <Route path="/" element={<Home />} />
         {/* <Route path="/productview" element={<ProductView />} />  */}

      
      </Routes>
     
    </>
  )
}

export default App
