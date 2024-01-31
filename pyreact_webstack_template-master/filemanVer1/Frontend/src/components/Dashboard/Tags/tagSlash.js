import React, { useEffect, useState,useRef,useParams } from "react";

export default function TagSlash() {
    const param = useParams();
    const email = localStorage.getItem("email");
    const access = localStorage.getItem("access");
    const [postData, setPostData] = useState();
    const [topTags, setTopTags] = useState();
    const [expanded, setExpanded] = useState(false);

    useEffect(()=> {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`post/`,{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}, params:{id:param.post},});
        setPostData(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    };
    fetchPosts();  }, [])

    useEffect(()=> {
      const fetchTopTags = async () => {
        try {
          const response = await api.get(`tag/top/`);
          setTopTags(response.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
          throw error; // Rethrow the error for handling in the component
        }
      };
      fetchTopTags();  }, [])
    const { userData, loading, error } = getUser(email, access);
    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
      


    return (
      <div>
      </div>
    );


}