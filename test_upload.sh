#!/bin/bash

echo "Testing file upload with 50MB limit..."

# Create a test file of 1MB
dd if=/dev/zero of=test_1mb.csv bs=1M count=1 2>/dev/null
echo "id,name,value" >> test_1mb.csv
for i in {1..1000}; do echo "$i,test$i,$i" >> test_1mb.csv; done

echo "Uploading 1MB test file..."
curl -X POST -F "file=@test_1mb.csv" http://localhost:8000/api/data/upload

echo -e "\n\nCleaning up..."
rm -f test_1mb.csv

echo "Test completed. If you see a dataset_id response, the upload is working!"
