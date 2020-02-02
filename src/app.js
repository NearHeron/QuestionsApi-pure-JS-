import { Question } from "./question";
import { isValid, createModal } from "./utils";
import { getAuthForm, authWithEmailAndPassword } from "./auth";
import './styles.css';

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

const submitFormHandler = (event) => {
  event.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    };

    submitBtn.disabled = true;

    Question.create(question).then(() => {
      input.value = '';
      input.className = '';
      submitBtn.disabled = false;
    })
  }
};

const renderModalAfterAuth = (content) => {
  if(typeof content === 'string') {
    createModal('Warning!', content)
  } else {
    createModal('Questions list', Question.listToHTML(content))
  }
};

const authFormHandler = (event) => {
  event.preventDefault();

  const btn = event.target.querySelector('button');
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;

  btn.disabled = true;
  authWithEmailAndPassword(email, password)
    .then(token => Question.fetch(token))
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
};

const openModal = () => {
  createModal('Sing in', getAuthForm());
  document.getElementById('auth-form')
          .addEventListener('submit', authFormHandler, {once: true})
};

form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value)
});
window.addEventListener('load', Question.renderList);
modalBtn.addEventListener('click', openModal);