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
}

function ImageCard(props: ImageCardProps) {
  const [open, setOpen] = useState(false);

  const toggleImage = () => {
    setOpen(!open);
  }

  return (
    <div className={`card-wrapper ${open ? 'card-wrapper--clicked' : 'card-wrapper--simple'}`} onClick={toggleImage}>
      <img className='card' src={props.image.url} />
      {props.showLikeBtn && <div className='card__favorite-btn'>
        {!props.image.favorite && <AiOutlineHeart></AiOutlineHeart>}
        {props.image.favorite && <AiFillHeart></AiFillHeart>}
      </div>
      }
    </div>
  )
}

export default ImageCard
