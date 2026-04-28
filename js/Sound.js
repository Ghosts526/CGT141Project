/**
 * This class handles adding sound to the game
*/
export class Sound {
    constructor(src, loop, startTime, poolSize, volume) { //Audio file location, is it looping, start time, how many audio will be playing, audio
        this.pool = [];
        this.poolSize = poolSize;
        this.time = startTime;

        for (let i = 0; i < poolSize; i++) {
            const audio = document.createElement("audio");
            audio.src = src;
            audio.preload = "auto";
            audio.controls = false;
            audio.style.display = "none";
            audio.loop = loop;
            if (localStorage.getItem("useAudio") == "true") {
                audio.volume = 0;
            } else {
                audio.volume = volume;
            }
            document.body.appendChild(audio);
            this.pool.push(audio);
        }
    }

    play() { // Plays an audio
        for (let audio of this.pool) {
            if (audio.paused) { // Check if an audio slot is paused
                audio.currentTime = this.time;
                audio.play(); // If so reset it and play it
                return;
            }
        }

        // Else reset the first slot and play that
        this.pool[0].currentTime = this.time;
        this.pool[0].play();
    }

    stop() {
        for (let audio of this.pool) {
            audio.pause();
        }
    }

    restart() { // Restart all audios
        for (let audio of this.pool) {
            audio.currentTime = this.time;
        }
        this.play();
    }

    destroy() {
        for (let audio of this.pool) {
            audio.pause();
            audio.src = "";
        }
    }
}