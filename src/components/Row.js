import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css';
import config from './config';
import buildingsConfig from './buildingsConfig.json';
import spritemap from './tiles.png'




function Row({tiles}) {
let loading = true
let sprites = []
const image = new Image();
image.src = spritemap;
  //The spritemap is 32 by 32, each sprite is 16 pixels wide and tall


  
  const square = config.TILE_PIXELS
  const mapWidth = config.TILE_WIDTH * square;
  const mapHeight = config.TILE_HEIGHT * square;
  const canvas = useRef(null);



  useEffect(() => {
    image.onload = () => {
      console.log("image loaded" + image)
    const kanvas = canvas.current;
    const ctx = kanvas.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, mapWidth, mapHeight);
    for (let y = 0 ; y < tiles.length ; y++) {
      for (let x = 0 ; x < tiles[0].length; x++) {
        const tile = tiles[y][x].type
        ctx.fillStyle=buildingsConfig[tile].color;
        ctx.fillRect(x*square, y*square, square, square);
        const tileRandom = Math.floor(Math.random() * 4);
        ctx.drawImage(image, (buildingsConfig[tile].sprite+tileRandom)%32*16, Math.floor(buildingsConfig[tile].sprite+tileRandom)/32*16, 16, 16, x*square, y*square, square, square);
        // ctx.drawImage(sprites[buildingsConfig[tile].sprite], x*square, y*square, square, square);
      }
    }
  }
  }, [tiles]);


    return (
      <canvas ref={canvas} width={mapWidth} height={mapHeight}></canvas>
    );
  }

  export default Row;



  // for (let i = 0 ; i < 5 ; i++) {
  //   sprites[i] = createImageBitmap(image, i%32, Math.floor(i/32), 16, 16);
  // }