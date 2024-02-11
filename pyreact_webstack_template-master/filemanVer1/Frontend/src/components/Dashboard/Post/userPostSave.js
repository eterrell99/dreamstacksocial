import React, {useState} from "react";
import {
  Button,
} from "@material-ui/core";
import api from "../../Services/token_refresh";
import Grid from "@material-ui/core/Grid";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const PostSaved = ({id, saved}) => {
    const [isSaved,setIsSaved]= useState(saved);

    const handlePostSaveClick = (e) =>{ 
      e.preventDefault();
        if (isSaved===false){
          const addSave = async () => {
          try {
            const response = await api.post(`posts/${id}/sv/`, {post:{id:id}},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
            setIsSaved(true);

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
            {isSaved? (<Button onClick={(e)=> handlePostSaveClick(e)} startIcon={<DeleteForeverIcon/>}></Button>):(<Button onClick={(e)=> handlePostSaveClick(e)} variant={"outlined"} startIcon={<Inventory2Icon/>}> Save</Button>)}
          </Grid>
          
    </div>
  );
};

export default PostSaved;