/** @format */

import React, { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import config from "./config";
import buildingsConfig from "./buildingsConfig.json";
import spritemap from "./tileset.png";
const tilePx = config.TILE_PIXELS;
const mapWidth = config.TILE_WIDTH * tilePx;
const mapHeight = config.TILE_HEIGHT * tilePx;
const sourcePx = config.TILEMAP_SQUARE;
const mapStyles = config.MAP_STYLES;

function normalMap(ctx, tiles, tileset, mapSelection, lastSnapshot) {
	for (let y = 0; y < tiles.length; y++) {
		for (let x = 0; x < tiles[0].length; x++) {
			const drawX = x * tilePx;
			const drawY = y * tilePx;
			let tile = 0;
			//If we are using an alternative mapmode, we don't render buildings as sprites, but as colored rectangles
			if (mapSelection !== "city" && tiles[y][x].type !== "empty") {
				if (tiles[y][x].type !== "road") {
					ctx.globalAlpha = 1;
					ctx.fillStyle = buildingsConfig[tiles[y][x].type].color;
					ctx.fillRect(drawX, drawY, tilePx, tilePx);
					continue;
				}
				const heatMap = lastSnapshot.current[tiles[y][x].buildingId].heatMap;
				const heatTile = heatMap[mapStyles[mapSelection].heatMapIndex];
				ctx.globalAlpha = 1;
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(drawX, drawY, tilePx, tilePx);
				ctx.globalAlpha = (heatTile+2)/3;
				ctx.fillStyle = mapStyles[mapSelection].color;
				ctx.fillRect(drawX, drawY, tilePx, tilePx);
				continue;
			}
			
			
			if (tiles[y][x].type === "road") {
				//Bitwise operations to determine which road sprite to use, returns a number from 0 to 15. 
				//Prettier made the if statements look ugly so I had no choice but to go implicit-type-conversion-mode
				tile += x > 0 && tiles[y][x - 1].type === "road";
				tile += 2 * (x < tiles[0].length - 1 && tiles[y][x + 1].type === "road");
				tile += 4 * (y > 0 && tiles[y - 1][x].type === "road");
				tile += 8 * (y < tiles.length - 1 && tiles[y + 1][x].type === "road");
				tile += buildingsConfig["road"].sprite.y * 16; //y offset
			} else {
				tile = tiles[y][x].spriteIndex;
			}
			const srcX = (tile % 16) * sourcePx;
			const srcY = Math.floor(tile / 16) * sourcePx;
			ctx.globalAlpha = 1;
			ctx.drawImage(tileset, srcX, srcY, sourcePx, sourcePx, drawX, drawY, tilePx, tilePx);
		}
	}
}

function Row({ tiles, mapSelection, lastSnapshot }) {
	const tileset = new Image();
	tileset.src = spritemap;
	//The spritemap is 32 by 32, each sprite is 64 pixels wide and tall

	const canvas = useRef(null);


	useEffect(() => {
		tileset.onload = () => {
			const ctx = canvas.current.getContext("2d");
			normalMap(ctx, tiles, tileset, mapSelection, lastSnapshot);
		};
		console.log("Rendered");
	}, [tiles, mapSelection]);

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
//       ctx.fillRect(x*tilePx, y*tilePx, tilePx, tilePx);
//       const tileRandom = Math.floor(Math.random() * 4);
//       ctx.drawImage(image, (tile%32)*64, (Math.floor(tile/32))*64, 64, 64, x*tilePx, y*tilePx, tilePx, tilePx);
//     }
//   }
//   console.log("Redrew image")
// }, [tiles]);
