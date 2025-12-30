import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import usersImg from "../../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile, deleteMyProfile } from "../../redux/slices/appConfigSlice";

function UpdateProfile() {
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");
  const [originalImg, setOriginalImg] = useState(""); // Track original image URL
  const [hasImageChanged, setHasImageChanged] = useState(false); // Track if image was actually changed
  const dispatch = useDispatch();

  useEffect(() => {
    if (myProfile) {
      setName(myProfile.name || "");
      setBio(myProfile.bio || "");
      setUserImg(myProfile.avatar?.url || "");
      setOriginalImg(myProfile.avatar?.url || '');
      setHasImageChanged(false);
    }
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === FileReader.DONE) {
        setUserImg(fileReader.result);
        setHasImageChanged(true); // Mark that image has been changed
      }
    };
    fileReader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
    fileReader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Build the update object with only changed fields
    const updateData = {};

    // Check if name has changed
    if (name !== (myProfile?.name || "")) {
      updateData.name = name;
    }

    // Check if bio has changed
    if (bio !== (myProfile?.bio || "")) {
      updateData.bio = bio;
    }

    // Check if image has changed (only send if it's a new base64 image)
    if (hasImageChanged && userImg && userImg.includes('data:image')) {
      updateData.userImg = userImg;
    }

    // If no fields have changed, don't make the request
    if (Object.keys(updateData).length === 0) {
      alert("No changes detected");
      return;
    }

    dispatch(updateMyProfile(updateData))
    .unwrap()
    .then(() => {
      // Reset change tracking after successful update
      setHasImageChanged(false);
      alert("Profile updated successfully!");
    })
    .catch((error) => {
      // console.error("Failed to update profile:", error);
      // Show user-friendly error message
      const errorMessage = error?.message || "Failed to update profile. Please try again.";
      alert(`Error: ${errorMessage}`);
    });
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await dispatch(deleteMyProfile()).unwrap();
      // Redirect and token removal are handled in the thunk
      // Optional: alert("Account deleted successfully!"); but redirect happens immediately
    } catch (error) {
      const errorMessage = error?.message || "Failed to delete account. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg ? userImg : usersImg} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />

            <input type="submit" className="btn-primary" value="Submit" />
          </form>

          <button onClick={handleDelete} className="delete-account btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
