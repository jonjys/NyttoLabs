#!/usr/bin/env python3
"""
Nytto Relay Backend API Test Suite
Tests all backend endpoints according to the test plan in test_result.md
"""

import requests
import json
import hmac
import hashlib
import os
import time
from urllib.parse import urlparse

# Configuration — pass secrets via env; do not hardcode credentials.
BASE_URL = os.environ.get("RELAY_BASE_URL", "http://localhost:3000")
API_BASE = f"{BASE_URL}/api"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")
ADMIN_PASSCODE = os.environ.get("ADMIN_PASSCODE", "")
WEBHOOK_SECRET = os.environ.get("RELAY_WEBHOOK_SECRET", "")

# Session storage
session_cookie = None

def print_test(name):
    print(f"\n{'='*80}")
    print(f"TEST: {name}")
    print('='*80)

def print_pass(msg):
    print(f"✅ PASS: {msg}")

def print_fail(msg):
    print(f"❌ FAIL: {msg}")

def print_info(msg):
    print(f"ℹ️  INFO: {msg}")

def compute_hmac_signature(body_str):
    """Compute HMAC-SHA256 signature for webhook"""
    return hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        body_str.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

def check_forbidden_strings(text, context=""):
    """Check for forbidden portfolio strings"""
    forbidden = ["netfold", "skrivklart", "invoic"]
    text_lower = text.lower()
    found = []
    for word in forbidden:
        if word in text_lower:
            found.append(word)
    if found:
        print_fail(f"{context} contains forbidden strings: {', '.join(found)}")
        return False
    return True

# =============================================================================
# TEST 1: RESOLVER /api/resolve
# =============================================================================

def test_resolver():
    print_test("1. RESOLVER POST /api/resolve")
    
    # 1a) Basic resolve with category match
    print("\n--- 1a) Basic resolve: cycletag/reorder/SE/water-filter ---")
    try:
        payload = {
            "app": "cycletag",
            "action": "reorder",
            "country": "SE",
            "language": "sv",
            "category": "water-filter",
            "query": "Brita Maxtra Pro",
            "brand": "Brita",
            "model": "Maxtra Pro"
        }
        resp = requests.post(f"{API_BASE}/resolve", json=payload, timeout=10)
        print_info(f"Status: {resp.status_code}")
        
        if resp.status_code != 200:
            print_fail(f"Expected 200, got {resp.status_code}")
            print_info(f"Response: {resp.text}")
            return None
        
        data = resp.json()
        print_info(f"Response keys: {list(data.keys())}")
        
        # Check required fields
        assert data.get("fallback") == False, "Expected fallback=false"
        assert data.get("partner_name"), "Missing partner_name"
        assert "aquapure" in data.get("partner_name", "").lower(), f"Expected AquaPure partner, got {data.get('partner_name')}"
        
        dest_url = data.get("destination_url", "")
        assert dest_url.startswith("https://"), "destination_url must be https"
        parsed = urlparse(dest_url)
        assert "aquapure-demo.example" in parsed.netloc, f"Expected aquapure-demo.example host, got {parsed.netloc}"
        assert "subid=" in dest_url, "destination_url must contain subid parameter"
        assert "aff=nytto" in dest_url, "destination_url must contain aff=nytto"
        
        assert data.get("reason"), "Missing reason"
        assert data.get("click_id"), "Missing click_id"
        
        redirect_url = data.get("redirect_url", "")
        assert redirect_url.endswith(f"/go/{data['click_id']}"), "redirect_url must end with /go/{click_id}"
        
        print_pass("Basic resolve works correctly")
        print_info(f"Partner: {data.get('partner_name')}")
        print_info(f"Reason: {data.get('reason')}")
        print_info(f"Click ID: {data.get('click_id')}")
        
        # Check for forbidden strings
        check_forbidden_strings(json.dumps(data), "Resolve response")
        
        return data  # Return for use in later tests
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
        return None
    except Exception as e:
        print_fail(f"Exception: {e}")
        return None
    
    # 1b) Relevance beats commission
    print("\n--- 1b) Relevance beats commission: category match preferred ---")
    try:
        payload = {
            "app": "cycletag",
            "action": "reorder",
            "country": "SE",
            "category": "water-filter",
            "query": "water filter"
        }
        resp = requests.post(f"{API_BASE}/resolve", json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            reason = data.get("reason", "").lower()
            
            # AquaPure should be chosen because of category match
            if "aquapure" in data.get("partner_name", "").lower():
                if "category" in reason or "water-filter" in reason:
                    print_pass("Relevance (category match) beats commission")
                    print_info(f"Reason mentions category: {data.get('reason')}")
                else:
                    print_info(f"AquaPure selected but reason unclear: {data.get('reason')}")
            else:
                print_fail(f"Expected AquaPure for category match, got {data.get('partner_name')}")
        else:
            print_fail(f"Request failed with status {resp.status_code}")
            
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 1c) No-match fallback
    print("\n--- 1c) No-match fallback: unsupported country/category ---")
    try:
        payload = {
            "app": "cycletag",
            "action": "reorder",
            "country": "JP",
            "category": "unicorn-food",
            "query": "xyz"
        }
        resp = requests.post(f"{API_BASE}/resolve", json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            assert data.get("fallback") == True, "Expected fallback=true"
            assert data.get("partner_name") is None, "Expected partner_name=null for fallback"
            
            dest_url = data.get("destination_url", "")
            # Should be a neutral search URL
            assert "google.com" in dest_url or "search" in dest_url, "Expected neutral search URL"
            
            print_pass("No-match fallback works correctly")
            print_info(f"Fallback URL: {dest_url}")
        else:
            print_fail(f"Request failed with status {resp.status_code}")
            
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 1d) PII stripping
    print("\n--- 1d) PII stripping: email and phone in query ---")
    try:
        payload = {
            "app": "cycletag",
            "action": "reorder",
            "country": "SE",
            "category": "water-filter",
            "query": "buy filter john@example.com 0701234567"
        }
        resp = requests.post(f"{API_BASE}/resolve", json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            pii_stripped = data.get("pii_stripped", [])
            
            assert "query" in pii_stripped, "Expected 'query' in pii_stripped"
            
            dest_url = data.get("destination_url", "")
            assert "john@example.com" not in dest_url, "Email should not appear in destination_url"
            assert "0701234567" not in dest_url, "Phone should not appear in destination_url"
            
            print_pass("PII stripping works correctly")
            print_info(f"PII stripped fields: {pii_stripped}")
        else:
            print_fail(f"Request failed with status {resp.status_code}")
            
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 1e) Validation error
    print("\n--- 1e) Validation: missing required fields ---")
    try:
        payload = {
            "country": "SE"
            # Missing app and action
        }
        resp = requests.post(f"{API_BASE}/resolve", json=payload, timeout=10)
        
        assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
        data = resp.json()
        assert data.get("error") == "validation", f"Expected error='validation', got {data.get('error')}"
        
        print_pass("Validation error handling works correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")

# =============================================================================
# TEST 2: SAFE REDIRECT /go/{click_id}
# =============================================================================

def test_safe_redirect(click_id):
    print_test("2. SAFE REDIRECT GET /go/{click_id}")
    
    if not click_id:
        print_fail("No click_id provided from resolver test")
        return
    
    # 2a) Valid click_id redirect
    print("\n--- 2a) Valid click_id redirect ---")
    try:
        redirect_url = f"{BASE_URL}/go/{click_id}"
        print_info(f"Testing: {redirect_url}")
        
        # Don't follow redirects to check the 302
        resp = requests.get(redirect_url, allow_redirects=False, timeout=10)
        print_info(f"Status: {resp.status_code}")
        
        assert resp.status_code == 302, f"Expected 302, got {resp.status_code}"
        
        location = resp.headers.get("Location", "")
        assert location, "Missing Location header"
        assert "aquapure-demo.example" in location, f"Expected redirect to aquapure-demo.example, got {location}"
        
        print_pass("Safe redirect works correctly")
        print_info(f"Redirects to: {location}")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 2b) Check clicked_at is set (via admin API after auth)
    print("\n--- 2b) Verify clicked_at is set (will check after auth) ---")
    print_info("Will verify via /api/admin/clicks after authentication")
    
    # 2c) Unknown click_id
    print("\n--- 2c) Unknown click_id redirect ---")
    try:
        resp = requests.get(f"{BASE_URL}/go/nonexistent-click-id", allow_redirects=False, timeout=10)
        
        assert resp.status_code == 302, f"Expected 302, got {resp.status_code}"
        location = resp.headers.get("Location", "")
        assert "relay=expired" in location, f"Expected redirect to /?relay=expired, got {location}"
        
        print_pass("Unknown click_id handled correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 2d) Verify no open redirect vulnerability
    print("\n--- 2d) Verify no open redirect vulnerability ---")
    print_info("The /go endpoint only accepts click_id, not arbitrary URLs")
    print_info("Attempting to pass URL as click_id should fail")
    try:
        resp = requests.get(f"{BASE_URL}/go/https://evil.com", allow_redirects=False, timeout=10)
        location = resp.headers.get("Location", "")
        
        # Should redirect to error/expired, not to evil.com
        assert "evil.com" not in location, "SECURITY ISSUE: Open redirect vulnerability!"
        print_pass("No open redirect vulnerability")
        
    except AssertionError as e:
        print_fail(f"SECURITY ISSUE: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")

# =============================================================================
# TEST 3: CONVERSION WEBHOOK /api/event
# =============================================================================

def test_conversion_webhook(click_id):
    print_test("3. CONVERSION WEBHOOK POST /api/event")
    
    if not click_id:
        print_fail("No click_id provided from resolver test")
        return
    
    # 3a) Invalid signature
    print("\n--- 3a) Invalid/missing signature ---")
    try:
        payload = {
            "click_id": click_id,
            "event_id": "evt-test-invalid",
            "amount": 199,
            "currency": "SEK",
            "status": "approved"
        }
        body_str = json.dumps(payload)
        
        # No signature
        resp = requests.post(f"{API_BASE}/event", data=body_str, headers={"Content-Type": "application/json"}, timeout=10)
        assert resp.status_code == 401, f"Expected 401 for missing signature, got {resp.status_code}"
        data = resp.json()
        assert data.get("error") == "invalid_signature", f"Expected error='invalid_signature', got {data.get('error')}"
        
        print_pass("Missing signature rejected correctly")
        
        # Wrong signature
        resp = requests.post(
            f"{API_BASE}/event",
            data=body_str,
            headers={"Content-Type": "application/json", "X-Relay-Signature": "wrong_signature"},
            timeout=10
        )
        assert resp.status_code == 401, f"Expected 401 for wrong signature, got {resp.status_code}"
        
        print_pass("Invalid signature rejected correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 3b) Valid signature
    print("\n--- 3b) Valid signature with conversion data ---")
    try:
        payload = {
            "click_id": click_id,
            "event_id": "evt-test-1",
            "amount": 199,
            "currency": "SEK",
            "status": "approved"
        }
        body_str = json.dumps(payload)
        signature = compute_hmac_signature(body_str)
        
        resp = requests.post(
            f"{API_BASE}/event",
            data=body_str,
            headers={"Content-Type": "application/json", "X-Relay-Signature": signature},
            timeout=10
        )
        
        print_info(f"Status: {resp.status_code}")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert data.get("ok") == True, "Expected ok=true"
        assert data.get("id"), "Missing conversion id"
        
        print_pass("Valid webhook accepted")
        print_info(f"Conversion ID: {data.get('id')}")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 3c) Duplicate event_id
    print("\n--- 3c) Duplicate event_id (idempotency) ---")
    try:
        # Send same event_id again
        payload = {
            "click_id": click_id,
            "event_id": "evt-test-1",  # Same as above
            "amount": 199,
            "currency": "SEK",
            "status": "approved"
        }
        body_str = json.dumps(payload)
        signature = compute_hmac_signature(body_str)
        
        resp = requests.post(
            f"{API_BASE}/event",
            data=body_str,
            headers={"Content-Type": "application/json", "X-Relay-Signature": signature},
            timeout=10
        )
        
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        assert data.get("duplicate") == True, "Expected duplicate=true"
        
        print_pass("Duplicate event_id handled correctly (idempotency)")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 3d) Verify amount stored as minor units
    print("\n--- 3d) Amount stored as minor units (will verify via admin API) ---")
    print_info("Will verify that 199 SEK is stored as 19900 minor units after authentication")

# =============================================================================
# TEST 4: AUTH & PROTECTION
# =============================================================================

def test_auth():
    print_test("4. AUTH & PROTECTION")
    global session_cookie
    
    # 4a) Unauthenticated access to admin endpoint
    print("\n--- 4a) Unauthenticated access to /api/admin/overview ---")
    try:
        resp = requests.get(f"{API_BASE}/admin/overview", timeout=10)
        assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"
        data = resp.json()
        assert data.get("error") == "unauthorized", f"Expected error='unauthorized', got {data.get('error')}"
        
        print_pass("Unauthenticated access blocked correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 4b) Wrong passcode
    print("\n--- 4b) Login with wrong passcode ---")
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "passcode": "wrong_passcode"
        }
        resp = requests.post(f"{API_BASE}/auth/login", json=payload, timeout=10)
        assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"
        
        print_pass("Wrong passcode rejected correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 4c) Correct credentials
    print("\n--- 4c) Login with correct credentials ---")
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "passcode": ADMIN_PASSCODE
        }
        resp = requests.post(f"{API_BASE}/auth/login", json=payload, timeout=10)
        
        print_info(f"Status: {resp.status_code}")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert data.get("ok") == True, "Expected ok=true"
        assert data.get("email") == ADMIN_EMAIL, f"Expected email={ADMIN_EMAIL}"
        
        # Extract session cookie
        cookies = resp.cookies
        session_cookie = cookies.get("nytto_session")
        assert session_cookie, "Missing nytto_session cookie"
        
        print_pass("Login successful")
        print_info(f"Session cookie obtained: {session_cookie[:20]}...")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
        return False
    except Exception as e:
        print_fail(f"Exception: {e}")
        return False
    
    # 4d) Check session with /api/auth/me
    print("\n--- 4d) Check session with /api/auth/me ---")
    try:
        resp = requests.get(f"{API_BASE}/auth/me", cookies={"nytto_session": session_cookie}, timeout=10)
        
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        assert data.get("authenticated") == True, "Expected authenticated=true"
        assert data.get("email") == ADMIN_EMAIL, f"Expected email={ADMIN_EMAIL}"
        
        print_pass("Session verification works correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    return True

# =============================================================================
# TEST 5: ADMIN CRUD + END-TO-END REVENUE
# =============================================================================

def test_admin_crud(click_id):
    print_test("5. ADMIN CRUD + END-TO-END REVENUE")
    
    if not session_cookie:
        print_fail("No session cookie available")
        return
    
    cookies = {"nytto_session": session_cookie}
    
    # 5a) Verify clicked_at is set for our click
    print("\n--- 5a) Verify clicked_at is set for test click ---")
    try:
        resp = requests.get(f"{API_BASE}/admin/clicks", cookies=cookies, timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        clicks = data.get("items", [])
        test_click = next((c for c in clicks if c.get("id") == click_id), None)
        
        if test_click:
            assert test_click.get("clicked_at"), "clicked_at should be set after /go redirect"
            print_pass("clicked_at is set correctly")
            print_info(f"Clicked at: {test_click.get('clicked_at')}")
        else:
            print_fail(f"Could not find click with id {click_id}")
            
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 5b) Create partner
    print("\n--- 5b) Create partner ---")
    partner_id = None
    try:
        payload = {
            "name": "Test Partner",
            "slug": f"test-partner-{int(time.time())}",
            "approvedDomains": ["mypartner-demo.example"],
            "affiliateNetwork": "direct",
            "reliabilityScore": 85,
            "active": True
        }
        resp = requests.post(f"{API_BASE}/admin/partners", json=payload, cookies=cookies, timeout=10)
        
        print_info(f"Status: {resp.status_code}")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        partner = data.get("item")
        assert partner, "Missing partner in response"
        partner_id = partner.get("id")
        assert partner_id, "Missing partner id"
        
        print_pass("Partner created successfully")
        print_info(f"Partner ID: {partner_id}")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 5c) Create offer
    print("\n--- 5c) Create offer ---")
    offer_id = None
    if partner_id:
        try:
            payload = {
                "name": "Test Offer",
                "partnerSlug": f"test-partner-{int(time.time())}",
                "supportedApplications": ["viesproof"],
                "supportedActions": ["verify"],
                "destinationTemplate": "https://mypartner-demo.example/x?q={query}",
                "markets": ["SE"],
                "categories": [],
                "commissionType": "percentage",
                "commissionAmount": 10,
                "currency": "SEK",
                "active": True
            }
            resp = requests.post(f"{API_BASE}/admin/offers", json=payload, cookies=cookies, timeout=10)
            
            print_info(f"Status: {resp.status_code}")
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            
            data = resp.json()
            offer = data.get("item")
            assert offer, "Missing offer in response"
            offer_id = offer.get("id")
            assert offer_id, "Missing offer id"
            
            print_pass("Offer created successfully")
            print_info(f"Offer ID: {offer_id}")
            
        except AssertionError as e:
            print_fail(f"Assertion failed: {e}")
        except Exception as e:
            print_fail(f"Exception: {e}")
    
    # 5d) Toggle offer active
    print("\n--- 5d) Toggle offer active status ---")
    if offer_id:
        try:
            payload = {"active": False}
            resp = requests.put(f"{API_BASE}/admin/offers/{offer_id}", json=payload, cookies=cookies, timeout=10)
            
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            data = resp.json()
            assert data.get("item", {}).get("active") == False, "Offer should be inactive"
            
            print_pass("Offer toggled to inactive")
            
            # Toggle back
            payload = {"active": True}
            resp = requests.put(f"{API_BASE}/admin/offers/{offer_id}", json=payload, cookies=cookies, timeout=10)
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            
            print_pass("Offer toggled back to active")
            
        except AssertionError as e:
            print_fail(f"Assertion failed: {e}")
        except Exception as e:
            print_fail(f"Exception: {e}")
    
    # 5e) Delete offer and partner
    print("\n--- 5e) Delete offer and partner ---")
    if offer_id:
        try:
            resp = requests.delete(f"{API_BASE}/admin/offers/{offer_id}", cookies=cookies, timeout=10)
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            print_pass("Offer deleted successfully")
        except Exception as e:
            print_fail(f"Exception deleting offer: {e}")
    
    if partner_id:
        try:
            resp = requests.delete(f"{API_BASE}/admin/partners/{partner_id}", cookies=cookies, timeout=10)
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            print_pass("Partner deleted successfully")
        except Exception as e:
            print_fail(f"Exception deleting partner: {e}")
    
    # 5f) Manual conversion entry
    print("\n--- 5f) Manual conversion entry ---")
    if click_id:
        try:
            payload = {
                "click_id": click_id,
                "amount": 199,
                "currency": "SEK",
                "status": "approved"
            }
            resp = requests.post(f"{API_BASE}/admin/conversions", json=payload, cookies=cookies, timeout=10)
            
            print_info(f"Status: {resp.status_code}")
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            
            data = resp.json()
            conversion = data.get("item")
            assert conversion, "Missing conversion in response"
            
            # Verify amount stored as minor units (19900)
            amount_minor = conversion.get("amountMinor")
            assert amount_minor == 19900, f"Expected amountMinor=19900, got {amount_minor}"
            
            print_pass("Manual conversion created successfully")
            print_info(f"Amount stored as minor units: {amount_minor}")
            
        except AssertionError as e:
            print_fail(f"Assertion failed: {e}")
        except Exception as e:
            print_fail(f"Exception: {e}")
    
    # 5g) Check revenue
    print("\n--- 5g) Check revenue in /api/admin/revenue ---")
    try:
        resp = requests.get(f"{API_BASE}/admin/revenue", cookies=cookies, timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        totals = data.get("totalsByCurrency", [])
        
        sek_total = next((t for t in totals if t.get("currency") == "SEK"), None)
        if sek_total:
            # Should include our 199 SEK conversion (19900 minor units)
            assert sek_total.get("amountMinor") >= 19900, f"Expected at least 19900 minor units, got {sek_total.get('amountMinor')}"
            print_pass("Revenue tracking works correctly")
            print_info(f"SEK revenue: {sek_total.get('amountMinor')} minor units")
        else:
            print_fail("No SEK revenue found")
            
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 5h) Check overview
    print("\n--- 5h) Check /api/admin/overview ---")
    try:
        resp = requests.get(f"{API_BASE}/admin/overview", cookies=cookies, timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "resolvedActions" in data, "Missing resolvedActions"
        assert "outboundClicks" in data, "Missing outboundClicks"
        assert "conversions" in data, "Missing conversions"
        assert "conversionRate" in data, "Missing conversionRate"
        assert "revenueByCurrency" in data, "Missing revenueByCurrency"
        
        revenue = data.get("revenueByCurrency", [])
        sek_revenue = next((r for r in revenue if r.get("currency") == "SEK"), None)
        if sek_revenue:
            assert sek_revenue.get("amountMinor") >= 19900, "Revenue should include our test conversion"
            print_pass("Overview endpoint works correctly")
            print_info(f"Total conversions: {data.get('conversions')}")
            print_info(f"Conversion rate: {data.get('conversionRate')}")
        else:
            print_fail("No SEK revenue in overview")
            
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 5i) CSV export
    print("\n--- 5i) CSV export ---")
    try:
        resp = requests.get(f"{API_BASE}/admin/export?type=conversions", cookies=cookies, timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        content_type = resp.headers.get("Content-Type", "")
        assert "text/csv" in content_type, f"Expected text/csv, got {content_type}"
        
        csv_data = resp.text
        lines = csv_data.strip().split("\n")
        assert len(lines) >= 2, "CSV should have header + at least one row"
        
        header = lines[0]
        assert "click_id" in header, "CSV header should contain click_id"
        
        print_pass("CSV export works correctly")
        print_info(f"CSV has {len(lines)} lines (including header)")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 5j) Simulator
    print("\n--- 5j) Simulator ---")
    try:
        payload = {
            "app": "cycletag",
            "action": "reorder",
            "country": "SE",
            "category": "water-filter",
            "query": "Brita"
        }
        resp = requests.post(f"{API_BASE}/admin/simulate", json=payload, cookies=cookies, timeout=10)
        
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        # Should return similar structure to /resolve
        assert "click_id" in data, "Simulator should return click_id"
        assert "destination_url" in data, "Simulator should return destination_url"
        assert "reason" in data, "Simulator should return reason"
        
        print_pass("Simulator works correctly")
        print_info(f"Simulated partner: {data.get('partner_name')}")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")

# =============================================================================
# TEST 6: PUBLIC ENDPOINTS + SCOPE
# =============================================================================

def test_public_endpoints():
    print_test("6. PUBLIC ENDPOINTS + SCOPE")
    
    # 6a) GET /api/public/products
    print("\n--- 6a) GET /api/public/products ---")
    try:
        resp = requests.get(f"{API_BASE}/public/products", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        products = data.get("products", [])
        assert len(products) > 0, "Should have at least one product"
        
        # Check for expected products
        slugs = [p.get("slug") for p in products]
        assert "cycletag" in slugs, "Should include cycletag"
        assert "viesproof" in slugs, "Should include viesproof"
        assert "gatezero" in slugs, "Should include gatezero"
        
        # Should NOT include internal products
        assert "ai-venture-worker" not in slugs, "Should NOT include ai-venture-worker"
        assert "nytto-relay" not in slugs, "Should NOT include nytto-relay"
        
        # Check that sensitive fields are not exposed
        for product in products:
            assert "commission" not in str(product).lower(), "Should not expose commission"
            assert "revenue" not in str(product).lower(), "Should not expose revenue"
            assert "notes" not in product, "Should not expose notes"
        
        print_pass("Public products endpoint works correctly")
        print_info(f"Products: {', '.join(slugs)}")
        
        # Check for forbidden strings
        check_forbidden_strings(json.dumps(data), "Public products")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 6b) Check for forbidden portfolio strings in all responses
    print("\n--- 6b) CRITICAL SCOPE: Check for forbidden strings ---")
    try:
        # Check products
        resp = requests.get(f"{API_BASE}/public/products", timeout=10)
        if resp.status_code == 200:
            if check_forbidden_strings(resp.text, "Public products"):
                print_pass("No forbidden strings in public products")
        
        # Check settings
        resp = requests.get(f"{API_BASE}/public/settings", timeout=10)
        if resp.status_code == 200:
            if check_forbidden_strings(resp.text, "Public settings"):
                print_pass("No forbidden strings in public settings")
        
        # Check with authenticated endpoints if we have session
        if session_cookie:
            cookies = {"nytto_session": session_cookie}
            
            resp = requests.get(f"{API_BASE}/admin/offers", cookies=cookies, timeout=10)
            if resp.status_code == 200:
                check_forbidden_strings(resp.text, "Admin offers")
            
            resp = requests.get(f"{API_BASE}/admin/partners", cookies=cookies, timeout=10)
            if resp.status_code == 200:
                check_forbidden_strings(resp.text, "Admin partners")
            
            resp = requests.get(f"{API_BASE}/admin/applications", cookies=cookies, timeout=10)
            if resp.status_code == 200:
                check_forbidden_strings(resp.text, "Admin applications")
        
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 6c) POST /api/partner-inquiries
    print("\n--- 6c) POST /api/partner-inquiries ---")
    try:
        # Valid inquiry with consent
        payload = {
            "company": "Test Company AB",
            "contactName": "John Doe",
            "workEmail": "john@testcompany.se",
            "website": "https://testcompany.se",
            "message": "We are interested in partnering",
            "consent": True
        }
        resp = requests.post(f"{API_BASE}/partner-inquiries", json=payload, timeout=10)
        
        print_info(f"Status: {resp.status_code}")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert data.get("ok") == True, "Expected ok=true"
        assert data.get("emailed") == False, "Expected emailed=false (no email configured)"
        
        print_pass("Partner inquiry with consent works correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")
    
    # 6d) Partner inquiry without consent
    print("\n--- 6d) Partner inquiry without consent ---")
    try:
        payload = {
            "company": "Test Company AB",
            "contactName": "John Doe",
            "workEmail": "john@testcompany.se",
            "website": "https://testcompany.se",
            "message": "We are interested in partnering",
            "consent": False
        }
        resp = requests.post(f"{API_BASE}/partner-inquiries", json=payload, timeout=10)
        
        assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
        data = resp.json()
        assert data.get("error") == "validation", "Expected validation error"
        
        print_pass("Partner inquiry without consent rejected correctly")
        
    except AssertionError as e:
        print_fail(f"Assertion failed: {e}")
    except Exception as e:
        print_fail(f"Exception: {e}")

# =============================================================================
# MAIN TEST RUNNER
# =============================================================================

def main():
    print("\n" + "="*80)
    print("NYTTO RELAY BACKEND TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    print("="*80)
    
    # Test 1: Resolver
    resolve_result = test_resolver()
    click_id = resolve_result.get("click_id") if resolve_result else None
    
    # Test 2: Safe redirect
    if click_id:
        test_safe_redirect(click_id)
    
    # Test 3: Conversion webhook
    if click_id:
        test_conversion_webhook(click_id)
    
    # Test 4: Auth
    auth_success = test_auth()
    
    # Test 5: Admin CRUD (requires auth)
    if auth_success and click_id:
        test_admin_crud(click_id)
    
    # Test 6: Public endpoints
    test_public_endpoints()
    
    print("\n" + "="*80)
    print("TEST SUITE COMPLETE")
    print("="*80)

if __name__ == "__main__":
    main()
