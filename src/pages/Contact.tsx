import { Link } from "react-router-dom";
import ROUTES from "@/constants/routes";

const Contact = () => (
  <>
    <h1>create-boilerplate-vite-react-ts</h1>
    <h2>Contact</h2>
    <Link to={ROUTES.home}>Go to home</Link>
  </>
);

export default Contact;
