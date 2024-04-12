import { mergeTypeDefs } from "graphql-tools-merge-typedefs";
import { todoCategoryTypeDefs } from "./todo-category-schema";
import { TodoTypeDefs } from "./todo-schema";

export const typeDefs = mergeTypeDefs([todoCategoryTypeDefs, TodoTypeDefs]);
