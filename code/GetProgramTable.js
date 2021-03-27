var console = require('console');
var http = require('http');
var config = require('config');
var fail = require('fail');
var dates = require('dates');
var flag = 0;

function table_makeURL(channel, dateTime) {
  //https://todaytv.azurewebsites.net/epg?channel=SBS&date=20191010
  let url = 'https://todaytv.azurewebsites.net/epg?';

  url += 'channel=' + encodeURI(channel);
  url += '&date=' + dateTime.getYear() + dateTime.getMonth();

  var temp = String(dateTime.getDay());

  if (temp.length == 1) {
    url += '0' + dateTime.getDay()
  } else {
    url += dateTime.getDay()
  }
  console.log(url);

  return url;
}

function get_dayofweek(dateTime) {

  var dayOfWeek = new String();

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

  return dayOfWeek;
}

module.exports.function = function getProgramTable(dateTime, channelName, point) {

  dateTime = new dates.ZonedDateTime(point);

  console.log(dateTime);
  var options = {
    format: 'json',
    returnHeaders: true,
  };
  url = table_makeURL(channelName, dateTime);

  var response = http.getUrl(url, options);
  if (response.status != 200) {
    throw fail.checkedError("No Information", "NoInfo");
  }

  var imageDate = require("./data/ImageData.js");
  var imageUrl = new String();

  imageDate.forEach(function (element) {
    if (element.name == channelName) {
      imageUrl = element.image;
      console.log(element.image);
    }
  })

  console.log(imageUrl);

  let result = [];

  let value = {
    programImageUrl: imageUrl,
    channelName: channelName,
    programTime: dateTime.getMonth() + '.' + dateTime.getDay() + get_dayofweek(dateTime),
    temp: [],
    first: []
  };

  for (var i = 0; i < response.parsed.length; i++) {
    var str = response.parsed[i].Time.split(':');
    if (dateTime.getHour() <= parseInt(str[0])) {
      if (dateTime.getHour() == parseInt(str[0])) {
        if (dateTime.getMinute() <= parseInt(str[1])) {
          value.first.push(response.parsed[i - 1].Time + "  :  " + response.parsed[i - 1].ProgramName);
          // result.push({
          //   programName: response.parsed[i - 1].ProgramName.toString().replace(channelName.toString(), ''),
          //   channelName: channelName,
          //   programTime: response.parsed[i - 1].Time,
          //   dateTime: dateTime._internals.dateTimeExpression
          // });
        }
      }
      if (flag == 0) {
        value.first.push(response.parsed[i - 1].Time + "  :  " + response.parsed[i - 1].ProgramName);
        flag = 1;
      } else {
        value.temp.push(response.parsed[i].Time + "  :  " + response.parsed[i].ProgramName);
      }
      // result.push({
      //   programName: response.parsed[i].ProgramName.toString().replace(channelName.toString(), ''),
      //   channelName: channelName,
      //   programTime: response.parsed[i].Time,
      //   dateTime: dateTime._internals.dateTimeExpression
      // });
      console.log(response.parsed[i].Time);
      console.log(response.parsed[i].ProgramName);
    }
  }

  console.log(value);

  console.log(response);

  return value;
}
