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

function playMap(ctx, tiles, tileset, mapSelection, lastSnapshot) {
	for (let y = 0; y < tiles.length; y++) {
		for (let x = 0; x < tiles[0].length; x++) {
			const drawX = (x + 40) * tilePx;
			const drawY = (y + 40) * tilePx;
			let tile = 0;
			//If we are using an alternative mapmode, we don't render buildings as sprites, but as colored rectangles
			if (mapSelection !== "city" && tiles[y][x].type !== "empty") {
				const mapStyle = mapStyles[mapSelection];
				if (tiles[y][x].type !== "road") {
					ctx.globalAlpha = 1;
					ctx.fillStyle = buildingsConfig[tiles[y][x].type].color;
					ctx.fillRect(drawX, drawY, tilePx, tilePx);
					continue;
				}
				let heatTile;
				try {
					const heatMap = lastSnapshot.current[tiles[y][x].buildingId].heatMap;
					heatTile = heatMap[mapStyle.heatMapIndex];
				} catch (e) {
					heatTile = 0; //Before the database updates, render a cold tile
				}
				ctx.globalAlpha = 1;
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(drawX, drawY, tilePx, tilePx);
				ctx.globalAlpha = heatTile;
				ctx.fillStyle = mapStyle.color;
				ctx.fillRect(drawX, drawY, tilePx, tilePx);
				continue;
			}

			if (tiles[y][x].type === "road") {
				//Bitwise operations to determine which road sprite to use, returns a number from 0 to 15.
				//Prettier made the if statements look ugly so I had no choice but to go implicit-type-conversion-mode
				tile += x > 0 && tiles[y][x - 1].type === "road";
				tile += x < 1
				tile += 2 * (x < tiles[0].length - 1 && tiles[y][x + 1].type === "road");
				tile += 2 * (x > tiles[0].length-2);
				tile += 4 * (y > 0 && tiles[y - 1][x].type === "road");
				tile += 4 * (y < 1);
				tile += 8 * (y < tiles.length - 1 && tiles[y + 1][x].type === "road");
				tile += 8 * (y > tiles.length - 2);
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

function neighborsMap(ctx, rawTiles, tileset) {
	console.log(rawTiles)
	const w = config.TILE_WIDTH;
	const h = config.TILE_HEIGHT;
	const offsets = [
		[0, 2*h],
		[w, 2*h],
		[2 * w, 2*h],
		[0, h],
		[2 * w, h],
		[0, 0],
		[w, 0],
		[2 * w, 0],
	];

	let tile = 0;
	for (let i = 0; i < rawTiles.length; i++) {
		for (let j = 0; j < rawTiles[i].length; j++) {
			const drawX = ((j % w) + offsets[i][0]) * tilePx;
			const drawY = (Math.floor(j / w) + offsets[i][1]) * tilePx;
			tile = rawTiles[i][j];
			const srcX = (tile % 16) * sourcePx;
			const srcY = Math.floor(tile / 16) * sourcePx;
			ctx.drawImage(tileset, srcX, srcY, sourcePx, sourcePx, drawX, drawY, tilePx, tilePx);
		}
	}
	//Borders
	ctx.fillStyle = "#000000";
	ctx.fillRect(w * tilePx - 10, 0, 10, 3 * h * tilePx);
	ctx.fillRect(2 * w * tilePx, 0, 10, 3 * h * tilePx);
	ctx.fillRect(0, h * tilePx - 10, 3 * w * tilePx, 10);
	ctx.fillRect(0, 2 * h * tilePx, 3 * w * tilePx, 10);
}

function Row({ tiles, mapSelection, lastSnapshot, neighborTiles }) {
	const tileset = new Image();
	tileset.src = spritemap;
	//The spritemap is 32 by 32, each sprite is 64 pixels wide and tall

	const canvas = useRef(null);

	useEffect(() => {
		tileset.onload = () => {
			const ctx = canvas.current.getContext("2d");
			neighborsMap(ctx, neighborTiles, tileset);
			playMap(ctx, tiles, tileset, mapSelection, lastSnapshot);
		};
		console.log("Rendered");
	}, [tiles, mapSelection]);

	return <canvas ref={canvas} width={mapWidth * 3} height={mapHeight * 3}></canvas>;
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
