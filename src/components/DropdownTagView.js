import React from "react";


import eggshell from "../assets/eggshell-texture.png"
import arrow from "../assets/arrow-down.png"


class DropdownTagView extends React.Component {
    constructor (props) {
        super(props);
    }
      render() {
        const {label, value, onChange, options, selectedTagMoves} = this.props; // Important line caused errors
        return (<label>
           {label}
          <select value={value} onChange={onChange}>
            {options.map((option) => (
                <option value={option}>{option}</option>
            ))}
          </select>
              Tag selected: {value}
              {selectedTagMoves}

        </label>
        );
    }
}

export default DropdownTagView;