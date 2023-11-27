import React, { useState, useEffect } from "react";
import Axios from 'axios'
import "../global.css";
import './info.css';
import { convertToPrice, convertToIntegerPrice } from '../Functions.js';
import Chart from 'react-apexcharts'

function Info({ id, go, data, currency }) {

    const [favorite, setFavorite] = useState(false);
    const [period, setPeriod] = useState('24h'); // 24h, 1w, 1m, 3m, 6m, 1y, all
    const [chart, setChart] = useState([]);

    useEffect(() => {
		Axios.get(
		  `https://openapiv1.coinstats.app/coins/${data.id}/charts?period=${period}`, {
		  method: 'GET',
		  headers: {
			accept: 'application/json',
			'X-API-KEY': 'QhhE22owPT33jOfdUUWWwONj2pVoxSUc1FAH3k0f8Ak='
		  }
		}
		).then((res) => {
		  const chartData = [...res.data].map(row => [row[0], row[1]]);
          for (let i = 0; i < chartData.length; i++) {
            chartData[i][0] = chartData[i][0] * 1000;
        }
		  setChart(chartData);
		});
	  }, [period]);

    const options = {
        xaxis: {
            tooltip: {
                enabled: false
              },
            axisBorder: {
                color: getComputedStyle(document.body).getPropertyValue('--textColor'),
            },
            axisTicks: {
                color: getComputedStyle(document.body).getPropertyValue('--textColor'),
            },
            type: 'datetime',
            labels: {
                datetimeUTC: false,
                format: 'hh:mm',
                style: {
                    fontSize: '12px',
                    cssClass: 'chart-labels'
                }
            }
        },
        yaxis: {
            floating: true,
            labels: {
                align: 'left',
                offsetX: 8,
                offsetY: -8,
                style:
                {
                    fontSize: '12px',
                    cssClass: 'chart-labels'
                },
                formatter: (value) => { return currency.symbol + convertToIntegerPrice(value); }
            },
        },
        chart: {
            fontFamily: 'Inter, sans-serif',
            width: '100%',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 2
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.05,
                stops: [0, 95]
            }
        },
        tooltip: {
            marker: {
                show: false
            },
            theme: 'chart-tooltip',
            x: {
                format: 'hh:mm'
            },
            y: {
                formatter: (value) => { return currency.symbol + convertToPrice(value); }
            }
        },
        grid: {
            borderColor: getComputedStyle(document.body).getPropertyValue('--darkGray'),
        }
    };

    const series = [
        {
            name: data.name,
            data: chart
        }
    ];

    return (
        <div className='grid'>
            <div className="statusBar"></div>
            <div className="top">
                <svg className="button icon" height="24" width="24" onClick={() => go('home', data)}>
                    <path d="M 13 4 L 5 12 M 5 12 L 13 20 M 5 12" stroke-width="2" stroke-linecap="round" />
                </svg>
                <div className="container logo-and-symbol">
                    <img src={data.icon} alt="logo" width={"36px"} />
                    <div className="container symbol">
                        <span className="text-16">{data.symbol}</span>
                    </div>
                </div>
                <svg className={`button icon ${favorite ? 'filled' : ''}`} height="24" width="24" onClick={() => setFavorite(!favorite)}>
                    <path d="M11.0748 3.25583C11.4141 2.42845 12.5859 2.42845 12.9252 3.25583L14.6493 
                        7.45955C14.793 7.80979 15.1221 8.04889 15.4995 8.07727L20.0303 8.41798C20.922 
                        8.48504 21.2841 9.59942 20.6021 10.1778L17.1369 13.1166C16.8482 13.3614 
                        16.7225 13.7483 16.8122 14.1161L17.8882 18.5304C18.1 19.3992 17.152 20.0879 
                        16.3912 19.618L12.5255 17.2305C12.2034 17.0316 11.7966 17.0316 11.4745 
                        17.2305L7.60881 19.618C6.84796 20.0879 5.90001 19.3992 6.1118 18.5304L7.18785 
                        14.1161C7.2775 13.7483 7.1518 13.3614 6.86309 13.1166L3.3979 10.1778C2.71588 
                        9.59942 3.07796 8.48504 3.96971 8.41798L8.50046 8.07727C8.87794 8.04889 9.20704 
                        7.80979 9.35068 7.45955L11.0748 3.25583Z" stroke-width="2" stroke-linecap="round"
                    />
                </svg>
            </div>
            <div className="body">
                <div className="text-container sided">
                    <span className="text-16">{data.name}</span>
                </div>
                <div className="text-container sided">
                    <span className="text-24">{currency.symbol + convertToPrice(data.price)}</span>
                </div>
                <Chart height='30%' options={options} series={series} type="area" />
            </div>
            <div className="bottom"></div>
            <div className="navigationBar"></div>
        </div>
    )
}

export default Info;