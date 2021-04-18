import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Image, Card } from 'react-bootstrap';
import useLikePhoto from '../../hooks/useLikePhoto';
import useUnlikePhoto from '../../hooks/useUnlikePhoto';
import useUncollectPhoto from '../../hooks/useUncollectPhoto';
import useCollectPhoto from '../../hooks/useCollectPhoto';
import useDownloadPhoto from '../../hooks/useDownloadPhoto';
import SaveToCollectionsModal from '../others/photo-card/SaveToCollectionsModal';
import PhotoMoreDetailsModal from '../others/photo-card/PhotoMoreDetailsModal';

const PhotoDetailContainer = ({ photoToShow, setPhotoToShow, authorizedUser }) => {
  const [likePhoto] = useLikePhoto();
  const [unlikePhoto] = useUnlikePhoto();
  const [collectPhoto] = useCollectPhoto();
  const [uncollectPhoto] = useUncollectPhoto();
  const [downloadPhoto] = useDownloadPhoto();
  const [showCollectModal, setShowCollectModal] = useState(false);
  const history = useHistory();

  if (!photoToShow) return null;

  const likeSinglePhoto = async () => {
    if (!authorizedUser) {
      history.push('/signin');
    } else {
      const temp = { ...photoToShow, isLiked: !photoToShow.isLiked };
      setPhotoToShow(temp);
      if (photoToShow.isLiked) {
        await unlikePhoto({ photoId: photoToShow.id });
      } else {
        await likePhoto({ photoId: photoToShow.id });
      }
    }
  };

  const collectSinglePhoto = async (photo, collection) => {
    const changeCover = (collection.isCollected === false);
    const updatedCollection = {
      ...collection,
      isCollected: !collection.isCollected,
      cover: changeCover ? photo.small : collection.cover,
    };
    const updatedCollections = photo.allCollectionsToShow
      .map((obj) => (obj.id === collection.id ? updatedCollection : obj));
    const updatedPhoto = { ...photo, allCollectionsToShow: updatedCollections };
    setPhotoToShow(updatedPhoto);
    if (collection.isCollected) {
      await uncollectPhoto({ photoId: photo.id, collectionId: collection.id });
    } else {
      await collectPhoto({ photoId: photo.id, collectionId: collection.id });
    }
  };

  const openCollectModal = async () => {
    if (!authorizedUser) {
      history.push('/signin');
    } else {
      setShowCollectModal(true);
    }
  };

  const photo = photoToShow;

  const photoCredit = `Photographer: ${photo.photographer}`;

  const downloadSinglePhoto = async () => {
    window.open(photo.downloadPage);
    await downloadPhoto({ id: photo.id });
  };

  return (
    <div className="p-3">
      <div className="photodetails-photo-item">
        <Card>
          <Image src={photoToShow.small} width="100%" />
        </Card>
      </div>
      <div className="container-row-photodetail-btn">
        <div className="">
          <button
            type="button"
            className="photodetails-card-btn-like container-row-0 photodetails-card-btn-item"
            onClick={() => likeSinglePhoto(photo)}
          >
            <div className="">
              {!photo.isLiked && (<i className={photo.isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'} />)}
              {photo.isLiked && (
                <div className="red-icon">
                  <i className={photo.isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'} />
                </div>
              )}
            </div>
          </button>
        </div>
        <div>
          <button type="button" className="photodetails-card-btn-collect photodetails-card-btn-item" onClick={() => openCollectModal()}>
            <i className="bi bi-plus-square" />
          </button>
          <SaveToCollectionsModal
            photo={photo}
            collectSinglePhoto={collectSinglePhoto}
            showCollectModal={showCollectModal}
            setShowCollectModal={setShowCollectModal}
          />
        </div>
        <div className="photodetails-card-btn-item">
          <button type="button" className="photodetails-card-btn-download" onClick={() => downloadSinglePhoto()}>
            <i className="bi bi-download" />
          </button>
        </div>
      </div>
      <div className="container-row-0">
        <h5>{photoCredit}</h5>
      </div>
      <div className="col-item-collection-description">
        <p className="">
          From
          {' '}
          <a href={photo.creditId} target="_">{photo.creditWeb}</a>
        </p>
      </div>
      <div className="container-row-0">
        <PhotoMoreDetailsModal photo={photo} />
      </div>
    </div>
  );
};

export default PhotoDetailContainer;
