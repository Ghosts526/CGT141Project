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
            audio.volume = volume;
            document.body.appendChild(audio);
            this.pool.push(audio);
        }
    }

    play() { // Play resumes the audio 
        for (let audio of this.pool) {
            if (audio.paused) {
                audio.currentTime = this.time;
                audio.play();
                return;
            }
        }

        this.pool[0].currentTime = this.time;
        this.pool[0].play();
    }

    stop() {
        for (let audio of this.pool) {
            audio.pause();
        }
    }

    restart() { 
        for (let audio of this.pool) {
            audio.currentTime = this.time;
        }
        this.play();
    }
}