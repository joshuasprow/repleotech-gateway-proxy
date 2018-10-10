const fetch = require('isomorphic-unfetch');
const DOMParser = require('xmldom').DOMParser;

const today = (() => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const year = now.getFullYear();

  return `${month}/${date}/${year}`;
})();

/**
 * Hits the platform's endpoint and returns
 * an XML string containing opted-in mobile numbers.
 * @param {string} guid
 * @param {string} keyword
 * @returns {string}
 */
const getXML = async (guid, keyword) => {
  const startDate = '9/8/2018';
  const endDate = today;
  const response = await fetch(
    'http://www.repleotech.com/gateway/xml_opt_in_list.asp?' +
      `guid=${guid}` +
      `&keyword=${keyword}` +
      `&startdate=${startDate}` +
      `&enddate=${endDate}`,
  );
  const xml = await response.text();

  return xml;
};

/**
 * Takes an XML string with opted-in mobile numbers and
 * returns a count.
 * @param {string} xml
 * @returns {number}
 */
const getOptInCount = xml => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  const mobileTags = xmlDoc.getElementsByTagName('mobile');

  return mobileTags.length;
};

/**
 * Takes an optional guid and keyword and returns a count of customers
 * opted in to that keyword.
 * @param {string} guid
 * @param {string} keyword
 * @returns {number}
 */
module.exports = async (guid, keyword) => {
  const xml = await getXML(guid, keyword);
  const optInCount = getOptInCount(xml);

  return optInCount;
};
