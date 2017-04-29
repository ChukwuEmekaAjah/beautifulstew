# BeautifulStew documentation.

## Author
Ajah, Chukwuemeka

## Contacts
chukwuemekaajah on npmJS
chukwuemekaajah on github

## Install

    $ npm install beautifulstew

## Usage
This is a library used for web scraping and any other use that the smart developers all over the world can think of. It helps the developer to select and extract content that is relevant to him/her from the http response of a web request.

#### Motivation for the Library
The motivation for this library is from the fact that the python community has a cool web scraping library called beautifulsoup and so I decided to replicate such in the JavaScript community even though I know that this library is nowhere near the functionalities of the beautifulsoup library.


## Documentation

## To create an instance of the beautifulstew:
You can use any http request libray of choice.
For example using the nodejs request library
	var beautifulstew = require('beautifulstew');
  var request = require('request');
  request('www.google.com.ng',function(err,response,body){
    if(!err && response.statusCode == 200){
      var stew = new beautifulstew(body);
    }
    })

## To get a particular set of tags
  var request = require('request');
  request('www.google.com.ng',function(err,response,body){
    if(!err && response.statusCode == 200){
      var stew = new beautifulstew(body);
      var tag = stew.findTag('a',{href:'google.com'})
      console.log(tag);
    }
    })

	the first argument is a html valid tag and it can be the only argument or we can include a second argument
	which is an object with a html attribute name and value.

## To get a particular attribute from an html tag
    var request = require('request');
    request('www.google.com.ng',function(err,response,body){
      if(!err && response.statusCode == 200){
        var stew = new beautifulstew(body);
        stew.findTag('a',{href:'google.com'})
        var tag = stew.getAttributes()
        console.log(tag);
      }
      })

  	the first argument is a html valid tag and it can be the only argument or we can include a second argument
  	which is an object with a html attribute name and value. It returns an array of attributes and their values that match your query.

## To get the raw content from the http response body without the html formatting
    var request = require('request');
    request('www.google.com.ng',function(err,response,body){
      if(!err && response.statusCode == 200){
        var stew = new beautifulstew(body);
        var bareContent = stew.strips();
        console.log(bareContent);
        }
      });

      this returns the raw content of the http response body without any form of html formatting.It is cool when you want to use it in reading news on your command prompt or when you are scrapping a particular site for its main contents.

"# beautifulstew"
