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

  // Define the columns for your table
  const columns = React.useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="logo">
            <a href={row.original.websiteUrl}>
              <img src={row.original.icon} alt="logo" width="30px" />
            </a>
            <p>{row.original.name}</p>
          </div>
        ),
      },
      {
        Header: "Symbol",
        accessor: "symbol",
      },
      {
        Header: "Market Cap",
        accessor: "marketCap",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `${value.toFixed(4)}$`,
      },
      {
        Header: "Available Supply",
        accessor: "availableSupply",
      },
      {
        Header: "Volume(24hrs)",
        accessor: "volume",
        Cell: ({ value }) => `${value.toFixed(0)}$`,
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
    <div className="App">
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
  );
}

export default Home;