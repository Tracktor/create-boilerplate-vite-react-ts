import { Link } from "react-router-dom";
import ROUTES from "@/constants/routes";

const Contact = () => (
  <>
    <h1>Contact</h1>
    <Link to={ROUTES.home}>Go to home</Link>
  </>
);

export default Contact;
