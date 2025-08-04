import './Dialog.css';
import { MouseEvent } from 'react';
interface Props {
  show: boolean;
  title: string;
  description: string;
  confirm: (e: MouseEvent<HTMLElement>) => void;
  cancel: () => void;
}

export default function Dialog({
  show,
  title,
  description,
  confirm,
  cancel,
}: Props) {
  if (!show) {
    return <></>;
  }
  return (
    <div className='dialog'>
      <div className='dialog__content'>
        <h2 className='dialog__title'>{title}</h2>
        <p className='dialog__description'>{description}</p>
      </div>
      <hr />
      <div className='dialog__footer'>
        <button onClick={cancel} className='dialog__cancel'>
          Cancel
        </button>
        <button onClick={confirm} className='dialog__confirm'>
          Delete
        </button>
      </div>
    </div>
  );
}
