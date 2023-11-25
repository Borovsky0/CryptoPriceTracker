import React, { useState } from "react";
import "../global.css";
import './info.css';

function Info({ id, go, data }) {

    const [favorite, setFavorite] = useState(false);

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
                <svg className={`button icon ${favorite ? 'filled' : ''}`} height="24" width="24" onClick={() =>  setFavorite(!favorite)}>
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
            <div className="body"></div>
            <div className="bottom"></div>
            <div className="navigationBar"></div>
        </div>
    )
}

export default Info;