import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import Axios from 'axios'
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './Home/Home';
import Info from './Info/Info';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [infoData, setInfoData] = useState("");
	const [currency, setCurrency] = useState({ value: 'USD', symbol: '$' });
	const [fiats, setFiats] = useState([]);
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

	useEffect(() => {
		Axios.get(
		  `https://openapiv1.coinstats.app/fiats`, {
		  method: 'GET',
		  headers: {
			accept: 'application/json',
			'X-API-KEY': 'QhhE22owPT33jOfdUUWWwONj2pVoxSUc1FAH3k0f8Ak='
		  }
		}
		).then((res) => {
		  const fiatsData = [...res.data];
		  setFiats(fiatsData);
		});
	  }, []);
	

	const go = (panel, data) => {
		setActivePanel(panel);
		setInfoData(data);
	};	

	const setGlobalCurrency = (value) => {
		const symbol = fiats.find(item => item.name === value)?.symbol || value;
		setCurrency({value, symbol});
	};

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' go={go} setGlobalCurrency={setGlobalCurrency} currency={currency} />
								<Info id='info' go={go} data = {infoData} currency={currency} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
