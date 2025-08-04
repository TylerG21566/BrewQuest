import './StartButton.css';

import { MouseEventHandler } from 'react';

interface BackButtonProps {
  onClick?: MouseEventHandler;
  className?: string;
}

const StartButton = ({ onClick, className }: BackButtonProps) => {
  return (
    <div
      className={'d-inline-flex align-items-start ' + className}
      onClick={onClick}
    >
     
      <div className='p-2 flex-fill'>
        <h5>Start</h5>
      </div>
    </div>
  );
};
export default StartButton;
