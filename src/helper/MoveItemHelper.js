export default class MoveItemHelper {
  static arrayContainsTags = (tagArr, move, targetTag) => {
    for (let i = 0; i < tagArr.length; i++){
      if (move.tags[i].includes(targetTag)){
        return true;
      }
    }
    return false;
  };
  static filterByTag = (moves, targetTag) => {
    if (!moves){
      return [];
    } else {
      return moves.filter((move) => {
        return this.arrayContainsTags(move.tags, move, targetTag);
      })
    }
  }
}

