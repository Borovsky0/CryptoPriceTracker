import React, { useEffect, useState, useRef } from "react";
import Axios from "axios"
import "./styles/global.css";
import bridge from '@vkontakte/vk-bridge';
import Popup from 'reactjs-popup';


function Home() {
  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [currency, setCurrency] = useState("USD");
  const [fiats, setFiats] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const [priceChange, setPriceChange] = useState({ id: 'priceChange1d', text: '1D%' });
  const tableRef = useRef(null);
  const style = getComputedStyle(document.body);

  // Получить список доступных валют и информацию о них
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

  const updateData = () => {
    Axios.get(
      `https://openapiv1.coinstats.app/coins?limit=100&currency=${currency}`, {
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
    }, 30000);

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

  // Конвертация числа в систему СИ с буквенным обозначением
  const convertToSI = (value) => {
    return value >= 1.0e+12 ?
      (value / 1.0e+12).toFixed(2) + "T" : value >= 1.0e+9 ?
        (value / 1.0e+9).toFixed(2) + "B" : value >= 1.0e+6 ?
          (value / 1.0e+6).toFixed(2) + "M" : value >= 1.0e+3 ?
            (value / 1.0e+3).toFixed(2) + "K" : value;
  }

  // Оставляет у числа необходимое количество знаков после запятой
  const convertToPrice = (value) => {
    return value > 1.0e+6 ?
      (value / 1.0e+6).toFixed(2) + "M" : value > 10 ?
        value.toFixed(2) : value > 0.1 ?
          value.toFixed(4) : value > 0.01 ?
            value.toFixed(5) : value.toFixed(8);
  }

  // Указать символ, информирующий о сортировке, если выбрана сортировка по определенному столбцу
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <div className="grid">
      <div className="statusBar"></div>
      <div className="top">
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <Popup
          trigger={<button className="button-default">{priceChange.text} ⌵</button>}
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
          trigger={<button className="button-default">{currency} ⌵</button>}
          position="bottom center"
          closeOnDocumentClick
        >
          {close => (
            <div>
              <div className="popup-row" onClick={() => {
                setCurrency('USD');
                close();
              }}>USD {currency === 'USD' ? '•' : ''}</div>
              <div className="popup-row" onClick={() => {
                setCurrency('EUR');
                close();
              }}>EUR {currency === 'EUR' ? '•' : ''}</div>
              <div className="popup-row" onClick={() => {
                setCurrency('RUB');
                close();
              }}>RUB {currency === 'RUB' ? '•' : ''}</div>
            </div>
          )}
        </Popup>
      </div>
      <div className="body">
        <table ref={tableRef}>
          <colgroup>
            <col className="rank-col"></col>
            <col className="market-cap-col"></col>
            <col className="price-col"></col>
            <col className="percent-col"></col>
          </colgroup>
          <thead>
            <tr>
              <td onClick={() => handleSort("rank")}>
                <div className="thead-container">
                  <span className="head-text">Rank</span>
                  <span className="sort-symbol">{getSortIcon("rank")}</span>
                </div>
              </td>
              <td onClick={() => handleSort("marketCap")}>
                <div className="thead-container">
                  <span className="head-text">Market Cap</span>
                  <span className="sort-symbol">{getSortIcon("marketCap")}</span>
                </div>
              </td>
              <td onClick={() => handleSort("price")}>
                <div className="thead-container">
                  <span className="head-text">Price</span>
                  <span className="sort-symbol">{getSortIcon("price")}</span>
                </div>
              </td>
              <td onClick={() => handleSort(priceChange.id)}>
                <div className="thead-container">
                  <span className="head-text">{priceChange.text}</span>
                  <span className="sort-symbol">{getSortIcon(priceChange.id)}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {crypto
              .filter((val) => {
                return val.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((val, id) => {
                return (
                  <tr className="tr-border" id={id}>
                    <td className="td-default">
                      <span className="rank">{val.rank}</span>
                    </td>
                    <td className="td-market-cap">
                      <div className="market-cap-container">
                        <div className="logo">
                          <img src={val.icon} alt="logo" width={"24px"} />
                        </div>
                        <div className="symbol-and-cap-container">
                          <p className="symbol">{val.symbol}</p>
                          <span className="cap">{convertToSI(val.marketCap)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="td-default">
                      <p className="price">{(fiats.find(item => item.name === currency)?.symbol || currency) + convertToPrice(val.price)}</p>
                    </td>
                    <td className="td-default">
                      <p className={val[priceChange.id] < 0 ? "red" : "green"}>{val[priceChange.id]}%</p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="bottom">
        <div className="buttons-container">
          <button className="button-default" onClick={() => switchTheme()}>Theme</button>
        </div>
      </div>
      <div className="navigationBar"></div>
    </div>
  );
}

export default Home;