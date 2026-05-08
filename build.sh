#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Building PowerLens..."

swiftc -o PowerLens \
  -sdk "$(xcrun --show-sdk-path)" \
  -framework SwiftUI \
  -framework AppKit \
  -framework IOKit \
  -framework Combine \
  Sources/PowerLens/*.swift

# Copy into app bundle
cp PowerLens PowerLens.app/Contents/MacOS/PowerLens

echo "Done: PowerLens.app"
echo "Run: open PowerLens.app"
