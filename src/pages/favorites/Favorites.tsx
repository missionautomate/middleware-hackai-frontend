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
import { PictureData } from '../image-slide-show/ImageSlideShow';


const db: PictureData[] = [];
const revDb: PictureData[] = [];
let revIndex = 0;

function Favorites() {
  let swipeDir;
  let navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(revDb.length - 1)
  const [lastDirection, setLastDirection] = useState('')
  const currentIndexRef = useRef(currentIndex)
  const [cookies, setCookie, removeCookie] = useCookies(['google-token']);

  const images = [
    'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmFieSUyMGNhdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    'https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554__480.jpg',
    'https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80',
    'https://i.pinimg.com/originals/7e/0a/50/7e0a507de8cf8b46e0f2665f1058ef37.jpg'
  ];

  useEffect(() => {
    if (!('google-token' in cookies)){
      navigate('/login');
    }

    // To Test: console.log("cookies", cookies["google-token"]);
    
    // getImages();
    // OR
    getRandom();
  }, []);

  const getImages = () => {
    for (let i in images) {
      const isFavorite = Math.floor(Math.random() * 10)%2 === 0;
      db.push({ name: `img_${i}`, url: images[i], favorite: isFavorite});
    }
    for (let tempUrl of Array.from(db).reverse()) {
      revDb.push(tempUrl);
    }
    setLoading(false);
  }

  const getRandom = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 10; // Between 10 and 20

    axios.get(`https://api.pexels.com/v1/search?query=cat&per_page=${randomNumber}`, {
      headers: { "Authorization": "563492ad6f91700001000001992684dff806482995da956a82ac603c" }
    })
      .then((res) => {
        for (var i in res.data.photos) {
          const isFavorite = Math.floor(Math.random() * 10)%2 === 0;
          db.push({ name: `img_${i}`, url: res.data.photos[i].src.original, favorite: isFavorite});
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

  const childRefs:React.Ref<any>[] = useMemo(
    () =>
      Array(revDb.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  // set last direction and decrease current index
  const swiped = async (direction: string, nameToDelete: string, index: number) => {
    if (direction === "right") {
      swipeDir = ("Yey, we are glad you liked it.");
    }
    setLastDirection(direction);
    revIndex = revIndex + 1;

    if (revIndex >= db.length) {
      window.location.reload();
    }
  }

  if (isLoading) {
    return (<Loading />)
  }

  return (

    <div className="favorites">
      <h1 className="favorites__title">Your favorite Cats</h1>
      <div className="favorites__container">
      {revDb.map((character, index) => (
             <div className='card-wrapper'>
             <img className='card' src={character.url} />
             <div className='card__favorite-btn'>
             {!character.favorite && <AiOutlineHeart></AiOutlineHeart>}
             {character.favorite && <AiFillHeart></AiFillHeart>}
               </div>
           </div>
      ))
}
              
        </div>
     
    </div>
  )
}

export default Favorites
