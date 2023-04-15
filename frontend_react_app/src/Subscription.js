
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser, resetUserSession } from './service/AuthService';
import { useNavigate } from "react-router-dom";

// taken reference from youtube: https://www.youtube.com/watch?v=ReNkQ0Xkccw&t=1913s

function Subscription() {
  const [musicData, setMusicData] = useState([]);
  const [artistImageURLs, setArtistImageURLs] = useState({});
  const apiurl = 'https://4m2tcg1vr0.execute-api.us-east-1.amazonaws.com/prod/tabledisplay';
  const xapikey = '1NbgWVwiRG7GJKfbLEMAF5yzXQLJF17774cnDkAc';


  const logoutHandler = () => {
    resetUserSession();
    navigate('/login');
  }
  const navigate = useNavigate(); 
  const user = getUser();
  console.log(user)
  const user_name = user !== 'undefined' && user ? user.user_name : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiurl, { headers: { 'x-api-key': xapikey } });

        const modifiedData = response.data.map(item => ({ ...item, url: '' }));
        console.log(modifiedData)
        setMusicData(modifiedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const [loading, setLoading] = useState(true);

  const getArtistUrl = async (artist) => {
    const url = `https://mybucket-s3885529.s3.amazonaws.com/${artist}.jpg`; // Replace with your S3 bucket URL
    try {
      console.log(`Fetching image for artist ${artist} from URL ${url}`);
      const response = await axios.get(url);
      console.log(`Response:`, response);
      if (response.status === 200) {
        const imageData = { ...response.data, url: url };
        return { artist, url: imageData.url };
      } else {
        return { artist, url: '' };
      }
    } catch (error) {
      console.log(error);
      return { artist, url: '' };
    }
  };
  

  const handleRemoveClick = (id) => {
    const url = `https://4m2tcg1vr0.execute-api.us-east-1.amazonaws.com/prod/removemusic?id=${id}`;
    axios.post(url)
      .then(res => {
        console.log(res.data);
        axios.get(apiurl, { headers: { 'x-api-key': xapikey } })
          .then(res => {
            setMusicData(res.data);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });

  };

  useEffect(() => {
    const getImages = async () => {
      const imageURLs = {};
      for (const item of musicData) {
        const { artist, url } = await getArtistUrl(item.artist);
        imageURLs[artist] = url;
      }
      console.log(imageURLs)
      setArtistImageURLs(imageURLs);
      setLoading(false);
    };
    getImages();
  }, [musicData]);

  return (
    <div className='text'>
      <h3>Welcome {user_name}! This is your subscription page.<br/><br/></h3>
      Want to logout instead? <br/>
      <input type="button" value="Logout" onClick={logoutHandler} />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {musicData.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.artist}</td>
              <td>{item.year}</td>
              <td>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className='images'><img src={artistImageURLs[item.artist]} alt={item.artist} /></div>
                )}
              </td>
              <td><button onClick={() => handleRemoveClick(item.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
        </table>
        </div>)

}

export default Subscription;
