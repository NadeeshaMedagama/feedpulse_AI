#!/usr/bin/env python3
import json
import sys
import urllib.error
import urllib.request

BASE_URL = "http://localhost:4000"
ADMIN_EMAIL = "admin@feedpulse.dev"
ADMIN_PASSWORD = "admin123"


def request(path, method="GET", body=None, token=None):
    headers = {}
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(f"{BASE_URL}{path}", method=method, data=data, headers=headers)
    with urllib.request.urlopen(req) as response:
        payload = json.loads(response.read().decode("utf-8"))
        return response.status, payload


def assert_success(step, status, payload, expected):
    if status != expected or not payload.get("success"):
        raise RuntimeError(f"{step} failed: status={status}, payload={payload}")
    print(f"[OK] {step}: {status}")


def main():
    try:
        status, payload = request("/health")
        assert_success("gateway health", status, payload, 200)

        status, payload = request(
            "/api/auth/login",
            method="POST",
            body={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert_success("admin login", status, payload, 200)
        token = payload["data"]["token"]

        status, payload = request(
            "/api/feedback",
            method="POST",
            body={
                "title": "Smoke test: CSV export request",
                "description": "Please add CSV export in analytics reports because manual extraction is slow and error-prone.",
                "category": "Feature Request",
                "submitterName": "Smoke Tester",
                "submitterEmail": "smoke@test.dev"
            }
        )
        assert_success("create feedback", status, payload, 201)
        feedback_id = payload["data"]["_id"]

        status, payload = request("/api/feedback?page=1&limit=10", token=token)
        assert_success("list feedback", status, payload, 200)

        status, payload = request("/api/feedback/summary", token=token)
        assert_success("weekly summary", status, payload, 200)

        status, payload = request(
            f"/api/feedback/{feedback_id}",
            method="PATCH",
            body={"status": "In Review"},
            token=token
        )
        assert_success("update status", status, payload, 200)

        status, payload = request(f"/api/feedback/{feedback_id}", method="DELETE", token=token)
        assert_success("delete feedback", status, payload, 200)

        print("\nSmoke test complete.")
    except (urllib.error.HTTPError, urllib.error.URLError, KeyError, RuntimeError) as error:
        print(f"Smoke test failed: {error}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

