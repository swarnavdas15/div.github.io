import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Events from './components/Events'
import PhotoWall from './components/Photowall'
import Projects from './components/Projects'
import Contacts from './components/Contacts'
import Footer from './components/Footer'

function App() {

  return (
    <>
      <Navbar/>
      <Hero/>
      <About/>
      <Events/>
      <PhotoWall/>
      <Projects/>
      <Contacts/>
      <Footer/>
    </>
  )
}

export default App
