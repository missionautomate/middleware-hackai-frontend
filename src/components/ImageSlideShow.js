import React, { useState, useMemo, useRef, useEffect } from 'react'
import ReactLoading from 'react-loading';
import { Component } from 'react'
import Select from 'react-select';
import Bootstrap from 'bootstrap'
import makeAnimated from 'react-select/animated';
import 'bootstrap/dist/css/bootstrap.min.css';
import  { Navigate, useNavigate  } from 'react-router-dom'
import TinderCard from 'react-tinder-card'
import './../css/CardReview.css'
import axios from 'axios'
import PainterSelect from './PainterSelect';

var db = []

var rev_db = []

var rev_index = 0;


function ImageSlideShow () {

  var swipeDir;
  const [styles, setStyles] = useState()
  const [isLoading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(rev_db.length - 1)
  const [lastDirection, setLastDirection] = useState()
  const currentIndexRef = useRef(currentIndex)


  useEffect(() => {
    // Update the document title using the browser API
    var randomNumber = Math.floor(Math.random() * 82471821)

    axios.post('https://y3lvwgziv0.execute-api.us-east-2.amazonaws.com/getPhoto?' + localStorage.getItem('style') + '/' + randomNumber,{
      headers: {"Access-Control-Allow-Origin": "*"}})
         .then((res) => {
              for(var i in res.data){
                db.push({name: '', url: res.data[i]});
              }
              for (let temp_url of Array.from(db).reverse()) {
                rev_db.push(temp_url);

              }
              axios.get('https://y3lvwgziv0.execute-api.us-east-2.amazonaws.com/getArtists')
                  .then((res) => {
                    var artists = []
                    for(var i = 0 ; i < res.data.length; i++){
                      artists.push({label: res.data[i][0], index: res.data[i][1]})
                      setStyles(artists)
                    }
                    setLoading(false);
                  })

              axios.post('https://y3lvwgziv0.execute-api.us-east-2.amazonaws.com/generatePhoto?' + localStorage.getItem('style') + '/' + db.length,{
                headers: {"Access-Control-Allow-Origin": "*"}})
                  .then((res) => {
                  })
            })


  }, []);

  const Example = ({ type, color }) => (
    <ReactLoading type={'bars'} color={'#ffffff'} height={667} width={375} />
  );

  const childRefs = useMemo(
    () =>
      Array(rev_db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }


  const canSwipe = currentIndex >= 0

  const navigate = useNavigate();

  const onChange = (value) => {

    console.log(value.index);
    localStorage.setItem('style', value.index);
    localStorage.setItem('name', value.label);
    window.location.reload(false);
  }

  // set last direction and decrease current index
  const swiped = async(direction, nameToDelete, index) => {

    if(direction === "right"){
      console.log(lastDirection);
      swipeDir = ("Yey, we are glad you liked it.");
      axios
          .post("https://y3lvwgziv0.execute-api.us-east-2.amazonaws.com/acceptPhoto?" + db[rev_index].url, {headers: {"Access-Control-Allow-Origin": "*"}})
          .then((res) => console.log(res));
    }
    else {
      axios
          .post("https://y3lvwgziv0.execute-api.us-east-2.amazonaws.com/removePhoto?" + db[rev_index].url, {headers: {"Access-Control-Allow-Origin": "*"}})
          .then((res) => console.log(res));
      setLastDirection("We are sorry, we will take this feedback and improve our methods.");
    }
    setLastDirection(direction)
    rev_index = rev_index + 1

    if(rev_index >= db.length){
      window.location.reload(false);
    }
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {

    }
    await childRefs[currentIndex].current.swipe(dir)
  }

  if (isLoading) {
    return (<Example />)
  }

  return (

    <div className="fullC">
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
      <h1>Your image based on {localStorage.getItem('name')}</h1>
      <div className = "row">
      <img src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/285/cross-mark_274c.png" height="220px" className = "directionF"/>
      <div className='cardContainer'>
        {rev_db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
          >
            <div>
              <img className='card' src={character.url}/>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <img src = "https://emojipedia-us.s3.amazonaws.com/source/skype/289/check-mark_2714-fe0f.png" height="300px" className = "directionFN"/>
      </div>
      <div className='buttons'>

      </div>

        <h2 className='infoText'>
          {swipeDir}
        </h2>

        <h2 className='infoText'>
          Swipe left if you don't like the image or right if you think it looks awesome!
        </h2>

          <h2 className='infoText'> Do you want to try another style? </h2>

          <Select options={styles} onChange ={onChange} placeholder="Pick a different one" className="selectP" menuPlacement="auto" menuShouldBlockScroll={false}/>


    </div>
  )
}

export default ImageSlideShow
