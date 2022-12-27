#!/bin/bash
VERSION=${1:-latest}

ROOT_DIR=$(dirname "$(dirname "$(readlink -f "$0")")")
EMSDK_DIR="$ROOT_DIR/emsdk"

CURRENT_DIR="$PWD"
if [ ! -d "$EMSDK_DIR" ]; then
    echo "*** Cloning emscripten-core/emsdk.git to $EMSDK_DIR"
    cd "$ROOT_DIR"
    git clone https://github.com/emscripten-core/emsdk.git
else
    echo "*** Updating emscripten-core/emsdk.git at $EMSDK_DIR"
    cd "$EMSDK_DIR"
    git pull
fi
cd "$CURRENT_DIR"

echo "*** Using emsdk version: $VERSION"

"$EMSDK_DIR/emsdk" install "$VERSION"
"$EMSDK_DIR/emsdk" activate "$VERSION"