class ScoreManager {
    constructor() {
        this.score = 0;
        this.scoreText = null;
        // 최고 점수 초기화
        this.highScore = Number(localStorage.getItem("highScore")) || 0;
    }

    setTextObject(scoreText) {
        this.scoreText = scoreText;
        this.updateText();
    }

    add(point) {
        this.score += point;
        this.updateText();
    }

    addByBlock(block) {
        this.add(this.getBlockScore(block));
    }

    getBlockScore(block) {
        if (!block) return 0;

        const src = block.sprite?.src || "";

        if (src.includes("diamond")) return 500;
        if (src.includes("ancient_debris")) return 400;
        if (src.includes("obsidian")) return 300;
        if (src.includes("enderman")) return 300;
        if (src.includes("blaze")) return 250;
        if (src.includes("creeper")) return 250;
        if (src.includes("tnt")) return 200;
        if (src.includes("iron_ore")) return 200;
        if (src.includes("nether_gold")) return 200;
        if (src.includes("zombie")) return 150;
        if (src.includes("spider")) return 150;
        if (src.includes("nether_bricks")) return 120;
        if (src.includes("netherrack")) return 100;
        if (src.includes("soulsand")) return 100;
        if (src.includes("pig")) return 100;
        if (src.includes("sheep")) return 100;
        if (src.includes("oak_log")) return 80;
        if (src.includes("stone")) return 50;
        if (src.includes("dirt")) return 30;
        if (src.includes("grass")) return 20;

        return (block.maxHp || 1) * 10;
    }

    reset() {
        this.score = 0;
        this.updateText();
    }

    updateText() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
    
            localStorage.setItem(
                "highScore",
                this.highScore
            );
        }
    
        if (this.scoreText) {
            this.scoreText.text =
                `Score: ${this.score} | Best: ${this.highScore}`;
        }
    }

    getScore() {
        return this.score;
    }

    // 최고 점수 저장 및 불러오기
    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem(
                "highScore",
                this.highScore
            );
        }
    }
    
    getHighScore() {
        return this.highScore;
    }
}

const scoreManager = new ScoreManager();