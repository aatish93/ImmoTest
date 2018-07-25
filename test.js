//https://www.magicbricks.com/property-for-sale/residential-real-estate?proptype=Multistorey-Apartment,Builder-Floor-Apartment,Penthouse,Studio-Apartment&Locality=Panjim&cityName=Goa&BudgetMin=1-Crores&BudgetMax=2-Crores

var request = require('request');
var fs = require("fs");
var readline = require('readline-sync');
const cheerio = require('cheerio');

var cityName = readline.question("Enter City/State:");
var locality = readline.question("Enter locality:");

request('https://www.magicbricks.com/property-for-sale/residential-real-estate?proptype=Multistorey-Apartment,Builder-Floor-Apartment,Penthouse,Studio-Apartment,Residential-House,Villa&Locality='+locality+'&cityName='+cityName, function (error, response, body) {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);
  var flatData=getFlatData(body);
  console.log(flatData);
  writeToFile(flatData);

});

function writeToFile(flatDetails){
	fs.writeFile('data.csv', flatDetails,  function(err) {
	   if (err) {
	      return console.error(err);
	   }
	   console.log("Data written successfully to data.csv.");
	});
}

function getFlatData(body){
  var respBody = cheerio.load(body);
  var contentName,contentNoOfRooms,contentLocality,i,j,listOfNames=new Array(),listOfRoomNo=new Array(),listOfLocality=new Array(),len,finalOutput="";
  var propertryNames = respBody(".m-srp-card__title__bhk");
  var noOfRooms=respBody("*[itemprop = 'numberOfRooms']");
  var locality=respBody("*[itemprop = 'addressLocality']");
  j=0;
  for(i=0;i<propertryNames.length;i++){
	  contentName = respBody(propertryNames[i]).text();
	  if (!isNaN(parseInt(contentName.charAt(1)))){
	  	listOfNames[j]=contentName.substring(1,contentName.length - 1);
	  	j++;
	  }
  }
  len=j;
  j=0;
  for(i=0;i<noOfRooms.length;i++){
	  contentNoOfRooms=respBody(noOfRooms[i]).attr('content');
	  if (!isNaN(parseInt(contentNoOfRooms))){
	  	listOfRoomNo[j]=contentNoOfRooms;
	  	j++;
	  }
  }
  j=0;
  for(i=0;i<len;i++){
	  contentLocality=respBody(locality[i]).attr('content');
	  listOfLocality[j]=contentLocality;
	  j++;
  }
  for(i=0;i<len;i++){
	  finalOutput=finalOutput + (listOfNames[i] +";Number of Rooms:"+ listOfRoomNo[i] +";Address Locality:"+ listOfLocality[i] +"\n");
  }
  return finalOutput;
}