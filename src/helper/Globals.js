
export default class Globals {
  static BASE_URL_PROXY = 'http://localhost:8080'; // 9999 with proxyman
  static COMMON_TAGS = ['biohack', 'spartan-race', 'relax', 'eod-mwf', 'not-a-victim', 'checklist'];
  static moveUrl= new URL(this.BASE_URL_PROXY + '/move');
  static movePostUrl= new URL(this.BASE_URL_PROXY + '/move');
  static moveRecordUrlFilterByToday = new URL(this.BASE_URL_PROXY + '/moverecords' + '?weekFilter=CURRENT_DAY');
  static listItemRandomizedUrl = new URL(this.BASE_URL_PROXY + '/list/singlerandom/WORKING_ON_SELF');
}


// let BASE_URL_PROXY = 'http://localhost:8080'; // 9999 with proxyman
//
//
// module.exports = {
//   BASE_URL: 'http://google.com',
//   COLOR_TEXT: 'blue',
//   sleepUrl: new URL(BASE_URL_PROXY + '/sleep'),
//   moveUrl: new URL(BASE_URL_PROXY + '/move'),
//   movePostUrl: new URL(BASE_URL_PROXY + '/move'),
//   moveRecordUrl: new URL(BASE_URL_PROXY + '/moverecords'),
//   moveAggregateUrl: new URL(BASE_URL_PROXY + '/aggregates'),
//   songListItemsUrl: new URL(BASE_URL_PROXY + '/listsong'),
//   listItemsUrl: new URL(BASE_URL_PROXY + '/list'),
//   formDataUrl: new URL(BASE_URL_PROXY + '/form'),
//   fileDataUrl: new URL(BASE_URL_PROXY + '/file'),
//   filePostURL: new URL(BASE_URL_PROXY + '/file')
// };