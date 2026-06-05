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
const ITEM_ENDER_PEARL  = new ItemInfo("assets/items/ender_pearl.png");
const ITEM_BLAZE_ROD    = new ItemInfo("assets/items/blaze_rod.png");
const ITEM_OBSIDIAN     = new ItemInfo("assets/items/obsidian.png");
const ITEM_NETHERRACK   = new ItemInfo("assets/items/netherrack.png");
const ITEM_GOLD_INGOT  = new ItemInfo("assets/items/gold_ingot.png");

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
const BLOCK_GRASS       = new BlockInfo("b_grass",          "assets/blocks/over/grass.png", 2, ITEM_DIRT);
const BLOCK_DIRT        = new BlockInfo("b_dirt",           "assets/blocks/over/dirt.png", 2, ITEM_DIRT);
const BLOCK_STONE       = new BlockInfo("b_stone",          "assets/blocks/over/stone.png", 4, ITEM_COBBLESTONE);
const BLOCK_OAK_LOG     = new BlockInfo("b_oak_log",        "assets/blocks/over/oak_log.png", 2, ITEM_OAK_LOG);
const BLOCK_IRON_ORE    = new BlockInfo("b_iron_ore",       "assets/blocks/over/iron_ore.png", 5, ITEM_IRON_INGOT);
const BLOCK_DIAMOND_ORE = new BlockInfo("b_diamond_ore",    "assets/blocks/over/diamond_ore.png", 5, ITEM_DIAMOND);
const BLOCK_OBSIDIAN    = new BlockInfo("b_obsidian",       "assets/blocks/over/obsidian.png", 10, ITEM_OBSIDIAN);
const BLOCK_TNT         = new BlockInfo("b_tnt",            "assets/blocks/over/tnt.png");
const BLOCK_ZOMBIE      = new BlockInfo("b_zombie",         "assets/blocks/over/zombie.png");
const BLOCK_PIG         = new BlockInfo("b_pig",            "assets/blocks/over/pig.png");
const BLOCK_SHEEP       = new BlockInfo("b_sheep",          "assets/blocks/over/sheep.png");
const BLOCK_SPIDER      = new BlockInfo("b_spider",         "assets/blocks/over/spider.png");
const BLOCK_CREEPER     = new BlockInfo("b_creeper",        "assets/blocks/over/creeper.png");

// nether blocks
const BLOCK_SOULSAND        = new BlockInfo("b_soulsand",           "assets/blocks/nether/soulsand.png");
const BLOCK_NETHERRACK      = new BlockInfo("b_netherrack",         "assets/blocks/nether/netherrack.png", 1, ITEM_NETHERRACK);
const BLOCK_ANCIENT_DEBRIS  = new BlockInfo("b_ancient_debris",     "assets/blocks/nether/ancient_debris.png");
const BLOCK_NETHER_GOLD_ORE = new BlockInfo("b_nether_gold_ore",    "assets/blocks/nether/nether_gold_ore.png", 5, ITEM_GOLD_INGOT);
const BLOCK_NETHER_BRICKS   = new BlockInfo("b_nether_bricks",      "assets/blocks/nether/nether_bricks.png");
const BLOCK_BLAZE           = new BlockInfo("b_blaze",              "assets/blocks/nether/blaze.png", 5, ITEM_BLAZE_ROD);

// ender blocks
const BLOCK_ENDERMAN        = new BlockInfo("b_enderman",       "assets/blocks/ender/enderman.png", 5, ITEM_ENDER_PEARL);
const BLOCK_END_CRYSTAL     = new BlockInfo("b_end_crystal",    "assets/blocks/ender/end_crystal.png", 1)

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
    BLOCK_END_CRYSTAL
].forEach(blockInfo => {
    BLOCK_LIST[blockInfo.id] = blockInfo;
})

const BLOCK_SIZE  = 64;

const LEVEL_WOOD    = 0;
const LEVEL_STONE   = 1;
const LEVEL_IRON    = 2;
const LEVEL_GOLD    = 3;
const LEVEL_DIAMOND = 4;

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
maps.push(GameMap.load({"name":"level2","data":{"390, 390":"b_nether_gold_ore","455, 390":"b_netherrack","520, 390":"b_netherrack","585, 390":"b_netherrack","520, 325":"b_netherrack","520, 260":"b_netherrack","520, 195":"b_nether_gold_ore","455, 325":"b_netherrack","585, 325":"b_netherrack","455, 260":"b_netherrack","715, 390":"b_netherrack","650, 390":"b_netherrack","780, 390":"b_netherrack","845, 390":"b_netherrack","910, 390":"b_netherrack","975, 390":"b_netherrack","845, 325":"b_netherrack","845, 260":"b_netherrack","845, 195":"b_netherrack","845, 130":"b_nether_gold_ore","845, 65":"b_netherrack","715, 0":"b_nether_gold_ore","780, 0":"b_netherrack","845, 0":"b_netherrack","910, 0":"b_netherrack","975, 0":"b_netherrack","780, -65":"b_netherrack","845, -65":"b_netherrack","910, -65":"b_soulsand","845, -130":"b_soulsand","910, 65":"b_netherrack","455, 130":"b_netherrack","520, 130":"b_nether_gold_ore","585, 130":"b_nether_gold_ore","520, 65":"b_netherrack","325, 390":"b_nether_gold_ore","325, 325":"b_netherrack","0, 390":"b_netherrack","65, 390":"b_netherrack","130, 390":"b_netherrack","195, 390":"b_netherrack","260, 390":"b_netherrack","910, 325":"b_netherrack","975, 325":"b_nether_gold_ore","780, 325":"b_netherrack","715, 325":"b_netherrack","650, 325":"b_netherrack","390, 325":"b_netherrack","260, 325":"b_netherrack","195, 325":"b_netherrack","130, 325":"b_netherrack","65, 325":"b_netherrack","0, 325":"b_netherrack","0, 260":"b_netherrack","65, 260":"b_netherrack","130, 260":"b_netherrack","195, 260":"b_netherrack","260, 260":"b_netherrack","325, 260":"b_netherrack","390, 260":"b_netherrack","585, 260":"b_netherrack","650, 260":"b_netherrack","715, 260":"b_netherrack","780, 260":"b_netherrack","910, 260":"b_netherrack","975, 260":"b_nether_gold_ore","975, 195":"b_netherrack","910, 195":"b_netherrack","780, 195":"b_nether_gold_ore","715, 195":"b_netherrack","650, 195":"b_netherrack","585, 195":"b_netherrack","455, 195":"b_nether_gold_ore","390, 195":"b_netherrack","325, 195":"b_netherrack","260, 195":"b_netherrack","195, 195":"b_netherrack","130, 195":"b_nether_gold_ore","65, 195":"b_netherrack","0, 195":"b_netherrack","0, 130":"b_netherrack","195, 130":"b_netherrack","260, 130":"b_netherrack","325, 130":"b_netherrack","390, 130":"b_netherrack","650, 130":"b_netherrack","715, 130":"b_netherrack","780, 130":"b_nether_gold_ore","910, 130":"b_netherrack","975, 130":"b_netherrack","975, 65":"b_netherrack","780, 65":"b_nether_gold_ore","715, 65":"b_nether_gold_ore","650, 65":"b_netherrack","585, 65":"b_netherrack","455, 65":"b_netherrack","390, 65":"b_netherrack","325, 0":"b_nether_gold_ore","260, 0":"b_nether_gold_ore","195, 0":"b_netherrack","130, 0":"b_netherrack","65, 0":"b_netherrack","0, 0":"b_netherrack","0, 65":"b_netherrack","65, 65":"b_netherrack","130, 65":"b_netherrack","195, 65":"b_netherrack","260, 65":"b_netherrack","325, 65":"b_nether_gold_ore","520, 0":"b_netherrack","455, 0":"b_netherrack","585, 0":"b_netherrack","650, 0":"b_netherrack","390, 0":"b_nether_gold_ore","65, 130":"b_nether_gold_ore","130, 130":"b_nether_gold_ore","0, -130":"b_soulsand","65, -130":"b_soulsand","130, -130":"b_soulsand","195, -130":"b_soulsand","260, -130":"b_soulsand","325, -130":"b_soulsand","390, -130":"b_netherrack","520, -130":"b_nether_gold_ore","585, -130":"b_nether_gold_ore","650, -130":"b_nether_gold_ore","715, -130":"b_nether_gold_ore","780, -130":"b_soulsand","910, -130":"b_soulsand","975, -130":"b_soulsand","975, -65":"b_soulsand","715, -65":"b_netherrack","650, -65":"b_netherrack","585, -65":"b_netherrack","520, -65":"b_netherrack","455, -65":"b_netherrack","390, -65":"b_netherrack","325, -65":"b_soulsand","260, -65":"b_netherrack","195, -65":"b_netherrack","130, -65":"b_netherrack","65, -65":"b_soulsand","0, -65":"b_soulsand","65, -195":"b_soulsand","130, -195":"b_soulsand","195, -195":"b_soulsand","260, -195":"b_soulsand","325, -195":"b_soulsand","390, -195":"b_soulsand","455, -195":"b_netherrack","520, -195":"b_soulsand","585, -195":"b_soulsand","715, -195":"b_netherrack","780, -195":"b_soulsand","845, -195":"b_soulsand","910, -195":"b_soulsand","0, -195":"b_soulsand","975, -195":"b_soulsand","0, -455":"b_nether_bricks","0, -390":"b_nether_bricks","0, -325":"b_nether_bricks","0, -260":"b_nether_bricks","65, -455":"b_nether_bricks","65, -390":"b_nether_bricks","65, -325":"b_nether_bricks","65, -260":"b_nether_bricks","520, -455":"b_nether_bricks","520, -390":"b_nether_bricks","520, -325":"b_nether_bricks","520, -260":"b_nether_bricks","585, -455":"b_nether_bricks","585, -390":"b_blaze","585, -325":"b_nether_bricks","585, -260":"b_nether_bricks","780, -455":"b_nether_bricks","780, -390":"b_nether_bricks","780, -325":"b_nether_bricks","780, -260":"b_nether_bricks","845, -455":"b_nether_bricks","845, -390":"b_nether_bricks","845, -325":"b_nether_bricks","845, -260":"b_nether_bricks","260, -455":"b_nether_bricks","260, -390":"b_nether_bricks","260, -325":"b_nether_bricks","260, -260":"b_nether_bricks","195, -455":"b_nether_bricks","195, -390":"b_nether_bricks","195, -325":"b_nether_bricks","195, -260":"b_nether_bricks","0, -520":"b_nether_bricks","65, -520":"b_nether_bricks","130, -520":"b_nether_bricks","195, -520":"b_blaze","260, -520":"b_nether_bricks","325, -520":"b_nether_bricks","390, -520":"b_nether_bricks","455, -520":"b_nether_bricks","520, -520":"b_nether_bricks","585, -520":"b_nether_bricks","650, -520":"b_nether_bricks","715, -520":"b_nether_bricks","780, -520":"b_nether_bricks","845, -520":"b_nether_bricks","0, -585":"b_nether_bricks","65, -585":"b_nether_bricks","130, -585":"b_nether_bricks","195, -585":"b_nether_bricks","260, -585":"b_nether_bricks","325, -585":"b_nether_bricks","390, -585":"b_nether_bricks","455, -585":"b_blaze","520, -585":"b_nether_bricks","585, -585":"b_nether_bricks","650, -585":"b_nether_bricks","715, -585":"b_nether_bricks","780, -585":"b_nether_bricks","845, -585":"b_nether_bricks","65, -650":"b_blaze","195, -650":"b_blaze","650, -650":"b_blaze","130, -260":"b_soulsand","130, -325":"b_soulsand","130, -390":"b_soulsand","130, -455":"b_soulsand","325, -455":"b_nether_gold_ore","325, -390":"b_nether_gold_ore","325, -325":"b_nether_gold_ore","390, -325":"b_soulsand","390, -260":"b_soulsand","325, -260":"b_soulsand","390, -390":"b_nether_gold_ore","390, -455":"b_nether_gold_ore","455, -455":"b_soulsand","455, -390":"b_soulsand","455, -325":"b_soulsand","455, -260":"b_soulsand","650, -455":"b_soulsand","650, -390":"b_soulsand","650, -325":"b_soulsand","650, -260":"b_soulsand","715, -260":"b_soulsand","715, -325":"b_soulsand","715, -390":"b_soulsand","715, -455":"b_soulsand","910, -585":"b_nether_bricks","910, -520":"b_nether_bricks","910, -455":"b_soulsand","910, -390":"b_soulsand","910, -325":"b_soulsand","910, -260":"b_soulsand","975, -260":"b_soulsand","975, -325":"b_soulsand","975, -390":"b_nether_gold_ore","975, -585":"b_nether_bricks","975, -520":"b_nether_bricks","975, -455":"b_nether_gold_ore","0, -650":"b_nether_bricks","0, -715":"b_nether_bricks","0, -780":"b_nether_bricks","65, -780":"b_nether_bricks","130, -780":"b_nether_bricks","195, -780":"b_nether_bricks","260, -780":"b_nether_bricks","325, -780":"b_nether_bricks","390, -780":"b_nether_bricks","455, -780":"b_nether_bricks","520, -780":"b_nether_bricks","585, -780":"b_nether_bricks","650, -780":"b_nether_bricks","715, -780":"b_nether_bricks","780, -780":"b_nether_bricks","845, -780":"b_nether_bricks","390, -715":"b_blaze","65, -715":"b_nether_gold_ore","130, -715":"b_nether_gold_ore","130, -650":"b_nether_gold_ore","195, -715":"b_netherrack","260, -715":"b_netherrack","325, -715":"b_netherrack","260, -650":"b_netherrack","325, -650":"b_netherrack","390, -650":"b_netherrack","455, -650":"b_netherrack","455, -715":"b_netherrack","520, -715":"b_netherrack","520, -650":"b_netherrack","585, -650":"b_netherrack","585, -715":"b_netherrack","650, -715":"b_netherrack","715, -715":"b_netherrack","780, -715":"b_netherrack","780, -650":"b_netherrack","715, -650":"b_netherrack","910, -715":"b_netherrack","910, -650":"b_blaze","975, -650":"b_nether_bricks","975, -715":"b_nether_bricks","910, -780":"b_nether_bricks","975, -780":"b_nether_bricks","650, -195":"b_nether_gold_ore","845, -715":"b_nether_gold_ore","845, -650":"b_netherrack","455, -130":"b_netherrack","845, -845":"b_blaze","195, -845":"b_blaze","0, -845":"b_netherrack","0, -910":"b_netherrack","0, -975":"b_netherrack","0, -1040":"b_netherrack","0, -1105":"b_netherrack","0, -1170":"b_netherrack","0, -1235":"b_netherrack","0, -1300":"b_netherrack","65, -1300":"b_netherrack","65, -1235":"b_netherrack","65, -1105":"b_netherrack","65, -1040":"b_netherrack","65, -975":"b_netherrack","65, -910":"b_netherrack","65, -845":"b_netherrack","130, -845":"b_netherrack","130, -910":"b_netherrack","130, -975":"b_netherrack","130, -1040":"b_netherrack","130, -1105":"b_netherrack","130, -1170":"b_enderman","130, -1235":"b_netherrack","130, -1300":"b_netherrack","195, -1300":"b_netherrack","195, -1235":"b_netherrack","195, -1170":"b_netherrack","195, -1105":"b_netherrack","195, -975":"b_netherrack","195, -1040":"b_netherrack","195, -910":"b_netherrack","260, -910":"b_netherrack","325, -910":"b_netherrack","390, -910":"b_netherrack","455, -910":"b_netherrack","520, -910":"b_netherrack","585, -910":"b_netherrack","650, -910":"b_netherrack","715, -910":"b_netherrack","780, -910":"b_netherrack","845, -910":"b_netherrack","845, -975":"b_netherrack","780, -975":"b_netherrack","715, -975":"b_netherrack","650, -975":"b_netherrack","585, -975":"b_netherrack","520, -975":"b_netherrack","455, -975":"b_netherrack","390, -975":"b_netherrack","325, -975":"b_netherrack","260, -975":"b_netherrack","260, -1040":"b_netherrack","325, -1040":"b_netherrack","390, -1040":"b_enderman","455, -1040":"b_netherrack","520, -1040":"b_netherrack","585, -1040":"b_enderman","650, -1040":"b_netherrack","715, -1040":"b_netherrack","780, -1040":"b_netherrack","780, -1105":"b_netherrack","845, -1105":"b_netherrack","715, -1105":"b_netherrack","650, -1170":"b_netherrack","585, -1170":"b_netherrack","520, -1170":"b_netherrack","455, -1170":"b_netherrack","390, -1170":"b_netherrack","325, -1170":"b_netherrack","260, -1170":"b_netherrack","260, -1105":"b_netherrack","325, -1105":"b_netherrack","390, -1105":"b_netherrack","455, -1105":"b_netherrack","520, -1105":"b_netherrack","585, -1105":"b_netherrack","650, -1105":"b_netherrack","715, -1170":"b_netherrack","780, -1170":"b_enderman","715, -1235":"b_netherrack","650, -1235":"b_netherrack","585, -1235":"b_netherrack","520, -1235":"b_netherrack","455, -1235":"b_netherrack","390, -1235":"b_netherrack","325, -1235":"b_enderman","260, -1235":"b_netherrack","260, -1300":"b_netherrack","325, -1300":"b_netherrack","390, -1300":"b_netherrack","260, -845":"b_netherrack","325, -845":"b_netherrack","390, -845":"b_netherrack","455, -845":"b_netherrack","520, -845":"b_netherrack","585, -845":"b_netherrack","650, -845":"b_netherrack","715, -845":"b_netherrack","780, -845":"b_netherrack","910, -845":"b_netherrack","975, -845":"b_netherrack","975, -910":"b_netherrack","975, -975":"b_netherrack","975, -1040":"b_netherrack","975, -1105":"b_netherrack","975, -1170":"b_netherrack","975, -1235":"b_netherrack","910, -1235":"b_netherrack","910, -1170":"b_netherrack","910, -1105":"b_netherrack","910, -1040":"b_enderman","910, -975":"b_netherrack","910, -910":"b_netherrack","845, -1040":"b_netherrack","845, -1170":"b_netherrack","845, -1235":"b_netherrack","780, -1235":"b_netherrack","455, -1300":"b_netherrack","520, -1300":"b_enderman","585, -1300":"b_netherrack","650, -1300":"b_netherrack","715, -1300":"b_netherrack","780, -1300":"b_netherrack","845, -1300":"b_netherrack","910, -1300":"b_enderman","975, -1300":"b_netherrack","975, -1365":"b_netherrack","910, -1365":"b_netherrack","845, -1365":"b_netherrack","780, -1365":"b_netherrack","130, -1365":"b_enderman","195, -1365":"b_netherrack","260, -1365":"b_netherrack","325, -1365":"b_netherrack","390, -1365":"b_netherrack","455, -1365":"b_netherrack","520, -1365":"b_netherrack","585, -1365":"b_netherrack","650, -1365":"b_netherrack","715, -1365":"b_netherrack","0, -1365":"b_netherrack","65, -1365":"b_netherrack","65, -1170":"b_netherrack"}}));
maps.push(GameMap.load({"name":"level3","data":{"390, 390":"b_obsidian","455, 390":"b_obsidian","520, 390":"b_obsidian","585, 390":"b_obsidian","520, 325":"b_obsidian","455, 325":"b_obsidian","585, 325":"b_obsidian","455, 260":"b_obsidian","715, 390":"b_obsidian","650, 390":"b_obsidian","780, 390":"b_end_crystal","845, 390":"b_end_crystal","910, 390":"b_end_crystal","975, 390":"b_end_crystal","845, 325":"b_end_crystal","325, 390":"b_obsidian","325, 325":"b_obsidian","0, 390":"b_enderman","65, 390":"b_enderman","130, 390":"b_enderman","195, 390":"b_enderman","0, 325":"b_enderman","65, 325":"b_enderman","130, 325":"b_enderman","195, 325":"b_enderman","260, 260":"b_obsidian","260, 325":"b_obsidian","260, 390":"b_obsidian","390, 260":"b_obsidian","390, 325":"b_obsidian","650, 325":"b_obsidian","715, 325":"b_obsidian","715, 260":"b_obsidian","780, 325":"b_end_crystal","910, 325":"b_end_crystal","975, 325":"b_end_crystal","0, 260":"b_enderman","65, 260":"b_enderman","130, 260":"b_enderman","195, 260":"b_enderman","325, 260":"b_obsidian","520, 260":"b_obsidian","585, 260":"b_obsidian","650, 260":"b_obsidian","780, 260":"b_end_crystal","975, 260":"b_end_crystal","910, 260":"b_end_crystal","845, 260":"b_end_crystal"}}));

const log = (msg) => {
    const debug = document.querySelector("#log");
    debug.insertAdjacentHTML('beforeend', `<p>${msg}</p>`);
    debug.scrollTop = debug.scrollHeight;
};