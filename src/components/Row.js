import React, { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import config from "./config";
import buildingsConfig from "./buildingsConfig.json";
import spritemap from "./tileset.png";

function Row({ tiles }) {
	const tileset = new Image();
	tileset.src = spritemap;
	//The spritemap is 32 by 32, each sprite is 64 pixels wide and tall
	const square = config.TILE_PIXELS;
	const mapWidth = config.TILE_WIDTH * square;
	const mapHeight = config.TILE_HEIGHT * square;
	const spriteWidth = config.TILEMAP_SQUARE;
	const canvas = useRef(null);

	useEffect(() => {
    tileset.onload = () => {
		const kanvas = canvas.current;
		const ctx = kanvas.getContext("2d");
		// ctx.fillStyle = "#59c135";
		// ctx.fillRect(0, 0, mapWidth, mapHeight);
		for (let y = 0; y < tiles.length; y++) {
			for (let x = 0; x < tiles[0].length; x++) {
				if (tiles[y][x].type === "empty") {
          // ctx.fillStyle = "#59c135";
					// ctx.fillRect(x * square, y * square, square, square);
					ctx.drawImage(
						tileset,
						tiles[y][x].spriteIndex * spriteWidth,
						0,
						spriteWidth,
						spriteWidth,
						x * square,
						y * square,
						square,
						square
					);
					continue;
				}
				if (tiles[y][x].type === "road") {
					//We do a little bit of bitwise magic to determine which road sprite to use
					//Pretty unreadable but speed is the most important thing here
					let sprite = 0;

					if (x > 0 && tiles[y][x - 1].type === "road") {
						sprite += 1;
					}
					if (
						x < tiles[0].length - 1 &&
						tiles[y][x + 1].type === "road"
					) {
						sprite += 2;
					}
					if (y > 0 && tiles[y - 1][x].type === "road") {
						sprite += 4;
					}
					if (
						y < tiles.length - 1 &&
						tiles[y + 1][x].type === "road"
					) {
						sprite += 8;
					}

					ctx.drawImage(
						tileset,
						sprite * 64,
						buildingsConfig["road"].sprite.y * spriteWidth,
						spriteWidth,
						spriteWidth,
						x * square,
						y * square,
						square,
						square
					);
					continue;
				}

				const tile = tiles[y][x].spriteIndex;

				ctx.drawImage(
					tileset,
					(tile % 16) * spriteWidth,
					Math.floor(tile / 16) * spriteWidth,
					spriteWidth,
					spriteWidth,
					x * square,
					y * square,
					square,
					square
				);
			}
		}
  }
		console.log("Rendered");
	}, [tiles]);

	return <canvas ref={canvas} width={mapWidth} height={mapHeight}></canvas>;
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
