import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './Home/Home';
import Info from './Info/Info';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [infoData, setInfoData] = useState("");
	const [fetchedUser, setUser] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');

			await bridge.send('VKWebAppSetViewSettings', {
				status_bar_style: 'dark',
				action_bar_color: getComputedStyle(document.body).getPropertyValue('--bgColor'),
				navigation_bar_color: getComputedStyle(document.body).getPropertyValue('--bgColor')
				});
			setUser(user);
		}
		fetchData();
	}, []);

	const go = (panel, data) => {
		setActivePanel(panel);
		setInfoData(data);
	};

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' go={go} />
								<Info id='info' go={go} data = {infoData} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
