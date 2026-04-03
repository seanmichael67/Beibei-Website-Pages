#!/bin/bash

# WordPress credentials
WP_USER="luciano"
WP_PASS="ZjjW wlE4 tNJa 5sQr F6ym fLtV"
WP_API="https://www.beibeiamigos.com/wp-json/wp/v2"
AUTH=$(echo -n "${WP_USER}:${WP_PASS}" | base64)

SLUG=$1
TITLE=$2
CONTENT_FILE=$3

# Check if page exists
echo "Checking if page exists: $SLUG"
EXISTING=$(curl -s -X GET \
  "${WP_API}/pages?slug=${SLUG}" \
  -H "Authorization: Basic ${AUTH}" \
  -H "User-Agent: WordPress/6.0")

PAGE_ID=$(echo "$EXISTING" | jq -r '.[0].id // empty')

if [ -n "$PAGE_ID" ]; then
  echo "Page exists with ID: $PAGE_ID - Updating..."
  METHOD="PUT"
  URL="${WP_API}/pages/${PAGE_ID}"
else
  echo "Creating new page..."
  
  # Step 1: Create draft
  DRAFT_RESPONSE=$(curl -s -X POST \
    "${WP_API}/pages" \
    -H "Content-Type: application/json" \
    -H "Authorization: Basic ${AUTH}" \
    -H "User-Agent: WordPress/6.0" \
    -d "{
      \"title\": \"${TITLE}\",
      \"slug\": \"${SLUG}\",
      \"status\": \"draft\",
      \"author\": 9,
      \"parent\": 1714,
      \"content\": \"Loading...\"
    }")
  
  PAGE_ID=$(echo "$DRAFT_RESPONSE" | jq -r '.id // empty')
  
  if [ -z "$PAGE_ID" ]; then
    echo "Failed to create draft page"
    echo "$DRAFT_RESPONSE"
    exit 1
  fi
  
  echo "Draft created with ID: $PAGE_ID"
  METHOD="PUT"
  URL="${WP_API}/pages/${PAGE_ID}"
fi

# Read content from file
CONTENT=$(cat "$CONTENT_FILE")

# Step 2: Update with full content
echo "Publishing full content..."
RESPONSE=$(curl -s -X ${METHOD} \
  "${URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ${AUTH}" \
  -H "User-Agent: WordPress/6.0" \
  --data-binary @- <<EOF
{
  "content": ${CONTENT},
  "status": "publish",
  "author": 9,
  "parent": 1714
}
EOF
)

PUBLISHED_URL=$(echo "$RESPONSE" | jq -r '.link // empty')

if [ -n "$PUBLISHED_URL" ]; then
  echo "✓ Published: $PUBLISHED_URL (ID: $PAGE_ID)"
  echo "$PAGE_ID"
else
  echo "✗ Failed to publish"
  echo "$RESPONSE"
  exit 1
fi
