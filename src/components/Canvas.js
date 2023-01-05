import React, { useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import './Canvas.css';
 

 
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
    const { width, height } = useWindowSize();
    const square = (width + height) / 60;

    const Cell = ({ columnIndex, rowIndex, style }) => (
        <div 
            onClick={() => props.handleOnClick(columnIndex, rowIndex)} 
            
            style={style}><div className={"tile"} style={{background: props.tiles[columnIndex+(rowIndex*120)].color}}> 
          </div>
        </div>
      );




    console.log(props)
    return (
  <Grid
    columnCount={120}
    columnWidth={square}
    height={height/1.2}
    rowCount={100}
    rowHeight={square}
    width={width}
    className={"Grid"}
    
  >
    {Cell}
  </Grid>
    )
    };

export default Canvas;