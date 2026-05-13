@echo off
echo Downloading images with PowerShell...

powershell -Command "Invoke-WebRequest -Uri 'https://images.unsplash.com/photo-1587952477769-754598c16c51?w=1920&h=1080&fit=crop' -OutFile 'public/images/hero-truck.jpg'"

powershell -Command "Invoke-WebRequest -Uri 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop' -OutFile 'public/images/cargo-truck.jpg'"

powershell -Command "Invoke-WebRequest -Uri 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop' -OutFile 'public/images/refrigerated-truck.jpg'"

powershell -Command "Invoke-WebRequest -Uri 'https://images.unsplash.com/photo-1566576912326-d5ddd3e605e5?w=800&h=600&fit=crop' -OutFile 'public/images/logistics-truck.jpg'"

powershell -Command "Invoke-WebRequest -Uri 'https://images.unsplash.com/photo-1603726847590-03c4878341e0?w=800&h=600&fit=crop' -OutFile 'public/images/express-truck.jpg'"

powershell -Command "Invoke-WebRequest -Uri 'https://picsum.photos/800/600' -OutFile 'public/images/team-photo.jpg'"

powershell -Command "Invoke-WebRequest -Uri 'https://picsum.photos/1200/800' -OutFile 'public/images/argentina-map.jpg'"

powershell -Command "Invoke-WebRequest -Uri 'https://picsum.photos/600/400' -OutFile 'public/images/gallery-1.jpg'"
powershell -Command "Invoke-WebRequest -Uri 'https://picsum.photos/600/401' -OutFile 'public/images/gallery-2.jpg'"
powershell -Command "Invoke-WebRequest -Uri 'https://picsum.photos/600/402' -OutFile 'public/images/gallery-3.jpg'"

echo All images downloaded successfully!
pause
