import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition.jsx";
import "./NotFound.css";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="not-found">
        <h1>404</h1>
        <p>This page isn't in the stacks.</p>
        <Link to="/">Back to the reading room →</Link>
      </div>
    </PageTransition>
  );
}
