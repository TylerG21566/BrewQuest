/*
interface props{
    submittedAnswer: { id: number, player_id: number, question_index: number, round_index: number, contents: string },
    handleDelete: (element:any) => void,
    roundNum: number,
    questionNum: number
}*/
//{submittedAnswer, handleDelete, roundNum, questionNum}:props
import axios from 'axios';
import { useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

interface SubmittedAnswer {
  id: number;
  player_id: number;
  question_index: number;
  round_index: number;
  contents: string;
}

interface props {
  submittedAnswer: SubmittedAnswer;
  handleDelete: (element: SubmittedAnswer) => void;
  roundNum: number;
  questionNum: number;
  client: W3CWebSocket;
  livequizhttp: string;
  room: string;
}

const SubmittedAnswer = ({
  submittedAnswer,
  handleDelete,
  roundNum,
  questionNum,
  client,
  livequizhttp,
  room,
}: props) => {
  const markWrong = () => {
    const payload = {
      pin: room,
      questionToMark_id: submittedAnswer.id,
    };
    axios
      .post(livequizhttp + 'markQuestionWrong/', payload)
      .then((response) => {
        console.log(response.data);
      })
      .then(() => {
        client.send(
          JSON.stringify({
            type: 'HostMarksAnswer',
            data: { room_id: room },
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markRight = () => {
    const payload = {
      pin: room,
      questionToMark_id: submittedAnswer.id,
      player: submittedAnswer.player_id,
    };
    axios
      .post(livequizhttp + 'markQuestionRight/', payload)
      .then((response) => {
        console.log(response.data);
      })
      .then(() => {
        client.send(
          JSON.stringify({
            type: 'HostMarksAnswer',
            data: { room_id: room },
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let answerElement: HTMLElement | null;
  let backgroundColor = '';
  let startX = 0,
    offsetX = 0,
    isDragging = false,
    animationID = 0;
  const tolerance = 35;

  // html element animation
  const animation = () => {
    if (answerElement) {
      if (isDragging) {
        answerElement.style.transform = `translateX(${offsetX}px)`;
        // recursive function, request only when dragging
        requestAnimationFrame(animation);
      } else {
        // reset to 0 when animation frame is requested one last time
        answerElement.style.transform = `translateX(0px)`;
      }
    }
  };

  const getPositionX = (e: any) => {
    if (e.type.includes('mouse')) {
      return e.pageX;
    } else {
      return e.touches[0].clientX;
    }
  };

  const handleTouchStart = (e: any) => {
    // prevent default browser scroll and refresh behavior
    e.preventDefault();

    startX = getPositionX(e);
    offsetX = 0;
    isDragging = true;

    // call function for first time
    animationID = requestAnimationFrame(animation);
  };

  const handleTouchMove = (e: any) => {
    //update endX for final offset
    if (answerElement) {
      if (isDragging) {
        offsetX = getPositionX(e) - startX;
        if (offsetX > 0 && offsetX > tolerance) {
          answerElement.style.backgroundColor = '#49ab2e';
        } else if (offsetX < 0 && -offsetX > tolerance) {
          answerElement.style.backgroundColor = '#bb1818';
        } else {
          if (answerElement.style.backgroundColor) {
            answerElement.style.backgroundColor = backgroundColor;
          }
        }
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging = false;

    //detect swipe direction
    if (offsetX > 0 && offsetX > tolerance) {
      console.log('swipe right, right answer');
      markRight();
    } else if (offsetX < 0 && -offsetX > tolerance) {
      console.log('swipe left, wrong answer');
      markWrong();
    }

    // remove element from list
    if (
      (offsetX > 0 && offsetX > tolerance) ||
      (offsetX < 0 && -offsetX > tolerance)
    ) {
      //delete answer element from list using function prop
      handleDelete(submittedAnswer);
    }

    // cancel animation (after this animation will rerun one last time)
    cancelAnimationFrame(animationID);
  };

  // add event listeners after DOM first loads
  // runs twice
  useEffect(() => {
    answerElement = document.getElementById(
      `sd-${roundNum}-${questionNum}-${submittedAnswer.id}`
    );
    backgroundColor = (answerElement?.style.backgroundColor || '') as string;

    answerElement?.addEventListener('touchstart', handleTouchStart);
    answerElement?.addEventListener('touchmove', handleTouchMove);
    answerElement?.addEventListener('touchend', handleTouchEnd);
    answerElement?.addEventListener('mousedown', handleTouchStart);
    answerElement?.addEventListener('mousemove', handleTouchMove);
    answerElement?.addEventListener('mouseup', handleTouchEnd);
    answerElement?.addEventListener('mouseleave', handleTouchEnd);
  }, []);
  const returnedComponent = () => {
    const comp =
      Number(roundNum) === Number(submittedAnswer.round_index) &&
      Number(questionNum) === Number(submittedAnswer.question_index);
    if (comp) {
      return (
        <div
          className='submitted-answer'
          id={`sd-${roundNum}-${questionNum}-${submittedAnswer.id}`}
        >
          {submittedAnswer.contents}
        </div>
      );
    } else {
      return null;
    }
  };
  return <>{returnedComponent()}</>;
};

export default SubmittedAnswer;
