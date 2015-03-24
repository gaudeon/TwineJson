/**
* TwineJson - Twine 2 Json Export Story Format
* By Cauli Tomaz for Páprica
* http://cau.li/ 
* http://www.papricacomunicacao.com.br
*
* Based on Entweedle by Michael McCollum
* Copyright (c) 2015 Michael McCollum
* http://www.maximumverbosity.net/twine/Illume/
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
* associated documentation files (the "Software"), to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial
* portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
* LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
window.onload = function() {
	if (typeof(window.TwineJson) == "undefined") {

		window.TwineJson = {

			convert: function() {
				var output = window.document.getElementById("output");

				output.innerHTML = this.export();
			},

			
			export: function() {
				var buffer = [];

				buffer.push("[\r\n"); // Opening JSON

				var storyData = window.document.getElementsByTagName("tw-storydata");
				if (storyData) {
					buffer.push(this.buildPassage("StoryTitle","",storyData[0].getAttribute("name")));
				}

				var userScript = window.document.getElementById("twine-user-script");
				if (userScript) {
					buffer.push(this.buildPassage("UserScript","script",userScript.innerHTML));
				}

				var userStylesheet = window.document.getElementById("twine-user-stylesheet");
				if (userStylesheet) {
					buffer.push(this.buildPassage("UserStylesheet","stylesheet",userStylesheet.innerHTML));
				}

				var passages = window.document.getElementsByTagName("tw-passagedata");
				for (var i = 0; i < passages.length; ++i) {
					buffer.push(this.buildPassageFromElement(passages[i], i, passages.length));
				}

				buffer.push("]\r\n"); // Opening JSON

				return buffer.join('');
			},

			
			buildPassageFromElement: function(passage, index, howManyPassages) {
				var last = false;
				
				if(index+1 == howManyPassages) {
					last = true;
				}
				
				var name = passage.getAttribute("name");
				if (!name) {
					name = "Untitled Passage";
				}

				var tags = passage.getAttribute("tags");
				var content = passage.textContent;
				
				return this.buildPassage(name, tags, content, last);
			},
	
	
			buildPassage: function(title, tags, content, last) {
				var result = [];
				
				result.push("{\r\n");

				result.push("\t\"name\" : ");
				result.push("\"",title,"\"");

				if (tags) {
					result.push(",\r\n");
					result.push("\t\"tags\" : ");
					result.push("\"[",tags,"]\"");
				}

				/* Push the content */
				result.push(",\r\n");
				result.push("\t\"content\" : ");
				result.push("\"", this.scrub(content),"\",\r\n");
				
				result.push("\t\"children\" : ");
				result.push("\"", this.findChildren(content),"\"\r\n");
				
				if (!last) {
					result.push("},\r\n");
				} else {
					result.push("}\r\n");
				}

				return result.join('');
			},

			scrub: function(content) {
				if (content)
				{
					content = content.replace(/^\"/gm, "\'");
					// Removes all line breaks
					content = content.replace(/(\r\n|\n|\r)/gm,"  ");
				}
				return content;
			},

			findChildren: function(content) {
				var children = /\[\[(.+)\]\]/gm.execAll(content);
				return children;
			}

		}			
	}
	
	window.TwineJson.convert();
}	


RegExp.prototype.execAll = function(string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        var matchArray = [];
        for (i in match) {
            if (parseInt(i) == i) {
                matchArray.push(match[i]);
            }
        }
        matches.push(matchArray);
    }
    return matches;
}