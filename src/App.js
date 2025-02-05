import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { View } from './Components/View';

import Home from './Home/Home';
import Info from './Info/Info';
import Settings from './Settings/Settings';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [infoData, setInfoData] = useState("");
	const [currency, setCurrency] = useState({ value: 'USD', symbol: '$' });
	const [showFullName, setShowFullName] = useState(true);
	const [theme, setTheme] = useState('dark');
	const [fiats, setFiats] = useState([]);

	useEffect(() => {
		Axios.get(
			`https://openapiv1.coinstats.app/fiats`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				'cache-control': 'no-cache',
				'X-API-KEY': 'QhhE22owPT33jOfdUUWWwONj2pVoxSUc1FAH3k0f8Ak='
			}
		}
		).then((res) => {
			const fiatsData = [...res.data];
			setFiats(fiatsData);
		});
	}, []);

	// Заменяет тему при изменении параметра theme
	useEffect(() => {
		document.body.setAttribute("data-theme", theme);
	}, [theme]);

	const go = (panel, data) => {
		setActivePanel(panel);
		setInfoData(data);
	};

	const setGlobalCurrency = (value) => {
		const symbol = fiats.find(item => item.name === value)?.symbol || value;
		setCurrency({ value, symbol });
	};

	const setGlobalTheme = (value) => {
		setTheme(value);
	};

	const setGlobalNames = (value) => {
		setShowFullName(value)
	}

	return (
		<div className="app">
			<View activePanel={activePanel}>
				<Home id='home' go={go} theme={theme} currency={currency} showFullName={showFullName} />
				<Settings 
					id='settings' 
					go={go} 
					fiats={fiats} 
					setGlobalCurrency={setGlobalCurrency} 
					currency={currency}
					setGlobalTheme={setGlobalTheme} 
					theme={theme} 
					setGlobalNames={setGlobalNames} 
					showFullName={showFullName} 
				/>
				<Info id='info' go={go} data={infoData} currency={currency} />
			</View>
		</div>
	);
}

export default App;