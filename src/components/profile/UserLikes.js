import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useUserLikes from '../../hooks/useUserLikes';
import HomePhotoList from '../others/photo-list/HomePhotoList';

const UserLikes = ({ authorizedUser }) => {
  const [allPhotos, setAllPhotos] = useState();
  const [loading, setLoading] = useState(false);
  let { username } = useParams();
  username = username.substr(1, username.length - 1);

  const variables = {
    username,
    checkUserLike: !authorizedUser ? 'lq3d6VSwSwDlv3mqJr7RE' : authorizedUser.id,
    first: 15,
  };

  const { likes, fetchMore } = useUserLikes(variables);

  useEffect(() => {
    if (likes) {
      const temp = likes && likes.edges
        ? likes.edges.map((edge) => edge.node.photo)
        : [];

      setAllPhotos(temp);
      setLoading(false);
    }
  }, [likes, authorizedUser]);

  const clickFetchMore = () => {
    fetchMore();
    setLoading(true);
  };

  return (
    <div className="p-3">
      <HomePhotoList
        allPhotos={allPhotos}
        setAllPhotos={setAllPhotos}
        clickFetchMore={clickFetchMore}
        loading={loading}
      />
    </div>
  );
};

export default UserLikes;
