import React, { useState } from 'react';
import { Button, Backdrop, IconButton, Container, Grid } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton'
import ReactPlayer from 'react-player';
import SaveIcon from '@mui/icons-material/Save'; // Add this line
import './mediaViewer.css';
import { ButtonGroup } from '@mui/material';
//    
// fix media video aspect ration when scaling

const mediaContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxHeight: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  zIndex:'1',
};

const isMobileViewport = window.innerWidth <= 768;

const loadingButtonIcon = () =>{ 
  return ( <div>
    <ButtonGroup variant="outlined" aria-label="Loading button group">
  
  <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>
    Save
  </LoadingButton>
</ButtonGroup>
</div>)
}


function ImageViewer({ files, expand,setExpand, toggleMediaExpanded }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const previousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const openImage = () => {
    setOpen(true);
  };

  const closeImage = () => {
    setOpen(false);
  };

  const preventBackdropClose = (e) => {
    e.stopPropagation();
  };

  const currentFile = files[currentIndex];

  const supportedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const supportedVideoExtensions = ['mp4', 'webm', 'ogg'];

  const getFileExtension = (url) => {
    return url.split('.').pop();
  };

  const isImageFile = (url) => {
    const extension = getFileExtension(url);
    return supportedImageExtensions.includes(extension);
  };

  const isVideoFile = (url) => {
    const extension = getFileExtension(url);
    return supportedVideoExtensions.includes(extension);
  };

  const renderMediaContent = () => {
    if (currentFile) {
      const url = currentFile.file;
      if (isImageFile(url)) {
        console.log(url);
        return (
          <img src={url} alt={`Image ${currentIndex}`} style={{ ...mediaContainerStyle, objectFit: 'cover', cursor: 'pointer' }} onClick={openImage} />
        );
      } else if (isVideoFile(url)) {
        console.log(url);
        console.log('video');
        return (
          //add styling for hte video tag
          <div>
            {isMobileViewport ? (<ReactPlayer url={url} controls={true} playsinline={true} style={{ ...mediaContainerStyle, cursor: 'pointer', height: '50%'  }} onClick={openImage} />
          )
          : 
          (<ReactPlayer url={url} controls={true} playsinline={true} style={{ ...mediaContainerStyle, cursor: 'pointer', height: '50%'  }} onClick={openImage} />
          )}
          </div>
          
          
          //file not <ReactPlayer url={url} controls={true} width='100%' height='100%' style={{ ...mediaContainerStyle, cursor: 'pointer', objectFit: 'cover' }} onClick={openImage} />

         
        );
      }
      else {
        return (
          <Button>{isImageFile(url) ? loadingButtonIcon: isVideoFile(url) ? loadingButtonIcon: loadingButtonIcon}</Button>
        );
      };
    }
    return null;
  };

  const mediaContent = renderMediaContent();

  return (
    <div className="image-viewer">
      <div className="image-container" style={{ maxHeight: '300px', position: 'relative', overflow: 'hidden' }}>
        {mediaContent}
        <div className="navigation-buttons">
          <Button
            onClick={(e) => {
              previousImage();
              preventBackdropClose(e);
            }}
            disabled={currentIndex === 0}
            variant="contained"
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}
          >
            <NavigateBeforeIcon />
          </Button>
          <Button
            onClick={(e) => {
              nextImage();
              preventBackdropClose(e);
            }}
            disabled={currentIndex === files.length - 1}
            variant="contained"
            style={{ position: 'absolute', top: 0, right: 0, height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}
          >
            <NavigateNextIcon />
          </Button>
        </div>
      </div>

      <Backdrop open={open} onClick={closeImage}>
        <Container maxWidth="lg" style={{ height: '100%' }}>
          <Grid container alignItems="center" justifyContent="center" style={{ height: '100%' }}>
            <Grid item xs={1}>
              <IconButton
                onClick={(e) => {
                  previousImage();
                  preventBackdropClose(e);
                }}
                disabled={currentIndex === 0}
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              >
                <NavigateBeforeIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <div className='player-wrapper'>
                {mediaContent}
              </div>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={(e) => {
                  nextImage();
                  preventBackdropClose(e);
                }}
                disabled={currentIndex === files.length - 1}
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                onClick={(e) => {
                  closeImage();
                  preventBackdropClose(e);
                }}
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </Backdrop>
    </div>
  );
}

export default ImageViewer;