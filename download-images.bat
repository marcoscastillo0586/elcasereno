@echo off
echo Downloading hero truck image...
curl -o "public/images/hero-truck.jpg" "https://images.unsplash.com/photo-1587952477769-754598c16c51?w=1920&h=1080&fit=crop"

echo Downloading cargo truck image...
curl -o "public/images/cargo-truck.jpg" "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop"

echo Downloading refrigerated truck image...
curl -o "public/images/refrigerated-truck.jpg" "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"

echo Downloading logistics truck image...
curl -o "public/images/logistics-truck.jpg" "https://images.unsplash.com/photo-1566576912326-d5ddd3e605e5?w=800&h=600&fit=crop"

echo Downloading express truck image...
curl -o "public/images/express-truck.jpg" "https://images.unsplash.com/photo-1603726847590-03c4878341e0?w=800&h=600&fit=crop"

echo Downloading team photo...
curl -o "public/images/team-photo.jpg" "https://picsum.photos/800/600"

echo Downloading Argentina map...
curl -o "public/images/argentina-map.jpg" "https://picsum.photos/1200/800"

echo Downloading gallery images...
curl -o "public/images/gallery-1.jpg" "https://picsum.photos/600/400"
curl -o "public/images/gallery-2.jpg" "https://picsum.photos/600/400"
curl -o "public/images/gallery-3.jpg" "https://picsum.photos/600/400"

echo All images downloaded!
pause
