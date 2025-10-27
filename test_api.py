import requests

url = "http://127.0.0.1:5000/detect-image"
files = {'file': open('street_image.jpg', 'rb')}
response = requests.post(url, files=files)

with open("output.jpg", "wb") as f:
    f.write(response.content)

print("Detection complete. Output saved as output.jpg")
