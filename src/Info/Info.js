import React, { useState } from "react";
import "../global.css";
import './info.css';
import { convertToPrice, convertToIntegerPrice } from '../Functions.js';
import Chart from 'react-apexcharts'

function Info({ id, go, data, currency }) {

    const [favorite, setFavorite] = useState(false);

    const chart = [
        [
            1700863800,
            37794.4877,
            1,
            18.189
        ],
        [
            1700864100,
            37722.5973,
            1,
            18.2252
        ],
        [
            1700864400,
            37767.0678,
            1,
            18.1837
        ],
        [
            1700864700,
            37763.5763,
            1,
            18.1908
        ],
        [
            1700865000,
            37721.5471,
            1,
            18.1874
        ],
        [
            1700865300,
            37736.537,
            1,
            18.1927
        ],
        [
            1700865600,
            37738.689,
            1,
            18.2007
        ],
        [
            1700865900,
            37740.4924,
            1,
            18.1952
        ],
        [
            1700866200,
            37767.5845,
            1,
            18.1852
        ],
        [
            1700866500,
            37727.3532,
            1,
            18.2055
        ],
        [
            1700866800,
            37696.4709,
            1,
            18.1875
        ],
        [
            1700867100,
            37638.1365,
            1,
            18.1781
        ],
        [
            1700867400,
            37604.4435,
            1,
            18.1748
        ],
        [
            1700867700,
            37613.2543,
            1,
            18.1589
        ],
        [
            1700868000,
            37646.5267,
            1,
            18.1743
        ],
        [
            1700868300,
            37674.742,
            1,
            18.1591
        ],
        [
            1700868600,
            37700.7989,
            1,
            18.1619
        ],
        [
            1700868900,
            37686.7799,
            1,
            18.1518
        ],
        [
            1700869200,
            37701.8882,
            1,
            18.1544
        ],
        [
            1700869500,
            37711.858,
            1,
            18.1663
        ],
        [
            1700869800,
            37705.529,
            1,
            18.1505
        ],
        [
            1700870100,
            37717.4856,
            1,
            18.1481
        ],
        [
            1700870400,
            37720.9603,
            1,
            18.1438
        ],
        [
            1700870700,
            37710.9835,
            1,
            18.1446
        ],
        [
            1700871000,
            37705.8175,
            1,
            18.1328
        ],
        [
            1700871300,
            37715.4083,
            1,
            18.119
        ],
        [
            1700871600,
            37734.8561,
            1,
            18.1323
        ],
        [
            1700871900,
            37732.9254,
            1,
            18.1382
        ],
        [
            1700872200,
            37760.456,
            1,
            18.1565
        ],
        [
            1700872500,
            37758.6513,
            1,
            18.1595
        ],
        [
            1700872800,
            37752.3576,
            1,
            18.1639
        ],
        [
            1700873100,
            37769.7505,
            1,
            18.1823
        ],
        [
            1700873400,
            37758.1964,
            1,
            18.1758
        ],
        [
            1700873700,
            37730.1529,
            1,
            18.1802
        ],
        [
            1700874000,
            37726.507,
            1,
            18.2085
        ],
        [
            1700874300,
            37747.492,
            1,
            18.1715
        ],
        [
            1700874600,
            37741.236,
            1,
            18.1566
        ],
        [
            1700874900,
            37741.5224,
            1,
            18.1509
        ],
        [
            1700875200,
            37753.4585,
            1,
            18.1665
        ],
        [
            1700875500,
            37741.1271,
            1,
            18.1666
        ],
        [
            1700875800,
            37744.1497,
            1,
            18.1571
        ],
        [
            1700876100,
            37768.8699,
            1,
            18.1619
        ],
        [
            1700876400,
            37769.8011,
            1,
            18.1658
        ],
        [
            1700876700,
            37777.1319,
            1,
            18.1729
        ],
        [
            1700877000,
            37774.7267,
            1,
            18.1589
        ],
        [
            1700877300,
            37810.3272,
            1,
            18.1442
        ],
        [
            1700877600,
            37797.2438,
            1,
            18.134
        ],
        [
            1700877900,
            37785.535,
            1,
            18.156
        ],
        [
            1700878200,
            37780.2429,
            1,
            18.162
        ],
        [
            1700878500,
            37769.8657,
            1,
            18.1693
        ],
        [
            1700878800,
            37747.3171,
            1,
            18.1699
        ],
        [
            1700879100,
            37745.5412,
            1,
            18.1613
        ],
        [
            1700879400,
            37728.9645,
            1,
            18.146
        ],
        [
            1700879700,
            37774.9943,
            1,
            18.1405
        ],
        [
            1700880000,
            37799.6347,
            1,
            18.1409
        ],
        [
            1700880300,
            37800.6445,
            1,
            18.1324
        ],
        [
            1700880600,
            37825.5427,
            1,
            18.1442
        ],
        [
            1700880900,
            37818.9844,
            1,
            18.1493
        ],
        [
            1700881200,
            37827.1876,
            1,
            18.1515
        ],
        [
            1700881500,
            37827.8971,
            1,
            18.1629
        ],
        [
            1700881800,
            37825.6758,
            1,
            18.1582
        ],
        [
            1700882100,
            37828.2372,
            1,
            18.1542
        ],
        [
            1700882400,
            37838.2334,
            1,
            18.1515
        ],
        [
            1700882700,
            37845.3956,
            1,
            18.1442
        ],
        [
            1700883000,
            37837.0021,
            1,
            18.1385
        ],
        [
            1700883300,
            37835.3792,
            1,
            18.1361
        ],
        [
            1700883600,
            37823.8236,
            1,
            18.1477
        ],
        [
            1700883900,
            37824.5124,
            1,
            18.1313
        ],
        [
            1700884200,
            37785.7787,
            1,
            18.1192
        ],
        [
            1700884500,
            37797.0105,
            1,
            18.1304
        ]
    ];

    var chart2 = chart.map(function (val) {
        return val.slice(0, -2);
    });

    for (let i = 0; i < chart2.length; i++) {
        chart2[i][0] = chart2[i][0] * 1000;
    }

    const options = {
        xaxis: {
            axisBorder: {
                color: getComputedStyle(document.body).getPropertyValue('--textColor'),
            },
            axisTicks: {
                color: getComputedStyle(document.body).getPropertyValue('--textColor'),
            },
            type: 'datetime',
            labels: {
                format: 'HH:MM',
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
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.05,
                stops: [0, 95]
            }
        },
        grid: {
            borderColor: getComputedStyle(document.body).getPropertyValue('--darkGray'),
        }
    };

    const series = [
        {
            data: chart2
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
                <Chart options={options} series={series} type="area" />
            </div>
            <div className="bottom"></div>
            <div className="navigationBar"></div>
        </div>
    )
}

export default Info;