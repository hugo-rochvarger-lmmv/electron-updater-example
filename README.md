# Quick Start

```sh
# start minIo (hosting release file locally)
docker compose up -d

# create release
yarn && yarn run publish

# Run the installer .dmg in /dist (macos)

# Increment version in package.json

# Create new release
yarn run publish

# Hackish sign and zip + upload mac version to minio bucket
./script/dev-mac.sh <versionNumber>

# Run release Server
cd releaseserver && yarn && yarn start

# Start the app "electron-updater-example'
# Expect Results: The autoUpdate will find the new version, download it and install. No errors
```