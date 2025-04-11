import Header from './components/Header'
import SideNav from './components/SideNav'
import PokeCard from './components/PokeCard'
import { useState } from 'react'

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0)
  const [showSideMenu, setShowSideMenu] = useState(false)

  function handleSideMenu() {
    setShowSideMenu(!showSideMenu)
  }
  return (
    <>
      <Header handleSideMenu={handleSideMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        handleSideMenu={handleSideMenu}
        showSideMenu={showSideMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App
