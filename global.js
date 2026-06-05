// 글로벌 변수: 블럭 등

const ItemInfo = function(src) {
    let img = new Image();
    img.src = src;

    this.sprite = img;
    
    return this;
}

const ITEM_DIRT         = new ItemInfo("assets/items/dirt.png");
const ITEM_OAK_LOG      = new ItemInfo("assets/items/oak_log.png");
const ITEM_COBBLESTONE  = new ItemInfo("assets/items/cobblestone.png");
const ITEM_IRON_INGOT   = new ItemInfo("assets/items/iron_ingot.png");
const ITEM_DIAMOND      = new ItemInfo("assets/items/diamond.png");

const BlockInfo = function(blockId, src, hp=1, itemInfo=null) {
    let img = new Image();
    img.src = src;
    
    this.sprite = img;
    this.id = blockId;
    this.hp = hp;
    this.itemInfo = itemInfo;

    return this;
};

// overworld blocks
const BLOCK_GRASS       = new BlockInfo("b_grass",          "assets/blocks/over/grass.png", 1, ITEM_DIRT);
const BLOCK_DIRT        = new BlockInfo("b_dirt",           "assets/blocks/over/dirt.png", 1, ITEM_DIRT);
const BLOCK_STONE       = new BlockInfo("b_stone",          "assets/blocks/over/stone.png", 2, ITEM_COBBLESTONE);
const BLOCK_OAK_LOG     = new BlockInfo("b_oak_log",        "assets/blocks/over/oak_log.png", 2, ITEM_OAK_LOG);
const BLOCK_IRON_ORE    = new BlockInfo("b_iron_ore",       "assets/blocks/over/iron_ore.png", 3, ITEM_IRON_INGOT);
const BLOCK_DIAMOND_ORE = new BlockInfo("b_diamond_ore",    "assets/blocks/over/diamond_ore.png", 5, ITEM_DIAMOND);
const BLOCK_OBSIDIAN    = new BlockInfo("b_obsidian",       "assets/blocks/over/obsidian.png", 50);
const BLOCK_TNT         = new BlockInfo("b_tnt",            "assets/blocks/over/tnt.png");
const BLOCK_ZOMBIE      = new BlockInfo("b_zombie",         "assets/blocks/over/zombie.png");
const BLOCK_PIG         = new BlockInfo("b_pig",            "assets/blocks/over/pig.png");
const BLOCK_SHEEP       = new BlockInfo("b_sheep",          "assets/blocks/over/sheep.png");
const BLOCK_SPIDER      = new BlockInfo("b_spider",         "assets/blocks/over/spider.png");
const BLOCK_CREEPER     = new BlockInfo("b_creeper",        "assets/blocks/over/creeper.png");

// nether blocks
const BLOCK_SOULSAND        = new BlockInfo("b_soulsand",           "assets/blocks/nether/soulsand.png");
const BLOCK_NETHERRACK      = new BlockInfo("b_netherrack",         "assets/blocks/nether/netherrack.png");
const BLOCK_ANCIENT_DEBRIS  = new BlockInfo("b_ancient_debris",     "assets/blocks/nether/ancient_debris.png");
const BLOCK_NETHER_GOLD_ORE = new BlockInfo("b_nether_gold_ore",    "assets/blocks/nether/nether_gold_ore.png");
const BLOCK_NETHER_BRICKS   = new BlockInfo("b_nether_bricks",      "assets/blocks/nether/nether_bricks.png");
const BLOCK_BLAZE           = new BlockInfo("b_blaze",              "assets/blocks/nether/blaze.png");

// ender blocks
const BLOCK_ENDERMAN        = new BlockInfo("b_enderman",   "assets/blocks/ender/enderman.png");

let BLOCK_LIST = {};

[
    BLOCK_GRASS,       
    BLOCK_DIRT,        
    BLOCK_STONE,       
    BLOCK_OAK_LOG,     
    BLOCK_IRON_ORE,    
    BLOCK_DIAMOND_ORE, 
    BLOCK_OBSIDIAN,    
    BLOCK_TNT,         
    BLOCK_ZOMBIE,      
    BLOCK_PIG,         
    BLOCK_SHEEP,       
    BLOCK_SPIDER,      
    BLOCK_CREEPER,     
    
    // nether
    BLOCK_SOULSAND,        
    BLOCK_NETHERRACK,      
    BLOCK_ANCIENT_DEBRIS,  
    BLOCK_NETHER_GOLD_ORE, 
    BLOCK_NETHER_BRICKS,   
    BLOCK_BLAZE,           

    // ender
    BLOCK_ENDERMAN,
].forEach(blockInfo => {
    BLOCK_LIST[blockInfo.id] = blockInfo;
})

const BLOCK_SIZE  = 64;

const LEVEL_WOOD    = 0;
const LEVEL_STONE   = 1;
const LEVEL_IRON    = 2;
const LEVEL_DIAMOND = 3;

const SLOT_COUNT = 9;

const CANVAS_WIDTH  = 1024;
const CANVAS_HEIGHT = 768;

class GameMap {

    constructor(name) {
        this.name = name;
        this.map = {};
    }

    dump() {
        return JSON.stringify({
            'name': this.name,
            'data': this.map
        });
    }

    draw(scene) {
        let blocks = [];
        for (const _coord in this.map) {
            let blockId = this.map[_coord];
            let absX = parseInt(_coord.split(', ')[0]);
            let absY = parseInt(_coord.split(', ')[1]);

            const blockInfo = BLOCK_LIST[blockId];

            let block = new Block(`block_${absX}_${absY}`, absX, absY, blockInfo);
            block.absX = absX;
            block.absY = absY;

            // console.log('Block placed at', absX, absY)
            scene.addGameObject(block);
            blocks.push(block);
        }
        return blocks;
    }
    
    coord(x, y) { return `${x}, ${y}`; }

    getBlock(x, y) {
        if (this.map[this.coord(x, y)]) return this.map[this.coord(x, y)];
        return false;
    }

    removeBlock(x, y) {
        delete this.map[this.coord(x, y)];
    }

    placeBlock(x, y, blockId) {
        this.map[this.coord(x, y)] = blockId;
    }
}

GameMap.makeRandomName = function() {
    const colors = ['red', 'yellow', 'orange', 'green', 'blue', 'black', 'white'];
    const nouns = ['elephant', 'panda', 'apple', 'potato', 'bird'];

    const color = colors[Math.floor(Math.random() * colors.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${color}_${noun}`;
}

GameMap.load = function(map) {
    if (typeof map == 'string')
        map = JSON.parse(map);

    let _map = new GameMap(map.name);
    _map.map = map.data;
    return _map;
}


let maps = [];
maps.push(GameMap.load({"name":"test","data":{"390, 390":"b_grass","455, 390":"b_grass","520, 390":"b_grass","585, 390":"b_grass","520, 325":"b_oak_log","520, 260":"b_oak_log","520, 195":"b_oak_log","455, 325":"b_zombie","585, 325":"b_pig","390, 455":"b_dirt","390, 520":"b_dirt","390, 585":"b_stone","455, 585":"b_stone","520, 585":"b_stone","585, 585":"b_stone","585, 520":"b_stone","585, 455":"b_grass","520, 455":"b_dirt","455, 455":"b_dirt","455, 520":"b_dirt","520, 520":"b_stone","455, 260":"b_zombie","715, 390":"b_grass","650, 390":"b_grass","715, 455":"b_stone","650, 455":"b_dirt","650, 520":"b_stone","715, 520":"b_stone","715, 585":"b_stone","650, 585":"b_stone","780, 390":"b_grass","845, 390":"b_grass","910, 390":"b_grass","975, 390":"b_grass","1040, 390":"b_grass","1105, 390":"b_grass","780, 455":"b_dirt","845, 455":"b_dirt","910, 455":"b_dirt","975, 455":"b_dirt","1040, 455":"b_dirt","1105, 455":"b_dirt","1105, 520":"b_dirt","1040, 520":"b_iron_ore","975, 520":"b_stone","910, 520":"b_stone","845, 520":"b_diamond_ore","780, 520":"b_stone","780, 585":"b_stone","845, 585":"b_stone","910, 585":"b_stone","975, 585":"b_stone","1040, 585":"b_iron_ore","1105, 585":"b_stone","845, 325":"b_oak_log","845, 260":"b_oak_log","845, 195":"b_oak_log","845, 130":"b_oak_log","845, 65":"b_oak_log","715, 0":"b_zombie","780, 0":"b_zombie","845, 0":"b_creeper","910, 0":"b_zombie","975, 0":"b_zombie","780, -65":"b_zombie","845, -65":"b_zombie","910, -65":"b_zombie","845, -130":"b_zombie","910, 65":"b_tnt","1040, 325":"b_sheep","1170, 325":"b_grass","1235, 260":"b_grass","1300, 195":"b_grass","1365, 195":"b_grass","1430, 195":"b_grass","1235, 325":"b_dirt","1235, 390":"b_dirt","1170, 390":"b_dirt","1170, 455":"b_dirt","1170, 520":"b_dirt","1235, 520":"b_dirt","1300, 520":"b_stone","1300, 455":"b_stone","1365, 455":"b_stone","1300, 390":"b_dirt","1235, 455":"b_dirt","1365, 390":"b_stone","1365, 325":"b_dirt","1300, 325":"b_dirt","1365, 260":"b_dirt","1300, 260":"b_dirt","1430, 260":"b_dirt","1430, 325":"b_dirt","1430, 390":"b_stone","1430, 455":"b_stone","1430, 520":"b_stone","1365, 520":"b_stone","1365, 585":"b_stone","1300, 585":"b_diamond_ore","1235, 585":"b_stone","1235, 650":"b_stone","1170, 650":"b_stone","1170, 585":"b_stone","1430, 585":"b_creeper","780, 780":"b_stone","1105, 650":"b_stone","1300, 130":"b_obsidian","1365, 130":"b_obsidian","1430, 130":"b_obsidian","1495, 130":"b_obsidian","1495, 65":"b_obsidian","1495, 0":"b_obsidian","1495, -65":"b_obsidian","1495, -130":"b_obsidian","1430, -130":"b_obsidian","1365, -130":"b_obsidian","1300, -130":"b_obsidian","1300, -65":"b_obsidian","1300, 0":"b_obsidian","1300, 65":"b_obsidian","1495, 195":"b_grass","1560, 195":"b_grass","1625, 195":"b_grass","1495, 260":"b_dirt","1560, 260":"b_dirt","1625, 260":"b_dirt","1625, 325":"b_stone","1560, 325":"b_stone","1495, 325":"b_stone","1625, 390":"b_stone","1560, 390":"b_stone","1495, 390":"b_stone","1495, 455":"b_stone","1560, 455":"b_stone","1495, 520":"b_stone","390, 715":"b_stone","390, 650":"b_stone","455, 650":"b_stone","520, 650":"b_stone","585, 650":"b_stone","650, 650":"b_stone","715, 650":"b_stone","780, 650":"b_stone","845, 650":"b_stone","910, 650":"b_stone","975, 650":"b_stone","1040, 650":"b_stone","1040, 715":"b_stone","975, 715":"b_stone","910, 715":"b_stone","845, 715":"b_stone","780, 715":"b_creeper","715, 715":"b_stone","650, 715":"b_stone","585, 715":"b_stone","520, 715":"b_stone","455, 715":"b_stone","455, 780":"b_stone","390, 780":"b_stone","520, 780":"b_stone","585, 780":"b_stone","650, 780":"b_stone","715, 780":"b_stone","845, 780":"b_stone","910, 780":"b_stone","975, 780":"b_stone","1040, 780":"b_stone","1105, 780":"b_stone","1170, 780":"b_stone","1235, 780":"b_stone","1105, 715":"b_stone","1170, 715":"b_stone","1235, 715":"b_stone","1300, 715":"b_stone","1365, 715":"b_stone","1430, 715":"b_stone","1495, 715":"b_stone","1560, 715":"b_stone","1625, 715":"b_stone","1625, 650":"b_stone","1625, 585":"b_stone","1625, 520":"b_stone","1625, 455":"b_stone","1560, 585":"b_stone","1560, 520":"b_stone","1495, 585":"b_stone","1430, 650":"b_stone","1365, 650":"b_stone","1495, 650":"b_stone","1560, 650":"b_stone","1300, 650":"b_stone","1300, 780":"b_zombie","1365, 780":"b_stone","1430, 780":"b_stone","1495, 780":"b_stone","1560, 780":"b_stone","1625, 780":"b_creeper","455, 130":"b_zombie","520, 130":"b_zombie","585, 130":"b_zombie","520, 65":"b_zombie","325, 780":"b_oak_log","325, 715":"b_oak_log","325, 650":"b_oak_log","325, 585":"b_oak_log","325, 520":"b_oak_log","325, 455":"b_oak_log","325, 390":"b_oak_log","1690, 780":"b_oak_log","1690, 715":"b_oak_log","1690, 650":"b_oak_log","1690, 585":"b_oak_log","1690, 520":"b_oak_log","1690, 455":"b_oak_log","1690, 390":"b_oak_log","1690, 325":"b_oak_log","1690, 260":"b_oak_log","1690, 195":"b_oak_log","325, 325":"b_grass","1690, 130":"b_grass"}}));
maps.push(GameMap.load({"name":"asdf", "data":{}}));
maps.push(GameMap.load({"name":"level1","data":{"845, 130":"b_dirt","845, 65":"b_stone","715, 0":"b_dirt","780, 0":"b_iron_ore","845, 0":"b_dirt","910, 0":"b_dirt","780, -65":"b_iron_ore","845, -65":"b_iron_ore","910, -65":"b_stone","845, -130":"b_iron_ore","910, 65":"b_dirt","130, 130":"b_stone","195, 130":"b_stone","130, 65":"b_dirt","195, 65":"b_dirt","260, 65":"b_grass","325, 65":"b_grass","390, 65":"b_diamond_ore","455, 65":"b_dirt","455, 0":"b_stone","520, 0":"b_dirt","585, 0":"b_stone","650, 0":"b_stone","715, 130":"b_dirt","715, 65":"b_dirt","780, 130":"b_dirt","130, 195":"b_stone","325, 130":"b_oak_log","325, 195":"b_oak_log","325, 260":"b_oak_log","130, 0":"b_iron_ore","195, 0":"b_iron_ore","260, 0":"b_stone","325, 0":"b_stone","390, 0":"b_iron_ore","390, -65":"b_stone","325, -65":"b_iron_ore","260, -65":"b_iron_ore","65, -130":"b_stone","130, -130":"b_iron_ore","260, -130":"b_stone","325, -130":"b_stone","390, -130":"b_stone","455, -130":"b_stone","520, -130":"b_stone","585, -130":"b_stone","520, -65":"b_stone","455, -65":"b_stone","585, -65":"b_iron_ore","650, -65":"b_stone","650, -130":"b_stone","780, -130":"b_stone","715, -65":"b_stone","780, 65":"b_dirt","910, -130":"b_stone","715, 195":"b_oak_log","715, 260":"b_oak_log","715, 390":"b_oak_log","325, 325":"b_oak_log","455, 130":"b_dirt","650, 65":"b_stone","650, 130":"b_grass","585, 65":"b_grass","585, 130":"b_grass","650, 195":"b_grass","130, -195":"b_iron_ore","195, -195":"b_iron_ore","260, -195":"b_stone","390, -195":"b_stone","650, -195":"b_stone","845, -195":"b_stone","650, -260":"b_stone","585, -260":"b_stone","520, -260":"b_diamond_ore","455, -260":"b_diamond_ore","390, -260":"b_stone","455, -195":"b_diamond_ore","520, -195":"b_iron_ore","585, -195":"b_iron_ore","325, -325":"b_stone","390, -325":"b_stone","390, -390":"b_stone","455, -390":"b_stone","325, -390":"b_stone","455, -325":"b_stone","520, -325":"b_stone","910, -195":"b_stone","910, -260":"b_stone","845, -260":"b_stone","780, -260":"b_stone","715, -260":"b_stone","715, -325":"b_stone","780, -325":"b_stone","910, -325":"b_stone","780, -390":"b_stone","715, -390":"b_obsidian","650, -390":"b_stone","650, -325":"b_iron_ore","585, -390":"b_stone","520, -390":"b_stone","585, -325":"b_stone","260, -390":"b_stone","195, -390":"b_stone","195, -260":"b_stone","130, -260":"b_stone","65, -195":"b_stone","65, -260":"b_stone","130, -325":"b_stone","130, -390":"b_diamond_ore","65, -325":"b_stone","65, -390":"b_stone","130, -455":"b_diamond_ore","195, -455":"b_diamond_ore","260, -455":"b_obsidian","325, -455":"b_obsidian","390, -455":"b_obsidian","455, -455":"b_stone","520, -455":"b_obsidian","585, -455":"b_obsidian","650, -455":"b_stone","715, -455":"b_iron_ore","910, -390":"b_stone","910, -455":"b_diamond_ore","0, -65":"b_stone","0, -130":"b_stone","0, -195":"b_stone","0, -260":"b_stone","0, -325":"b_stone","0, -390":"b_stone","0, -455":"b_stone","65, -455":"b_stone","65, -520":"b_stone","975, -65":"b_stone","975, -130":"b_stone","975, -195":"b_stone","975, -260":"b_stone","975, -325":"b_stone","975, -390":"b_stone","975, -455":"b_stone","975, -520":"b_stone","910, -520":"b_stone","845, -585":"b_stone","780, -585":"b_stone","650, -585":"b_stone","650, -520":"b_iron_ore","715, -520":"b_iron_ore","975, -585":"b_stone","910, -585":"b_stone","715, -585":"b_stone","585, -520":"b_stone","585, -585":"b_stone","520, -585":"b_stone","520, -520":"b_obsidian","455, -520":"b_obsidian","390, -520":"b_obsidian","390, -585":"b_stone","455, -585":"b_stone","325, -585":"b_stone","260, -585":"b_stone","260, -520":"b_obsidian","325, -520":"b_diamond_ore","195, -585":"b_stone","195, -520":"b_diamond_ore","130, -520":"b_stone","130, -585":"b_stone","65, -585":"b_stone","0, -520":"b_stone","0, -585":"b_stone","0, 0":"b_stone","65, 0":"b_stone","0, 65":"b_dirt","65, 65":"b_dirt","65, 130":"b_dirt","0, 130":"b_dirt","0, 195":"b_dirt","65, 195":"b_stone","845, 195":"b_grass","780, 195":"b_grass","910, 130":"b_grass","910, 195":"b_grass","975, 130":"b_grass","975, 195":"b_grass","715, 325":"b_oak_log","975, 65":"b_dirt","975, 0":"b_dirt","0, 325":"b_oak_log","0, 260":"b_oak_log","0, 390":"b_oak_log","520, 65":"b_stone","520, 130":"b_dirt","585, 195":"b_dirt","520, 195":"b_dirt","845, -520":"b_diamond_ore"}}));
// maps.push(GameMap.load({"name":"level1","data":{"390, 390":"b_iron_ore","455, 390":"b_diamond_ore","520, 390":"b_diamond_ore","585, 390":"b_diamond_ore","520, 325":"b_diamond_ore","520, 260":"b_diamond_ore","455, 325":"b_diamond_ore","585, 325":"b_diamond_ore","455, 260":"b_diamond_ore","715, 390":"b_obsidian","650, 390":"b_obsidian","780, 390":"b_obsidian","845, 390":"b_obsidian","910, 390":"b_obsidian","975, 390":"b_obsidian","845, 325":"b_obsidian","845, 260":"b_obsidian","325, 390":"b_iron_ore","325, 325":"b_iron_ore","0, 390":"b_grass","65, 390":"b_dirt","130, 390":"b_oak_log","195, 390":"b_oak_log","0, 325":"b_oak_log","65, 325":"b_oak_log","130, 325":"b_oak_log","195, 325":"b_oak_log","0, 260":"b_oak_log","65, 260":"b_oak_log","130, 260":"b_oak_log","195, 260":"b_oak_log","260, 260":"b_iron_ore","260, 325":"b_iron_ore","260, 390":"b_iron_ore","325, 260":"b_iron_ore","390, 260":"b_iron_ore","390, 325":"b_iron_ore","585, 260":"b_diamond_ore","650, 260":"b_obsidian","650, 325":"b_obsidian","715, 325":"b_obsidian","715, 260":"b_obsidian","780, 260":"b_obsidian","780, 325":"b_obsidian","910, 260":"b_obsidian","910, 325":"b_obsidian","975, 325":"b_obsidian","975, 260":"b_obsidian"}}));
maps.push(GameMap.load({"name":"level2","data":{"390, 390":"b_netherrack","455, 390":"b_netherrack","520, 390":"b_enderman","585, 390":"b_enderman","520, 325":"b_enderman","520, 260":"b_enderman","455, 325":"b_netherrack","585, 325":"b_enderman","455, 260":"b_netherrack","715, 390":"b_enderman","650, 390":"b_enderman","780, 390":"b_blaze","845, 390":"b_blaze","910, 390":"b_blaze","975, 390":"b_blaze","845, 325":"b_blaze","845, 260":"b_blaze","325, 390":"b_netherrack","325, 325":"b_netherrack","0, 390":"b_netherrack","65, 390":"b_netherrack","130, 390":"b_netherrack","195, 390":"b_netherrack","0, 325":"b_netherrack","65, 325":"b_netherrack","130, 325":"b_netherrack","195, 325":"b_netherrack","0, 260":"b_netherrack","65, 260":"b_netherrack","130, 260":"b_netherrack","195, 260":"b_netherrack","260, 260":"b_netherrack","260, 325":"b_netherrack","260, 390":"b_netherrack","325, 260":"b_netherrack","390, 260":"b_netherrack","390, 325":"b_netherrack","585, 260":"b_enderman","650, 260":"b_enderman","650, 325":"b_enderman","715, 325":"b_enderman","715, 260":"b_enderman","780, 260":"b_blaze","780, 325":"b_blaze","910, 260":"b_blaze","910, 325":"b_blaze","975, 325":"b_blaze","975, 260":"b_blaze"}}));
maps.push(GameMap.load({"name":"level3","data":{"390, 390":"b_obsidian","455, 390":"b_obsidian","520, 390":"b_obsidian","585, 390":"b_obsidian","520, 325":"b_obsidian","455, 325":"b_obsidian","585, 325":"b_obsidian","455, 260":"b_obsidian","715, 390":"b_obsidian","650, 390":"b_obsidian","780, 390":"b_end_crystal","845, 390":"b_end_crystal","910, 390":"b_end_crystal","975, 390":"b_end_crystal","845, 325":"b_end_crystal","325, 390":"b_obsidian","325, 325":"b_obsidian","0, 390":"b_enderman","65, 390":"b_enderman","130, 390":"b_enderman","195, 390":"b_enderman","0, 325":"b_enderman","65, 325":"b_enderman","130, 325":"b_enderman","195, 325":"b_enderman","260, 260":"b_obsidian","260, 325":"b_obsidian","260, 390":"b_obsidian","390, 260":"b_obsidian","390, 325":"b_obsidian","650, 325":"b_obsidian","715, 325":"b_obsidian","715, 260":"b_obsidian","780, 325":"b_end_crystal","910, 325":"b_end_crystal","975, 325":"b_end_crystal","0, 260":"b_enderman","65, 260":"b_enderman","130, 260":"b_enderman","195, 260":"b_enderman","325, 260":"b_obsidian","520, 260":"b_obsidian","585, 260":"b_obsidian","650, 260":"b_obsidian","780, 260":"b_end_crystal","975, 260":"b_end_crystal","910, 260":"b_end_crystal","845, 260":"b_end_crystal"}}));

const log = (msg) => {
    const debug = document.querySelector("#log");
    debug.insertAdjacentHTML('beforeend', `<p>${msg}</p>`);
    debug.scrollTop = debug.scrollHeight;
};