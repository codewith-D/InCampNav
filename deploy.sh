#!/usr/bin/env sh

# abort on errors
set -e


npm run build


cd dist


echo > .nojekyll


git init
git checkout -B main
git add -A
git commit -m 'deploy'


cd -