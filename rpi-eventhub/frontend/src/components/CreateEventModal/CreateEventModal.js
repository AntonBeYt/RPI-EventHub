import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';

const imgBB_API_KEY = process.env.REACT_APP_imgBB_API_KEY; 
console.log('imgBB_API_KEY: ', process.env);




function CreateEventModal() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');

  const { addEvent } = useEvents(); // Use addEvent from EventsContext

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const uploadImage = async (imageFile) => {
    // Assume using ImgBB or similar for simplicity
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      let imgBB_API_KEY = process.env.REACT_APP_imgBB_API_KEY;
      console.log('imgBB_API_KEY: ', imgBB_API_KEY);
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`, formData);
      return response.data.data.url; // Return URL of uploaded image
    } catch (error) {
      console.error('Failed to upload image:', error);
      return ''; // Return empty string if upload fails
    }
  };

  const handleCreateEvent = async () => {
    let imageUrl = await uploadImage(file);

    const eventData = {
      title,
      description,
      poster: "admin", // Temporary hardcode
      image: imageUrl || 'default-placeholder-image-url', // Use placeholder if upload fails
      date,
      location,
      tags: tags.split(',').map(tag => tag.trim()),
    };

    try {
      const { data } = await axios.post('http://localhost:5000/events', eventData);
      addEvent(data); // Add the new event to the global context
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  
  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Create Event
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create an Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventFile">
              <Form.Label>File (Poster or PDF)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Event date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventTags">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., workshop, seminar"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateEventModal;
