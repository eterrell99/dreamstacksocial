import React, {useState} from "react";
import {
  Button,
} from "@material-ui/core";
import api from "../Services/token_refresh";
import Grid from "@material-ui/core/Grid";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { setUserSaveList } from "../Redux/userSaveSlice";
import { useDispatch } from 'react-redux'
const UserSaved = ({id, saved}) => {
    const [isSaved,setIsSaved]= useState(saved);
    const dispatch = useDispatch();
    const handlePostSaveClick = (e) =>{ 
      e.preventDefault();
        if (isSaved===false){
          const addSave = async () => {
          try {
            const response = await api.post(`user/${id}/svs/`, {},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
            setIsSaved(true);

            dispatch(setUserSaveList(response.data));
          } catch (error) {
            console.error("Error fetching posts:", error);
            throw error; // Rethrow the error for handling in the component
          }
        }; addSave();
      } else {
        const removeSave = async () => {
          try {
            const response = await api.delete(`user/${id}/svs/`,{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
            setIsSaved(false);
            dispatch(setUserSaveList(response.data));
            
          } catch (error) {
            console.error("Error fetching posts:", error);
            throw error; 
          }
        }; removeSave();
        } 
        
        
        

      };
    

  return (
    <div >
          <Grid item>
            {!isSaved? (<Button variant="outlined" onClick={(e)=> handlePostSaveClick(e)} startIcon={<DeleteForeverIcon/>}>Unsave</Button>):(<Button onClick={(e)=> handlePostSaveClick(e)} variant={"outlined"} startIcon={<Inventory2Icon/>}> Save</Button>)}
          </Grid>
          
    </div>
  );
};

export default UserSaved;