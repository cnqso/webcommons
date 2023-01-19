import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css';
import config from './config';
import buildingsConfig from './buildingsConfig.json';
import spritemap from './tiles2.png'


var xAxis = {
  x : 1,
  y : 0.5,
}
var yAxis = {
  x : -1,
  y : 0.5,
}
var origin = {
  x : 0,
  y : 0,
}

function Row({tiles}) {
  const image = new Image();
  image.src = spritemap;
  //The spritemap is 32 by 32, each sprite is 64 pixels wide and tall
  const square = config.TILE_PIXELS
  const mapWidth = config.TILE_WIDTH * square;
  const mapHeight = config.TILE_HEIGHT * square;
  const canvas = useRef(null);



  useEffect(() => {
    const kanvas = canvas.current;
    const ctx = kanvas.getContext('2d');
    ctx.fillStyle = "#1b1b22";
    ctx.fillRect(0, 0, mapWidth, mapHeight);
    for (let y = 0 ; y < tiles.length ; y++) {
      for (let x = 0 ; x < tiles[0].length; x++) {
        if (tiles[y][x].type === "empty") {
          ctx.fillStyle="#1b1b22";
          ctx.fillRect(x*square, y*square, square, square);
          continue;
        }
        if (tiles[y][x].type === "road") {

          //Measure horiz and vert road section. Then set sprite accordingly (1h+1v is a turn, 1h2v and 2h1v are t-junctions, 2h2v is a crossroads)
          //Then we just rotate accordingly
          let left = false;
          let right = false;
          let up = false;
          let down = false;

          if (x > 0 && tiles[y][x-1].type === "road") { left = true; }
          if (x < tiles[0].length-1 && tiles[y][x+1].type === "road") { right = true; }
          if (y > 0 && tiles[y-1][x].type === "road") { up = true; }
          if (y < tiles.length-1 && tiles[y+1][x].type === "road") { down = true; }

          const result = left + right*2 + up*4 + down*8; //There is probably a faster boolean-to-binary conversion


          ctx.drawImage(image, result*64, buildingsConfig["road"].sprite.y*64, 64, 64, x*square, y*square, square, square);
          continue;
        }

        const tile = tiles[y][x].spriteIndex;
        
        ctx.drawImage(image, (tile%16)*64, (Math.floor(tile/16))*64, 64, 64, x*square, y*square, square, square);
      }
    }
    console.log("Rendered")
  }, [tiles]);


    return (
      <canvas ref={canvas} width={mapWidth} height={mapHeight}></canvas>
    );
  }

  export default Row;


  // useEffect(() => {
  //   const kanvas = canvas.current;
  //   const ctx = kanvas.getContext('2d');
  //   ctx.fillStyle = "#000000";
  //   ctx.fillRect(0, 0, mapWidth, mapHeight);
  //   for (let y = 0 ; y < tiles.length ; y++) {
  //     for (let x = 0 ; x < tiles[0].length; x++) {
  //       const tile = tiles[y][x].spriteIndex
  //       const buildingType = tiles[y][x].type
  //       ctx.fillStyle=buildingsConfig[buildingType].color;
  //       ctx.fillRect(x*square, y*square, square, square);
  //       const tileRandom = Math.floor(Math.random() * 4);
  //       ctx.drawImage(image, (tile%32)*64, (Math.floor(tile/32))*64, 64, 64, x*square, y*square, square, square);
  //     }
  //   }
  //   console.log("Redrew image")
  // }, [tiles]);