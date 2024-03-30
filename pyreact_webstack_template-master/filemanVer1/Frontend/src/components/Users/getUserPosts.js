import React, { useEffect, useState } from 'react';
import api from '../Services/token_refresh';

const getUserPosts = (userID) => {
    try {
      if (userID) {
        const response = api.get(`/post/user/${userID}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        console.log(`postsUser - ${userID} loaded`)
        return response.data;
      } else {
        return(console.error("User data or user ID is null or undefined."));
      }
    } catch (error) {
      return(console.error("Error fetching posts:", error));
      // Handle the error as needed
    }
        
};

export default getUserPosts;