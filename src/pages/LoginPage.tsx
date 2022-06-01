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
  const [cookies, setCookie, removeCookie] = useCookies(['google-token', 'google-id']);
  
  useEffect(() => {
    if ('google-token' in cookies){
      navigate('/');
    }
    setLoading(false);
  }, []);

  const Loading = () => (
    <ReactLoading type={'bars'} color={'#ffffff'} height={667} width={375} />
  );
  
  const responseGoogle = (response: any) => {
    console.log(response);
    const data = []
    data.push(response['accessToken'])
    data.push(response['profileObj'])
    console.log(data)
    setCookie("google-token", response.tokenObj.id_token, {expires: new Date(response.tokenObj.expires_at), maxAge: response.tokenObj.expires_in});
    setCookie("google-id", response['profileObj'].googleId)
    const newUser = new UserBasics();
    newUser.userRole = UserRole.LOGED_IN_USER;
    newUser.name = response['profileObj'].name;
    newUser.email = response['profileObj'].email;
    newUser.pictureURL = response['profileObj'].imageUrl;
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
    // setCookie("google-token", response.tokenObj.id_token, {expires: new Date(response.tokenObj.expires_at), maxAge: response.tokenObj.expires_in});
    
    navigate('/');
    /*
    Set a cookie:
    (if not exists (check on index page) --> navigate to login page, else stay there)
    (when loging in: save token in cookie)

    access_token: "ya29.A0ARrdaM_lMHPbloHuVEhfVCAzsM5OB6WiH-Es2PTZ0HMS6-0BiOSKzfF9rK60h7a52x-vfQ0Vo4N3k1YVD5ZYk99mk_2iAEwNqhFvZi0vZQpU8MAt5cLm6iqD5eOIkjtx5LaGJQZMGoFNY41NN9F_zu9tiqfu"
    expires_at: 1651572228491
    expires_in: 3599
    first_issued_at: 1651568629491
    id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZjYmQ3ZjQ4MWE4MjVkMTEzZTBkMDNkZDk0ZTYwYjY5ZmYxNjY1YTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTAyODk3NTE4MDk1MS1nZWdpZzJudWNwNHR1ZnVtcHFtYzA0Z3Fob2Z1aWxyai5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwMjg5NzUxODA5NTEtZ2VnaWcybnVjcDR0dWZ1bXBxbWMwNGdxaG9mdWlscmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg1MjAxMDQ3OTk1ODE0NzAzNjAiLCJoZCI6InJvZ3VlbWFyay5jb20iLCJlbWFpbCI6ImtpbmdhQHJvZ3VlbWFyay5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InlZQzREbzRhVzlXdWpleVFkUUtpYXciLCJuYW1lIjoiS2luZ2EgU2FsYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaWtmU3AweVpia3daZWd5OFl6ZmZITlluLVNrREc3cFJ2Rk5Gd209czk2LWMiLCJnaXZlbl9uYW1lIjoiS2luZ2EiLCJmYW1pbHlfbmFtZSI6IlNhbGEiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY1MTU2ODYyOSwiZXhwIjoxNjUxNTcyMjI5LCJqdGkiOiJkMTkyNDZhM2VmMjRmMTRjMzI1OWNhOGJjNWQ0MTU2NTI1MGY2Y2Y2In0.frAk8uUg8NNZMy-_Upju2ukqYCpdTWyVZp90EhnfmbDHn1OJrCKRl1VHzqlx8khc-3-gu5ShylSpePUmFggeu1eGxI5hl_ValtvO48y_77iwACkSJ4p90yaUhnuX5I5aBjmGibHG_mYpXmG9EUFwI-rupI2NcKbLeThta4-qNSmJjpBHarfqt12MVZx59llVxV2q8pgFhSpMcahZ_-r9D1qdphQ9L7HeQvKfDdrN6rbwPw7QWUYFLFI5_krajYgVOWxMMFB9qKopMwcf3_wT-dNN01nN7kR38igodov-MOWbwbA5fkcIvjsvPCaUWvej7R1jYvCcJ16JigAm5FDJaA"
    idpId: "google"

    */
  };

  if (isLoading) {
    return (<Loading />)
  }

  return (

    <div className="fullC">

      <h1>Login</h1>
      <div className="row">
        <div className='cardContainer'>
          <GoogleLogin
            clientId="1028975180951-gegig2nucp4tufumpqmc04gqhofuilrj.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
