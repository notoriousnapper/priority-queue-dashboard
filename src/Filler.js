import React from 'react';
import {Link} from 'react-router-dom';

class Filler extends React.Component {
    constructor (props) {
        super(props);
    }
    componentDidMount(){
    }

    render() {
        return (
            <div>
              Filler is here.
                Go to /experiment path to see most of tracking features.

              <nav>
                <ul>
                  <li>
                    <Link to="/experiment">All features</Link>
                  </li>
                  <li>
                    <Link to="/daily">Daily dashboard, work in progress</Link>
                  </li>
                </ul>
              </nav>

            </div>
        );
    }
}

export default Filler;