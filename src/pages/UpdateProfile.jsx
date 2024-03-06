import React from 'react'
import { NavLink } from 'react-router-dom'

const UpdateProfile = () => {
  return (
    <div className='container py-4 px-5'>
        <p>
          <NavLink
            className="text-decoration-none text-secondary me-2 "
            to={"/my-profile"}
          >
            My Profile
          </NavLink>
          <span>/ Update Profile</span>
        </p>
        <h3>Update Profile</h3>
    </div>
  )
}

export default UpdateProfile