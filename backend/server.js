// server.js (Node/Express + Socket.IO backend)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

let players = [];

const questions = [
    {
        question: "What is the capital of France?",
        options: ["A. Berlin", "B. Madrid", "C. Paris", "D. Rome"],
        answer: "C" // Correct answer
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["A. Earth", "B. Mars", "C. Venus", "D. Jupiter"],
        answer: "B" // Correct answer
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["A. Elephant", "B. Blue Whale", "C. Giraffe", "D. Great White Shark"],
        answer: "B" // Correct answer
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["A. Charles Dickens", "B. William Shakespeare", "C. Mark Twain", "D. J.K. Rowling"],
        answer: "B" // Correct answer
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["A. Ag", "B. Au", "C. Pb", "D. Fe"],
        answer: "B" // Correct answer
    },
    {
        question: "Which ocean is the largest?",
        options: ["A. Atlantic Ocean", "B. Indian Ocean", "C. Arctic Ocean", "D. Pacific Ocean"],
        answer: "D" // Correct answer
    },
    {
        question: "What year did the Titanic sink?",
        options: ["A. 1910", "B. 1912", "C. 1914", "D. 1916"],
        answer: "B" // Correct answer
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["A. Vincent van Gogh", "B. Pablo Picasso", "C. Leonardo da Vinci", "D. Claude Monet"],
        answer: "C" // Correct answer
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["A. Gold", "B. Diamond", "C. Iron", "D. Quartz"],
        answer: "B" // Correct answer
    },
    {
        question: "Which element has the highest atomic number?",
        options: ["A. Uranium", "B. Plutonium", "C. Oganesson", "D. Francium"],
        answer: "C" // Correct answer
    }
];


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('playerJoined', (playerName) => {
        const player = { id: socket.id, name: playerName, score: 0 };
        players.push(player);
        io.emit('playerListUpdated', players);  // Send updated player list
    });

    socket.on('answerSubmitted', (data) => {
        const { playerId, answer, questionIndex } = data;

        const correctAnswer = questions[questionIndex].answer;

        const player = players.find(p => p.id === playerId);
        if (player) {
            if (answer === correctAnswer) {
                player.score += 10; // Increase score for a correct answer
                socket.emit('correctAnswer'); // Notify the player that they answered correctly
            } else {
                socket.emit('wrongAnswer', "Incorrect answer!"); // Notify the player that they answered incorrectly
            }

            // Emit the updated score to the player
            io.to(playerId).emit('scoreUpdate', player.score);

            // Optionally, emit the updated player list to other players
            io.emit('playerListUpdated', players);
        }
    });


    socket.on('disconnect', () => {
        players = players.filter(player => player.id !== socket.id);
        io.emit('playerListUpdated', players);  // Update list after player leaves
    });
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
