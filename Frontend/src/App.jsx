import { useState } from 'react'
import Navbar from './components/Navbar/navbar'
import Hero from './components/Hero/hero'
import Movies from './components/Movies/movies'
import Footer from './components/Footer/footer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Hero />
      <Movies />
      <Footer />
    </>
  )
}

export default App
