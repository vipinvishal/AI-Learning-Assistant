#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r backend/requirements.txt

npm install --prefix frontend
npm run build --prefix frontend
