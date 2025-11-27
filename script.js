// Données des pistes audio au format JSON
const tracks = [
    {
        id: 1,
        title: "hunter x hunter",
        artist: "spacetoon",
        src: "audio/hunter.mp3",
        duration: "1:20"
    },
    {
        id: 2,
        title: "detective conan",
        artist: "spacetoon", 
        src: "audio/detective conan.mp3",
        duration: "1:24"
    },
    {
        id: 3,
        title: "rimy",
        artist: "spacetoon",
        src: "audio/rimy.mp3",
        duration: "1:39"
    },
    {
        id: 4,
        title: "renma",
        artist: "spacetoon",
        src: "audio/renma.mp3",
        duration: "1:29"
    }
];

// Variables globales
let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Éléments DOM
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const playBtn = document.querySelector('.btn-play');
const prevBtn = document.querySelector('.btn-prec');
const nextBtn = document.querySelector('.btn-next');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const volumeSlider = document.querySelector('.volume-slider');
const trackList = document.getElementById('trackList');

// Initialisation
function init() {
    loadTrack(currentTrackIndex);
    renderTrackList();
    setupEventListeners();
}

// Charger une piste
function loadTrack(index) {
    const track = tracks[index];
    
    // Mettre à jour l'interface
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // Configurer l'audio
    audio.src = track.src;
    audio.volume = volumeSlider.value;
    
    // Réinitialiser la progression
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = track.duration;
    
    // Mettre à jour la liste des pistes
    updateActiveTrack(index);
}

// Rendre la liste des pistes
function renderTrackList() {
    trackList.innerHTML = '';
    
    tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = `track-item ${index === currentTrackIndex ? 'active' : ''}`;
        trackItem.innerHTML = `
            <div class="track-item-info">
                <div class="track-item-title">${track.title}</div>
                <div class="track-item-artist">${track.artist}</div>
            </div>
            <div class="track-item-duration">${track.duration}</div>
        `;
        
        trackItem.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
        
        trackList.appendChild(trackItem);
    });
}

// Mettre à jour la piste active dans la liste
function updateActiveTrack(index) {
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Lecture/Pause
    playBtn.addEventListener('click', togglePlay);
    
    // Piste suivante/précédente
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    // Barre de progression
    progressContainer.addEventListener('click', setProgress);
    
    // Contrôle du volume
    volumeSlider.addEventListener('input', setVolume);
    
    // Événements audio
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('error', handleAudioError);
    
    // Touches du clavier
    document.addEventListener('keydown', handleKeyPress);
}

// Gestion des erreurs audio
function handleAudioError(e) {
    console.error('Erreur audio:', e);
    alert('Erreur de chargement du fichier audio');
}

// Basculer lecture/pause
function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

// Lire la piste
function playTrack() {
    isPlaying = true;
    audio.play().catch(error => {
        console.error('Erreur de lecture:', error);
        isPlaying = false;
    });
    playBtn.innerHTML = '⏸';
}

// Mettre en pause la piste
function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = '▶';
}

// Piste suivante
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
}

// Piste précédente
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
}

// Mettre à jour la durée
function updateDuration() {
    const duration = audio.duration;
    durationEl.textContent = formatTime(duration);
}

// Mettre à jour la progression
function updateProgress() {
    const { currentTime, duration } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
}

// Définir la progression
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Définir le volume
function setVolume() {
    audio.volume = volumeSlider.value;
}

// Gérer les touches du clavier
function handleKeyPress(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            nextTrack();
            break;
        case 'ArrowLeft':
            prevTrack();
            break;
        case 'ArrowUp':
            volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
            setVolume();
            break;
        case 'ArrowDown':
            volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
            setVolume();
            break;
    }
}

// Formater le temps (secondes -> mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Démarrer l'application
init();