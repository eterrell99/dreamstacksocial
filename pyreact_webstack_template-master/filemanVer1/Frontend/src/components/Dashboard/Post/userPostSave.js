import React, {useState} from "react";
import {
  Button,
} from "@material-ui/core";
import api from "../../Services/token_refresh";
import Grid from "@material-ui/core/Grid";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { setSaveList } from "../../Redux/saveBarSlice";
import { useDispatch } from 'react-redux'
const PostSaved = ({id, saved,setTags}) => {
    const [isSaved,setIsSaved]= useState(saved);
    const dispatch = useDispatch();
    const handlePostSaveClick = (e) =>{ 
      e.preventDefault();
        if (isSaved===false){
          const addSave = async () => {
          try {
            const response = await api.post(`posts/${id}/sv/`, {post: id},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
            setIsSaved(true);
            setTags();
            dispatch(setSaveList(response.data));
          } catch (error) {
            console.error("Error fetching posts:", error);
            throw error; // Rethrow the error for handling in the component
          }
        }; addSave();
      } else {
        const removeSave = async () => {
          try {
            const response = await api.delete(`posts/${id}/sv/`,{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
            setIsSaved(false);
            setTags();
            dispatch(setSaveList(response.data));
            
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
            {isSaved? (<Button variant="outlined" onClick={(e)=> handlePostSaveClick(e)} startIcon={<DeleteForeverIcon/>}>Unsave</Button>):(<Button onClick={(e)=> handlePostSaveClick(e)} variant={"outlined"} startIcon={<Inventory2Icon/>}> Save</Button>)}
          </Grid>
          
    </div>
  );
};

export default PostSaved;