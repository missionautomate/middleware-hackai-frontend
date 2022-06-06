import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.min.css";
import TinderCard from "react-tinder-card";
import "./../../css/CardReview.css";
import "./ImageSlideShow.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button } from "reactstrap";
import path from "path";
import { PictureData } from "../../models/picture.data";
import ImageCard from "../../components/image-card/ImageCard";
import UserContext from "../../context/User.context";
import Modal from 'react-bootstrap/Modal';
import { render } from "@testing-library/react";


const db: PictureData[] = [];
const revDb: PictureData[] = [];
let revIndex = 0;

function ImageSlideShow() {
  let swipeDir;
  let navigate = useNavigate();
  const { user, changeUser } = useContext(UserContext);

  const [isLoading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(revDb.length - 1);
  const [lastDirection, setLastDirection] = useState("");
  const currentIndexRef = useRef(currentIndex);
  const [cookies, setCookie, removeCookie] = useCookies(["google-token", "unique-id"]);
  const [images, setImages] = useState<any>()

  const navigateTo = (path: string) => () => {
    return navigate(path);
  };

  useEffect(() => {
    // if (!('google-token' in cookies)) {
    //   navigate('/login');
    // }
    fetch("https://middleware-hackai-backend.azurewebsites.net/generate-images", {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    }).then(() => {
      fetch("https://middleware-hackai-backend.azurewebsites.net/get-images", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
      }).then(async res => {
        // await new Promise(f => setTimeout(f, 4000));
        let images_json = await res.json();
        const image = []

        for (var index in images_json["images"]) {
          image.push(images_json["images"][index]["path"])
        }
        setImages(image)

      }).catch(error => { console.log(error) });
    })



  }, []);
  useEffect(() => {
    if (images) {
      getImages();
    }

  }, [images])

  const getImages = () => {
    for (let i in images) {
      const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
      db.push({ name: `img_${i}`, url: images[i], favorite: isFavorite });
    }
    for (let tempUrl of Array.from(db).reverse()) {
      revDb.push(tempUrl);
    }
    setLoading(false);
  };

  const getRandom = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 10; // Between 10 and 20

    console.log(11);

    axios
      .get(
        `https://api.pexels.com/v1/search?query=cat&per_page=${randomNumber}`,
        {
          headers: {
            Authorization:
              "563492ad6f91700001000001992684dff806482995da956a82ac603c",
          },
        }
      )
      .then((res) => {
        for (var i in res.data.photos) {
          const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
          db.push({
            name: `img_${i}`,
            url: res.data.photos[i].src.original,
            favorite: isFavorite,
          });
        }
        for (let tempUrl of Array.from(db).reverse()) {
          revDb.push(tempUrl);
        }
        console.log(22);

        setLoading(false);
      });
  };

  const Loading = () => (
    <div>
      <h1>Please wait as we are getting your superheros ready for show off</h1>
      <ReactLoading type={"bars"} color={"#ffffff"} height={667} width={375} />
    </div>
  );

  const childRefs: React.Ref<any>[] = useMemo(
    () =>
      Array(revDb.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const LoginModal = () => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>You need to do something first</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have to log in before being able to see your favorite pictures</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { setShow(false); navigate('/login'); }}>
              Log in
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );


  };

  const LoginGuard = () => {
    if (!('google-token' in cookies)) {
      render(<LoginModal />)
    } else {
      navigate('/favorites')
    }


  }

  // set last direction and decrease current index
  const swiped = async (
    direction: string,
    nameToDelete: string,
    index: number
  ) => {

    if (!('google-token' in cookies)) {
      render(<LoginModal />)
      return 0;
    }
    
    if (direction === "right") {
      var imgLink = revDb[index].url
      var parts = imgLink.split('/');
      var imgName = parts[parts.length - 1];
      const data = {"azureId": cookies['unique-id'], "imgName": imgName};
      fetch("https://middleware-hackai-backend.azurewebsites.net/add-image", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      }).then(res => {
        console.log("Request complete! response:", res);
      });
      swipeDir = "Yey, we are glad you liked it.";
    }
    setLastDirection(direction);
    revIndex = revIndex + 1;

    if (revIndex >= db.length) {
      window.location.reload();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="fullC">
      <Button onClick={LoginGuard}>Favorites</Button>
      <h1>Your brand new superheroes are here</h1>
      <div className="row">
        <div className="cardContainer">
          {revDb.map((character, index) => (
            // @ts-ignore
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name, index)}
            >
              <ImageCard image={character}></ImageCard>
            </TinderCard>
          ))}
        </div>
      </div>

      <h2 className="infoText">
        Swipe right if you like the superhero or left if you do not
      </h2>
    </div>
  );
}

export default ImageSlideShow;