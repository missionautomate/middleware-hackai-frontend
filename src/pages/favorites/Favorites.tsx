import React, { useState, useMemo, useRef, useEffect } from 'react'
import ReactLoading from 'react-loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import TinderCard from 'react-tinder-card'
import './../../css/CardReview.css'
import './Favorites.css'
import axios from 'axios'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import ImageCard from '../../components/image-card/ImageCard';
import { PictureData } from '../../models/picture.data';


let db: PictureData[] = [];
let revDb: PictureData[] = [];
let revIndex = 0;

function Favorites() {
  let swipeDir;
  let navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(revDb.length - 1)
  const [lastDirection, setLastDirection] = useState('')
  const currentIndexRef = useRef(currentIndex)
  const [cookies, setCookie, removeCookie] = useCookies(['google-token', 'unique-id']);

  useEffect(() => {
    if (!('google-token' in cookies)) {
      navigate('/login');
    }

    getImages();

  }, []);

  const getImages = () => {
    db = [];
    revDb = [];
    fetch("https://middleware-hackai-backend.azurewebsites.net/get-img", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(cookies['unique-id'])
    }).then(res => {
      return res.json();
    }).then(data => {
      for (var i in data){
        db.push({ name: `img_${i}`, url: "https://imagesstoragesuperhero.blob.core.windows.net/savedimages/" + String(data[i]), favorite: true });
      }
      for (let tempUrl of Array.from(db).reverse()) {
        revDb.push(tempUrl);
      }
      setLoading(false);
    })
  }

  const Loading = () => (
    <ReactLoading type={'bars'} color={'#ffffff'} height={667} width={375} />
  );

  if (isLoading) {
    return (<Loading />)
  }

  return (

    <div className="favorites">
      <h1 className="favorites__title">Your favorite superheroes</h1>
      <div className="favorites__container">
        {revDb.map((character, index) => (
          <ImageCard image={character} showLikeBtn={true} openOnClick={true}></ImageCard>
        ))
        }
      </div>
    </div>
  )
}

export default Favorites