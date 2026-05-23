// 맵 에디터

const editorScene = () => {
    let scene = new Scene("editor");

    let drawMode = true;
    let camera = new ObjectT(0, 0, 0, 0);
    let cameraPos = camera.transform;

    scene.addUI("camera", camera);

    ////////////// 그리드 선 생성 //////////////
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
    
    ////////////// 하단 블럭 선택 메뉴 바 생성 //////////////
    let i = 0;
    let blockSelected = null;
    const menuBtnSize = 64;

    let menu = new ObjectT(16, CANVAS_HEIGHT-menuBtnSize, 0, menuBtnSize+16, 0, 0.5);
    for (const blockId in BLOCK_LIST) {
        let block = new UIImage(i*(menuBtnSize+16), 0, menuBtnSize, menuBtnSize, BLOCK_LIST[blockId].sprite, 0, 0.5);
        block.onClick = function() {
            blockSelected = blockId;
            previewBlock.sprite = BLOCK_LIST[blockSelected].sprite;
        }

        menu.appendChild(block);
        menu.transform.width += block.transform.width+16;
        // scene.addUI(`menuBtn-${blockId}`, block);
        if (i == 0)
            blockSelected = blockId;
        i++;
    }

    menu.hover = false;
    menu.onHover = function() {
        previewBlock.opacity = 0;
    }

    menu.onScroll = function(e) {
        const d = e.deltaY;
        if ((this.transform.left <= 0 && d > 0) || (this.transform.right >= CANVAS_WIDTH && d < 0))
            this.transform.x += d / 2;
    }
    scene.addUI("menu", menu);

    //////////////  //////////////
    let editorManager = new UI(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0);
    let previewBlock = new UIImage(0, 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_GRASS.sprite, 0, 0);
    previewBlock.opacity = 0.7;

    editorManager.appendChild(previewBlock);
    
    const movePreviewBlock = (e) => {
        const { offsetX, offsetY, deltaX, deltaY } = e;

        previewBlock.transform.x = UNIT * Math.floor((offsetX + cameraPos.x % UNIT) / UNIT) - cameraPos.x % UNIT;
        previewBlock.transform.y = UNIT * Math.floor((offsetY + cameraPos.y % UNIT) / UNIT) - cameraPos.y % UNIT;
    }

    const moveRelative = e => {        
        const { offsetX, offsetY, deltaX, deltaY } = e;
        scene.findGameObjects("block").forEach(block => {            
            block.transform.x = block.absX - cameraPos.x;
            block.transform.y = block.absY - cameraPos.y;
        });
    }

    editorManager.onScroll = function(e) {
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

        movePreviewBlock(e);
        moveRelative(e);
    }

    editorManager.onClick = function(e) {
        const { offsetX, offsetY } = e;

        let x = UNIT * Math.floor((offsetX + cameraPos.x % UNIT) / UNIT) - cameraPos.x % UNIT;
        let y = UNIT * Math.floor((offsetY + cameraPos.y % UNIT) / UNIT) - cameraPos.y % UNIT;
        
        let block = new UIImage(x, y, BLOCK_SIZE, BLOCK_SIZE, BLOCK_LIST[blockSelected].sprite, 0, 0);
        block.absX = cameraPos.x + x;
        block.absY = cameraPos.y + y;

        scene.addGameObject("block", block);
    }

    editorManager.onMouseMove = function(e) {
        movePreviewBlock(e);
    }

    editorManager.hover = false;
    editorManager.onHover = function() {
        previewBlock.opacity = 0.7;
    }

    scene.addUI('editorManager', editorManager);





    scene.update = function() {
        

        this.draw();
    }

    return scene;
};