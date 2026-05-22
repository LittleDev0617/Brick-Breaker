const editorScene = () => {
    let scene = new Scene("editor");
    let cameraPos = new Vector2D(0, 0);

    const LINE_WIDTH = 1;
    const UNIT = BLOCK_SIZE+LINE_WIDTH;
    for (let i=0; i <= CANVAS_WIDTH / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
        let line = new UIRect(i*UNIT + cameraPos.x % UNIT, 0, LINE_WIDTH, CANVAS_HEIGHT, 'gray', 0.5, 0);
        scene.addUI(`lineVertical${i}`, line);
    }

    for (let i=0; i <= CANVAS_HEIGHT / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
        let line = new UIRect(0, i*UNIT + cameraPos.y % UNIT, CANVAS_WIDTH, LINE_WIDTH, 'gray', 0, 0.5);
        scene.addUI(`lineHorizontal${i}`, line);
    }

    let scrollUI = new UI(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0);
    let previewBlock = new UIImage(0, 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_GRASS.sprite, 0, 0);
    previewBlock.opacity = 0.7;

    scrollUI.child.push(previewBlock);
    
    const updatePreviewBlock = (e) => {
        const { offsetX, offsetY } = e;

        previewBlock.transform.x = UNIT * Math.floor((offsetX + cameraPos.x % UNIT) / UNIT) - cameraPos.x % UNIT;
        previewBlock.transform.y = UNIT * Math.floor((offsetY + cameraPos.y % UNIT) / UNIT) - cameraPos.y % UNIT;
    }

    scrollUI.onScroll = function(e) {
        const { deltaX, deltaY } = e;
        cameraPos.x += deltaX / 2;
        cameraPos.y += deltaY / 2;

        for (let i=0; i <= CANVAS_WIDTH / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
            let line = scene.findUIObject(`lineVertical${i}`);
            line.transform.x = i*UNIT - cameraPos.x % UNIT;
        }

        for (let i=0; i <= CANVAS_HEIGHT / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
            let line = scene.findUIObject(`lineHorizontal${i}`);
            line.transform.y = i*UNIT - cameraPos.y % UNIT;
        }

        updatePreviewBlock(e);
    }

    scrollUI.onMouseMove = function(e) {
        updatePreviewBlock(e);
    }

    scene.addUI('scrollUI', scrollUI);

    let i = 0;
    let blockSelected = null;
    const menuBtnSize = 64;

    let menu = new ObjectT(16, CANVAS_HEIGHT-menuBtnSize, 0, menuBtnSize+16, 0, 0.5);
    for (const blockId in BLOCK_LIST) {
        let block = new UIImage(i*(menuBtnSize+16), 0, menuBtnSize, menuBtnSize, BLOCK_LIST[blockId].sprite, 0, 0.5);
        block.onClick = function() {
            blockSelected = blockId;
        }

        menu.child.push(block);
        menu.transform.width += block.transform.width+16;
        // scene.addUI(`menuBtn-${blockId}`, block);
        if (i == 0)
            blockSelected = blockId;
        i++;
    }

    menu.onScroll = function(e) {
        const d = e.deltaY;
        if ((this.transform.left <= 0 && d > 0) || (this.transform.right >= CANVAS_WIDTH && d < 0))
            this.transform.x += d / 2;
    }
    scene.addUI("menu", menu);




    scene.update = function() {
        

        this.draw();
    }

    return scene;
};