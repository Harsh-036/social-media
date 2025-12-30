import React, { useEffect, useState } from 'react'
import Avatar from '../avatar/Avatar'
import './Follower.scss'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollowUser, getFeedData } from '../../redux/slices/feedSlice';
import { useNavigate } from 'react-router-dom';


function Follower({user}) {
  const dispatch = useDispatch();
  const feedData = useSelector(state => state.feedDataReducer.feedData)
  const [isFollowing, setIsFollowing] = useState();
  const navigate = useNavigate()

  useEffect(() => {
   setIsFollowing(feedData.followings.find(item => item._id === user._id))
  },[feedData]);

  function handleUserFollow () {
    dispatch(followAndUnfollowUser({
      userIdToFollow: user._id
    }))
    // dispatch(getFeedData())
  }
  return (
    <div className='Follower'>
        <div className="user-info" onClick={() => navigate(`/profile/${user._id}`)}>
            <Avatar src={user?.avatar?.url}/>
            <h4 className='name'>{user?.name}</h4>
        </div>   
             
        <h5 onClick={handleUserFollow} className={isFollowing ? 'hover-link follow-link' : 'btn-primary'}>{isFollowing ? 'Unfollow' : 'Follow'}</h5>
    </div>
  )
}

export default Follower