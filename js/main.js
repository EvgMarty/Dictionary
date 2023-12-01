// ==========   Get data  ===============
const URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const input = document.getElementById('word-input');
const form = document.querySelector('.form');
const notFound = document.querySelector('.not-found');
const allResult = document.querySelector('.allResult');
const resultsList = document.querySelector('.results-list');
let containetWord = document.querySelector('.results-word');

let state = {
  word: '',
  meanings: [],
  phonetics: [],
  error: false,
};

const insertWord = () => {
  containetWord.innerHTML = state.word;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!state.word.trim()) return;

  try {
    const result = await fetch(`${URL}${state.word}`);
    const data = await result.json();

    if (result.status && data.length) {
      const item = data[0];
      state = {
        ...state,
        error: false,
        meanings: item.meanings,
        phonetics: item.phonetics,
      };
      insertWord();
      handleSound();
    } else {
      state = {
        ...state,
        error: true,
      };
    }
  } catch (error) {
    console.log(error.message);
  }
  notFounds();
};

const handleKeyUp = (e) => {
  const value = e.target.value;
  state.word = value;
};

const notFounds = () => {
  if (state.error) {
    notFound.innerText = `Word "${state.word}" not found`;
    notFound.classList.remove('hidden');
    showResults();
  } else {
    notFound.classList.add('hidden');
    showResults();
  }
};

const renderItem = (item) => {
  const itemDefinition = item.definitions[0];
  return `<div class="results-list">
                  <div class="result-item">
                    <div class="results-item__part">${item.partOfSpeech}</div>
                    <div class="result-item__defenitions">
                      <div class="result-item__defenition">
                        <p>${itemDefinition.definition}</p>
                      </div>
                    </div>
                  </div>
                </div>`;
};

const showResults = () => {
  if (state.word.length && !state.error) {
    allResult.classList.remove('hidden');
    resultsList.innerHTML = '';
    state.meanings.forEach(
      (item) => (resultsList.innerHTML += renderItem(item))
    );
  } else {
    allResult.classList.add('hidden');
  }
};

//EVENTS
input.addEventListener('keyup', handleKeyUp);
form.addEventListener('submit', handleSubmit);

// ==========   Castom player  ===============
const audio = document.getElementById('audio');
const playPauseButton = document.getElementById('playPauseButton');

const handleSound = () => {
  if (state.phonetics.length) {
    let sound = '';
    if (state.phonetics[0].audio) {
      sound = state.phonetics[0].audio;
    } else if (state.phonetics.length > 1 && state.phonetics[1].audio) {
      sound = state.phonetics[1].audio;
    }

    audio.src = sound;
    audio.load();
  }
};

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseButton.textContent = '⏸️';
  } else {
    audio.pause();
    playPauseButton.textContent = '▶️';
  }
}

playPauseButton.addEventListener('click', togglePlayPause);

audio.addEventListener('ended', () => {
  playPauseButton.textContent = '▶️';
});
