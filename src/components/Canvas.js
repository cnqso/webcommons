import React, { useState, useRef } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import './Canvas.css';
import { Space, Pressable, PressEventCoordinates } from 'react-zoomable-ui';
import config from './config';
 

 
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







const Canvas = (props) => {

    const TILE_WIDTH = 60;
    const TILE_HEIGHT = 60;
    const TILE_PIXELS = 8;


    const tiles = props.tiles;
    const { width, height } = useWindowSize();
    const square = (width + height) / 60;
    const imageWidth = config.TILE_WIDTH * config.TILE_PIXELS;
    const imageHeight = config.TILE_HEIGHT*config.TILE_PIXELS;

    //const [hover, setHover] = useState();
    const clickxy = useRef([0,0]);

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

    
    // const Tilemap = React.memo(() => {
    //   return (
    //     <Pressable className={'Grid'} onTap={() => {props.handleOnClick(clickxy.current)}}>
    //     {tiles.map((tile, i) => <div key={i} style={{background: tile.color}} className="tile"></div>)}
    //     </Pressable>
    //   );
    // });




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

        {/* <div className="Grid">
            {tiles.map((tile, i) => <div key={i} style={{background: tile.color}} className="tile"></div>)}
        </div> */}
        <Pressable style={{gridTemplateColumns: `repeat(${config.TILE_WIDTH}, 8px)`,  width: `${imageWidth}`, height: `${imageHeight}`}} className={'Grid'} onTap={() => {props.handleOnClick(clickxy.current)}}>
        {tiles.map((tile, i) => <div key={i} style={{background: tile.color}} className="tile"></div>)}
        </Pressable>
        </Space>
      </div>
    )
    };

export default Canvas;