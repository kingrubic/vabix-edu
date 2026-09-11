import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CACHE_BUST_VERSION,
  hasFreshCacheCookie,
  isCacheBustDocumentRequest,
  needsCacheBustRedirect,
} from "./cacheBust";

test("stale visitors need a one-time cache-bust redirect", () => {
  assert.equal(needsCacheBustRedirect({ cookieValue: undefined, paramValue: null }), true);
  assert.equal(needsCacheBustRedirect({ cookieValue: "old", paramValue: null }), true);
  assert.equal(
    needsCacheBustRedirect({ cookieValue: undefined, paramValue: CACHE_BUST_VERSION }),
    false,
  );
  assert.equal(
    needsCacheBustRedirect({ cookieValue: CACHE_BUST_VERSION, paramValue: null }),
    false,
  );
});

test("cache-bust redirect is only for real browser document loads", () => {
  assert.equal(
    isCacheBustDocumentRequest({
      method: "GET",
      dest: "document",
      prefetch: false,
      rsc: false,
      userAgent: "Mozilla/5.0",
    }),
    true,
  );
  assert.equal(
    isCacheBustDocumentRequest({
      method: "GET",
      dest: "empty",
      prefetch: false,
      rsc: true,
      userAgent: "Mozilla/5.0",
    }),
    false,
  );
  assert.equal(
    isCacheBustDocumentRequest({
      method: "GET",
      dest: "document",
      prefetch: false,
      rsc: false,
      userAgent: "Googlebot/2.1",
    }),
    false,
  );
  assert.equal(hasFreshCacheCookie(CACHE_BUST_VERSION), true);
  assert.equal(hasFreshCacheCookie("nope"), false);
});
