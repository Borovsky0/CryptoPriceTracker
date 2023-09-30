import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useTable, useSortBy } from "react-table";
import "./styles/global.css";

function Home() {
  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);

  useEffect(() => {
    Axios.get(
      `https://api.coinstats.app/public/v1/coins?skip=0&limit=100¤cy=USD`
    ).then((res) => {
      setCrypto(res.data.coins);
    });
  }, []);

  function convertToInternationalCurrencySystem (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue));

}

  // Define the columns for your table
  const columns = React.useMemo(
    () => [
      {
        Header: "Market Cap",
        accessor: "marketCap",
        Cell: ({ row }) => (
          <div className="info">
            <div className="rank">
            <p>{row.original.rank}</p>
            </div>
            <div className="logo">
              <img src={row.original.icon} alt="logo" width="32px" />
            </div>
            <div className="symbol">
              <p>{row.original.symbol}</p>
            </div>
            <div className="cap">
              <p>{convertToInternationalCurrencySystem(row.original.marketCap)}</p>
            </div>
          </div>
        ),
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `${(value.toFixed(2))}$`,
      },
      {
        Header: "Volume(24hrs)",
        accessor: "volume",
        Cell: ({ value }) => `${convertToInternationalCurrencySystem(value)}$`,
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return crypto.filter((val) =>
      val.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [crypto, search]);

  // Initialize the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy // Enable sorting
  );

  return (
    <div className="grid">
      <div className="statusBar"></div>
      <div className="top"></div>
      <div className="body">
      <h1>All Cryptocurrencies</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
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