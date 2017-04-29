function beautifulstew(file) {

/*
We create the beautifulstew instance by accepting the response from a http request like a file to be parsed.
We assign the response value to the file property of the beautifulstew instance.
*/

this.file = file


/*
The parseFile method is used for removing new line feeds, carriage returns and unnecessary tabs from the this.file property
It as well creates a data property that is utilized in carrying out other processes in the beautifulstew instance.
the parseFile method breaks the file property into elementary tags and returns an array of html tags and their corresponding contents.
*/
this.parseFile = function (){
var d = String(this.file);
  d = d.split(/\r+|\n+|\t+/)
  d = d.join('')

  var h = d.split(/>\s*</);
  this.data = h;

for(var i =0; i< h.length; i++){
  if(i !==0 && i !==h.length-1) {
    var u = h[i].split(' '); u.unshift('<'); u.push('>');
    h[i] = u.join(' ');
  }
  else if(i ==0) {
    var u = h[i].split(' ');
    u.push('>');
    h[i] = u.join(' ');
  }
  else if(i==h.length-1) {
    var u = h[i].split(' ');
    u.unshift('<');
    h[i] = u.join(' ');
  }

}
  return h;
}

/*
the findTag method is used to get any tag of choice from the file property.
it extracts any tag of choice from the response string and if the second argument is given,it specifically finds the tag with the given attribute values.
it strongly makes use of regular expressions to filter out the desire tags. if only one argument is parsed and if the argument is a tag element, it returns
an array of elements and their contents with the given tag name and if the second argument is as well given, it returns all elements with the given tag name
and corresponding attribute values.
*/
this.findTag = function (tag,attrValue){
  var collector = []; var d = 8;
  var newCol = []; // this is for holding elements that fit the criteria
  var h = this.parseFile(this.file);
  var newReg = new RegExp('<\\s*'+tag+'\\b[^<>]*\\s*\/?\\s*>','im')
  var checker  = new RegExp('<\\s*script\\b.*>','im');
    if(arguments.length==1){
      for(var i = 0; i< h.length; i++){
        if(newReg.test(JSON.stringify(h[i]))){
          newCol.push({tag:h[i],index:i})

      }
    }
      } // this is for when we are given both a tag and the corresponding attributes needed.
    else if(arguments.length==2){
      var regExpPattern = new RegExp(Object.keys(attrValue)[0]+'\\s*=\'?\"?.*\\b'+attrValue[Object.keys(attrValue)[0]]+'\\b','im');
      for(var i = 0; i< h.length; i++){
        if (regExpPattern.test(h[i]))
        collector.push({tag:h[i],index:i})
      }
      for(var i = 0; i< collector.length; i++){

        if(newReg.test(JSON.stringify(collector[i]['tag'])))
          newCol.push(collector[i]);
      }
  }
  var holder = []; // this variable is  meant to hold all the elements of the given tag and their corresponding textContent.
  var finalCheck = new RegExp('.*<\\s*\/\\s*'+tag+'\\s*>','im')

  var singleTags = ['img','br','link','hr','meta','input']
  // this part is to extract the children of the tag from the code.
  // it searches the array so as to collate all the children from it an peg them together.
   for(var i = 0; i < newCol.length; i++){
    var temp = 0;
    for(var u = newCol[i]['index']; u < h.length; u++){
      if(newReg.test(h[u]) && singleTags.indexOf(tag) !== -1){
        holder.push(newCol[i]);
        break;
      }
      else if(newReg.test(h[u]) && finalCheck.test(h[u]) && u !== newCol[i]['index'])
        continue;
      else if (newReg.test(h[u]) && finalCheck.test(h[u]) && u === newCol[i]['index']){
        holder.push(newCol[i])
        break;
      }
      else if(!newReg.test(h[u]) && !finalCheck.test(h[u]))
        continue;
      else if (newReg.test(h[u]) && u !== newCol[i]['index']){
         temp +=1;
        continue;
      }
      else if(finalCheck.test(h[u]) && temp){
        temp -= 1 ;
        continue;
      }

      else if(finalCheck.test(h[u]) ){
        newCol[i]['tag'] += h.slice(newCol[i]['index']+1,u+1).join(' ');
        holder.push(newCol[i])
        break;
      }
    }
  }
  this.tag = tag;
  this.attrValue = attrValue;
  this.tag = tag;
  this.tags = holder;
  return holder;

}
/*
  the getAttributes method is used to get the specific contents we want from the return tags of the findTag method.
  we can decide to get the class or id or href or any attribute of our choice but if we specify the attribute name as data,
  we specifically get the innerHTML value of the given tag.
*/
this.getAttributes = function(href,a){
  var tags = this.tags;
  var returnArray = [];
  var regExpFinal = new RegExp('\\b'+href+'\\s*=\\s*'+'\'?\"?([^=\'\"]*)\'?\"?\\b','im');
  var mainData = new RegExp('<\\s*'+this.tag+ '[^><]*?>(.*)<\\s*\/'+this.tag+'\\s*>','im')
  for(var i = 0; i < tags.length; i++){
    if(href == 'data'){
      var match = tags[i]['tag'].match(mainData);
      if(match == null || match == undefined)
        continue;
      else
        returnArray.push(match[1])
    }
    else{
      var match = tags[i]['tag'].match(regExpFinal);
      if(match == null)
        continue;
      else
        returnArray.push(match[1]);
    }
  }
 return returnArray;
}
/*
  this function pretty prints the contents of the HTML response and removes all tags including script and style tags so that we can read the
  raw content of the http response.
  It removes all html formatting and returns the raw content.
*/
 this.strings = function(){
  var collector = [];
  var newCol = []; // this is for holding elements that fit the criteria
  var newReg = /<\s*(script|style)\b/im;
   var h = this.data;
     for(var i = 0; i< h.length; i++){
        if(newReg.test(h[i])){
          newCol.push({tag:h[i],index:i})
      }
      }
   var finalCheck = /.*<\s*\/\s*(script|style)\s*>/im;

  var temp = 0;
   for(var i = 0; i < newCol.length; i++){
    var temp = 0;
    for(var u = newCol[i]['index']; u < h.length; u++){
      if(newReg.test(h[u]) && finalCheck.test(h[u]) && u !== newCol[i]['index']){
        h[u] = ' ';
        continue;
      }
      else if (newReg.test(h[u]) && finalCheck.test(h[u]) && u === newCol[i]['index']){
        newCol[i]['diff'] = u
        h[u] = ' ';
        break;
      }
      else if (newReg.test(h[u]) && u !== newCol[i]['index']){
        h[u] = ' ';
         temp +=1;
        continue;
      }
      else if(!newReg.test(h[u]) && !finalCheck.test(h[u])){
        h[u] = ' ';
        continue;
      }
      else if(finalCheck.test(h[u]) && temp){
        h[u] = ' ';
        temp -= 1 ;
        continue;
      }

      else if(finalCheck.test(h[u]) ){
        newCol[i]['diff'] = u
        h[u] = ' ';
        break;
      }
    }
  }


    var strip = /<[^<>]*>|&lt;[^<>]*&gt;/gim;
    this.data = h.join('').replace(strip,' ');
    return this.data;
}

}

module.exports = beautifulstew;
