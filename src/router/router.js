import { createBrowserRouter } from "react-router-dom";
import Blocks from "../pages/Blocks";
import Markdown from "../pages/Markdown";
import Layout from "../pages/Layout";
import Error404 from "../pages/Error404";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Markdown,
      },
      {
        path: "blocks",
        Component: Blocks,
      },
      {
        path: "*",
        Component: Error404,
      },
    ],
  },
]);

export default router;
