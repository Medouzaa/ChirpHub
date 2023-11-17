// Protects access from all the other pages except the home page

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/trpc/posts.getAll",
    "/api/trpc/likes.getLikesByPostId",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
