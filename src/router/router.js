import { createBrowserRouter } from "react-router-dom";
import Blocks from "../pages/Blocks";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import Error404 from "../pages/Error404";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
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
