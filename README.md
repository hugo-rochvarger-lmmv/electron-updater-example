# Quick Start

```sh
# start minIo (hosting release file locally)
docker compose up -d

# create release (we are not notarizing)
npm && npm run build

# Run the installer .dmg in /dist (macos)

# Increment version in package.json

# Create new release
npm run build

# Hackish sign and zip + upload mac version to minio bucket - if first time you might need to install tools like jq and mc
brew install jq
brew install minio/stable/mc
./script/dev-mac.sh <versionNumber>

# Copy/paste the Generated JSON into releaseserver/main.js

# Run release Server and play around - if first time you need to install packages first
yarn --cwd ars start

# Start the app "electron-updater-example'
# Expect Results: The autoUpdate will find the new version, download it and install. No errors
```