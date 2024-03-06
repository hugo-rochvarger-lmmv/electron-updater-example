#!/bin/bash

# Requires jq and mc
# jq: brew install jq
# mc: brew install minio/stable/mc

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

env_file=".env"

# Check if the .env file exists
if [ -f "$env_file" ]; then
    # Source the .env file to load environment variables
    source "$env_file"
    echo "Loaded environment variables from $env_file"
else
    echo "Error: The .env file ($env_file) not found."
    exit 1
fi

version="$1"
filename="electron-updater-example"
dmg_file="dist/${filename}-${version}-arm64.dmg"
signed_zip_file="dist/${filename}-${version}-arm64-mac.zip"
minio_endpoint="http://localhost:$MINIO_PORT"
minio_bucket_name="$MINIO_BUCKET"

release_date=$(date -u +"%Y-%m-%dT%H:%M:%S.%NZ")
release_note="hi this is a note"

codesign -vvv --deep --strict "${dmg_file}"
# Sign the DMG file
codesign --deep --force --verbose --sign - "${dmg_file}"


# Check if codesign was successful
if [ $? -eq 0 ]; then
    # Zip the signed DMG file
    zip -r "${signed_zip_file}" "${dmg_file}"
    echo "Signing and zipping completed successfully."

    # Display SHA512 hash of the ZIP file
    zip_sha512_hash=$(openssl dgst -sha512 -binary ${signed_zip_file} | base64)
    dmg_sha512_hash=$(openssl dgst -sha512 -binary ${dmg_file} | base64)
    echo "ZIP SHA512: ${zip_sha512_hash}"
    echo "DMG SHA512: ${dmg_sha512_hash}"

    # Display file size of the ZIP file
    zip_file_size=$(stat -f%z "${signed_zip_file}")
    dmg_file_size=$(stat -f%z "${dmg_file}")
    echo "zip size: ${zip_file_size} bytes"
    echo "dmg size: ${dmg_file_size} bytes"

    # Upload the ZIP file to MinIO (replace with your MinIO details)
    mc config host add minio ${minio_endpoint}
    mc cp "${signed_zip_file}" minio/${minio_bucket_name}/
    mc cp "${dmg_file}" minio/${minio_bucket_name}/

    zip_minio_url="${minio_endpoint}/${minio_bucket_name}/${signed_zip_file#dist/}"
    dmg_minio_url="${minio_endpoint}/${minio_bucket_name}/${dmg_file#dist/}"
    echo "zip url(MinIO): ${minio_url}"
    echo "dmg url(MinIO): ${dmg_minio_url}"

    # JSON Output
    json_output=$(cat <<EOF
{
    "version": "${version}",
    "files": [
        {
            "url": "${zip_minio_url}",
            "sha512": "${zip_sha512_hash}",
            "size": ${zip_file_size}
        },
        {
            "url": "${dmg_minio_url}",
            "sha512": "${dmg_sha512_hash}",
            "size": ${dmg_file_size}
        }
    ],
    "path": "${zip_minio_url}",
    "sha512": "${zip_sha512_hash}",
    "releaseDate": "${release_date}",
    "releaseNote": "${release_note}",
    "required": true
}
EOF
)
    echo "Generated JSON:"
    echo "${json_output}" | jq '.'
else
    echo "Error: Codesigning failed."
    exit 1
fi