import axios from 'axios';
import ip from '../../info';
import { useState, useEffect } from 'react';
import OptionButton from '../OptionButton/OptionButton';

const QuizList = ({
  onQuizSelected,
}: {
  onQuizSelected: (quiz: { title: string; id: number }) => void;
}) => {
  // set up items list structure
  // sample quiz array

  const [quizzes, setQuizzes] = useState([{ title: 'Loading', id: -1 }]);

  //set selected item structure

  const loadQuizzes = () => {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .get('http://' + ip + ':8000/api/quizzes/', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setQuizzes(response.data.quizzes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createQuiz = () => {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/createQuiz/')
      .then(loadQuizzes)
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadQuizzes();
  }, []);

  // toggle option dropdown content based on which button is clicked
  const toggleOptionDropdown = (e : any) => {
    console.log("button pressed");
    for (let i=0; i< quizzes.length; i++) {
      // reset to toggle all off except target
      if (document.getElementById("shown-options-"+quizzes[i].id)?.classList.contains("show-flex-menu") && !e.target.matches("#option-button-"+quizzes[i].id) && !e.target.matches("#option-icon-"+quizzes[i].id)){
        document.getElementById("shown-options-"+quizzes[i].id)?.classList.remove("show-flex-menu");
      }
      //toggle only the target
      if (e.target.matches("#option-button-"+quizzes[i].id) || e.target.matches("#option-icon-"+quizzes[i].id)){
        console.log("button detected");
        document.getElementById("shown-options-"+quizzes[i].id)?.classList.toggle("show-flex-menu");
      }
    }
  }

  // toggle off all dropdown content when empty space clicked
  window.onclick = (e : any) => {
    if (!e.target.matches(".option-button") && !e.target.matches(".option-icon")){
      for (let i=0; i< quizzes.length; i++) {
        if (document.getElementById("shown-options-"+quizzes[i].id)?.classList.contains("show-flex-menu")){
          document.getElementById("shown-options-"+quizzes[i].id)?.classList.remove("show-flex-menu");
        }
      }
    }
  }

  const quizElements =
    quizzes &&
    quizzes.map((quizItem) => [
      <input
        key={'quiz_' + quizItem.id + '_input'}
        type='radio'
        className='btn-check quiz-item-input'
        name='quizList'
        id={quizItem.id.toString()}
        // called when item is selected and selected item has changed
        onChange={() => {
          onQuizSelected(quizItem);
        }}
      ></input>,

      <label
        key={'quiz_' + quizItem.id + '_label'}
        className='btn quiz-item-selection'
        htmlFor={quizItem.id.toString()}
      >
        <div key={'quiz_' + quizItem.id + '_title'} className='quiz-item-title'>
          {quizItem.title}
        </div>
        <OptionButton
          key={'quiz_' + quizItem.id + '_optionButton'}
          quizId={quizItem.id}
          reloadFunction={loadQuizzes}
          toggleOptionDropdown={toggleOptionDropdown}
        ></OptionButton>
      </label>,
    ]);

  return (
    <div className='boxContainer'>
      <div className='btn-group-vertical quiz-button-group' role='group'>
        <label className='btn quiz-list-head'>Quizzes</label>
        {quizElements}
      </div>

      <button
        type='button'
        onClick={createQuiz}
        className='btn fs-1 newQuizButton'
      >+</button>
    </div>
  );
};

export default QuizList;
