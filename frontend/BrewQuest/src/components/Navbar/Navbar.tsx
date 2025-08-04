import { useState, useEffect } from 'react';
const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <div>
      <nav className='navbar navbar-expand-lg bg-body-primary'>
        <div className='container-fluid'>
          <a className='navbar-brand text' href='/host/QuizList'>
            BrewQuest
          </a>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon icon'></span>
          </button>

          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <a className='nav-link text' href='/editprofile'>
                  Edit Profile
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className='nav-link text'
                  aria-current='page'
                  href='/host/logout'
                >
                  Logout
                </a>
              </li>
            </ul>
            {/* This can be re-implemented at a later date */}
            {/* <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form> */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
