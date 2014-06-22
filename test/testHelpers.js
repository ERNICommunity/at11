module.exports.setWeekDates = function(mockDate) {
    global.dates = [];
    for(var i = 1; i < 6; i++) {
        global.dates.push(mockDate.clone().startOf('week').day(i));
    }
}