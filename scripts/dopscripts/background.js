export function calculateTimestamsShort(timestampitemsteam){
    
    const diff = (Date.now() - timestampitemsteam) / 1000; 
    let value, unit;

    if (diff < 60) {
        value = -Math.floor(diff);
        unit = 's';
    } else if (diff < 3600) {
        value = -Math.floor(diff/60);
        unit = 'm';
    } else if (diff < 86400) {
        value = -Math.floor(diff/3600);
        unit = 'h';
    } else if (diff < 604800) {
        value = -Math.floor(diff/86400);
        unit = 'd';
    } else {
        value = -Math.floor(diff/604800);
        unit = 'w';
    }

    return `${Math.abs(value)}${unit}`; 
}

