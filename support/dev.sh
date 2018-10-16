#!/bin/bash
# extract build type and scope from the command line args
BUILD_TYPE=$1
SCOPE=$2
 # run the dev script for that build type in the scoped packages
lerna run --scope "$SCOPE" dev:$BUILD_TYPE --parallel