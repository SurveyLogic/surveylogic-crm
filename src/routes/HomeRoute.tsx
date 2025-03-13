import { Link } from "react-router-dom";
import { basicExampleRoute } from "src/examples/basic/constants/routes.constants.ts";

export function HomeRoute() {
  return (
    <div>
      <h1>Examples</h1>
      <ul>
        <li>
          <Link to={basicExampleRoute}>Basic</Link>
        </li>
      </ul>
    </div>
  );
}
