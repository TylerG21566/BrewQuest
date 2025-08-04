import beeru from '../assets/beeru.gif';
import './LoadingScreen.css';



// import OptionButton from './OptionButton.tsx';


const LoadingScreen = () => {
    // set up items list structure
    // sample quiz array





    return (
        <div>
         
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
        
            <h1 className='text'>Marking your answers...</h1>
            <img className='beer-img' src={beeru} />
        </div>
    );
}
export default LoadingScreen;
