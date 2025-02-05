import React, { useEffect, useState, useRef, useCallback } from 'react';
import Axios from 'axios'
import { convertToPrice, convertToSI } from '../Functions.js';
import '../global.css';
import './home.css';
import Popup from 'reactjs-popup';

function Home({ id, go, theme, currency, showFullName }) {
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const [priceChange, setPriceChange] = useState({ id: 'priceChange1d', text: '1D%' });
  const searchRef = useRef(null);
  const tableRef = useRef(null);

const updateData = useCallback(() => {
    Axios.get(
      `https://openapiv1.coinstats.app/coins?limit=100&currency=${currency.value}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'cache-control': 'no-cache',
        'X-API-KEY': 'QhhE22owPT33jOfdUUWWwONj2pVoxSUc1FAH3k0f8Ak='
      }
    }
    ).then((res) => {
      //console.log("Data received:", res.data.result);
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
  }, [currency, sortConfig]);

  useEffect(() => {
    // Получение данных
    updateData();

    // Установка интервала для получения данных каждые 30 секунд
    const intervalId = setInterval(updateData, 30000);

    // Очистить интервал, когда компонент размонтирован
    return () => clearInterval(intervalId);
}, [sortConfig, updateData]); // Включение sortConfig в качестве зависимости для повторной выборки данных при изменении сортировки

  // Сделать новый запрос при изменении валюты
  useEffect(() => {
    updateData();
  }, [currency, updateData]);

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
        <svg className={`close-button icon ${searchState ? 'active' : ''}`} height="24" width="24" onClick={() => closeSearch()}>
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
                  <tr className="tr-border" key={id} onClick={() => go('info', val)} >
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
        <div className="container elements-3">
          <svg className="button icon center" height="24" width="24" onClick={() => go('home')}>
            <path d="M16 11V16M8 11V16M12 8V16M7 21H17C19.2091 21 21 19.2091 21 17V7C21 
                    4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z"
              strokeWidth="2" strokeLinecap="round"
            />
          </svg>
          <svg className="button icon center" height="24" width="24" >
            <path fill-rule="evenodd" clip-rule="evenodd" 
            d="M3 12H21M7 12V14M17 12V14M8 7H7.8C6.11984 7 5.27976 7 4.63803 7.32698C4.07354 
            7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 
            18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 
            6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 
            19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 
            8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H16M8 
            7V6C8 5.06812 8 4.60218 8.15224 4.23463C8.35523 3.74458 8.74458 3.35523 9.23463 3.15224C9.60218 
            3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6448 3.74458 15.8478 
            4.23463C16 4.60218 16 5.06812 16 6V7M8 7H16" strokeWidth="2" strokeLinecap="round"
            />
          </svg>
          <svg className="button icon center" height="24" width="24" onClick={() => go('settings')}>
            <path d="M10.5213 3.62368C11.3147 2.75255 12.6853 2.75255 13.4787 3.62368L14.2142 
                    4.43128C14.6151 4.87154 15.1914 5.11025 15.7862 5.08245L16.8774 5.03146C18.0543 
                    4.97645 19.0236 5.94568 18.9685 7.12264L18.9176 8.21377C18.8898 8.80859 19.1285 
                    9.38487 19.5687 9.78582L20.3763 10.5213C21.2475 11.3147 21.2475 12.6853 20.3763 
                    13.4787L19.5687 14.2142C19.1285 14.6151 18.8898 15.1914 18.9176 15.7862L18.9685 
                    16.8774C19.0236 18.0543 18.0543 19.0236 16.8774 18.9685L15.7862 18.9176C15.1914 
                    18.8898 14.6151 19.1285 14.2142 19.5687L13.4787 20.3763C12.6853 21.2475 11.3147 
                    21.2475 10.5213 20.3763L9.78582 19.5687C9.38487 19.1285 8.80859 18.8898 8.21376 
                    18.9176L7.12264 18.9685C5.94568 19.0236 4.97645 18.0543 5.03146 16.8774L5.08245 
                    15.7862C5.11025 15.1914 4.87154 14.6151 4.43128 14.2142L3.62368 13.4787C2.75255 
                    12.6853 2.75255 11.3147 3.62368 10.5213L4.43128 9.78582C4.87154 9.38487 5.11025 
                    8.80859 5.08245 8.21376L5.03146 7.12264C4.97645 5.94568 5.94568 4.97645 7.12264 
                    5.03146L8.21376 5.08245C8.80859 5.11025 9.38487 4.87154 9.78583 4.43128L10.5213 
                    3.62368Z" strokeWidth="2" strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="navigationBar"></div>
    </div>
  );
}

export default Home;