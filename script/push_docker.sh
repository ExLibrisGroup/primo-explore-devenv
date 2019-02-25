#!/bin/sh -ex

docker tag primo-explore-devenv quay.io/nyulibraries/primo-explore-devenv:latest
docker tag primo-explore-devenv quay.io/nyulibraries/primo-explore-devenv:${CIRCLE_BRANCH//\//_}
docker tag primo-explore-devenv quay.io/nyulibraries/primo-explore-devenv:${CIRCLE_BRANCH//\//_}-${CIRCLE_SHA1}

docker push quay.io/nyulibraries/primo-explore-devenv:latest
docker push quay.io/nyulibraries/primo-explore-devenv:${CIRCLE_BRANCH//\//_}
docker push quay.io/nyulibraries/primo-explore-devenv:${CIRCLE_BRANCH//\//_}-${CIRCLE_SHA1}

# Pushes using version number for master
[ $CIRCLE_BRANCH == master ] \
  && echo 'hello world' \
  && docker tag primo-explore-devenv quay.io/nyulibraries/primo-explore-devenv:$version \
  && docker push quay.io/nyulibraries/primo-explore-devenv:$version