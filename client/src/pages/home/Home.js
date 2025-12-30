import { useDispatch } from 'react-redux'
import Navbar from '../../component/navbar/Navbar'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import { getMyInfo } from '../../redux/slices/appConfigSlice';

function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyInfo())
  },[])
  return (
    <>
      <Navbar/>
      <div className="outlet" style={{marginTop:'60px'}}>
          <Outlet/>
      </div>
      
    </>
  )
}

export default Home