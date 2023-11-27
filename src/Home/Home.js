import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios'
import { convertToPrice, convertToSI } from '../Functions.js';
import '../global.css';
import './home.css';
import bridge from '@vkontakte/vk-bridge';
import Popup from 'reactjs-popup';

function Home({ id, go, setGlobalCurrency, currency }) {
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [showFullName, setShowFullName] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const [priceChange, setPriceChange] = useState({ id: 'priceChange1d', text: '1D%' });
  const searchRef = useRef(null);
  const tableRef = useRef(null);
  const style = getComputedStyle(document.body);

  const updateData = () => {
    Axios.get(
      `https://openapiv1.coinstats.app/coins?limit=100&currency=${currency.value}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-KEY': 'QhhE22owPT33jOfdUUWWwONj2pVoxSUc1FAH3k0f8Ak='
      }
    }
    ).then((res) => {
      // Сортировка данных на основе текущей конфигурации сортировки
      const sortedData = [...res.data.result];
      sortedData.sort((a, b) => {
        const key = sortConfig.key;
        const direction = sortConfig.direction === "asc" ? 1 : -1;

        if (a[key] < b[key]) {
          return -1 * direction;
        }
        if (a[key] > b[key]) {
          return 1 * direction;
        }
        return 0;
      });

      // Обновление состояния с отсортированными данными
      setCrypto(sortedData);
    });
  };

  useEffect(() => {
    // Получение данных
    updateData();

    // Установка интервала для получения данных каждые 30 секунд
    const intervalId = setInterval(() => {
      updateData();
    }, 10000);

    // Очистить интервал, когда компонент размонтирован
    return () => clearInterval(intervalId);
  }, [sortConfig]); // Включение sortConfig в качестве зависимости для повторной выборки данных при изменении сортировки

  // Сделать новый запрос при изменении валюты
  useEffect(() => {
    updateData();
  }, [currency]);

  // Поменять тему с темной на светлую и наоборот
  const switchTheme = () => {
    let color;
    if (theme === "light") {
      setTheme("dark")
      color = "--black";
    }
    else {
      setTheme("light")
      color = "--white";
    }
    bridge.send('VKWebAppSetViewSettings', {
      status_bar_style: 'dark',
      action_bar_color: style.getPropertyValue(color),
      navigation_bar_color: style.getPropertyValue(color)
    });
  };

  // Поменять отображение названия/символа
  const switchNames = () => {
    showFullName ? setShowFullName(false) : setShowFullName(true);
  };

  // Заменяет тему при изменении параметра theme
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Прокручивает таблицу до верха
  const scrollToTop = () => {
    const table = tableRef.current;
    if (table) {
      table.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Сортирует таблицу по возрастанию или убыванию с учетом столбца
  const sortTable = (key, direction) => {
    const sortedCrypto = [...crypto];

    sortedCrypto.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setCrypto(sortedCrypto);
  };

  // Обрабатывает событие сортировки при нажатии на заголовок таблицы
  const handleSort = (key) => {
    scrollToTop();
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    sortTable(key, direction);
  };

  // Указать символ, информирующий о сортировке, если выбрана сортировка по определенному столбцу
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const openSearch = () => {
    setSearchState(true);
    // Фокус не ставится потому что элемент не успевает прорисоваться
    searchRef.current.focus();
  };

  const closeSearch = () => {
    setSearch("");
    setSearchState(false);
  };

  // SVG убрать в будущем
  return (
    <div className="grid">
      <div className="statusBar"></div>
      <div className="top">
        <svg className="button icon filled" height="24" width="24" onClick={() => openSearch()}>
          <path d="M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11ZM11 
          2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078 19.2635 16.6177 18.0319L20.2929 21.7071C20.6834 
          22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 
          20 13.125 20 11C20 6.02944 15.9706 2 11 2Z"/>
        </svg>
        <Popup
          trigger={<button className="button default">{priceChange.text} ⌵</button>}
          position="bottom center"
          closeOnDocumentClick
        >
          {close => (
            <div>
              <div className="popup-row" onClick={() => {
                setPriceChange({ id: 'priceChange1h', text: '1H%' });
                close();
              }}>1H% {priceChange.text === '1H%' ? '•' : ''}</div>
              <div className="popup-row" onClick={() => {
                setPriceChange({ id: 'priceChange1d', text: '1D%' });
                close();
              }}>1D% {priceChange.text === '1D%' ? '•' : ''}</div>
              <div className="popup-row" onClick={() => {
                setPriceChange({ id: 'priceChange1w', text: '1W%' });
                close();
              }}>1W% {priceChange.text === '1W%' ? '•' : ''}</div>
            </div>
          )}
        </Popup>
        <Popup
          trigger={<button className="button default">{currency.value} ⌵</button>}
          position="bottom center"
          closeOnDocumentClick
        >
          {close => (
            <div>
              <div className="popup-row" onClick={() => {
                setGlobalCurrency('USD');
                close();
              }}>USD {currency.value === 'USD' ? '•' : ''}</div>
              <div className="popup-row" onClick={() => {
                setGlobalCurrency('EUR');
                close();
              }}>EUR {currency.value === 'EUR' ? '•' : ''}</div>
              <div className="popup-row" onClick={() => {
                setGlobalCurrency('RUB');
                close();
              }}>RUB {currency.value === 'RUB' ? '•' : ''}</div>
            </div>
          )}
        </Popup>
        <input
          className={`search ${searchState ? 'active' : ''}`}
          ref={searchRef}
          autoFocus
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }} />
        <svg className={`close-button ${searchState ? 'active' : ''}`} height="24" width="24" onClick={() => closeSearch()}>
          <path d="M16 8L8 16M8 8L16 16" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="body">
        <table ref={tableRef}>
          <colgroup>
            <col className="column rank"></col>
            <col className="column market-cap"></col>
            <col className="column price"></col>
            <col className="column percent"></col>
          </colgroup>
          <thead>
            <tr>
              <td onClick={() => handleSort("rank")}>
                <div className="container thead">
                  <span className="text-12 thead end">Rank</span>
                  <span className="text-12 thead start">{getSortIcon("rank")}</span>
                </div>
              </td>
              <td onClick={() => handleSort("marketCap")}>
                <div className="container thead">
                  <span className="text-12 thead end">Market Cap</span>
                  <span className="text-12 thead start">{getSortIcon("marketCap")}</span>
                </div>
              </td>
              <td onClick={() => handleSort("price")}>
                <div className="container thead">
                  <span className="text-12 thead end">Price</span>
                  <span className="text-12 thead start">{getSortIcon("price")}</span>
                </div>
              </td>
              <td onClick={() => handleSort(priceChange.id)}>
                <div className="container thead">
                  <span className="text-12 thead end">{priceChange.text}</span>
                  <span className="text-12 thead start">{getSortIcon(priceChange.id)}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {crypto
              .filter((val) => {
                const fullNameMatch = val.name.toLowerCase().includes(search.toLowerCase());
                const shortNameMatch = val.symbol.toLowerCase().includes(search.toLowerCase());
                return fullNameMatch || shortNameMatch;
              })
              .map((val, id) => {
                return (
                  <tr className="tr-border" id={id} onClick={() => go('info', val)} >
                    <td className="text-container end">
                      <span className="text-12 gray">{val.rank}</span>
                    </td>
                    <td className="text-container start">
                      <div className="container market-cap">
                        <div className="container logo">
                          <img src={val.icon} alt="logo" width={"24px"} />
                        </div>
                        <div className="container name-and-cap">
                          <p className="text-14 name">{showFullName ? val.name : val.symbol}</p>
                          <span className="text-12 gray">{convertToSI(val.marketCap)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-container end">
                      <p className="text-14">{currency.symbol + convertToPrice(val.price)}</p>
                    </td>
                    <td className="text-container end">
                      <p className={val[priceChange.id] < 0 ? "text-14 red" : "text-14 green"}>{val[priceChange.id]}%</p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="bottom">
        <div className="container buttons-3">
          <button className="button default" onClick={() => switchTheme()}>Theme</button>
          <button className="button default" onClick={() => switchNames()}>Names</button>
        </div>
      </div>
      <div className="navigationBar"></div>
    </div>
  );
}

export default Home;