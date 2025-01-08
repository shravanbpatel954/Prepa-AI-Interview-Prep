import React, { useState, useEffect } from 'react';
import './QuestionBank.css';

const QuestionBank = ({ onClose, onSaveQuestions, initialSelectedQuestions }) => {
  const questionsList = [
    'Tell me about yourself.',
    'Why should we hire you?',
    'Why do you want to leave your current role?',
    'Tell me about a time you showed leadership.',
    'Tell me about a time you were successful on a team.',
    'Describe your most challenging project.',
    'Describe an accomplishment that you are proud of.',
    'Describe a time you had to manage conflicting priorities.',
    'Describe your leadership style.',
    'Describe a time you made a mistake.',
    'Describe a time you had to persuade someone.',
    'Describe a time you surpassed people\'s expectations.',
    'Can you share an experience where you successfully managed a high-pressure situation?',
    'Describe a time you had to learn something quickly.',
    'Describe a time you brought a new idea to work and what the outcome was.',
    'Give me an example of a time when you had to think on your feet.',
    'Talk about a time an unexpected problem derailed your planning. How did you recover?',
    'Talk about a time when you had to have a difficult conversation with a frustrated client or colleague. How did you handle the situation?',
    'Talk about a time you set a goal for yourself. How did you go about ensuring that you would meet your objective?',
    'Give me an example of a time you managed numerous responsibilities. How did you handle that?',
    'Tell me about a time when you had to make a decision between what was right and what was easy.',
    'Give me an example of when you stepped outside of your comfort zone. What did you learn from that experience?',
    'Talk about a major obstacle that you had to overcome.',
    'What is your biggest strength?',
    'Tell me about a time you solicited feedback from those around you and applied it to your performance.',
    'Give me an example of when you changed your mind on a topic after receiving new or additional information.',
    'How do you stay updated and adapt to the evolving trends and technologies in your field?',
    'Can you describe a recent project where you collaborated with a diverse team? What was the outcome?',
    'Share an example of a creative solution you devised to solve a complex problem in your previous role.',
    'How do you handle conflicts or disagreements within a team, and can you provide an example?',
    'What steps do you take to ensure the quality of your work and minimize errors or mistakes?',
    'Describe a situation where you had to prioritize tasks and manage your time effectively to meet a tight deadline.',
    'How do you stay motivated and keep your team motivated during challenging projects or periods?',
    'How do you handle feedback and constructive criticism from colleagues or supervisors?',
    'In what aspects do you see opportunities for personal and professional growth?',
    'Can you discuss a recent industry trend or development that has caught your attention, and how it might impact your work in the future?',
    'What would your co-workers say about you?',
    'Where do you see yourself in 5 years?',
    'What do you like to do outside of work?',
    'How long would you expect to work with us if hired?',
    'Tell me about a time you had to use emotional intelligence to lead.'
  ];

  const [customQuestion, setCustomQuestion] = useState('');
  const [myQuestions, setMyQuestions] = useState([]);

  useEffect(() => {
    setMyQuestions(initialSelectedQuestions);
  }, [initialSelectedQuestions]);

  const handleCustomQuestionChange = (e) => setCustomQuestion(e.target.value);

  const addCustomQuestion = () => {
    if (customQuestion.trim() && myQuestions.length < 5) {
      setMyQuestions((prevQuestions) => [...prevQuestions, customQuestion]);
      setCustomQuestion('');
    }
  };

  const selectQuestion = (question) => {
    if (myQuestions.length < 5 && !myQuestions.includes(question)) {
      setMyQuestions((prevQuestions) => [...prevQuestions, question]);
    }
  };

  const removeQuestion = (index) => {
    setMyQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index));
  };

  const clearMyQuestions = () => setMyQuestions([]);

  const saveQuestions = () => {
    if (typeof onSaveQuestions === 'function') {
      onSaveQuestions(myQuestions);
    } else {
      console.error('onSaveQuestions is not a function');
    }
  };

  return (
    <div className="question-bank-overlay">
      <div className="question-bank-container">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Question Bank</h2>
        <div className="question-bank-content">
          <div className="question-list">
            <input
              type="text"
              placeholder="Add custom question"
              value={customQuestion}
              onChange={handleCustomQuestionChange}
              className="custom-question-input"
            />
            <button onClick={addCustomQuestion} disabled={myQuestions.length >= 5}>
              Add
            </button>
            <ul>
              {questionsList.map((question, index) => (
                <li key={index}>
                  <button
                    className={`question-item ${myQuestions.includes(question) ? 'selected' : ''}`}
                    onClick={() => selectQuestion(question)}
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="my-questions">
            <h3>Your Selected Questions (Max 5)</h3>
            <ul>
              {myQuestions.map((question, index) => (
                <li key={index}>
                  <span>{question}</span>
                  <button onClick={() => removeQuestion(index)} className="remove-button">
                    X
                  </button>
                </li>
              ))}
            </ul>
            <div className="question-buttons">
              <button onClick={clearMyQuestions}>Clear All</button>
              <button onClick={saveQuestions} disabled={myQuestions.length === 0}>
                Save Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
