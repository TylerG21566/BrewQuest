import back_arrow_image from '../../assets/back_arrow.svg';
import { MouseEventHandler } from 'react';

interface BackButtonProps {
  onClick?: MouseEventHandler;
  className?: string;
}

const BackButton = ({ onClick, className }: BackButtonProps) => {
  return (
    <div
      className={'d-inline-flex align-items-start ' + className}
      onClick={onClick}
    >
      <div className='p-2 flex-fill'>
        <img src={back_arrow_image} className='back_icon' />
      </div>
      <div className='p-2 flex-fill'>
        <h5>Back</h5>
      </div>
    </div>
  );
};
export default BackButton;
