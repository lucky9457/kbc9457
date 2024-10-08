// src/MainScreen.js
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import "./App.css"

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

const MainScreen = ({ socket }) => {
    const [players, setPlayers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        socket.on('playerListUpdated', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on('correctAnswer', (data) => {
            setWinner(data.playerName);
            setTimeout(() => {
                setWinner(null);
                setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
            }, 3000);
        });

        // Clean up socket listeners on unmount
        return () => {
            socket.off('playerListUpdated');
            socket.off('correctAnswer');
        };
    }, [socket]);

    return (
        <div className='mainscreenmain'>
            <h1>KBC Game</h1>
            <p>Scan Qr to play</p>
            <QRCode className='qr' value="https://kbc9457.vercel.app/player" size={128} />
            <h2>Players</h2>
            <ul className='players'>
                {players && players.length > 0 ? (
                    players.map(player => (
                        <li key={player.id}>{player.name} - Score: {player.score}</li>
                    ))
                ) : (
                    <div>
                        <p>No players active</p>
                    </div>

                )}
            </ul>


            <h2>Current Question</h2>
            <p>{questions[currentQuestionIndex].question}</p>
            <ul>
                {questions[currentQuestionIndex].options.map((opt, index) => (
                    <li key={index}>{opt}</li>
                ))}
            </ul>

            {winner && <h3>Congratulations {winner}! Moving to the next question...</h3>}
        </div>
    );
};

export default MainScreen;
