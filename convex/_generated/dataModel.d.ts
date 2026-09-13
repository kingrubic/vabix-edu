/* eslint-disable */
/**
 * Generated data model types. This stand-in uses AnyDataModel so the platform
 * module typechecks without a live Convex project. Run `npx convex codegen`
 * after linking a deployment to replace this file.
 */
import type { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

export type DataModel = AnyDataModel;
export type TableNames = string;
export type Doc<TableName extends TableNames> = Record<string, unknown>;
export type Id<TableName extends TableNames> = GenericId<TableName>;
