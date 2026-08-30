import assert from "node:assert/strict";
import test from "node:test";
import { isSecureShareLink } from "./share-report-validation";

test("accepts HTTPS share links", () => {
  assert.equal(isSecureShareLink("https://example.com/share-proof"), true);
});

test("rejects executable, embedded, and non-secure share-link schemes", () => {
  for (const unsafeLink of [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://example.com/share-proof",
    "file:///etc/passwd",
  ]) {
    assert.equal(isSecureShareLink(unsafeLink), false, unsafeLink);
  }
});