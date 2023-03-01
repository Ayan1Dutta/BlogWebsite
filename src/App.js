
import { Routes, Route, useNavigate} from "react-router-dom"
import Login from './contaniers/login'
import Home from './contaniers/home';
import { useEffect, useState } from 'react';
import { fetchuser, userToken } from './userTools/fetchUser';
import Feed from './components/Feed';
import  Search from './components/Search'
import Create from './components/Create'
import  UserProfile  from "./components/UserProfile";
import VideoPinDetail from "./components/VideoPinDetail";
function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const accesstoken = userToken();
    if (!accesstoken) {
      navigate('/login', { replace: true });
    } else {
      const userinfo = fetchuser();
      setUser(userinfo);
    }
  }, [])
  return (
    <Routes>
      <Route path='/login' exact element={<Login />} />
      <Route path='/' exact element={<Home user={user} />}>
        <Route path="category/:categoryId" element={<Feed />} />
        <Route path="create" element={<Create />} />
        <Route path="search" element={<Search />} />
        <Route path="userDetail/:userId" element={<UserProfile/>} />
        <Route path="videoDetail/:videoId" element={<VideoPinDetail/>} />
        <Route path="/" exact element={<Feed />} />
      </Route>
    </Routes>
  );
}

export default App;
