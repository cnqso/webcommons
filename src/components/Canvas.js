import React, { useState, useRef } from 'react';
import jsonTiles from "../map.json";
import { FixedSizeGrid as Grid } from 'react-window';
import './Canvas.css';
import { Space, Pressable, PressEventCoordinates } from 'react-zoomable-ui';
import config from './config';
 import Row from './Row';


const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: 1000,
    height: 1000,
  });

  React.useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};


//It seems like React checks memoization in the naive way (store every value, check each value one at a time)
//There are 12,000*N key-value pairs that need to be checked, 120*N for each row. 
//For a list of objects, it makes sense to take the extra 3ms to give React an easier-to-manage checksum
//After many days of trying various solutions, this is the one that fixed my memoization woes
//Very proud of this solution, but I should probably make this adjustment at a lower level for <-->PEAK SPEED<-->

function checksum(array) {
  var chk = 0x12345678;
  let x = 0
  for (let i = 0; i < array.length; i++) {
    let len = array[i].color.length;
    for (let j = 0; j < len; j++) {
        chk += (array[i].color.charCodeAt(j) * (x + 1));
        x++
    }
  }
  return (chk & 0xffffffff).toString(16);
}

const buildPermit = (yMin, xMin, building) => {
  console.log(yMin, xMin, building);
}

const RowMemo = React.memo(Row);

const Canvas = (props) => {

  const MARGIN = 0;
  const xError = 0.01;
  const yError = 0.01;
  const [tiles, setTiles] = useState(jsonTiles);
  const { width, height } = useWindowSize();
  const square = (width + height) / 60;
  const imageWidth = config.TILE_WIDTH * config.TILE_PIXELS;
  const imageHeight = config.TILE_HEIGHT*config.TILE_PIXELS;

  //const [hover, setHover] = useState();
  const clickxy = useRef([0,0]);

  const boundsempty = (yMin, yMax, xMin, xMax) => {
    if (xMin < 0 || yMin < 0 || xMax > config.TILE_WIDTH || yMax > config.TILE_HEIGHT) {
      console.log("Out of bounds");
      return false;
    } 
    for (let i = yMin; i <= yMax; i++) {
      for (let j = xMin; j <= xMax; j++) {
        if (tiles[i][j].color != "#000000") {
          console.log("Space already occupied")
          return false;
        }
      }
    }
    return true;
  }

  const drawBuilding = (yMin, yMax, xMin, xMax, color) => {
  let tempTiles = tiles;
      for (let i = yMin; i <= yMax; i++) {
        for (let j = xMin; j <= xMax; j++) {
          tempTiles[i][j].color = color;
        }
      }
      setTiles([...tempTiles]);
  }

  const editMap = (x, y) => {

    let buildingColor = "#000000";
    let buildingSize = 0;
    switch(props.editSelection) {
      case "road":
        buildingColor = "#463836";
        buildingSize = 1;
        break;
      case "residential":
        buildingColor = "#700000";
        buildingSize = 3;
        break;
      case "coal":
        buildingColor = "#ffec41";
        buildingSize = 5;
        break;
        case "delete":
          buildingColor = "#000000";
          buildingSize = 1;
          break;
    }

    //checkboundaries
    const xMin = x - (Math.floor((buildingSize - 1) / 2));
    const xMax = x + (Math.floor(buildingSize / 2));
    const yMin = y - (Math.floor((buildingSize - 1) / 2));
    const yMax = y + (Math.floor(buildingSize / 2));
    //console.log(xMin, xMax, yMin, yMax);
    if (boundsempty(yMin, yMax, xMin, xMax) === true || props.editSelection === "delete") {
      buildPermit(yMin, xMin, props.editSelection);
      drawBuilding(yMin, yMax, xMin, xMax, buildingColor);
    }
  }
  
  const handleOnClick = (coordinates) => {
    //console.log(coordinates)
    const adjustedX = Math.floor((coordinates[0] + xError) / config.TILE_PIXELS);
    const adjustedY = Math.floor((coordinates[1] + yError) / config.TILE_PIXELS);
    //console.log(adjustedX, adjustedY);
    const tileIndex = adjustedX + (adjustedY * config.TILE_WIDTH);
    const tile = tiles[adjustedY][adjustedX];

    if ("authentication" != "placeholder") {
      editMap(adjustedX, adjustedY)
    }
  }





  return (
    <div style={{ width: width, height: (height/1.2), position: "relative" }}>
      <Space
      onDecideHowToHandlePress={(e, coords) => {clickxy.current = [coords.x, coords.y]}}
      //onHover={(e, c) => setHover(c)}
        style={{ border: "solid 1px black" }}
        onCreate={viewPort => {
          viewPort.setBounds({ x: [0, imageWidth], y: [0, imageHeight] });
          viewPort.camera.centerFitAreaIntoView({
            left: 0,
            top: 0,
            width: imageWidth,
            height: imageHeight
          });
        }}
      >  
        <Pressable style={{gridTemplateColumns: `repeat(${config.TILE_WIDTH}, 8px)`, gridTemplateRows: `repeat(${config.TILE_HEIGHT}, 8px)`,  width: `${imageWidth}`, height: `${imageHeight}`}} className={'Grid'} onTap={() => {handleOnClick(clickxy.current)}}>
          {/* {tiles.map((row, i) => <>
            {row.map((tile, j) => <div key={j} style={{background: tile.color}} className="tile"></div>)}
          </>)} */}
          {tiles.map((row, i) =>
            <RowMemo key = {i} rowChecksum = {checksum(row)} row = {row}/>
          )}
        </Pressable>
      </Space>
    </div>
  )
  };

export default Canvas;


    // const SimpleTapCountingButton = React.memo(() => {
    //   const [tapCount, setTapCount] = React.useState(0);
    //   const [message, setMessage] = React.useState('TAP ME');
    //   return (
    //     <Pressable
    //       className={'prez'}
    //       potentialTapStyle={{ backgroundColor: 'blue' }}
    //       potentialLongTapStyle={{ backgroundColor: 'darkblue' }}
    //       hoverStyle={{ backgroundColor: 'orchid' }}
    //       onTap={() => {
    //         props.handleOnClick(0,0)
    //       }}
    //       onLongTap={() => {
    //         setMessage('LONG TAPPED!');
    //       }}
    //     >
    //       {message}
    //     </Pressable>
    //   );
    // });