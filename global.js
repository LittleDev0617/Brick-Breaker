const makeImg = (src) => {
    let img = new Image();
    img.src = src;
    return img;
};

// overworld blocks
const BLOCK_GRASS       = makeImg("blocks/over/grass.png");
const BLOCK_DIRT        = makeImg("blocks/over/dirt.png");
const BLOCK_STONE       = makeImg("blocks/over/stone.png");
const BLOCK_OAK_LOG     = makeImg("blocks/over/oak_log.png");
const BLOCK_IRON_ORE    = makeImg("blocks/over/iron_ore.png");
const BLOCK_DIAMOND_ORE = makeImg("blocks/over/diamond_ore.png");
const BLOCK_OBSIDIAN    = makeImg("blocks/over/obsidian.png");
const BLOCK_TNT         = makeImg("blocks/over/tnt.png");
const BLOCK_ZOMBIE      = makeImg("blocks/over/zombie.png");
const BLOCK_PIG         = makeImg("blocks/over/pig.png");
const BLOCK_SHEEP       = makeImg("blocks/over/sheep.png");
const BLOCK_SPIDER      = makeImg("blocks/over/spider.png");
const BLOCK_CREEPER     = makeImg("blocks/over/creeper.png");

// nether blocks
const BLOCK_SOULSAND        = makeImg("blocks/nether/soulsand.png");
const BLOCK_NETHERRACK      = makeImg("blocks/nether/netherrack.png");
const BLOCK_ANCIENT_DEBRIS  = makeImg("blocks/nether/ancient_debris.png");
const BLOCK_NETHER_GOLD_ORE = makeImg("blocks/nether/nether_gold_ore.png");
const BLOCK_NETHER_BRICKS   = makeImg("blocks/nether/nether_bricks.png");
const BLOCK_BLAZE           = makeImg("blocks/nether/blaze.png");

// ender blocks
const BLOCK_ENDERMAN        = makeImg("blocks/ender/enderman.png");

const BLOCK_LIST = [
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
];