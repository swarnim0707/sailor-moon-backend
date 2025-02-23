function getLunarPhase({date = null}) {
    try {
        // Base reference: 6th Jan 2000 was a New Moon
        const pastDate = new Date("2000-01-06");
        let dateCheck = date ? new Date(date) : new Date();
        const diff = dateCheck - pastDate;
        const days_diff = Math.floor(diff / (1000 * 60 * 60 * 24)); // Convert to days
        const cycleDuration = 29.530588;

        let moonFraction = days_diff/cycleDuration;
        moonFraction = (moonFraction - Math.floor(moonFraction))*cycleDuration;

        return moonFraction;
    }
    catch (error) {
        console.error("Error calculating lunar fraction:", error.message);
    }
}

function getPhase(moonFraction) {
    if(moonFraction <= 1 || (moonFraction > 28.530588 && moonFraction <= 29.530588)) {return('New Moon')}
    else if(moonFraction > 1 && moonFraction <= 6.382647) {return('Waxing Crescent')}
    else if(moonFraction > 6.382647 && moonFraction <= 8.382647) {return('First Quarter')}
    else if(moonFraction > 8.382647 && moonFraction <= 13.765294) {return('Waxing Gibbous')}
    else if(moonFraction > 13.765294 && moonFraction <= 15.765294) {return('Full Moon')}
    else if(moonFraction > 15.765294 && moonFraction <= 21.147941) {return('Waning Gibbous')}
    else if(moonFraction > 21.147941 && moonFraction <= 23.147941) {return('Last Quarter')}
    else if(moonFraction > 23.147941 && moonFraction <= 28.530588) {return('Waning Crescent')}
    return 'Unknown Phase';
}

function getFavPhaseDates({favPhasesList}) {
    let dateList = {};
    var date = new Date();
    for(let i = 1; i<30; i++) {
        let futureDate = new Date(date);
        futureDate.setDate(date.getDate() + i);

        const moonFraction = getLunarPhase({date: futureDate});
        const phase = getPhase(moonFraction);

        if(favPhasesList.includes(phase) && !dateList.hasOwnProperty(phase)) {
            dateList[phase] = futureDate.toISOString().split("T")[0];;
        }
    }
    return dateList;
}

module.exports = { getLunarPhase, getFavPhaseDates, getPhase };

