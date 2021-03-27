var console = require('console');
var http = require('http');
var config = require('config');
var fail = require('fail');
var dates = require('dates');

function info_makeURL(programName) {
  //https://todaytv.azurewebsites.net/programinfo?name=아이슬란드간세끼
  let url = 'https://todaytv.azurewebsites.net/programinfo?name=';

  url += encodeURI(programName);

  console.log(url);

  return url;
}

module.exports.function = function getProgramInfo(programName) {

  var options = {
    format: 'json',
    returnHeaders: true,
  };

  //https://todaytv.azurewebsites.net/episode?programName=아는 형님
  //아는형님, 나 혼자 산다, 우아한 가

  url = info_makeURL(programName);

  var response = http.getUrl(url, options);
  if (response.status != 200) {
    throw fail.checkedError("No Information", "NoInfo");
  }

  console.log(response);

  return {
    programName: response.parsed.name,
    programTime: '(' + response.parsed.weekday + ') ' + response.parsed.time,
    programImageUrl: response.parsed.imgURL,
    programIntro: response.parsed.overview,
    programCast: response.parsed.cast,
    programStaff: response.parsed.staff
  };
}
