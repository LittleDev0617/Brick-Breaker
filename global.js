const makeBlockInfo = function(blockId, src) {
    let img = new Image();
    img.src = src;
    
    this.sprite = img;
    this.id = blockId;

    return this;
};

// overworld blocks
const BLOCK_GRASS       = new makeBlockInfo("b_grass",          "blocks/over/grass.png");
const BLOCK_DIRT        = new makeBlockInfo("b_dirt",           "blocks/over/dirt.png");
const BLOCK_STONE       = new makeBlockInfo("b_stone",          "blocks/over/stone.png");
const BLOCK_OAK_LOG     = new makeBlockInfo("b_oak_log",        "blocks/over/oak_log.png");
const BLOCK_IRON_ORE    = new makeBlockInfo("b_iron_ore",       "blocks/over/iron_ore.png");
const BLOCK_DIAMOND_ORE = new makeBlockInfo("b_diamond_ore",    "blocks/over/diamond_ore.png");
const BLOCK_OBSIDIAN    = new makeBlockInfo("b_obsidian",       "blocks/over/obsidian.png");
const BLOCK_TNT         = new makeBlockInfo("b_tnt",            "blocks/over/tnt.png");
const BLOCK_ZOMBIE      = new makeBlockInfo("b_zombie",         "blocks/over/zombie.png");
const BLOCK_PIG         = new makeBlockInfo("b_pig",            "blocks/over/pig.png");
const BLOCK_SHEEP       = new makeBlockInfo("b_sheep",          "blocks/over/sheep.png");
const BLOCK_SPIDER      = new makeBlockInfo("b_spider",         "blocks/over/spider.png");
const BLOCK_CREEPER     = new makeBlockInfo("b_creeper",        "blocks/over/creeper.png");

// nether blocks
const BLOCK_SOULSAND        = new makeBlockInfo("b_soulsand",           "blocks/nether/soulsand.png");
const BLOCK_NETHERRACK      = new makeBlockInfo("b_netherrack",         "blocks/nether/netherrack.png");
const BLOCK_ANCIENT_DEBRIS  = new makeBlockInfo("b_ancient_debris",     "blocks/nether/ancient_debris.png");
const BLOCK_NETHER_GOLD_ORE = new makeBlockInfo("b_nether_gold_ore",    "blocks/nether/nether_gold_ore.png");
const BLOCK_NETHER_BRICKS   = new makeBlockInfo("b_nether_bricks",      "blocks/nether/nether_bricks.png");
const BLOCK_BLAZE           = new makeBlockInfo("b_blaze",              "blocks/nether/blaze.png");

// ender blocks
const BLOCK_ENDERMAN        = new makeBlockInfo("b_enderman",   "blocks/ender/enderman.png");

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