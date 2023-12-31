import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "../UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  
    useEffect(() => {
      fetch('http://localhost:8000/profile', {
        credentials: 'include',
        method: "GET"
      }).then(response => {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
        });
      });
    }, [setUserInfo]);

  async function logout() {
    await fetch('http://localhost:8000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Shifu Magazine</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a href="/" onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}