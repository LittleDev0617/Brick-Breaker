// 맵 에디터

const editorScene = () => {
    let scene = new Scene("editor");


    let mode = "draw";
    let camera = new ObjectT(0, 0, 0, 0);
    let cameraPos = camera.transform;

    scene.addUI("currentMode", new UIText(20, 50, mode, 32, "black", TEXT_ALIGN_LEFT));
    scene.addUI("guide", new UIText(20, 100, "d: draw", 16, "black", TEXT_ALIGN_LEFT));
    scene.addUI("guide2", new UIText(20, 120, "e: erase", 16, "black", TEXT_ALIGN_LEFT));


    let map = new GameMap();

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

    //////////////   //////////////
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
        cameraPos.x += deltaX;
        cameraPos.y += deltaY;

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

    const destroyBlock = (screenX, screenY) => {
        let x = UNIT * Math.floor((screenX + cameraPos.x % UNIT) / UNIT) - cameraPos.x % UNIT;
        let y = UNIT * Math.floor((screenY + cameraPos.y % UNIT) / UNIT) - cameraPos.y % UNIT;
        let absX = cameraPos.x + x;
        let absY = cameraPos.y + y;

        console.log('Block destroyed at', absX, absY)
        if (map.getBlock(absX, absY)) {
            map.removeBlock(absX, absY);
            scene.removeObject(`block_${absX}_${absY}`);
        }
    }

    const place = (screenX, screenY, idx) => {
        let x = UNIT * Math.floor((screenX + cameraPos.x % UNIT) / UNIT) - cameraPos.x % UNIT;
        let y = UNIT * Math.floor((screenY + cameraPos.y % UNIT) / UNIT) - cameraPos.y % UNIT;
        
        let absX = cameraPos.x + x;
        let absY = cameraPos.y + y;

        if (map.getBlock(absX, absY)) {
            scene.removeObject(`block_${absX}_${absY}`);
        }

        let block = new UIImage(x, y, BLOCK_SIZE, BLOCK_SIZE, BLOCK_LIST[blockSelected].sprite, 0, 0);
        block.absX = absX;
        block.absY = absY;

        console.log('Block placed at', absX, absY)
        scene.addGameObject(`block_${absX}_${absY}`, block);
        map.placeBlock(absX, absY, BLOCK_LIST[idx].id);
    }

    editorManager.onClick = function(e, isRight) {
        const { offsetX, offsetY } = e;

        if (!isRight) { // 좌클릭
            if (mode == "draw")             
                place(offsetX, offsetY, blockSelected);
            else 
                destroyBlock(offsetX, offsetY);
        }
    }

    editorManager.onMouseMove = function(e) {
        const isLeftBtnClicked = e.buttons & 1;
        const isRightBtnClicked = e.buttons & 2;        

        if (isLeftBtnClicked) {
            editorManager.onClick(e, isRightBtnClicked);            
        } else if(isRightBtnClicked) {
            editorManager.onScroll({ 
                'deltaX': -e.movementX,
                'deltaY': -e.movementY 
            });
        }
        movePreviewBlock(e);
    }

    editorManager.onKeyDown = function(e) {        
        if (e.code == "KeyD") {
            previewBlock.sprite = BLOCK_LIST[blockSelected].sprite;
            mode = "draw";            
        }
        else if (e.code == "KeyE") {
            previewBlock.sprite = Block.destroyImages[5];
            mode = "erase";
        }

        scene.findUIObject("currentMode").text = mode;
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