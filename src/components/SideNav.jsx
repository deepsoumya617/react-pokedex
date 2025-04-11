import { useState } from 'react'
import { first151Pokemon, getFullPokedexNumber } from '../utils'

export default function SideNav(props) {
  const { selectedPokemon, setSelectedPokemon, handleSideMenu, showSideMenu } =
    props
  // For the topmost search bar
  const [searchVal, setSearchVal] = useState('')

  const filteredPokemon = first151Pokemon
    .map((poke, idx) => ({ name: poke, originalIdx: idx })) // Store name + original index
    .filter(({ name }) => name.toLowerCase().includes(searchVal)) // Filter by search term

  return (
    <nav className={' ' + (showSideMenu ? ' open' : '')}>
      <div className={'header' + (showSideMenu ? ' open' : '')}>
        <button onClick={handleSideMenu} className="open-nav-button">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-gradient">Pokedex</h1>
      </div>
      <input
        value={searchVal}
        onChange={(e) => {
          setSearchVal(e.target.value)
        }}
        placeholder="Eg: Bulbasaur...."
      />
      {filteredPokemon.map(({ name, originalIdx }) => {
        return (
          <button
            onClick={() => {
              setSelectedPokemon(originalIdx)
              handleSideMenu()
              // console.log(originalIdx) //-> used for debugging
            }}
            className={
              'nav-card ' +
              (originalIdx == selectedPokemon ? 'nav-card-selected' : '')
            }
            key={originalIdx}
          >
            <p>{getFullPokedexNumber(originalIdx)}</p>
            <p>{name}</p>
          </button>
        )
      })}
    </nav>
  )
}
