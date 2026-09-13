/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as platformAudit from "../platformAudit.js";
import type * as platformAuth from "../platformAuth.js";
import type * as platformGuard from "../platformGuard.js";
import type * as platformIam from "../platformIam.js";
import type * as platformMigrate from "../platformMigrate.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  platformAudit: typeof platformAudit;
  platformAuth: typeof platformAuth;
  platformGuard: typeof platformGuard;
  platformIam: typeof platformIam;
  platformMigrate: typeof platformMigrate;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
