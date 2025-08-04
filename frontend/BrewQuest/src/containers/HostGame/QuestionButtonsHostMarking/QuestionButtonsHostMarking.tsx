
interface props 
    {numberOfQuestions: number, roundNum:number, setQuestionNum: (i: number) => void}



const QuestionButtonsHostMarking = 
({numberOfQuestions, roundNum, setQuestionNum}:props
) => {
    const elements = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        if (i === 0) {
            elements.push(<input
                key={'QSI'+"_" + i+"_"+roundNum}
                type='radio'
                value={i}
                className='question-selection-input'
                name='questionList'
                id={'QS'+"_" + i+"_"+roundNum}
                onClick={() => setQuestionNum(i)}
              ></input>
            );
     
      elements.push(<label
                key={'QSL'+"_" + i+"_"+roundNum}
                className='question-selection-label'
                htmlFor={'QS'+"_" + i+"_"+roundNum}
              >
                Q{i+1}
              </label>
            );
          } else {
            elements.push(<input
                key={'QSI'+"_" + i+"_"+ roundNum}
                type='radio'
                value={i}
                className='question-selection-input'
                name='questionList'
                id={'QS'+"_" + i+"_"+ roundNum}
                onClick={() => setQuestionNum(i)}
              ></input>
            );
           
            elements.push(
              <label
                key={'QSL'+"_" + i+"_"+ roundNum}
                className='question-selection-label'
                htmlFor={'QS'+"_" + i+"_"+ roundNum}
              >
                Q{i+1}
              </label>
            );
          }
    }

    return (<>
    {elements}
    </>)
}

export default QuestionButtonsHostMarking;