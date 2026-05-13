const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1587952477769-754598c16c51?w=1920&h=1080&fit=crop',
    filename: 'hero-truck.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    filename: 'cargo-truck.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    filename: 'refrigerated-truck.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1566576912326-d5ddd3e605e5?w=800&h=600&fit=crop',
    filename: 'logistics-truck.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1603726847590-03c4878341e0?w=800&h=600&fit=crop',
    filename: 'express-truck.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1587952477769-754598c16c51?w=800&h=600&fit=crop',
    filename: 'team-photo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1587952477769-754598c16c51?w=1200&h=800&fit=crop',
    filename: 'argentina-map.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1587952477769-754598c16c51?w=600&h=400&fit=crop',
    filename: 'gallery-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
    filename: 'gallery-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1566576912326-d5ddd3e605e5?w=600&h=400&fit=crop',
    filename: 'gallery-3.jpg'
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'public', 'images', filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
};

const downloadAll = async () => {
  console.log('Starting image downloads...');
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Failed to download ${image.filename}`);
    }
  }
  
  console.log('All downloads completed!');
};

downloadAll();
