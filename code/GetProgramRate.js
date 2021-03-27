var console = require('console');
var http = require('http');
var config = require('config');
var fail = require('fail');
var dates = require('dates');
var flag = 0;
var dayOfWeek = new String();

function rate_makeURL(genre, dateTime) {
  //https://todaytv.azurewebsites.net/dailyRate?category=drama&weekday=6
  let url = 'https://todaytv.azurewebsites.net/dailyRate?category=';

  if (genre.toString() == 'entertainment') {
    url += 'entertainment&';
  } else {
    url += 'drama&';
  }

  if (flag == 0) {
    if (dateTime.toString() == 'Sunday') {
      url += 'weekday=0';
      dayOfWeek = "(일)"
    } else if (dateTime.toString() == 'Monday') {
      url += 'weekday=1';
      dayOfWeek = "(월)"
    } else if (dateTime.toString() == 'Tuesday') {
      url += 'weekday=2';
      dayOfWeek = "(화)"
    } else if (dateTime.toString() == 'Wednesday') {
      url += 'weekday=3';
      dayOfWeek = "(수)"
    } else if (dateTime.toString() == 'Thursday') {
      url += 'weekday=4';
      dayOfWeek = "(목)"
    } else if (dateTime.toString() == 'Friday') {
      url += 'weekday=5';
      dayOfWeek = "(금)"
    } else if (dateTime.toString() == 'Saturday') {
      url += 'weekday=6';
      dayOfWeek = "(토)"
    }
  } else {
    url += 'weekday=' + dateTime.getDayOfWeek();

    switch (dateTime.getDayOfWeek()) {
      case 0: dayOfWeek = "(일)"
        break;
      case 1: dayOfWeek = "(월)"
        break;
      case 2: dayOfWeek = "(화)"
        break;
      case 3: dayOfWeek = "(수)"
        break;
      case 4: dayOfWeek = "(목)"
        break;
      case 5: dayOfWeek = "(금)"
        break;
      case 6: dayOfWeek = "(토)"
        break;
    }
  }

  console.log(url);

  return url;
}

module.exports.function = function getProgramRate(dateTime, programGenre, point) {

  if (!dateTime) {
    dateTime = new dates.ZonedDateTime(point);
    flag += 1;
  }

  console.log(dateTime);
  console.log(programGenre);

  var options = {
    format: 'json',
    returnHeaders: true,
  };

  url = rate_makeURL(programGenre, dateTime);

  var response = http.getUrl(url, options);
  if (response.status != 200) {
    throw fail.checkedError("No Information", "NoInfo");
  }

  console.log(response);

  let result = [];

  for (var i = 0; i < response.parsed.length; i++) {
    result.push({
      programName: '[' + response.parsed[i].channel + '] ' + response.parsed[i].ProgramName.toString(),
      programRate: response.parsed[i].rate,
      programTime: dayOfWeek + ' ' + response.parsed[i].time,
      programGenre: programGenre,
      programImageUrl: response.parsed[i].imgURL,
      programIntro: response.parsed[i].overview,
      programCast: response.parsed[i].cast,
      programStaff: response.parsed[i].staff,
      dayofweek : dayOfWeek
    });
    console.log(response.parsed[i].overview);
    console.log(response.parsed[i].ProgramName);
  }

  return result;

}
