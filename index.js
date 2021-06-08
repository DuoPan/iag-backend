const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

let correctAnswerObj = {};

const generatePassword = () => {
  const charList = [0,1,2,3,4,5,6,7,8,9];
  let password = _.shuffle(charList).slice(0,8);
  let correctAnswer = password.join('');
  let hint = password.sort().join('');
  if (!correctAnswerObj[hint]) {
    correctAnswerObj[hint] = correctAnswer;
  }
  console.log(correctAnswerObj);
  return hint;
};

const verifyPassword = (hint, answer) => {
  let correctAnswer = correctAnswerObj[hint]
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
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({hint: generatePassword()}));
});

app.post('/verify-password', (req, res) => {
  if (!correctAnswerObj[req.body.hint]) {
    res.status(404).send({message: 'Hint Not found'});
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(verifyPassword(req.body.hint, req.body.answer)));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
