import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material'
import ShaderBackground from './backgroundShaders'
import UrlShortener from './urlShortener'
import { AnimatedNavFramer } from './components/Navbar'
import KineticGrid from './components/Kinetic_Grid'
import AboutPage from './components/About';
import ContactPage from './components/Contact';
import HomePage from './components/Home';


function App() {
  const [count, setCount] = useState(0)

  return (
    <KineticGrid>
      <AnimatedNavFramer />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/url-shortener" element={<UrlShortener />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </KineticGrid>
  )
}

export default App

