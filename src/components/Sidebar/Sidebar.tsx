import './Sidebar.css'

import {Link} from "react-router-dom";
import * as routes from "src/constants/routes.constants.ts";

export function Sidebar() {
	return <aside>
		<nav className={"sidebar-menu"}>
			<Link to={routes.productsRoute}>products</Link>
			<Link to={routes.categoriesRoute}>categories</Link>
			<Link to={routes.suppliersRoute}>suppliers</Link>
		</nav>
	</aside>
}
