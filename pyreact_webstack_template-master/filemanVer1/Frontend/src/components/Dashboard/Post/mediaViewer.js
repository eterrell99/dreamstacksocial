import React, { useState } from 'react';
import { Button, Backdrop, IconButton, Container, Grid } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from 'react-player';
import './mediaViewer.css';
const mediaContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxHeight: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  zIndex:'1',
};
function ImageViewer({ files }) {
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
    return url.split('.').pop().toLowerCase();
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
    if (currentFile && currentFile.file) {
      const url = currentFile.file.toLowerCase();
      if (isImageFile(url)) {
        console.log(url);
        return (
          <img src={url} alt={`Image ${currentIndex}`} style={{ ...mediaContainerStyle, objectFit: 'cover', cursor: 'pointer' }} onClick={openImage} />
        );
      } else if (isVideoFile(url)) {
        return (
          <ReactPlayer url={url} controls={true} className='react-player' width='100%' height='100%'/>
        );
      }
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
          <Grid container alignItems="center" style={{ height: '100%' }}>
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