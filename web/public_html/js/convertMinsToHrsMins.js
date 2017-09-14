function convertMinsToHrsMins(minutes,count) {
    var h = Math.floor(minutes / (60 * count));
    var m = (minutes % 60).toFixed(0);
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return parseFloat(parseFloat(parseInt(h)+parseFloat(m/100)).toFixed(2)) ;
}