function Navbar() {

    
  return (
    <>
      <div class="navbar bg-base-100 shadow-sm">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost text-xl">
            O'Kanban
          </a>
        </div>
        <div class="flex-none">
          <ul class="menu menu-horizontal px-1">
            <li>
              <button>Inscription</button>
            </li>
            <li>
              <button>Connexion</button>
            </li>

            <li>
              Hello!
              <button>Déconnexion</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
