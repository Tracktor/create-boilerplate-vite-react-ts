import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import ROUTES from "@/constants/routes";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={ROUTES.home} element={<Home />} />
      <Route path={ROUTES.contact} element={<Contact />} />
    </>,
  ),
);

const Router = () => <RouterProvider router={router} />;

export default Router;
