class SoundManager {
    constructor() {
        this.bgm = new Audio("assets/sounds/overworld_bgm.mp3");
        this.bgm.loop = true;
        this.bgm.volume = 0.4;

        this.clickSound = new Audio("assets/sounds/click.mp3");
        this.clickSound.volume = 0.6;

        this.blockHitSound = new Audio("assets/sounds/block_hit.mp3");
        this.blockHitSound.volume = 0.7;

        this.blockBreakSound = new Audio("assets/sounds/block_break.mp3");
        this.blockBreakSound.volume = 0.8;

        this.bgmEnabled = true;
        this.sfxEnabled = true;

        this.lastHitSoundTime = 0;
        this.hitSoundDelay = 80;

        this.lastBreakSoundTime = 0;
        this.breakSoundDelay = 80;
    }

    toggleBgm() {
        this.bgmEnabled = !this.bgmEnabled;
        if (this.bgmEnabled) {
            this.bgm.play().catch(() => {});
        } else {
            this.bgm.pause();
        }
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
    }

    playEffectSound(audioObject, errorMessage) {
        if (!this.sfxEnabled) return;

        const sound = audioObject.cloneNode();
        sound.volume = audioObject.volume;

        sound.play().catch(error => {
            console.log(errorMessage, error);
        });
    }

    playBGM() {
        if (!this.bgmEnabled) return;
        if (!this.bgm.paused) return;

        this.bgm.play().catch(error => {
            console.log("BGM 재생 실패:", error);
        });
    }

    stopBGM() {
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }

    playClick() {
        this.playEffectSound(this.clickSound, "클릭 효과음 재생 실패:");
    }

    playBlockHit() {
        const now = Date.now();
        if (now - this.lastHitSoundTime < this.hitSoundDelay) return;
        this.lastHitSoundTime = now;
        this.playEffectSound(this.blockHitSound, "블록 타격음 재생 실패:");
    }

    playBlockBreak() {
        const now = Date.now();
        if (now - this.lastBreakSoundTime < this.breakSoundDelay) return;
        this.lastBreakSoundTime = now;
        this.playEffectSound(this.blockBreakSound, "블록 파괴음 재생 실패:");
    }
}

const soundManager = new SoundManager();
