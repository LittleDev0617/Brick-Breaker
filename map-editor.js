// 맵 에디터

const editorScene = () => {
    let scene = new Scene("editor");

    scene.start = function() {
        let mode = "draw";
        let camera = new ObjectT("camera", 0, 0, 0, 0);
        let cameraPos = camera.transform;

        this.addUI(new UIText("currentMode", 20, 50, mode, 32, "black", TEXT_ALIGN_LEFT));
        this.addUI(new UIText("guide", 20, 100, "Left Click: Place/Destroy Block", 16, "black", TEXT_ALIGN_LEFT));
        this.addUI(new UIText("guide2", 20, 120, "Right Click: Drag to move map", 16, "black", TEXT_ALIGN_LEFT));
        this.addUI(new UIText("guide3", 20, 140, "d: draw", 16, "black", TEXT_ALIGN_LEFT));
        this.addUI(new UIText("guide4", 20, 160, "e: erase", 16, "black", TEXT_ALIGN_LEFT));
        let menuBtn = new UIButton("menuBtn", CANVAS_WIDTH-48, 48, 64, 64, "", () => {
            this.end();
        });
        menuBtn.appendChild(new UIImage("menuIcon", 0, 0, 48, 48, "assets/etc/menu-icon.png"));    


        let mapEditorUI = document.querySelector("#map-editor");
        mapEditorUI.style.display = "block";
        
        if (maps.length == 0) {
            // 임시 맵 이름 뭐로 할지 생각!
            maps.push(new GameMap("Map1"));
        }

        let map = null;
        const select = mapEditorUI.querySelector("#map-select");

        select.addEventListener("change", (e) => {

        });

        const clearMap = () => {
            cameraPos.x = 0, cameraPos.y = 0;
            this.findGameObjects('block').forEach(block => {})
        }

        const loadMaps = () => {
            maps.forEach(map => {
                select.insertAdjacentHTML('beforeend', `<option>${map.name}</option>`);
            });

            map = maps[maps.length-1];
            mapEditorUI.querySelector("#map-name").value = map.name;
        
            map.draw(this);
        };
        loadMaps();

        mapEditorUI.querySelector("#add-btn").addEventListener("click", () => {
            
        });

        mapEditorUI.querySelector("#save-btn").addEventListener("click", () => {
            map.name = mapEditorUI.querySelector("#map-name").value;

            log("\nMap Saved: ");
            log(map.dump());
        });

        this.addUI(camera);

        ////////////// 그리드 선 생성 //////////////
        const LINE_WIDTH = 1;
        const UNIT = BLOCK_SIZE+LINE_WIDTH;
        for (let i=0; i <= CANVAS_WIDTH / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
            let line = new UIRect(`lineVertical${i}`, i*UNIT + cameraPos.x % UNIT, 0, LINE_WIDTH, CANVAS_HEIGHT, 'gray', 0.5, 0);
            this.addUI(line);
        }

        for (let i=0; i <= CANVAS_HEIGHT / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
            let line = new UIRect(`lineHorizontal${i}`, 0, i*UNIT + cameraPos.y % UNIT, CANVAS_WIDTH, LINE_WIDTH, 'gray', 0, 0.5);
            this.addUI(line);
        }
        
        ////////////// 하단 블럭 선택 메뉴 바 생성 //////////////
        let i = 0;
        let blockSelected = null;
        const menuBtnSize = 64;

        let blockMenu = new ObjectT("blockMenu", 16, CANVAS_HEIGHT-menuBtnSize, 0, menuBtnSize+16, 0, 0.5);
        for (const blockId in BLOCK_LIST) {
            let block = new UIImage(`blockMenu_${blockId}`, i*(menuBtnSize+16), 0, menuBtnSize, menuBtnSize, BLOCK_LIST[blockId].sprite, 0, 0.5);
            block.onClick = function() {
                blockSelected = blockId;
                previewBlock.sprite = BLOCK_LIST[blockSelected].sprite;
            }

            blockMenu.appendChild(block);
            blockMenu.transform.width += block.transform.width+16;
            // this.addUI(`menuBtn-${blockId}`, block);
            if (i == 0)
                blockSelected = blockId;
            i++;
        }

        blockMenu.hover = false;
        blockMenu.onHover = function() {
            previewBlock.opacity = 0;
        }

        blockMenu.onScroll = function(e) {
            const d = e.deltaY;
            if ((this.transform.left <= 0 && d > 0) || (this.transform.right >= CANVAS_WIDTH && d < 0))
                this.transform.x += d / 2;
        }

        //////////////   //////////////
        let editorManager = new UI("editorManager", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0);
        let previewBlock = new UIImage("previewBlock", 0, 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_GRASS.sprite, 0, 0);
        previewBlock.opacity = 0.7;

        editorManager.appendChild(previewBlock);
        
        const movePreviewBlock = (e) => {
            const { offsetX, offsetY, deltaX, deltaY } = e;

            previewBlock.transform.x = UNIT * Math.floor((offsetX + cameraPos.x % UNIT) / UNIT) - cameraPos.x % UNIT;
            previewBlock.transform.y = UNIT * Math.floor((offsetY + cameraPos.y % UNIT) / UNIT) - cameraPos.y % UNIT;
        }

        const moveRelative = e => {        
            const { offsetX, offsetY, deltaX, deltaY } = e;
            this.findGameObjects("block").forEach(block => {            
                block.transform.x = block.absX - cameraPos.x;
                block.transform.y = block.absY - cameraPos.y;
            });
        }

        editorManager.onScroll = e => {
            const { deltaX, deltaY } = e;
            cameraPos.x += deltaX;
            cameraPos.y += deltaY;

            for (let i=0; i <= CANVAS_WIDTH / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
                let line = this.findUIObject(`lineVertical${i}`);
                line.transform.x = i*UNIT - cameraPos.x % UNIT;
            }

            for (let i=0; i <= CANVAS_HEIGHT / (BLOCK_SIZE+LINE_WIDTH)+1; i++) {
                let line = this.findUIObject(`lineHorizontal${i}`);
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
                this.removeObject(`block_${absX}_${absY}`);
            }
        }

        const place = (screenX, screenY, idx) => {
            let x = UNIT * Math.floor((screenX + cameraPos.x % UNIT) / UNIT) - cameraPos.x % UNIT;
            let y = UNIT * Math.floor((screenY + cameraPos.y % UNIT) / UNIT) - cameraPos.y % UNIT;
            
            let absX = cameraPos.x + x;
            let absY = cameraPos.y + y;

            if (map.getBlock(absX, absY)) {
                this.removeObject(`block_${absX}_${absY}`);
            }

            let block = new UIImage(`block_${absX}_${absY}`, x, y, BLOCK_SIZE, BLOCK_SIZE, BLOCK_LIST[blockSelected].sprite, 0, 0);
            block.absX = absX;
            block.absY = absY;

            console.log('Block placed at', absX, absY)
            this.addGameObject(block);
            map.placeBlock(absX, absY, BLOCK_LIST[idx].id);
        }

        editorManager.onClick = (e, isRight) => {
            const { offsetX, offsetY } = e;

            if (!isRight) { // 좌클릭
                if (mode == "draw")             
                    place(offsetX, offsetY, blockSelected);
                else 
                    destroyBlock(offsetX, offsetY);
            }
        }

        editorManager.onMouseMove = e => {
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

        editorManager.onKeyDown = e => {        
            if (e.code == "KeyD") {
                previewBlock.sprite = BLOCK_LIST[blockSelected].sprite;
                mode = "draw";            
            }
            else if (e.code == "KeyE") {
                previewBlock.sprite = Block.destroyImages[5];
                mode = "erase";
            }

            this.findUIObject("currentMode").text = mode;
        }

        editorManager.hover = false;
        editorManager.onHover = function() {        
            previewBlock.opacity = 0.7;
        }

        this.addUI(editorManager);
        this.addUI(blockMenu);
        this.addUI(menuBtn);
    }

    scene.update = function() {
        

        this.draw();
    }

    return scene;
};