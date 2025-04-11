import { useEffect, useState } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from './Modal'

export default function PokeCard(props) {
  const { selectedPokemon } = props

  // Actual pokemon data
  const [data, setData] = useState(null)

  // If already in cache(loading = false), we dont have to load the pokemon data from api otherwise
  // fetch from api(loading = true)
  const [loading, setLoading] = useState(false)

  // for the modal
  const [skill, setSkill] = useState(null)
  const [loadingSkill, setLoadingSKill] = useState(false)

  const { name, stats, types, moves, sprites } =
    data || {}

  /*
  1.Make a array of all the keys inside sprites object
  2.Filter the keys - if NULL / versions and other
    const sprites = { 
      front_default: "...",
      back_default: null, -> remove
      versions: {...}, -> remove
      other: {....} -> remove
    }
  */
  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false
    if (['versions', 'other'].includes(val)) return false
    return true
  })

  // fetch move data
  async function fetchMoveData(move, moveUrl) {
    // edge cases
    if (loadingSkill || !localStorage || !move) return

    // define cache
    let cache = {}
    if (localStorage.getItem('pokemon-moves'))
      cache = JSON.parse(localStorage.getItem('pokemon-moves'))

    // find in cache
    if (move in cache) {
      setSkill(cache[move])
      return
    }

    // not in cache, so fetch
    try {
      setLoadingSKill(true)
      const res = await fetch(moveUrl)
      const moveData = await res.json()
      const description = moveData?.flavor_text_entries.filter((val) => {
        return val.version_group.name == 'firered-leafgreen'
      })[0]?.flavor_text
      const skillData = {
        name: move,
        description,
      }
      setSkill(skillData)
      cache[move] = skillData
      localStorage.setItem('pokemon-moves', JSON.stringify(cache))
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingSKill(false)
    }
  }

  useEffect(() => {
    // Exit cases
    if (loading || !localStorage) return

    // Define cache
    let cache = {}
    if (localStorage.getItem('pokedex'))
      cache = JSON.parse(localStorage.getItem('pokedex'))

    // Check if selectedPokemon is in the cache, otherwise fetch from api
    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon])
      return
    }

    // Fetch data from api
    async function fetchPokemonData() {
      setLoading(true)
      try {
        const baseUrl = 'https://pokeapi.co/api/v2/'
        // giving pokemon index to fetch data
        const suffix = `pokemon/${getPokedexNumber(selectedPokemon)}`

        // giving pokemon name to fetch data
        // const suffix = `pokemon/${selectedPokemon}`
        const finalUrl = baseUrl + suffix
        const res = await fetch(finalUrl) // we get a json here, not the actual pokemon data
        const pokemonData = await res.json() // gets the pokemon data as an actual js object from res.body
        setData(pokemonData)

        //...Store in cache
        cache[selectedPokemon] = pokemonData
        localStorage.setItem('pokedex', JSON.stringify(cache))
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
    // invoke the function
    fetchPokemonData()
  }, [selectedPokemon])

  if (loading) {
    return (
      <div className="text-gradient">
        <h4 style={{ margin: 30 }}>Loading Pokemon Data....</h4>
      </div>
    )
  }

  return (
    <div className="poke-card">
      {/* Conditional Rendering */}
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null)
          }}
        >
          <div>
            <h6>{skill.name.replaceAll('-', ' ')}</h6>
            <h2></h2>
          </div>
          <div>
            <h6>Descriptiom</h6>
            <p>{skill?.description || 'No description available!'}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types?.map((typeObj, typeIdx) => {
          return <TypeCard key={typeIdx} type={typeObj?.type?.name} />
        })}
      </div>
      <img
        src={`/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
      />
      <div className="img-container">
        {imgList?.map((spriteUrl, spriteIdx) => {
          const imageUrl = sprites[spriteUrl]
          return <img key={spriteIdx} src={imageUrl} />
        })}
      </div>
      <h3 className="text-gradient">Stats</h3>
      <div className="stats-card">
        {stats?.map((statObj, statIdx) => {
          const { stat, base_stat } = statObj
          return (
            <div key={statIdx} className="stat-item">
              <p>{stat?.name.replaceAll('-', ' ')}</p>
              <h4>{base_stat}</h4>
            </div>
          )
        })}
      </div>
      <h3 className="text-gradient">Moves</h3>
      <div className="pokemon-move-grid">
        {moves
          ?.slice() // avoid modifying the original array
          .sort((a, b) => a.move.name.localeCompare(b.move.name)) // sort alphabetically
          .map((moveObj, moveIdx) => {
            return (
              <button
                className="button-card pokemon-move"
                key={moveIdx}
                onClick={() => {
                  fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                }}
              >
                <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
              </button>
            )
          })}
      </div>
    </div>
  )
}
