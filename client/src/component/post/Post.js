import React from 'react'
import Avatar from '../avatar/Avatar'
import './Post.scss'
import backgroundImg from '../../assets/background.png'
import { AiFillHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { likeAndUnlikePost, deletePost } from '../../redux/slices/postSlice';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../redux/slices/appConfigSlice';
import { TOAST_SUCCESS, TOAST_FAILURE } from '../../App';

function Post({post}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

    async function handlePostLiked() {
        dispatch(showToast({
            type: TOAST_SUCCESS,
            message: 'liked or unlike'
        }))
        dispatch(likeAndUnlikePost({
            postId: post._id
        }))
    }

    async function handleDeletePost() {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            await dispatch(deletePost({ postId: post._id })).unwrap();
            dispatch(showToast({
                type: TOAST_SUCCESS,
                message: 'Post deleted successfully'
            }));
        } catch (error) {
            dispatch(showToast({
                type: TOAST_FAILURE,
                message: error?.message || 'Failed to delete post'
            }));
        }
    }

    

  return (
    <div className='Post'>
        <div className="heading" onClick={() => navigate(`/profile/${post.owner._id}`)}>
            <Avatar src={post.owner?.avatar?.url}/>
            <h4>{post?.owner?.name || 'Unknown User'}</h4>
            {myProfile?._id === post.owner._id && (
                <AiFillDelete
                    className='delete-icon'
                    onClick={handleDeletePost}
                    title="Delete Post"
                />
            )}
        </div>
        <div className="content">
            <img src={post?.image?.url} alt="post" />
        </div>
        <div className="footer">
            <div className="like" onClick={handlePostLiked}>
                {post.isLiked ? <AiFillHeart style={{color: 'red'}} className='icon'/> : <AiOutlineHeart className='icon' />}
                
                <h4>{`${post.likesCount} likes`}</h4>
            </div>
            <p className='caption'>{post.caption || 'No caption'}</p>
            <h6 className='time-ago'>{post?.timeAgo || ''}</h6>
            
        </div>
    </div>
  )
}

export default Post