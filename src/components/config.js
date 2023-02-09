const config = {
    //Board config
    TILE_WIDTH: 40,
    TILE_HEIGHT: 40,

    //Tile config
    TILE_PIXELS: 32,
    X_ERROR: 0.01,
	Y_ERROR: 0.01,
    MARGIN: 0,


    //Tilemap config
    SPRITEMAP_RES: 64,
    SPRITEMAP_WIDTH: 126,
    SPRITEMAP_HEIGHT: 16,



    //Simulation config
    TICKS_PER_SECOND: 1,
    MAX_DISTANCE: 30,

    BUILDING_LEVEL: {
    //Residential buildings have 5 visible levels determined by the value of popCapacity
    "residential": [15, 30, 60, 100],

    //Industrial buildings have 3 visible levels determined by the value of employmentCapacity
    "industrial": [15, 30, 60, 100],

    //Commercial buildings have 5 visible levels determined by the value of employmentCapacity
    "commercial": [15, 30, 60, 100]
    },


    MAP_STYLES: {
        loading: {color: "#1b1b22", heatMapIndex: -2},
        city: {color: "#1b1b22", heatMapIndex: -1},
        resDemand: {color:"#be0d00", heatMapIndex: 0},
        indDemand: {color:"#ffd900", heatMapIndex: 1},
        comDemand: {color: "#0044ff", heatMapIndex: 2},
        landValue: {color: "#59c135", heatMapIndex: 3},
    }
}

export default config;