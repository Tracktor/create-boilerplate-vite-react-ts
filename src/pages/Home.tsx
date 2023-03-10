import { Link } from "react-router-dom";
import ROUTES from "@/constants/routes";

const Home = () => (
  <>
    <h1>Home</h1>
    <Link to={ROUTES.contact}>Go to contact</Link>
  </>
);

export default Home;
