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


// let db: PictureData[] = [];
// let revDb: PictureData[] = [];
let revIndex = 0;

function Favorites() {
  let swipeDir;
  let navigate = useNavigate();

  const [db, updateDb] = useState<PictureData[]>([]);
  const [revDb, updateRevDb] = useState<PictureData[]>([]);

  const [isLoading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(revDb.length - 1)
  const [lastDirection, setLastDirection] = useState('')
  const currentIndexRef = useRef(currentIndex)
  const [cookies, setCookie, removeCookie] = useCookies(['google-token', 'account-id']);


  useEffect(() => {
    if (!('google-token' in cookies)){
      navigate('/login');
    }
      if('account-id' in cookies){
        getUserImages(cookies['account-id']);
      }
  
    // To Test: console.log("cookies", cookies["google-token"]);
    
    // OR
    // getRandom();
}, []);

const getImages = (images:string[]) => {
  let _db: PictureData[] = [];
  let _revDb: PictureData[] = [];
  
  for (let i in images) {
    const isFavorite = Math.floor(Math.random() * 10)%2 === 0;
    _db.push({ name: `img_${i}`, url: images[i], favorite: isFavorite});
  }
  for (let tempUrl of Array.from(_db).reverse()) {
    _revDb.push(tempUrl);
  }
  updateDb(_db);
  updateRevDb(_revDb);
  setLoading(false);
}

const getUserImages = (account_id:string) => {
  let _body = {
    'account_id': account_id
  }
  let image_urls:string[] = [];
  fetch("https://middleware-hackai-backend.azurewebsites.net/pull_images_for_current_user", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(_body)
  }).then( async res => {
    let res_json = await res.json();
    getImages(res_json["image_urls"]);
  });

  setLoading(false);
  return image_urls;
}

  const getRandom = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 10; // Between 10 and 20

    axios.get(`https://api.pexels.com/v1/search?query=cat&per_page=${randomNumber}`, {
      headers: { "Authorization": "563492ad6f91700001000001992684dff806482995da956a82ac603c" }
    })
      .then((res) => {
        for (var i in res.data.photos) {
          const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
          db.push({ name: `img_${i}`, url: res.data.photos[i].src.original, favorite: isFavorite });
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

  const childRefs: React.Ref<any>[] = useMemo(
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
          <ImageCard image={character} showLikeBtn={true}></ImageCard>
        ))
        }
      </div>
    </div>
  )
}

export default Favorites
