const editorScene = () => {
    let scene = new Scene("editor");


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

    console.log(menu.transform.width)
    menu.onScroll = function(d) {
        if ((this.transform.left <= 0 && d > 0) || (this.transform.right >= CANVAS_WIDTH && d < 0))
            this.transform.x += d / 2;
    }
    scene.addUI("menu", menu);

    let cameraPos = new Vector2D(0, 0);
    scene.update = function() {
        

        this.draw();
    }

    return scene;
};