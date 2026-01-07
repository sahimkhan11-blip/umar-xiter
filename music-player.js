// music-player.js
// এই file টা সব pages এর জন্য common থাকবে

class MusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.7;
        this.initialized = false;
        
        // localStorage থেকে state load করো
        this.savedState = localStorage.getItem('musicState') || 'stopped';
        this.savedTime = localStorage.getItem('musicTime') || 0;
        
        this.init();
    }
    
    init() {
        if (this.initialized) return;
        
        // Audio element তৈরি করো
        this.audio = new Audio('NO_BATADAO.mp3');
        this.audio.loop = true;
        this.audio.volume = this.volume;
        this.audio.preload = 'auto';
        
        // Saved time থেকে resume করো
        if (this.savedTime > 0) {
            this.audio.currentTime = parseFloat(this.savedTime);
        }
        
        // Saved state থেকে resume করো
        if (this.savedState === 'playing') {
            this.play();
        }
        
        this.initialized = true;
        
        // Regular interval এ current time save করো
        setInterval(() => {
            if (!this.audio.paused) {
                localStorage.setItem('musicTime', this.audio.currentTime);
            }
        }, 1000);
        
        // Audio events
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            localStorage.setItem('musicState', 'playing');
            this.updateUI();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            localStorage.setItem('musicState', 'paused');
            this.updateUI();
        });
        
        this.audio.addEventListener('ended', () => {
            this.audio.currentTime = 0;
            this.audio.play();
        });
        
        console.log("Music Player Initialized");
    }
    
    play() {
        if (!this.initialized) return;
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            localStorage.setItem('musicState', 'playing');
            this.updateUI();
        }).catch(error => {
            console.log("Playback failed:", error);
        });
    }
    
    pause() {
        if (!this.initialized) return;
        
        this.audio.pause();
        this.isPlaying = false;
        localStorage.setItem('musicState', 'paused');
        this.updateUI();
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    updateUI() {
        const btn = document.getElementById('musicToggleBtn');
        if (!btn) return;
        
        if (this.isPlaying) {
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            btn.classList.remove('muted');
            btn.title = "Music Playing - Click to Pause";
        } else {
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.classList.remove('muted');
            btn.title = "Music Paused - Click to Play";
        }
    }
    
    // Web এর যেকোনো জায়গায় click করলে music start হবে
    enableClickAnywhere() {
        document.addEventListener('click', (event) => {
            // যদি user music button এ click করে, তাহলে toggle করবে
            if (event.target.closest('#musicToggleBtn')) {
                this.toggle();
                return;
            }
            
            // যদি user link বা button এ click করে, তাহলে music বন্ধ হবে না
            if (event.target.tagName === 'A' || 
                event.target.tagName === 'BUTTON' || 
                event.target.closest('a') || 
                event.target.closest('button')) {
                return;
            }
            
            // যদি music না চলছে, তাহলে start করবে
            if (!this.isPlaying && this.initialized) {
                this.play();
            }
        });
    }
}

// Global music player instance তৈরি করো
window.musicPlayer = new MusicPlayer();

// Page load হওয়ার সাথে সাথে click anywhere enable করো
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer.enableClickAnywhere();
    
    // Music button এর জন্য UI update করো
    setTimeout(() => {
        window.musicPlayer.updateUI();
    }, 500);
});
