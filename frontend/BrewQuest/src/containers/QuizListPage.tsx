import Navbar from '../components/Navbar/Navbar.tsx';
import QuizList from '../components/QuizList/QuizList.tsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const QuizListPage = () => {
  // This file provides the page where a host can see a list of all their quizzes

  const [quizToHost, setQuizToHost] = useState({ title: 'Loading', id: -1 });
  const [isDisabled, setIsDisabled] = useState(true);
  return (
    <div>
      <>
        <Navbar></Navbar>
        <div>
          <QuizList
            onQuizSelected={(quiz: { title: string; id: number }) => {
              setQuizToHost(quiz);
              setIsDisabled(false);
            }}
          ></QuizList>
          <div>
            {isDisabled ? (
              <button
                type='button'
                className='btn btn-secondary host-quiz'
                disabled={isDisabled}
              >
                Host Quiz
              </button>
            ) : (
              <Link
                className='host-quiz btn btn-secondary'
                to={'/host/game'}
                style={{ textDecoration: 'none' }}
                state={{
                  title: quizToHost.title,
                  id: quizToHost.id,
                  room:
                    quizToHost.title.replace(/ /g, '_') +
                    '_' +
                    quizToHost.id.toString(),
                }}
              >
                Host Quiz
              </Link>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default QuizListPage;
