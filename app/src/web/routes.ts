import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("favicon.ico", "routes/favicon.tsx"),
] satisfies RouteConfig;
