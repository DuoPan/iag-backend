const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

let correctAnswer = '';
let hint = '';

const generatePassword = () => {
  const charList = [0,1,2,3,4,5,6,7,8,9];
  let password = _.shuffle(charList).slice(0,8);
  correctAnswer = password.join('');
  hint = password.sort().join('');
  console.log(correctAnswer)
};

const verifyPassword = (answer) => {
  let highlight = [];
  const correctAnswerArray = correctAnswer.split('');
  const answerArray = answer.split('');
  correctAnswerArray.map(function(number, index){
    number === answerArray[index] && highlight.push(number);
  });
  let result = {
    correct: highlight.length === 8,
    hint: hint,
    answer: answer,
  };
  return highlight.length !== 8 ? Object.assign({}, result, {highlight}): result;
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/new-password', (req, res) => {
  generatePassword();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({hint: hint}));
});

app.post('/verify-password', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(verifyPassword(req.body.answer)));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
