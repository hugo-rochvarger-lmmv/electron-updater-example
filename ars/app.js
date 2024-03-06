const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.get('/download/*', (req, res) => {

  const redirectTo = req.query.redirectTo;;

  console.log(`Redirecting to: ${redirectTo}`);
  res.redirect(302, 'http://localhost:9000/release/electron-updater-example-1.0.1-arm64-mac.zip');
});

app.get('/release/*', (req, res) => {
  const jsonResult = {
    "version": "1.0.2",
    "files": [
      {
        "url": "http://localhost:3000/download/electron-updater-example-1.0.1-arm64-mac.zip",
        "sha512": "w0pK5gJP8ighWEDEbByCNWPBn8JcafHLLtUUTKtXQa5h4enlH8VqeXij8RRk77FKHeo89OJKyuFAT0OSqXw5RA==",
        "size": 94171676
      },
      {
        "url": "http://localhost:3000/download/electron-updater-example-1.0.1-arm64.dmg",
        "sha512": "Idr3IFdjjazliCAfPeJJ62Epc8brN88tRIZrZU5BdeC7Q90RmGSsnMeRoq5rUVLzL5gf7Jm3e3FtlHoK+6bBtg==",
        "size": 94381921
      }
    ],
    "path": "http://localhost:3000/download/electron-updater-example-1.0.1-arm64-mac.zip",
    "sha512": "w0pK5gJP8ighWEDEbByCNWPBn8JcafHLLtUUTKtXQa5h4enlH8VqeXij8RRk77FKHeo89OJKyuFAT0OSqXw5RA==",
    "releaseDate": "2024-03-06T03:36:48.NZ",
    "releaseNote": "hi this is a note",
    "required": true
  };

  res.json(jsonResult);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});