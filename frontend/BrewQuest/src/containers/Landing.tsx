//this is the landing page
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='landing-container '>
      <div id="particle-container">
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
	<div className="particle"></div>
</div>
      <Link to='/gamepin' className='btn btn-primary join-btn line-body'>
        Join Game
      </Link>
      <Link to='/host/login' className='btn btn-primary host-btn'>
        Host Game
      </Link>
    </div>

    
  );
};

export default Landing;
