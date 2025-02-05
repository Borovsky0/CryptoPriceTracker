import React from 'react';
import "../global.css";
import './settings.css';
import Switch from "react-switch";
import Popup from 'reactjs-popup';

function Settings({go, fiats, setGlobalCurrency, currency, setGlobalTheme, theme, setGlobalNames, showFullName}) {
    const style = getComputedStyle(document.body);

    // Поменять тему с темной на светлую и наоборот
    const switchTheme = () => {
        let newTheme = theme === "light" ? "dark" : "light";
        setGlobalTheme(newTheme);
    };

    // Поменять отображение названия/символа
    const switchNames = () => {
        setGlobalNames(!showFullName);
    };

    return (
        <div className='grid'>
            <div className="statusBar"></div>
            <div className="top">
                <div className='container elements-3'>
                <svg className="button icon" height="24" width="24" onClick={() => go('home')}>
                    <path d="M 13 4 L 5 12 M 5 12 L 13 20 M 5 12" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className='text-24 center'>Settings</div>
                </div>
            </div>
            <div className="body">
                <div className='container gray'>
                    <div className='two-grid'>
                        <div className="text-container">
                            <div className='text-14'>Dark theme</div>
                        </div>
                        <Switch className='switch'
                            checked={theme === 'dark' ? true : false}
                            onChange={() => switchTheme()}
                            onColor={style.getPropertyValue('--accent')}
                            onHandleColor={style.getPropertyValue('--main')}
                            handleDiameter={20}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={14}
                            width={36}
                        />
                    </div>
                    <div className='two-grid'>
                        <div className="text-container">
                            <div className='text-14'>Full names</div>
                        </div>
                        <Switch className='switch'
                            checked={showFullName === true ? true : false}
                            onChange={() => switchNames()}
                            onColor={style.getPropertyValue('--accent')}
                            onHandleColor={style.getPropertyValue('--main')}
                            handleDiameter={20}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={14}
                            width={36}
                        />
                    </div>
                    <Popup
                        trigger=
                        {<div className='two-grid' onClick={() => console.log('123')}>
                            <div className="text-container">
                                <div className='text-14'>Currency</div>
                            </div>
                            <div className="text-container end">
                                <div className='text-14'>{currency.value}</div>
                            </div>
                        </div>}
                        position="bottom right"
                        closeOnDocumentClick
                    >
                        {close => (
                            <table className='popup-table'>
                                <tbody>
                                    {fiats.map(val => {
                                        return (
                                            <tr key={val.name} onClick={() => {setGlobalCurrency(val.name); close();}}>
                                                <td>
                                                    <img className='container logo' src={val.imageUrl} width={'24px'} alt={`${val.name} logo`} />
                                                </td>
                                                <td>
                                                <div className="text-container">
                                                    <div className='text-12'>{val.name}</div>
                                                </div>
                                                </td>
                                                <td>
                                                <div className="text-container">
                                                    <div className='text-12'>{val.name === val.symbol ? "" : val.symbol}</div>
                                                </div></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </Popup>

                </div>
            </div>
            <div className="bottom"></div>
            <div className="navigationBar"></div>
        </div>
    )
}

export default Settings;