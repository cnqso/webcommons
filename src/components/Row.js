import React, { useMemo } from 'react';
import './Canvas.css';
import config from './config';



function Row({row}) {
    return (
      <>{row.map((tile, j) => <div key={j} style={{background: tile.color}} className="tile"></div>)}</>
    );
  }

  export default Row;