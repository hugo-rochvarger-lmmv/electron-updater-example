openssl dgst -sha512 -binary dist/electron-updater-example-0.8.8-arm64-mac.zip | base64



codesign --deep --force --verbose --sign - dist/electron-updater-example-0.8.8-arm64.dmg \
    && zip -r dist/electron-updater-example-0.8.8-arm64-mac.zip \
    dist/electron-updater-example-0.8.8-arm64.dmg
