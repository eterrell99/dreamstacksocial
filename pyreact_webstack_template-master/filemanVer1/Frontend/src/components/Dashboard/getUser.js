import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../Services/token_refresh";



export default function useGetUser(email, access){
    const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/user/lookup/${email}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (email && access) {
      fetchData();
    }
  }, [email, access]);

  return { userData, loading, error };
}

