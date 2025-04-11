export default function Header(props) {
  const { handleSideMenu } = props
  return (
    <header>
      <button onClick={handleSideMenu} className="open-nav-button">
        <i class="fa-solid fa-bars"></i>
      </button>
      <h1 className="text-gradient">Pokedex</h1>
    </header>
  )
}
