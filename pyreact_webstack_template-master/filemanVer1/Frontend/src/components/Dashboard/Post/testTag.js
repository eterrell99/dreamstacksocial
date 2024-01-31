import React, { useState, useEffect,useRef   } from "react";
import api from "../../Services/token_refresh";

import {

    Button,
  } from "@material-ui/core";


export default function TestTag(postID){
    const handleTest = (e,postID) => {
        e.preventDefault()
          
              try {
                 const addTag = async () => {
                      const response = await api.patch(`post/?id=1`,{tags:[{id:'1'}]},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}})
                    }
                    addTag();
                } catch (error) {
                  console.error("Error creating comment:", error);
               }
               
    
          };

    return (<Button onClick={(e)=>handleTest(e,postID)}>Test Tag</Button>)
};
