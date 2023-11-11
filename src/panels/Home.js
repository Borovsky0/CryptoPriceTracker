import React, { useEffect, useState, useRef } from "react";
import Axios from "axios"
import "./styles/global.css";
import bridge from '@vkontakte/vk-bridge';

function Home() {
  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const [priceChange, setPriceChange] = useState({ id: 'changePercent24Hr', text: '1d%' });
  const [theme, setTheme] = useState("dark-theme");
  const tableRef = useRef(null);
  const style = getComputedStyle(document.body);

  const updateData = () => {
    Axios.get(
      `https://api.coincap.io/v2/assets`
    ).then((res) => {
      // Сортировка данных на основе текущей конфигурации сортировки
      const sortedData = [...res.data.data].map(item => ({
        ...item,
        rank: parseInt(item.rank),
        marketCapUsd: parseFloat(item.marketCapUsd),
        priceUsd: parseFloat(item.priceUsd),
        changePercent24Hr: parseFloat(item.changePercent24Hr),
      }));
      
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

    // Установка интервала для получения данных каждые 10 секунд
    const intervalId = setInterval(() => {
      updateData();
    }, 10000);

    // Очистить интервал, когда компонент размонтирован
    return () => clearInterval(intervalId);
  }, [sortConfig]); // Включение sortConfig в качестве зависимости для повторной выборки данных при изменении сортировки

  // Меняет тему с темной на светлую и наоборот
  const changeTheme = () => {
    let color;
    if (theme === "light-theme") {
      setTheme("dark-theme")
      color = "--black";
    }
    else {
      setTheme("light-theme")
      color = "--white";
    }
    bridge.send('VKWebAppSetViewSettings', {
      status_bar_style: 'dark',
      action_bar_color: style.getPropertyValue(color),
      navigation_bar_color: style.getPropertyValue(color)
    });
  }

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
    return value >= 1.0e+9 ?
      (value / 1.0e+9).toFixed(2) + "B" : value >= 1.0e+6 ?
        (value / 1.0e+6).toFixed(2) + "M" : value >= 1.0e+3 ?
          (value / 1.0e+3).toFixed(2) + "K" : value;
  }

  // Оставляет у числа необходимое количество знаков после запятой
  const convertToPrice = (value) => {
    return value > 10 ?
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

  const missedLogo = () => {
  return (<div className="empty-logo">{val.symbol}</div>)
  };

  return (
    <div className={theme}>
      <div className="grid">
        <div className="statusBar"></div>
        <div className="top">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="body">
          <table ref={tableRef}>
            <thead>
              <tr>
                <td onClick={() => handleSort("rank")}>
                  <div className="thead-container">
                    <span className="head-text">Rank</span>
                    <span className="sort-symbol">{getSortIcon("rank")}</span>
                  </div>
                </td>
                <td onClick={() => handleSort("marketCapUsd")}>
                  <div className="thead-container">
                    <span className="head-text">Market Cap</span>
                    <span className="sort-symbol">{getSortIcon("marketCapUsd")}</span>
                  </div>
                </td>
                <td onClick={() => handleSort("priceUsd")}>
                  <div className="thead-container">
                    <span className="head-text">Price</span>
                    <span className="sort-symbol">{getSortIcon("priceUsd")}</span>
                  </div>
                </td>
                <td onClick={() => handleSort(priceChange.id)}>
                  <div className="thead-container">
                    <span className="head-text">1d%</span>
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
                            <img src={`https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/${val.id}.png`} alt="" width={"24px"}/>
                          </div>
                          <div className="symbol-and-cap-container">
                            <p className="symbol">{val.symbol}</p>
                            <span className="cap">{convertToSI(val.marketCapUsd)}</span>
                          </div>  
                        </div>
                      </td>
                      <td className="td-default">
                        <p className="price">{"$" + convertToPrice(val.priceUsd)}</p>
                      </td>
                      <td className="td-default">
                        <p className={val[priceChange.id] < 0 ? "red" : "green"}>{val[priceChange.id].toFixed(2)}%</p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="bottom">
          <div className="buttons-container">
            <button className="button-default" onClick={() => { changeTheme() }}>THEME</button>
            <button className="button-default" onClick={
              // Нарушает сортировку при нажатии
              updateData
              }>UPDATE</button>
          </div>
        </div>
        <div className="navigationBar"></div>
      </div>
    </div>
  );
}

export default Home;