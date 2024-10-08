import React, { useState, useEffect } from 'react';

const questions = [
    { question: "What is the capital of France?", options: ["A. Berlin", "B. Madrid", "C. Paris", "D. Rome"] },
    { question: "Which planet is known as the Red Planet?", options: ["A. Earth", "B. Mars", "C. Venus", "D. Jupiter"] },
    { question: "What is the largest mammal in the world?", options: ["A. Elephant", "B. Blue Whale", "C. Giraffe", "D. Great White Shark"] },
    { question: "Who wrote 'Hamlet'?", options: ["A. Charles Dickens", "B. William Shakespeare", "C. Mark Twain", "D. J.K. Rowling"] },
    { question: "What is the chemical symbol for gold?", options: ["A. Ag", "B. Au", "C. Pb", "D. Fe"] },
    { question: "Which ocean is the largest?", options: ["A. Atlantic Ocean", "B. Indian Ocean", "C. Arctic Ocean", "D. Pacific Ocean"] },
    { question: "What year did the Titanic sink?", options: ["A. 1910", "B. 1912", "C. 1914", "D. 1916"] },
    { question: "Who painted the Mona Lisa?", options: ["A. Vincent van Gogh", "B. Pablo Picasso", "C. Leonardo da Vinci", "D. Claude Monet"] },
    { question: "What is the hardest natural substance on Earth?", options: ["A. Gold", "B. Diamond", "C. Iron", "D. Quartz"] },
    { question: "Which element has the highest atomic number?", options: ["A. Uranium", "B. Plutonium", "C. Oganesson", "D. Francium"] }
];

const PlayerScreen = ({ socket }) => {
    const [playerName, setPlayerName] = useState('');
    const [joined, setJoined] = useState(false);
    const [answer, setAnswer] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showQuiz, setShowQuiz] = useState(true);

    useEffect(() => {
        // Listen for wrong answer feedback from the server
        socket.on('wrongAnswer', (message) => {
            setFeedback(message);
            setPopupMessage(`Your score: ${score}`);
            setShowPopup(true);
            setShowQuiz(false);
            socket.disconnect();
        });

        // Listen for correct answer and update the question index
        socket.on('correctAnswer', () => {
            setFeedback("Correct answer!");
            setScore(prevScore => prevScore + 1); // Update score for correct answer
            setTimeout(() => {
                setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
                setFeedback('');
                setAnswer('');
            }, 2000); // Move to the next question after 2 seconds
        });

        // Listen for score updates
        socket.on('scoreUpdate', (newScore) => {
            setScore(newScore);
        });

        return () => {
            // Cleanup listeners on unmount
            socket.off('wrongAnswer');
            socket.off('correctAnswer');
            socket.off('scoreUpdate');
        };
    }, [socket, score]);

    const handleJoinGame = () => {
        socket.emit('playerJoined', playerName);
        setJoined(true);
    };

    const handleSubmitAnswer = () => {
        if (!answer) {
            setFeedback('Please select an answer.');
            return;
        }

        socket.emit('answerSubmitted', {
            playerId: socket.id,
            playerName,
            answer,
            questionIndex: currentQuestionIndex,
        });
        setFeedback('Submitting...');
        setAnswer(''); // Clear the answer after submission
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setJoined(false);
        setPlayerName('');
        setScore(0);
        setCurrentQuestionIndex(0);
        setAnswer('');
        setFeedback('');
        setShowQuiz(true);
    };

    return (
        <div className='playerscreen'>
            {!joined ? (
                <>
                    <h1 className='joinhead'>Join the Game</h1>
                    <input
                        className='inputclass'
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button onClick={handleJoinGame}>Join Game</button>
                </>
            ) : (
                showQuiz && (
                    <div className='questioncard'>
                        <h2>Question: {questions[currentQuestionIndex].question}</h2>
                        <ul className='ul'>
                            {questions[currentQuestionIndex].options.map((opt, index) => (
                                <li className='listop' key={index}>
                                    <button className='optButon' onClick={() => setAnswer(opt[0])}>{opt}</button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleSubmitAnswer}>Submit Answer</button>
                        {feedback && <p className={feedback === "Correct answer!" ? "green" : "red"}>{feedback}</p>}
                        <h3>Your Score: {score}</h3>
                    </div>
                )
            )}

            {/* Popup for wrong answer */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Wrong Answer!</h2>
                        <p>{popupMessage}</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerScreen;
