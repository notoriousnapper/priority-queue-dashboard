export default class MoveItemHelper {
  static arrayContainsTags = (tagArr, move) => {
    for (let i = 0; i < tagArr.length; i++){
      if (move.tags[i].includes("daily")){
        return true;
      }
    }
    return false;
  };
}

