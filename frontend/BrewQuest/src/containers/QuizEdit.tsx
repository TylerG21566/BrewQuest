import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ip from '../info';

const QuizEdit = () => {
  const location = useLocation();
  const { state } = location;

  const quizId = state && state.quiz_id;
  const [quizName, setQuizName] = useState('Loading');
  const [quizNameChanged, setQuizNameChanged] = useState(false);

  const [rounds, setRounds] = useState<string[]>(['Loading']); // Array of round titles
  const [roundIds, setRoundIds] = useState([]); // Array of round record PKs
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0); // Index of currently selected relative to the roundIds and Rounds arrays
  const [isRoundNameChanged, setRoundNameChanged] = useState(false);

  const [questionChanged, setQuestionChanged] = useState(false);
  const [questionIds, setQuestionIds] = useState([]); // Ids of question in current round
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prompts, setPrompts] = useState(['Loading']);
  const [answers, setAnswers] = useState(['Loading']);

  useEffect(() => {
    getQuiz();
  }, []);

  useEffect(() => {
    // Runs getRound to populate questions for selected round when roundIds becomes defined
    roundIds[0] && getRound();
  }, [roundIds, selectedRoundIndex]);

  useEffect(() => {}, []);
  const getQuiz = (roundIndex: number = -1) => {
    // Gets Quiz name and round information

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/quizInfo/', { quiz_id: quizId })
      .then((response) => {
        const data = response.data;
        setQuizName(data.name);
        const roundNames = data.rounds.map(
          (round: { title: string; id: number }) => round.title
        );
        const roundIds = data.rounds.map(
          (round: { title: string; id: number }) => round.id
        );

        setRounds(roundNames);
        setRoundIds(roundIds);
        if (roundIndex != -1) {
          setSelectedRoundIndex(roundIndex);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRound = () => {
    // Gets questions from a round
    console.log('getting rounds');
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    console.log('roundIds[selectedRoundIndex]' + roundIds[selectedRoundIndex]);
    axios
      .post('http://' + ip + ':8000/api/getRoundsQuestions/', {
        number: selectedRoundIndex,
        r: roundIds,
        round_id: roundIds[selectedRoundIndex],
      })
      .then((response) => {
        const data = response.data;
        const prompts = data.map(
          (question: { prompt: string }) => question.prompt
        );
        const answers = data.map(
          (question: { answer: string }) => question.answer
        );
        const ids = data.map((question: { id: number }) => question.id);
        setPrompts(prompts);
        setAnswers(answers);
        setQuestionIds(ids);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateRoundName = () => {
    if (!isRoundNameChanged) {
      // If round name has not been edited, don't bother
      return;
    }

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/updateRoundName/', {
        round_id: roundIds[selectedRoundIndex],
        name: rounds[selectedRoundIndex],
      })
      .then(() => {
        setRoundNameChanged(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateQuizName = () => {
    if (!quizNameChanged) {
      // If round name has not been edited, don't bother
      return;
    }

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/updateQuizName/', {
        quiz_id: quizId,
        name: quizName,
      })
      .then(() => {
        setQuizNameChanged(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateQuestion = () => {
    if (!questionChanged) return;
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/updateQuestion/', {
        question_id: questionIds[questionIndex],
        prompt: prompts[questionIndex],
        answer: answers[questionIndex],
      })
      .then(() => {
        setQuestionChanged(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNameInputChange = (input: string) => {
    setQuizName(input);
    setQuizNameChanged(true);
  };

  const handleRoundNameInputChange = (input: string) => {
    setRoundNameChanged(true);
    const updatedRounds = rounds.map((round, index) => {
      if (index == selectedRoundIndex) {
        return input;
      }
      return round;
    });

    setRounds(updatedRounds);
  };

  const handleAnswerInputChange = (input: string) => {
    const a = JSON.parse(JSON.stringify(answers));
    a[questionIndex] = input;
    setAnswers(a);
    setQuestionChanged(true);
  };

  const handleQuestionInputChange = (input: string) => {
    const a = JSON.parse(JSON.stringify(prompts));
    a[questionIndex] = input;
    setPrompts(a);
    setQuestionChanged(true);
  };

  const handleNewQuestion = () => {
    // setPrompts((prevPrompts) => [...prevPrompts, '']);
    // setAnswers((prevAnswers) => [...prevAnswers, '']);
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/createQuestion/', {
        round_id: roundIds[selectedRoundIndex],
      })
      .then(getRound)
      .catch((error) => {
        console.log(error);
      });
    setQuestionIndex(prompts.length);
  };

  const handleDelQuestion = () => {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/deleteQuestion/', {
        question_id: questionIds[questionIndex],
      })
      .then(getRound)
      .catch((error) => {
        console.log(error);
      });

    if (questionIndex != 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleNewRound = () => {
    updateQuizName();
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/createRound/', {
        quiz_id: quizId,
      })
      .then((response) => {
        console.log(response);
        getQuiz(roundIds.length);
        setQuestionIndex(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelRound = () => {
    if (roundIds.length == 1) {
      alert('Each Quiz must have at least one round.');
      return;
    }
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`;
    axios
      .post('http://' + ip + ':8000/api/deleteRound/', {
        round_id: roundIds[selectedRoundIndex],
      })
      .then(() => {
        if (selectedRoundIndex == 0) {
          setSelectedRoundIndex(1);
        } else {
          setSelectedRoundIndex(selectedRoundIndex - 1);
        }
        getQuiz();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='box'>
      <div className='topBar d-flex justify-content-between align-items-center p-2'>
        <div className='input-group mb-3 roundSelect'>
          <input
            className='form-control textBlack'
            placeholder='Round name goes here...'
            value={rounds[selectedRoundIndex]}
            onChange={(e) => handleRoundNameInputChange(e.target.value)}
          />
          <button
            className='btn btn-outline-secondary dropdown-toggle'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          ></button>
          <ul className='dropdown-menu dropdown-menu-end'>
            {rounds.map((round, index) => (
              <button
                className='dropdown-item'
                key={roundIds[index]}
                id={index == selectedRoundIndex ? 'selectedButton' : ''}
                onClick={() => {
                  updateQuestion();
                  setSelectedRoundIndex(index);
                  setQuestionIndex(0);
                  updateRoundName();
                }}
              >
                {round == '' ? 'Unnamed Round' : round}
              </button>
            ))}
            <li key={'divider'}>
              <hr className='dropdown-divider'></hr>
            </li>
            <button
              className='dropdown-item'
              id='newRoundBtn'
              onClick={() => {
                updateQuestion();
                updateRoundName();
                handleNewRound();
              }}
              key={'new round'}
            >
              New
            </button>
            <button
              className='dropdown-item'
              id='delRoundBtn'
              onClick={() => {
                updateRoundName();
                handleDelRound();
              }}
              key={'delete round'}
            >
              Delete
            </button>
          </ul>
        </div>
        <div>
          <form>
            <input
              id='textInput'
              className='form-control textBlack'
              placeholder='Quiz name goes here...'
              value={quizName}
              onChange={(e) => handleNameInputChange(e.target.value)}
            />
          </form>
        </div>
        <div>
          <Link to='/host/QuizList'>
            <button
              type='button'
              className='btn p-2 submitAllButton'
              onClick={() => {
                updateQuestion();
                updateRoundName();
                updateQuizName();
              }}
            >
              <h5 className='text'>Exit</h5>
            </button>
          </Link>
        </div>
      </div>

      <div className='scrollMenuEdit p-2'>
        <button
          type='button'
          className='btn questionButton'
          id='newQuestionButton'
          key={'new button'}
          onClick={() => {
            updateQuestion();
            handleNewQuestion();
          }}
        >
          <h1 className='fw-bolder'>+</h1>
        </button>
        {prompts.map((_prompt, index) => (
          <button
            type='button'
            className='btn questionButton'
            id={index == questionIndex ? 'selectedButton' : ''}
            key={'button_' + index}
            onClick={() => {
              updateQuestion();
              setQuestionIndex(index);
            }}
          >
            <h4>Q{index + 1}</h4>
          </button>
        ))}
      </div>

      <div className='questionDiv text'>
        <div className='form mb-3'>
          <div className='d-flex justify-content-between p-2'>
            <label htmlFor='questionInput' className='h3'>
              Question
            </label>
            <button
              type='button'
              className='btn btn-custom delBtn'
              onClick={() => {
                updateQuestion();
                handleDelQuestion();
              }}
              disabled={prompts.length === 1}
            >
              <h6 className='text'>Delete</h6>
            </button>
          </div>
          <input
            id='questionInput'
            className='form-control questionEditText'
            value={prompts[questionIndex]}
            placeholder='Question goes here...'
            onChange={(e) => handleQuestionInputChange(e.target.value)}
          />
        </div>

        <div>
          <form>
            <input
              id='textInput'
              className='form-control'
              placeholder='Answer goes here...'
              value={answers[questionIndex]}
              onChange={(e) => handleAnswerInputChange(e.target.value)}
            />
          </form>
        </div>
        <div></div>
      </div>

      <div className='d-flex justify-content-between navigationButtons'>
        <div className='p-2'>
          <button
            type='button'
            className='btn btn-lg'
            onClick={() => {
              if (questionIndex != 0) {
                updateQuestion();
                setQuestionIndex(questionIndex - 1);
              }
            }}
          >
            <h3>&lt; Back</h3>
          </button>
        </div>
        <div className='p-2'>
          <button
            type='button'
            className='btn btn-lg'
            onClick={() => {
              if (questionIndex != prompts.length - 1) {
                setQuestionIndex(questionIndex + 1);
                updateQuestion();
              }
            }}
          >
            <h3>Next &gt;</h3>
          </button>
        </div>
      </div>
    </div>
  );
};
export default QuizEdit;
