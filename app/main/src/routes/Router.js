import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));

const AddCluster = lazy(() => import("../views/ui/AddCluster"));
const Url = lazy(() => import("../views/ui/Url"));
const Users= lazy(() => import("../views/ui/User"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },

      { path: "/add-cluster", exact: true, element: <AddCluster /> },
      { path: "/url/:id/:mode", element: <Url /> },
      { path: "/users", exact: true, element: <Users /> }
    ],
  },
];

export default ThemeRoutes;
