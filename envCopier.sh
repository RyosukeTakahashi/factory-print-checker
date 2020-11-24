#!/bin/bash
# shell script for adding environment variables from .env.local
while read row; do
  key=$(echo "${row}" | cut -d = -f 1)
  value=$(echo "${row}" | cut -d = -f 2)
  echo "${value}" | vc env add plain "${key}" production
done < .env.local