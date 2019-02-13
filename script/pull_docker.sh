#!/bin/sh -ex

docker pull quay.io/nyulibraries/primo-explore-devenv:${CIRCLE_BRANCH//\//_} || docker pull quay.io/nyulibraries/primo-explore-devenv:latest