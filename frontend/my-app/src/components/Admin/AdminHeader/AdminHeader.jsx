import './AdminHeader.css';

import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import bellIcon from '../../../assets/bell.png';
// Icon imports
import listIcon from '../../../assets/list_icon.png';
import peopleIcon from '../../../assets/people.png';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function AdminHeader() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const res = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name ? `${res.data.name}님` : '관리자');
      } catch (e) {
        setUserName('관리자');
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="admin-header">
      {/* Left: hamburger icon */}
      <div className="header-left">
        <img src={listIcon} alt="Menu" className="menu-icon" />
      </div>

      {/* Right: bell icon + profile icon + user name */}
      <div className="header-right">
        {/*   <img src={bellIcon} alt="Notifications" className="header-icon" />*/}

        <div className="profile-section">
          {/*  <img src={peopleIcon} alt="Profile" className="header-icon" /> */}
          <Link to="info-edit">
            <span className="user-name">{userName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
