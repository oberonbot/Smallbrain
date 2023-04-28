import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  thumbnail: {
    display: 'inline-block',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#f1f1f1',
    position: 'relative',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  uploadButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  photoIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '50px',
  },
}));

function ThumbnailWithPhotoIcon () {
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result);
    };
  };

  return (
    <div className={classes.thumbnail}>
      {imageUrl
        ? (
        <img className={classes.thumbnailImg} src={imageUrl} alt="Thumbnail" />
          )
        : (
        <>
          <IconButton className={classes.photoIcon}>
          </IconButton>
          <input
            type="file"
            accept="image/*"
            className={classes.uploadButton}
            onChange={handleImageUpload}
          />
        </>
          )}
    </div>
  );
}

export default ThumbnailWithPhotoIcon;
