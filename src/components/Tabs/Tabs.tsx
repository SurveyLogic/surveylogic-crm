import './Tabs.css';
import {MouseEventHandler, useEffect, useState} from "react";
import {RouterState} from "@remix-run/router";

import {noop} from "src/utils/noop.ts";
import {useDataRouterContext} from "src/hooks/useDataRouterContext.tsx";
import {last, removeItem, replaceAt} from "src/utils/array-utils.ts";
import {
	closestItem,
	getTabHandle,
	getTabLocation,
	TabModel,
	useActiveTab,
	useTabTitle
} from "src/tabbed-navigation.tsx";

let tabId = 0;

export function Tabs(props: {
	storeKey: string;
	onActiveTabChange?: (tab: TabModel | undefined) => void;
}) {
	const {storeKey, onActiveTabChange = noop} = props;
	const [tabs, setTabs] = useState<TabModel[]>([]);
	const {router} = useDataRouterContext();
	const activeTab = useActiveTab(tabs);

	useEffect(() => {
		const handleLocationChange = (state: RouterState) => {
			const {matches, location, navigation} = state;

			const match = matches.find(match => getTabHandle(match, storeKey));

			if (navigation.location) {
				return;
			}

			if (match) {
				setTabs((prevTabs) => {
					const tab = prevTabs.find(
					  (tab) =>
						tab.routeId === match.route.id &&
						getTabLocation(tab).pathname.startsWith(match.pathname),
					);

					const path =
					  last(matches).pathname +
					  (location.search ? `${location.search}` : "");

					if (!tab) {
						return [{
							storeKey: storeKey,
							id: `${tabId++}`,
							path: path,
							routeId: match.route.id,
						}, ...prevTabs]
					} else {
						const index = prevTabs.indexOf(tab);
						return replaceAt(prevTabs, index, {
							...tab,
							path: path
						})
					}
					return prevTabs;
				})

			}
		}
		// fire immediately
		handleLocationChange(router.state)
		return router.subscribe(handleLocationChange);
	}, [router, storeKey]);

	const closeTab = (tab: TabModel) => {
		const closest = closestItem(tabs, tab);
		console.log('closest', closest)
		if (!closest) {
			onActiveTabChange(undefined);
		} else {
			onActiveTabChange(closest);
		}

		setTabs(prevTabs => removeItem(prevTabs, tab));

	}

	if(tabs.length < 1) {
		return null;
	}

	return <div className="tabs">
		{tabs.map((tab) => (
		  <Tab onActiveTabChange={onActiveTabChange} onClose={closeTab} isActive={activeTab?.id === tab.id} tab={tab}
		       key={tab.id}/>))}
	</div>
}

function Tab(props: {
	tab: TabModel,
	isActive: boolean,
	onClose?: (tab: TabModel) => void;
	onActiveTabChange?: (tab: TabModel | undefined) => void;
}) {
	const {tab, isActive, onClose = noop, onActiveTabChange = noop} = props;
	const title = useTabTitle(tab);
	const className = ["tab", isActive && 'active'].filter(Boolean).join(" ");

	const handleClose: MouseEventHandler = (e) => {
		e.stopPropagation();
		onClose(tab);
	}

	return <div
	  onClick={() => onActiveTabChange(tab)}
	  key={tab.id}
	  className={className}
	>
		{title}
		<span className={"close-trigger"} onClick={handleClose}>x</span>
	</div>
}
