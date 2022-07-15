import { Link } from "react-router-dom";
import img from "../assets/images/logos/logo.png"
const Logo = () => {
  return (
    <Link to="/">
        <img src={img} height="50" alt="" />
    </Link>
  );
};

export default Logo;
