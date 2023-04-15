// const AWS = require('aws-sdk');
// const docClient = new AWS.DynamoDB.DocumentClient();
// const s3 = new AWS.S3();

// exports.tabledisplay = async (event) => {
//   const params = {
//     TableName: 'music'
//   };
  
//   try {
//     const data = await docClient.scan(params).promise();
//     const items = data.Items;
    
//     // Loop through each item and get the artist image URL from S3
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       const artistImageKey = `${item.artist}.jpg`;
//       const artistImageURL = await getArtistImageURL(artistImageKey);
      
//       // Add the artist image URL to the item object
//       item.artistImageURL = artistImageURL;
//     }
    
//     const response = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true,
//       },
//       body: JSON.stringify(items)
//     };
//     return response;
//   } catch (err) {
//     const response = {
//       statusCode: 500,
//       body: JSON.stringify(err)
//     };
//     return response;
//   }
// };

// // Function to retrieve the artist image URL from S3
// async function getArtistImageURL(key) {
//   const params = {
//     Bucket: 'mybucket-s3885529',
//     Key: key
//   };
  
//   try {
//     const url = await s3.getSignedUrlPromise('getObject', params);
//     return url;
//   } catch (err) {
//     console.log(err);
//     return '';
//   }
// }


//taken reference from youtube: https://www.youtube.com/watch?v=mgkgQtMplPY
//stackoverflow for doubts and errors and AWS for workflow and services.

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.tabledisplay = async (event) => {
  const params = {
    TableName: 'music'
  };
  
  try {
    const data = await docClient.scan(params).promise();
    const items = data.Items;
    
    // Loop through each item and get the artist image URL from S3
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const artistImageKey = `${item.artist}.jpg`;
      const artistImageURL = await getArtistImageURL(artistImageKey);
      
      // Add the artist image URL to the item object
      item.artistImageURL = artistImageURL;
    }

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(items)
    };
    return response;
  } catch (err) {
    const response = {
      statusCode: 500,
      body: JSON.stringify(err)
    };
    return response;
  }
};

// Function to retrieve the artist image URL from S3
async function getArtistImageURL(key) {
  const params = {
    Bucket: 'mybucket-s3885529',
    Key: key
  };
  
  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (err) {
    console.log(err);
    return '';
  }
}