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
  var contentName,contentNoOfRooms,contentLocality,contentPrice,contentFloorSize,i,j,listOfNames=new Array(),listOfRoomNo=new Array(),listOfLocality=new Array(),listOfPrices=new Array(),listOfFloorSize=new Array(),len,finalOutput="City; Number of rooms; Floor Size; Price\n";
  var propertryNames = respBody(".m-srp-card__title__bhk");
  var noOfRooms=respBody("*[itemprop = 'numberOfRooms']");
  var locality=respBody("*[itemprop = 'addressLocality']");
  var price=respBody(".m-srp-card__price");
  var floorSize=respBody("*[itemprop = 'floorSize']");
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
  j=0;
  for(i=0;i<(len*2);i=i+2){
	  contentPrice=respBody(price[i]).text();
	  if (isNaN(parseInt(contentPrice.charAt(0)))){
	  	i--;
	  	contentPrice=contentPrice.substring(1,contentPrice.length - 1);
	  }
	  listOfPrices[j]=contentPrice;
	  j++;
  }
  j=0;
  for(i=0;i<len;i++){
	  contentFloorSize=respBody(floorSize[i]).attr('content');
	  listOfFloorSize[j]=contentFloorSize;
	  j++;
  }
  for(i=0;i<len;i++){
	  finalOutput=finalOutput + (listOfLocality[i] +"; "+ listOfRoomNo[i]+"; "+ listOfFloorSize[i] +"; "+ listOfPrices[i]+"\n");
  		
  }
  return finalOutput;
}