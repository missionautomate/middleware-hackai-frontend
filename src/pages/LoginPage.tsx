import React, { useState, useMemo, useRef, useEffect, useContext } from 'react'
import ReactLoading from 'react-loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import TinderCard from 'react-tinder-card'
import './../css/CardReview.css'
import axios from 'axios'
import GoogleLogin from 'react-google-login';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/User.context';
import { UserBasics } from '../models/user-basics.data';
import { UserRole } from '../components/enums/user-role';
import MicrosoftLogin from "react-microsoft-login";

class PictureData {
  name: string = '';
  key?: string = '';
  url: string = '';
}

const db: PictureData[] = [];
const revDb: PictureData[] = [];
let revIndex = 0;

function LoginPage() {

  const navigate = useNavigate();
  const {user, changeUser} = useContext(UserContext);

  const [isLoading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['google-token', 'unique-id', 'user-name']);
  
  useEffect(() => {
    if ('google-token' in cookies){
      navigate('/');
    }
    setLoading(false);
  }, []);

  const Loading = () => (
    <ReactLoading type={'bars'} color={'#ffffff'} height={667} width={375} />
  );
  
  const responseGoogle = (err:any, response:any) => {
    console.log(err, response);
    const data = []
    data.push(response['account']['accountIdentifier'])
    data.push(response['account']['name'])
    data.push(response['account']['userName'])
    console.log(data)
    setCookie("google-token", response['accessToken'], {expires: response['expiresOn']});
    setCookie("unique-id", response['account']['accountIdentifier'])
    setCookie("user-name", response['account']['name'])
    const newUser = new UserBasics();
    newUser.userRole = UserRole.LOGED_IN_USER;
    newUser.name = response['account']['name'];
    newUser.email = response['account']['userName'];
    newUser.pictureURL = "https://upload.wikimedia.org/wikipedia/commons/d/d6/Connecticut_ComiCONN_Superhero_Mascot..jpg"
    // TODO: if user is loged in, get user data from backend to set the context
    changeUser(newUser);

    fetch("https://middleware-hackai-backend.azurewebsites.net/login", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    }).then(res => {
      console.log("Request complete! response:", res);
    });
    navigate('/');
  };

  if (isLoading) {
    return (<Loading />)
  }

  function onSignIn(googleUser:any) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  return (

    <div className="fullC">

      <h1>Login</h1>
      <div className="row">
        <div className='cardContainer'>
          <MicrosoftLogin clientId="20fdaf3b-cc20-4238-9fc0-183433e023ff" authCallback={responseGoogle} />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
