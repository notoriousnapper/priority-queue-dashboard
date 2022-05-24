import Globals from '../helper/Globals.js';
export default class MoveService {

  static handleRecordSubmit = (move, recordValue) => {
    console.log("move: exploded" + JSON.stringify(move));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Globals.movePostUrl.href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      ...move,
      'recordValue': recordValue
    }));
  }

}

