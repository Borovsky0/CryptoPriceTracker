import React, { useEffect, useState } from "react";
import Axios from "axios"
import "./styles/global.css";

function Home() {
  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

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

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    sortTable(key, direction);
  };

  function convertCurrency(value) {
    return Math.abs(Number(value)) >= 1.0e+9
      ? (Math.abs(Number(value)) / 1.0e+9).toFixed(2) + "B"
      : Math.abs(Number(value)) >= 1.0e+6
        ? (Math.abs(Number(value)) / 1.0e+6).toFixed(2) + "M"
        : Math.abs(Number(value)) >= 1.0e+3
          ? (Math.abs(Number(value)) / 1.0e+3).toFixed(2) + "K"
          : Math.abs(Number(value));
  }

  useEffect(() => {
    Axios.get(
      `https://api.coinstats.app/public/v1/coins?skip=0&limit=100¤cy=USD`
    ).then((res) => {
      setCrypto(res.data.coins);
    });
  }, []);

  return (
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
              <td onClick={() => handleSort("rank")}>Rank</td>
              <td onClick={() => handleSort("marketCap")}>Market Cap</td>
              <td onClick={() => handleSort("price")}>Price</td>
              <td onClick={() => handleSort("priceChange1d")}>1d%</td>
            </tr>
          </thead>
          <tbody>
            {crypto
              .filter((val) => {
                return val.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((val, id) => {
                return (
                  <>
                    <tr id={id}>
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
                            <span className="cap">{convertCurrency(val.marketCap)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="td-default">
                        <p className="price">{"$" + (
                          val.price > 1 ? val.price.toFixed(2) :
                            val.price > 0.1 ? val.price.toFixed(4) :
                              val.price > 0.01 ? val.price.toFixed(5) : val.price.toFixed(8))}</p>
                      </td>
                      <td className="td-default">
                        <p className={val.priceChange1d < 0 ? "red" : "green"}>{val.priceChange1d}%</p>
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="bottom"></div>
      <div className="navigationBar"></div>
    </div>
  );
}

export default Home;