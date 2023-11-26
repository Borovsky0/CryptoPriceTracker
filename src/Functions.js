// Оставляет у числа необходимое количество знаков после запятой
export const convertToPrice = (value) => {
    return value > 1.0e+6 ?
        (value / 1.0e+6).toFixed(2) + "M" : value > 10 ?
            value.toFixed(2) : value > 0.1 ?
                value.toFixed(4) : value > 0.01 ?
                    value.toFixed(5) : value.toFixed(8);
}

// Конвертация числа в систему СИ с буквенным обозначением
export const convertToSI = (value) => {
    return value >= 1.0e+12 ?
        (value / 1.0e+12).toFixed(2) + "T" : value >= 1.0e+9 ?
            (value / 1.0e+9).toFixed(2) + "B" : value >= 1.0e+6 ?
                (value / 1.0e+6).toFixed(2) + "M" : value >= 1.0e+3 ?
                    (value / 1.0e+3).toFixed(2) + "K" : value;
}