import { MouseEventHandler } from 'react';

interface BackButtonProps {
  onClick?: MouseEventHandler;
  className?: string;
  gameOver: boolean;
  disabled: boolean;
}

const NextRoundButton = ({
  onClick,
  className,
  gameOver,
  disabled,
}: BackButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={
        'd-inline-flex align-items-start mr-3 float-end text-light .btn-primary-outline ' +
        className
      }
      onClick={onClick}
    >
      {gameOver ? 'End Quiz' : 'Start Next Round'}
    </button>
  );
};
export default NextRoundButton;
