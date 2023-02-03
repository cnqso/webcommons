const config = {
    //Board config
    TILE_WIDTH: 40,
    TILE_HEIGHT: 40,

    //Tile config
    TILE_PIXELS: 32,
    TILEMAP_SQUARE: 64,
    X_ERROR: 0.01,
	Y_ERROR: 0.01,
    MARGIN: 0,


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
        city: {color: "#1b1b22", heatMapIndex: -1},
        resDemand: {color:"#700000", heatMapIndex: 0},
        indDemand: {color:"#ffac41", heatMapIndex: 1},
        comDemand: {color: "#1100ff", heatMapIndex: 2},
        landValue: {color: "#59c135", heatMapIndex: 3},
    }
}

export default config;