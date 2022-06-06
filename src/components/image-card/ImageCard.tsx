import React, { useState, useMemo, useRef, useEffect } from 'react'
import ReactLoading from 'react-loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import TinderCard from 'react-tinder-card'
import './../../css/CardReview.css'
import './ImageCard.css'
import axios from 'axios'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { PictureData } from '../../models/picture.data';

export class ImageCardProps {
  image: PictureData = new PictureData();
  showLikeBtn?: boolean = false;
  openOnClick?: boolean = false;
}

function ImageCard(props: ImageCardProps) {
  const [open, setOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["unique-id"]);

  const toggleImage = () => {
    setOpen(!open);
  }

  const removeImage = (imgLink: String) => () => {
    var parts = imgLink.split('/');
    var imgName = parts[parts.length - 1];
    const data = {"azureId": cookies['unique-id'], "imgName": imgName};
    console.log(JSON.stringify(data));
    fetch("https://middleware-hackai-backend.azurewebsites.net/remove-image", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    }).then(res => {
      console.log("Request complete! response:", res);
    });
    window.location.reload();
  }
  return (
    <div className={`card-wrapper ${ props.openOnClick && open ? 'card-wrapper--clicked' : 'card-wrapper--simple'}`} >
      <img className='card' src={props.image.url} onClick={toggleImage}/>
      {props.showLikeBtn && <div className='card__favorite-btn' onClick={removeImage(props.image.url)}>
        {!props.image.favorite && <AiOutlineHeart></AiOutlineHeart>}
        {props.image.favorite && <AiFillHeart></AiFillHeart>}
      </div>
      }
    </div>
  )
}

export default ImageCard
