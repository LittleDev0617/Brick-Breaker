class SoundManager {

    static musics = [
        new Audio("assets/sounds/bgm_C418.mp3"),
        new Audio("assets/sounds/bgm_Haggstrom.mp3"),
        new Audio("assets/sounds/bgm_Minecraft.mp3"),
        new Audio("assets/sounds/bgm_SubwooferLullaby.mp3"),
        new Audio("assets/sounds/bgm_WetHands.mp3")
    ];

    constructor() {
        this.bgm = SoundManager.musics[0];
        this.bgm_index = 0;
        this.bgm.loop = true;
        this.bgm.volume = 0.4;

        this.clickSound = new Audio("assets/sounds/click.mp3");
        this.clickSound.volume = 0.6;

        this.blockHitSound = new Audio("assets/sounds/block_hit.mp3");
        this.blockHitSound.volume = 0.7;

        this.blockBreakSound = new Audio("assets/sounds/block_break.mp3");
        this.blockBreakSound.volume = 0.8;

        this.getItemSound = new Audio("assets/sounds/get_item.mp3");
        this.getItemSound.volume = 0.2;

        this.bgmEnabled = true;
        this.sfxEnabled = true;

        this.lastHitSoundTime = 0;
        this.hitSoundDelay = 80;

        this.lastBreakSoundTime = 0;
        this.breakSoundDelay = 80;
    }

    changeBgm() {
        this.stopBGM();
        this.bgm_index = (this.bgm_index+1) % 5;
        this.bgm = SoundManager.musics[this.bgm_index];
        this.playBGM();
    }

    getBgm() {
        switch (this.bgm_index) {
            case 0: return "Music: C418";
            case 1: return "Music: Haggstorm";
            case 2: return "Music: Minecraft";
            case 3: return "Music: SubwooferLullaby";
            case 4: return "Music: WetHands";
        }
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

    playGetItem() {
        this.playEffectSound(this.getItemSound, "아이템 획득 효과음 재생 실패:");
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
