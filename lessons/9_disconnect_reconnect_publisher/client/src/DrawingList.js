import React, { Component } from 'react';
import {
  subscribeToDrawings,
} from './api';


class DrawingList extends Component {
  constructor(props) {
    super(props);

    subscribeToDrawings((drawing) => {
      this.setState(prevState => ({
        drawings: prevState.drawings.concat([drawing]),
      }));
    });
  }

  state = {
    drawings: [],
  };

  render() {
    const drawings = this.state.drawings.map(drawing => (
      <li
        className="DrawingList-item"
        key={drawing.id}
        onClick={event => this.props.selectDrawing(drawing)}
      >
        {drawing.name}
      </li>
    ));

    return (
      <ul
        className="DrawingList"
      >
        {drawings}
      </ul>
    );
  }
}

export default DrawingList;
