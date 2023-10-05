import React, { useEffect, useState } from "react";
import Axios from "axios"
import "./styles/global.css";
import bridge from '@vkontakte/vk-bridge';

function Home() {
  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const [theme, setTheme] = useState("dark-theme");

  const style = getComputedStyle(document.body);

  // Меняет тему с темной на светлую и наоборот
  const changeTheme = () => {
    var color = "";
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

  useEffect(() => {
    // Получение данных о криптовалютах через API
    Axios.get(
      `https://api.coinstats.app/public/v1/coins?skip=0&limit=100¤cy=USD`
    ).then((res) => {
      setCrypto(res.data.coins);
    });
  }, []);

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
          <table>
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
                <td onClick={() => handleSort("priceChange1d")}>
                  <div className="thead-container">
                    <span className="head-text">1d%</span>
                    <span className="sort-symbol">{getSortIcon("priceChange1d")}</span>
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
                        <p className="price">{"$" + convertToPrice(val.price)}</p>
                      </td>
                      <td className="td-default">
                        <p className={val.priceChange1d < 0 ? "red" : "green"}>{val.priceChange1d}%</p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="bottom" onClick={() => { changeTheme() }}></div>
        <div className="navigationBar"></div>
      </div>
    </div>
  );
}

export default Home;