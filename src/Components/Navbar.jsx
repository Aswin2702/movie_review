/* eslint-disable react/prop-types */

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🎬</span>
      <h1>Flicks</h1>
    </div>
  );
}

export default Navbar;
