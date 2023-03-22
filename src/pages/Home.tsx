import { Link } from "react-router-dom";
import ROUTES from "@/constants/routes";

const Home = () => (
  <>
    <h1>create-boilerplate-vite-react-ts</h1>
    <h2>Home</h2>
    <Link to={ROUTES.contact}>Go to contact</Link>
  </>
);

export default Home;
