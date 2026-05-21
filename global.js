const makeBlockInfo = (blockId, src) => {
    let img = new Image();
    img.src = src;
    
    this.sprite = img;
    this.id = blockId;

    return this;
};

// overworld blocks
const BLOCK_GRASS       = makeBlockInfo("b_grass",          "blocks/over/grass.png");
const BLOCK_DIRT        = makeBlockInfo("b_dirt",           "blocks/over/dirt.png");
const BLOCK_STONE       = makeBlockInfo("b_stone",          "blocks/over/stone.png");
const BLOCK_OAK_LOG     = makeBlockInfo("b_oak_log",        "blocks/over/oak_log.png");
const BLOCK_IRON_ORE    = makeBlockInfo("b_iron_ore",       "blocks/over/iron_ore.png");
const BLOCK_DIAMOND_ORE = makeBlockInfo("b_diamond_ore",    "blocks/over/diamond_ore.png");
const BLOCK_OBSIDIAN    = makeBlockInfo("b_obsidian",       "blocks/over/obsidian.png");
const BLOCK_TNT         = makeBlockInfo("b_tnt",            "blocks/over/tnt.png");
const BLOCK_ZOMBIE      = makeBlockInfo("b_zombie",         "blocks/over/zombie.png");
const BLOCK_PIG         = makeBlockInfo("b_pig",            "blocks/over/pig.png");
const BLOCK_SHEEP       = makeBlockInfo("b_sheep",          "blocks/over/sheep.png");
const BLOCK_SPIDER      = makeBlockInfo("b_spider",         "blocks/over/spider.png");
const BLOCK_CREEPER     = makeBlockInfo("b_creeper",        "blocks/over/creeper.png");

// nether blocks
const BLOCK_SOULSAND        = makeBlockInfo("b_soulsand",           "blocks/nether/soulsand.png");
const BLOCK_NETHERRACK      = makeBlockInfo("b_netherrack",         "blocks/nether/netherrack.png");
const BLOCK_ANCIENT_DEBRIS  = makeBlockInfo("b_ancient_debris",     "blocks/nether/ancient_debris.png");
const BLOCK_NETHER_GOLD_ORE = makeBlockInfo("b_nether_gold_ore",    "blocks/nether/nether_gold_ore.png");
const BLOCK_NETHER_BRICKS   = makeBlockInfo("b_nether_bricks",      "blocks/nether/nether_bricks.png");
const BLOCK_BLAZE           = makeBlockInfo("b_blaze",              "blocks/nether/blaze.png");

// ender blocks
const BLOCK_ENDERMAN        = makeBlockInfo("b_enderman",   "blocks/ender/enderman.png");

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

const CANVAS_WIDTH  = 1024;
const CANVAS_HEIGHT = 768;