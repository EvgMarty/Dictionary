//Castom player
const audio = document.getElementById('audio');
const playPauseButton = document.getElementById('playPauseButton');

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
