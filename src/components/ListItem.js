import React, {useEffect, useState} from 'react';
import HideItems from '../HideItems';

const ListItem = (props) => {

  const [listItem, setListItem] = useState(props);
  const [img, setImg] = useState(props);
  useEffect(() => {
    setListItem(props.listItem);
    setImg(props.img);

  }, [props]);

  return (
      <div style={{backgroundColor: "#B4D6B9"}}>
        <img style={{width:"30px",height:"30px"}} src={img}/>
        <span style={{marginRight: "3px",backgroundColor: "green", color: "white"}}> {listItem.type}  </span>
        <span> {listItem.name}  </span>
        <span style={{backgroundColor: "red", color: "white", fontSize: "11px"}}> {listItem.tags}  </span>
        <HideItems items={listItem.description}/>
      </div>
  );
};

export default ListItem;