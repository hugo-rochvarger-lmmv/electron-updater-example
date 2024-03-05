const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.get('/download', (req, res) => {

  const redirectTo = req.query.redirectTo;;

  console.log(`Redirecting to: ${redirectTo}`);
  res.redirect(302, redirectTo);
});

app.get('/release/*', (req, res) => {
  const jsonResult = {
    version: "0.8.8",
    files: [
      {
        url: "http://localhost:9000/bucket/electron-updater-example-0.8.8-arm64-mac.zip",
        sha512: "woJ1Gd+baWir5aK+T/STqV99wpQ/IJLH0t4KDIqTiyk7D7TatXfr/hi0B+F7x8OHRRHux9/k7Atpr8hs/AzK7g==",
        size: 94251954
      }
    ],
    path: "http://localhost:9000/bucket/electron-updater-example-0.8.8-arm64-mac.zip",
    sha512: "woJ1Gd+baWir5aK+T/STqV99wpQ/IJLH0t4KDIqTiyk7D7TatXfr/hi0B+F7x8OHRRHux9/k7Atpr8hs/AzK7g==",
    releaseDate: "2024-03-04T02:12:07.472Z",
    releaseNote: "hi this is a note",
    required: true
  };

  res.json(jsonResult);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});