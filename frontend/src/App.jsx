// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import Button from '@mui/material/Button';
// import { TextField } from '@mui/material'
// import ShaderBackground from './backgroundShaders'
// import UrlShortener from './urlShortener'
// import { AnimatedNavFramer } from './components/Navbar'
// import KineticGrid from './components/Kinetic_Grid'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <KineticGrid>
//       <AnimatedNavFramer/>
//       <UrlShortener/>
//       </KineticGrid>
//     </>
//   )
// }

// export default App

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


function App() {
  const [count, setCount] = useState(0)

  return (
    <KineticGrid>
      {/* The navbar stays fixed globally at the top of the grid */}
      <AnimatedNavFramer />

      {/* Routes dynamically render the matching component based on the URL */}
      <Routes>
        {/* Main Home Route with your URL Shortener tool */}
        <Route path="/" element={<UrlShortener />} />

        {/* Other Page Routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </KineticGrid>
  )
}

export default App

