#!/bin/bash

# Whispa Backend Test Script
# This script tests the authentication endpoints

BASE_URL="http://localhost:4001/api"

echo "🧪 Testing Whispa Backend Auth System"
echo "======================================"
echo ""

# Test 1: Register a new user
echo "📝 Test 1: Register new user"
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123"
  }')

REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n1)
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$REGISTER_STATUS" = "201" ]; then
  echo "✅ Register successful (201)"
  echo "$REGISTER_BODY" | jq '.'
else
  echo "❌ Register failed ($REGISTER_STATUS)"
  echo "$REGISTER_BODY"
fi

echo ""
echo "---"
echo ""

# Test 2: Login with the registered user
echo "🔐 Test 2: Login with credentials"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "identifier": "test@example.com",
    "password": "SecurePass123"
  }')

LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$LOGIN_STATUS" = "200" ]; then
  echo "✅ Login successful (200)"
  echo "$LOGIN_BODY" | jq '.'
else
  echo "❌ Login failed ($LOGIN_STATUS)"
  echo "$LOGIN_BODY"
fi

echo ""
echo "---"
echo ""

# Test 3: Access protected route with JWT cookie
echo "🔒 Test 3: Access protected route (/auth/me)"
ME_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/me" \
  -b cookies.txt)

ME_STATUS=$(echo "$ME_RESPONSE" | tail -n1)
ME_BODY=$(echo "$ME_RESPONSE" | sed '$d')

if [ "$ME_STATUS" = "200" ]; then
  echo "✅ Protected route access successful (200)"
  echo "$ME_BODY" | jq '.'
else
  echo "❌ Protected route access failed ($ME_STATUS)"
  echo "$ME_BODY"
fi

echo ""
echo "---"
echo ""

# Test 4: Test duplicate email (should fail with 409)
echo "🚫 Test 4: Duplicate email (should fail)"
DUPLICATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Another",
    "lastName": "User",
    "username": "anotheruser",
    "email": "test@example.com",
    "password": "AnotherPass123"
  }')

DUPLICATE_STATUS=$(echo "$DUPLICATE_RESPONSE" | tail -n1)
DUPLICATE_BODY=$(echo "$DUPLICATE_RESPONSE" | sed '$d')

if [ "$DUPLICATE_STATUS" = "409" ]; then
  echo "✅ Duplicate email rejected (409 Conflict)"
  echo "$DUPLICATE_BODY" | jq '.'
else
  echo "❌ Unexpected status ($DUPLICATE_STATUS)"
  echo "$DUPLICATE_BODY"
fi

echo ""
echo "---"
echo ""

# Test 5: Test invalid login
echo "🔓 Test 5: Invalid login credentials"
INVALID_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "WrongPassword"
  }')

INVALID_STATUS=$(echo "$INVALID_RESPONSE" | tail -n1)
INVALID_BODY=$(echo "$INVALID_RESPONSE" | sed '$d')

if [ "$INVALID_STATUS" = "401" ]; then
  echo "✅ Invalid credentials rejected (401 Unauthorized)"
  echo "$INVALID_BODY" | jq '.'
else
  echo "❌ Unexpected status ($INVALID_STATUS)"
  echo "$INVALID_BODY"
fi

echo ""
echo "---"
echo ""

# Cleanup
rm -f cookies.txt

echo "✨ All tests completed!"
echo ""
echo "Summary:"
echo "  - Register new user: $REGISTER_STATUS"
echo "  - Login: $LOGIN_STATUS"
echo "  - Protected route: $ME_STATUS"
echo "  - Duplicate email: $DUPLICATE_STATUS"
echo "  - Invalid login: $INVALID_STATUS"
