import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "pages/client/Home";
import AboutPage from "pages/client/About";
import ContactPage from "pages/client/Contact";
import { PATHS } from "@/constants/paths";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                path: PATHS.HOME,
                element: <HomePage />,

            },
            {
                path: PATHS.ABOUT,
                element: <AboutPage />,
            },
            {
                path: PATHS.CONTACT,
                element: <ContactPage />,
            },
        ],
    },
    {
        path: PATHS.LOGIN,
        element: <LoginPage />,
    },
    {
        path: PATHS.REGISTER,
        element: <RegisterPage />,
    },
]);
