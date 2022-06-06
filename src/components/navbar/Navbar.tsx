import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import UserContext from '../../context/User.context';
import { UserRole } from '../enums/user-role';
import { useCookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import { Button } from "reactstrap";


function Navbar() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const { user, changeUser } = useContext(UserContext);

  const navigateTo = (path: string) => () => {
    return navigate(path);
  }

  const logOut = () => () => {
    removeCookie('user-name');
    removeCookie('unique-id');
    removeCookie('google-token', {path:'/'});
    console.log("check");
    // removeCookie("google-token");
    window.location.reload();
    return navigate('/');
  }

  const LoginModal = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>You need to do something first</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have to log in before being able to see your favorite pictures</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={navigateTo('/login')}>
              Log in
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const LoginGuard = () => {
    if (!('google-token' in cookies)) {
      <LoginModal/>
    }
  }

  console.log(user);
  if(cookies['unique-id'] != undefined && cookies['user-name'] != undefined){
    return (
      <div className={`navbar`}>
          <div className={`navbar__left`}>
            <div className={`navbar__elem`} onClick={navigateTo('/')}>Home</div>
          </div>
          <div className={`navbar__right`}>
            <div className={`navbar__elem`} onClick={navigateTo('/favorites')}>
              <span>{cookies['user-name']}</span> <img src='https://upload.wikimedia.org/wikipedia/commons/d/d6/Connecticut_ComiCONN_Superhero_Mascot..jpg' alt='picture'></img>
            </div>
            <div className={`navbar__elem`} onClick={logOut()}>
              <img src='https://i.postimg.cc/52qrjk5g/kisspng-computer-icons-font-logs-5ae2d19bd44999-4333965515248142358695.png' alt='picture'></img>
            </div>
          </div>
        </div>
    );
  }
  return (
    <div className={`navbar`}>
        <div className={`navbar__left`}>
          <div className={`navbar__elem`} onClick={navigateTo('/')}>Home</div>
          {user.userRole === UserRole.LOGED_IN_USER && <div className={`navbar__elem`} onClick={LoginGuard}>Gallery</div>}
        </div>
        <div className={`navbar__right`}>
          {user.userRole === UserRole.LOGED_IN_USER && <div className={`navbar__elem`} onClick={navigateTo('/favorites')}>
            <span>{user.name}</span> <img src={user.pictureURL} alt='picture'></img>
          </div>}
          {user.userRole === UserRole.LOGED_IN_USER && <div className={`navbar__elem`} onClick={logOut()}>
            <img src='https://i.postimg.cc/52qrjk5g/kisspng-computer-icons-font-logs-5ae2d19bd44999-4333965515248142358695.png' alt='picture'></img>
          </div>
          }
          {user.userRole === UserRole.GUEST && <div className={`navbar__elem`} onClick={navigateTo('/login')}>Log in</div>}
        </div>
      </div>
    // </div>
  )
}

export default Navbar;
