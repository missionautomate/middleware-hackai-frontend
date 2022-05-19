import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../context/User.context';
import { UserRole } from '../enums/user-role';


function Navbar() {
  const navigate = useNavigate();
  const { user, changeUser } = useContext(UserContext);

  const navigateTo = (path: string) => () => {
    return navigate(path);
  }

  return (
    <div className={`navbar`}>
      {/* <div className={`navbar__content`}> */}
        <div className={`navbar__left`}>
          <div className={`navbar__elem`} onClick={navigateTo('/')}>Home</div>
          {user.userRole === UserRole.LOGED_IN_USER && <div className={`navbar__elem`} onClick={navigateTo('/favorites')}>Gallery</div>}
        </div>
        <div className={`navbar__right`}>
          {user.userRole === UserRole.LOGED_IN_USER && <div className={`navbar__elem`} onClick={navigateTo('/favorites')}>
            <span>{user.name}</span> <img src={user.pictureURL} alt='picture'></img>
          </div>}
          {user.userRole === UserRole.GUEST && <div className={`navbar__elem`} onClick={navigateTo('/login')}>Log in</div>}
        </div>
      </div>
    // </div>
  )
}

export default Navbar;
