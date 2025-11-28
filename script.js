// --- Données des pistes ---
const tracks = [
    { 
        id: 1, 
        title: "Hunter x Hunter", 
        artist: "Spacetoon", 
        src: "audio/hunter.mp3", 
        cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa6_ltrn7-sG-U_Iu4mZquMKcz_o7yrF87hg&s", 
        duration: "1:20" 
    },
    { 
        id: 2, 
        title: "Detective Conan", 
        artist: "Spacetoon", 
        src: "audio/detective conan.mp3", 
        cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAD9EINFbXWeZv-jaopx88wv0j6sq0C3gyCw&s", 
        duration: "1:24" 
    },
    { 
        id: 3, 
        title: "Rimy", 
        artist: "Spacetoon", 
        src: "audio/rimy.mp3", 
        cover: "https://i.pinimg.com/564x/85/93/1f/85931f8c897bf610ad3c42852afb37af.jpg", 
        duration: "1:39" 
    },
    { 
        id: 4, 
        title: "Renma", 
        artist: "Spacetoon", 
        src: "audio/renma.mp3", 
        cover: "https://w7.pngwing.com/pngs/713/264/png-transparent-ryu-kumon-ranma-%C2%BD-anime-female-character-ranma-1-2-fictional-character-curse-gender-bender-thumbnail.png", 
        duration: "1:29" 
    }
];

// --- Variables globales ---
let currentTrackIndex = 0;
let isPlaying = false;
let isRepeat = false;
const audio = new Audio();

// --- DOM ---
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const albumImg = document.querySelector('.album img');
const playBtn = document.querySelector('.btn-play');
const prevBtn = document.querySelector('.btn-prec');
const nextBtn = document.querySelector('.btn-next');
const repeatBtn = document.querySelector('.btn-repeat');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const volumeSlider = document.querySelector('.volume-slider');
const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const trackInfoContainer = document.querySelector('.track-info');

// --- Initialisation ---
function init() {
    loadTrack(currentTrackIndex);
    renderTrackList();
    setupEventListeners();
}

// --- Charger une piste avec fade ---
function loadTrack(index) {

    const track = tracks[index];
    if (!track) return;

    // Fade out
    albumImg.style.opacity = 0;
    trackInfoContainer.style.opacity = 0;

    setTimeout(() => {
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        albumImg.src = track.cover || "default-cover.png";

        audio.src = track.src;
        audio.volume = parseFloat(volumeSlider.value);

        currentTimeEl.textContent = '0:00';
        durationEl.textContent = track.duration;

        updateActiveTrack(index);

        // Fade in
        albumImg.style.opacity = 1;
        trackInfoContainer.style.opacity = 1;

        if (isPlaying) audio.play();
    }, 300);
}

// --- Rendre la liste de lecture ---
function renderTrackList() {

    trackList.innerHTML = '';

    tracks.forEach((track, index) => {

        const item = document.createElement('div');
        item.className = `track-item ${index === currentTrackIndex ? 'active' : ''}`;
        item.innerHTML = `
            <div class="track-item-info">
                <div class="track-item-title">${track.title}</div>
                <div class="track-item-artist">${track.artist}</div>
            </div>
            <div class="track-item-duration">${track.duration}</div>
        `;

        item.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            playTrack();
        });

        trackList.appendChild(item);
    });
}

// --- Mettre à jour la piste active ---
function updateActiveTrack(index) {
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// --- Écouteurs ---
function setupEventListeners() {

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.style.background = isRepeat ? '#9a3bf2' : 'rgba(255,255,255,0.1)';
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);

    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            playTrack();
        } else {
            nextTrack();
        }
    });

    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);

    searchInput.addEventListener('input', filterTracks);
    themeToggle.addEventListener('click', toggleTheme);
}

// --- Lecture / Pause ---
function togglePlay() {
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
    isPlaying = true;
    audio.play();
    playBtn.textContent = '⏸';
}

function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playBtn.textContent = '▶';
}

// --- Navigation ---
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
}

// --- Progression ---
function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100 || 0;
    progressBar.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
}

function updateDuration() {
    durationEl.textContent = formatTime(audio.duration);
}

// --- Volume ---
function setVolume() {
    audio.volume = parseFloat(volumeSlider.value);
}

// --- Thème sombre ---
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// --- Recherche ---
function filterTracks() {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll('.track-item').forEach(item => {
        const title = item.querySelector('.track-item-title').textContent.toLowerCase();
        const artist = item.querySelector('.track-item-artist').textContent.toLowerCase();
        item.style.display = title.includes(filter) || artist.includes(filter) ? 'flex' : 'none';
    });
}

// --- Formatage du temps ---
function formatTime(sec) {
    const mins = Math.floor(sec / 60) || 0;
    const secs = Math.floor(sec % 60) || 0;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', init);
