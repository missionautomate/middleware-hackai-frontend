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

  const images = [
    'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmFieSUyMGNhdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    'https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554__480.jpg',
    'https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80',
    'https://imagesstoragesuperhero.blob.core.windows.net/generatedimages/download.jpg'
  ];

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
  // const getImages = () => {
  //   db = [];
  //   revDb = [];
  //   for (let i in images) {
  //     const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
  //     db.push({ name: `img_${i}`, url: images[i], favorite: isFavorite });
  //   }
  //   for (let tempUrl of Array.from(db).reverse()) {
  //     revDb.push(tempUrl);
  //   }
  //   console.log()
  //   setLoading(false);
  // }

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