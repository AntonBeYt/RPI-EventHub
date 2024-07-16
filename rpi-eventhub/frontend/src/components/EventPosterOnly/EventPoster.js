import React, { useCallback } from 'react';
import style from './EventPoster.module.css';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

const EventPoster = ({ id, title, posterSrc, description, author, tags }) => {
  console.log("tags: ", tags);
  const { username } = useAuth();  // Destructure username from useAuth
  const { deleteEvent } = useEvents();
  const [imageSize, setImageSize] = useState(null);

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

  const canSeeDeleteButton = (user_name) => {
    console.log('user_name: ', user_name);
    console.log('author: ', author);

    if (user_name === 'admin' || user_name === author) {
      return true;
    }
    return false;
  }


  useEffect(() => {
    const fetchImageSize = async () => {
      try {
        const response = await fetch(posterSrc, { method: 'HEAD' });
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
          setImageSize((parseInt(contentLength) / 1024).toFixed(2)); 
        }
      } catch (error) {
        console.error('Failed to fetch image size:', error);
      }
    };

    fetchImageSize();
  }, [posterSrc]);


  return (
    <Link to={`/events/${id}`} className={style.eventLink}> {/* Wrap with Link */}
    <div className={style.eventPosterContainer}>
      <img src={posterSrc} alt={title} className={style.eventPosterImg} />
      <div className={style.eventPosterDetails}>
        <h2 className={style.eventPosterTitle}>{title}</h2>
        <p className={style.eventPosterDescription}>{description}</p>
        {canSeeDeleteButton(username) && <button onClick={handleDelete} className="delete-button btn-danger btn">Delete</button>}
        <p>Posted by {author}</p>
        {/* {imageSize && <p>Image Size: {imageSize} KB</p>} */}
        <ul>
          {tags.map((tag, index) =>(
          <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
    </div>
    </Link>
  );
};

export default EventPoster;
