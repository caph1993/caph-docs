//libraries/lzutf8-0.5.5/lzutf8.min.js
exports={};
/*!
 LZ-UTF8 v0.5.5

 Copyright (c) 2018, Rotem Dan
 Released under the MIT license.

 Build date: 2018-07-30 

 Please report any issue at https://github.com/rotemdan/lzutf8.js/issues
*/
var LZUTF8;if(function(n){n.runningInNodeJS=function(){return"object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node},n.runningInMainNodeJSModule=function(){return n.runningInNodeJS()&&require.main===module},n.commonJSAvailable=function(){return"object"==typeof module&&"object"==typeof module.exports},n.runningInWebWorker=function(){return"undefined"==typeof window&&"object"==typeof self&&"function"==typeof self.addEventListener&&"function"==typeof self.close},n.runningInNodeChildProcess=function(){return n.runningInNodeJS()&&"function"==typeof process.send},n.runningInNullOrigin=function(){return"object"==typeof window&&"object"==typeof window.location&&("http:"!==document.location.protocol&&"https:"!==document.location.protocol)},n.webWorkersAvailable=function(){return"function"==typeof Worker&&!n.runningInNullOrigin()&&(!n.runningInNodeJS()&&!(navigator&&navigator.userAgent&&0<=navigator.userAgent.indexOf("Android 4.3")))},n.log=function(e,t){void 0===t&&(t=!1),"object"==typeof console&&(console.log(e),t&&"object"==typeof document&&(document.body.innerHTML+=e+"<br/>"))},n.createErrorMessage=function(e,t){if(void 0===t&&(t="Unhandled exception"),null==e)return t;if(t+=": ","object"==typeof e.content){if(n.runningInNodeJS())return t+e.content.stack;var r=JSON.stringify(e.content);return"{}"!==r?t+r:t+e.content}return"string"==typeof e.content?t+e.content:t+e},n.printExceptionAndStackTraceToConsole=function(e,t){void 0===t&&(t="Unhandled exception"),n.log(n.createErrorMessage(e,t))},n.getGlobalObject=function(){return"object"==typeof global?global:"object"==typeof window?window:"object"==typeof self?self:{}},n.toString=Object.prototype.toString,n.commonJSAvailable()&&(module.exports=n)}(LZUTF8||(LZUTF8={})),"function"==typeof Uint8Array&&0!==new Uint8Array(1).subarray(1).byteLength){var subarray=function(e,t){var r=function(e,t,r){return e<t?t:r<e?r:e};e|=0,t|=0,arguments.length<1&&(e=0),arguments.length<2&&(t=this.length),e<0&&(e=this.length+e),t<0&&(t=this.length+t),e=r(e,0,this.length);var n=(t=r(t,0,this.length))-e;return n<0&&(n=0),new this.constructor(this.buffer,this.byteOffset+e*this.BYTES_PER_ELEMENT,n)},types=["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"],globalObject=void 0;if("object"==typeof window?globalObject=window:"object"==typeof self&&(globalObject=self),void 0!==globalObject)for(var i=0;i<types.length;i++)globalObject[types[i]]&&(globalObject[types[i]].prototype.subarray=subarray)}!function(f){var e=function(){function e(){}return e.compressAsync=function(e,n,o){var i=new f.Timer,u=new f.Compressor;if(!o)throw new TypeError("compressAsync: No callback argument given");if("string"==typeof e)e=f.encodeUTF8(e);else if(null==e||!(e instanceof Uint8Array))return void o(void 0,new TypeError("compressAsync: Invalid input argument, only 'string' and 'Uint8Array' are supported"));var s=f.ArrayTools.splitByteArray(e,n.blockSize),a=[],c=function(e){if(e<s.length){var t=void 0;try{t=u.compressBlock(s[e])}catch(e){return void o(void 0,e)}a.push(t),i.getElapsedTime()<=20?c(e+1):(f.enqueueImmediate(function(){return c(e+1)}),i.restart())}else{var r=f.ArrayTools.concatUint8Arrays(a);f.enqueueImmediate(function(){var e;try{e=f.CompressionCommon.encodeCompressedBytes(r,n.outputEncoding)}catch(e){return void o(void 0,e)}f.enqueueImmediate(function(){return o(e)})})}};f.enqueueImmediate(function(){return c(0)})},e.createCompressionStream=function(){var o=new f.Compressor,i=new(window.stream.Transform)({decodeStrings:!0,highWaterMark:65536});return i._transform=function(e,t,r){var n;try{n=f.BufferTools.uint8ArrayToBuffer(o.compressBlock(f.BufferTools.bufferToUint8Array(e)))}catch(e){return void i.emit("error",e)}i.push(n),r()},i},e}();f.AsyncCompressor=e}(LZUTF8||(LZUTF8={})),function(f){var e=function(){function e(){}return e.decompressAsync=function(e,n,o){if(!o)throw new TypeError("decompressAsync: No callback argument given");var i=new f.Timer;try{e=f.CompressionCommon.decodeCompressedBytes(e,n.inputEncoding)}catch(e){return void o(void 0,e)}var u=new f.Decompressor,s=f.ArrayTools.splitByteArray(e,n.blockSize),a=[],c=function(e){if(e<s.length){var t=void 0;try{t=u.decompressBlock(s[e])}catch(e){return void o(void 0,e)}a.push(t),i.getElapsedTime()<=20?c(e+1):(f.enqueueImmediate(function(){return c(e+1)}),i.restart())}else{var r=f.ArrayTools.concatUint8Arrays(a);f.enqueueImmediate(function(){var e;try{e=f.CompressionCommon.encodeDecompressedBytes(r,n.outputEncoding)}catch(e){return void o(void 0,e)}f.enqueueImmediate(function(){return o(e)})})}};f.enqueueImmediate(function(){return c(0)})},e.createDecompressionStream=function(){var o=new f.Decompressor,i=new(window.stream.Transform)({decodeStrings:!0,highWaterMark:65536});return i._transform=function(e,t,r){var n;try{n=f.BufferTools.uint8ArrayToBuffer(o.decompressBlock(f.BufferTools.bufferToUint8Array(e)))}catch(e){return void i.emit("error",e)}i.push(n),r()},i},e}();f.AsyncDecompressor=e}(LZUTF8||(LZUTF8={})),function(i){var e,u;(u=e=i.WebWorker||(i.WebWorker={})).compressAsync=function(e,t,r){if("ByteArray"!=t.inputEncoding||e instanceof Uint8Array){var n={token:Math.random().toString(),type:"compress",data:e,inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding},o=function(e){var t=e.data;t&&t.token==n.token&&(u.globalWorker.removeEventListener("message",o),"error"==t.type?r(void 0,new Error(t.error)):r(t.data))};u.globalWorker.addEventListener("message",o),u.globalWorker.postMessage(n,[])}else r(void 0,new TypeError("compressAsync: input is not a Uint8Array"))},u.decompressAsync=function(e,t,r){var n={token:Math.random().toString(),type:"decompress",data:e,inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding},o=function(e){var t=e.data;t&&t.token==n.token&&(u.globalWorker.removeEventListener("message",o),"error"==t.type?r(void 0,new Error(t.error)):r(t.data))};u.globalWorker.addEventListener("message",o),u.globalWorker.postMessage(n,[])},u.installWebWorkerIfNeeded=function(){"object"==typeof self&&void 0===self.document&&null!=self.addEventListener&&(self.addEventListener("message",function(e){var t=e.data;if("compress"==t.type){var r=void 0;try{r=i.compress(t.data,{outputEncoding:t.outputEncoding})}catch(e){return void self.postMessage({token:t.token,type:"error",error:i.createErrorMessage(e)},[])}(n={token:t.token,type:"compressionResult",data:r,encoding:t.outputEncoding}).data instanceof Uint8Array&&-1===navigator.appVersion.indexOf("MSIE 10")?self.postMessage(n,[n.data.buffer]):self.postMessage(n,[])}else if("decompress"==t.type){var n,o=void 0;try{o=i.decompress(t.data,{inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding})}catch(e){return void self.postMessage({token:t.token,type:"error",error:i.createErrorMessage(e)},[])}(n={token:t.token,type:"decompressionResult",data:o,encoding:t.outputEncoding}).data instanceof Uint8Array&&-1===navigator.appVersion.indexOf("MSIE 10")?self.postMessage(n,[n.data.buffer]):self.postMessage(n,[])}}),self.addEventListener("error",function(e){i.log(i.createErrorMessage(e.error,"Unexpected LZUTF8 WebWorker exception"))}))},u.createGlobalWorkerIfNeeded=function(){if(u.globalWorker)return!0;if(!i.webWorkersAvailable())return!1;if(!u.scriptURI&&"object"==typeof document){var e=document.getElementById("lzutf8");null!=e&&(u.scriptURI=e.getAttribute("src")||void 0)}return!!u.scriptURI&&(u.globalWorker=new Worker(u.scriptURI),!0)},u.terminate=function(){u.globalWorker&&(u.globalWorker.terminate(),u.globalWorker=void 0)},e.installWebWorkerIfNeeded()}(LZUTF8||(LZUTF8={})),function(e){var t=function(){function e(e,t,r){this.container=e,this.startPosition=t,this.length=r}return e.prototype.get=function(e){return this.container[this.startPosition+e]},e.prototype.getInReversedOrder=function(e){return this.container[this.startPosition+this.length-1-e]},e.prototype.set=function(e,t){this.container[this.startPosition+e]=t},e}();e.ArraySegment=t}(LZUTF8||(LZUTF8={})),function(e){var t;(t=e.ArrayTools||(e.ArrayTools={})).copyElements=function(e,t,r,n,o){for(;o--;)r[n++]=e[t++]},t.zeroElements=function(e,t,r){for(;r--;)e[t++]=0},t.countNonzeroValuesInArray=function(e){for(var t=0,r=0;r<e.length;r++)e[r]&&t++;return t},t.truncateStartingElements=function(e,t){if(e.length<=t)throw new RangeError("truncateStartingElements: Requested length should be smaller than array length");for(var r=e.length-t,n=0;n<t;n++)e[n]=e[r+n];e.length=t},t.doubleByteArrayCapacity=function(e){var t=new Uint8Array(2*e.length);return t.set(e),t},t.concatUint8Arrays=function(e){for(var t=0,r=0,n=e;r<n.length;r++)t+=(a=n[r]).length;for(var o=new Uint8Array(t),i=0,u=0,s=e;u<s.length;u++){var a=s[u];o.set(a,i),i+=a.length}return o},t.splitByteArray=function(e,t){for(var r=[],n=0;n<e.length;){var o=Math.min(t,e.length-n);r.push(e.subarray(n,n+o)),n+=o}return r}}(LZUTF8||(LZUTF8={})),function(e){var t;(t=e.BufferTools||(e.BufferTools={})).convertToUint8ArrayIfNeeded=function(e){return"function"==typeof Buffer&&Buffer.isBuffer(e)?t.bufferToUint8Array(e):e},t.uint8ArrayToBuffer=function(e){if(Buffer.prototype instanceof Uint8Array){var t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);return Object.setPrototypeOf(t,Buffer.prototype),t}for(var r=e.length,n=new Buffer(r),o=0;o<r;o++)n[o]=e[o];return n},t.bufferToUint8Array=function(e){if(Buffer.prototype instanceof Uint8Array)return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);for(var t=e.length,r=new Uint8Array(t),n=0;n<t;n++)r[n]=e[n];return r}}(LZUTF8||(LZUTF8={})),function(o){var e;(e=o.CompressionCommon||(o.CompressionCommon={})).getCroppedBuffer=function(e,t,r,n){void 0===n&&(n=0);var o=new Uint8Array(r+n);return o.set(e.subarray(t,t+r)),o},e.getCroppedAndAppendedByteArray=function(e,t,r,n){return o.ArrayTools.concatUint8Arrays([e.subarray(t,t+r),n])},e.detectCompressionSourceEncoding=function(e){if(null==e)throw new TypeError("detectCompressionSourceEncoding: input is null or undefined");if("string"==typeof e)return"String";if(e instanceof Uint8Array||"function"==typeof Buffer&&Buffer.isBuffer(e))return"ByteArray";throw new TypeError("detectCompressionSourceEncoding: input must be of type 'string', 'Uint8Array' or 'Buffer'")},e.encodeCompressedBytes=function(e,t){switch(t){case"ByteArray":return e;case"Buffer":return o.BufferTools.uint8ArrayToBuffer(e);case"Base64":return o.encodeBase64(e);case"BinaryString":return o.encodeBinaryString(e);case"StorageBinaryString":return o.encodeStorageBinaryString(e);default:throw new TypeError("encodeCompressedBytes: invalid output encoding requested")}},e.decodeCompressedBytes=function(e,t){if(null==t)throw new TypeError("decodeCompressedData: Input is null or undefined");switch(t){case"ByteArray":case"Buffer":var r=o.BufferTools.convertToUint8ArrayIfNeeded(e);if(!(r instanceof Uint8Array))throw new TypeError("decodeCompressedData: 'ByteArray' or 'Buffer' input type was specified but input is not a Uint8Array or Buffer");return r;case"Base64":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'Base64' input type was specified but input is not a string");return o.decodeBase64(e);case"BinaryString":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'BinaryString' input type was specified but input is not a string");return o.decodeBinaryString(e);case"StorageBinaryString":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'StorageBinaryString' input type was specified but input is not a string");return o.decodeStorageBinaryString(e);default:throw new TypeError("decodeCompressedData: invalid input encoding requested: '"+t+"'")}},e.encodeDecompressedBytes=function(e,t){switch(t){case"String":return o.decodeUTF8(e);case"ByteArray":return e;case"Buffer":if("function"!=typeof Buffer)throw new TypeError("encodeDecompressedBytes: a 'Buffer' type was specified but is not supported at the current envirnment");return o.BufferTools.uint8ArrayToBuffer(e);default:throw new TypeError("encodeDecompressedBytes: invalid output encoding requested")}}}(LZUTF8||(LZUTF8={})),function(o){var t,e,i,u;e=t=o.EventLoop||(o.EventLoop={}),u=[],e.enqueueImmediate=function(e){u.push(e),1===u.length&&i()},e.initializeScheduler=function(){var t=function(){for(var e=0,t=u;e<t.length;e++){var r=t[e];try{r.call(void 0)}catch(e){o.printExceptionAndStackTraceToConsole(e,"enqueueImmediate exception")}}u.length=0};if(o.runningInNodeJS()&&(i=function(){return setImmediate(function(){return t()})}),"object"==typeof window&&"function"==typeof window.addEventListener&&"function"==typeof window.postMessage){var e,r="enqueueImmediate-"+Math.random().toString();window.addEventListener("message",function(e){e.data===r&&t()}),e=o.runningInNullOrigin()?"*":window.location.href,i=function(){return window.postMessage(r,e)}}else if("function"==typeof MessageChannel&&"function"==typeof MessagePort){var n=new MessageChannel;n.port1.onmessage=function(){return t()},i=function(){return n.port2.postMessage(0)}}else i=function(){return setTimeout(function(){return t()},0)}},e.initializeScheduler(),o.enqueueImmediate=function(e){return t.enqueueImmediate(e)}}(LZUTF8||(LZUTF8={})),function(e){var r;(r=e.ObjectTools||(e.ObjectTools={})).override=function(e,t){return r.extend(e,t)},r.extend=function(e,t){if(null==e)throw new TypeError("obj is null or undefined");if("object"!=typeof e)throw new TypeError("obj is not an object");if(null==t&&(t={}),"object"!=typeof t)throw new TypeError("newProperties is not an object");if(null!=t)for(var r in t)e[r]=t[r];return e}}(LZUTF8||(LZUTF8={})),function(o){o.getRandomIntegerInRange=function(e,t){return e+Math.floor(Math.random()*(t-e))},o.getRandomUTF16StringOfLength=function(e){for(var t="",r=0;r<e;r++){for(var n=void 0;55296<=(n=o.getRandomIntegerInRange(0,1114112))&&n<=57343;);t+=o.Encoding.CodePoint.decodeToString(n)}return t}}(LZUTF8||(LZUTF8={})),function(e){var t=function(){function e(e){void 0===e&&(e=1024),this.outputBufferCapacity=e,this.outputPosition=0,this.outputString="",this.outputBuffer=new Uint16Array(this.outputBufferCapacity)}return e.prototype.appendCharCode=function(e){this.outputBuffer[this.outputPosition++]=e,this.outputPosition===this.outputBufferCapacity&&this.flushBufferToOutputString()},e.prototype.appendCharCodes=function(e){for(var t=0,r=e.length;t<r;t++)this.appendCharCode(e[t])},e.prototype.appendString=function(e){for(var t=0,r=e.length;t<r;t++)this.appendCharCode(e.charCodeAt(t))},e.prototype.appendCodePoint=function(e){if(e<=65535)this.appendCharCode(e);else{if(!(e<=1114111))throw new Error("appendCodePoint: A code point of "+e+" cannot be encoded in UTF-16");this.appendCharCode(55296+(e-65536>>>10)),this.appendCharCode(56320+(e-65536&1023))}},e.prototype.getOutputString=function(){return this.flushBufferToOutputString(),this.outputString},e.prototype.flushBufferToOutputString=function(){this.outputPosition===this.outputBufferCapacity?this.outputString+=String.fromCharCode.apply(null,this.outputBuffer):this.outputString+=String.fromCharCode.apply(null,this.outputBuffer.subarray(0,this.outputPosition)),this.outputPosition=0},e}();e.StringBuilder=t}(LZUTF8||(LZUTF8={})),function(o){var e=function(){function e(){this.restart()}return e.prototype.restart=function(){this.startTime=e.getTimestamp()},e.prototype.getElapsedTime=function(){return e.getTimestamp()-this.startTime},e.prototype.getElapsedTimeAndRestart=function(){var e=this.getElapsedTime();return this.restart(),e},e.prototype.logAndRestart=function(e,t){void 0===t&&(t=!0);var r=this.getElapsedTime(),n=e+": "+r.toFixed(3)+"ms";return o.log(n,t),this.restart(),r},e.getTimestamp=function(){return this.timestampFunc||this.createGlobalTimestampFunction(),this.timestampFunc()},e.getMicrosecondTimestamp=function(){return Math.floor(1e3*e.getTimestamp())},e.createGlobalTimestampFunction=function(){if("object"==typeof process&&"function"==typeof process.hrtime){var r=0;this.timestampFunc=function(){var e=process.hrtime(),t=1e3*e[0]+e[1]/1e6;return r+t},r=Date.now()-this.timestampFunc()}else if("object"==typeof chrome&&chrome.Interval){var e=Date.now(),t=new chrome.Interval;t.start(),this.timestampFunc=function(){return e+t.microseconds()/1e3}}else if("object"==typeof performance&&performance.now){var n=Date.now()-performance.now();this.timestampFunc=function(){return n+performance.now()}}else Date.now?this.timestampFunc=function(){return Date.now()}:this.timestampFunc=function(){return(new Date).getTime()}},e}();o.Timer=e}(LZUTF8||(LZUTF8={})),function(n){var e=function(){function e(e){void 0===e&&(e=!0),this.MinimumSequenceLength=4,this.MaximumSequenceLength=31,this.MaximumMatchDistance=32767,this.PrefixHashTableSize=65537,this.inputBufferStreamOffset=1,e&&"function"==typeof Uint32Array?this.prefixHashTable=new n.CompressorCustomHashTable(this.PrefixHashTableSize):this.prefixHashTable=new n.CompressorSimpleHashTable(this.PrefixHashTableSize)}return e.prototype.compressBlock=function(e){if(null==e)throw new TypeError("compressBlock: undefined or null input received");return"string"==typeof e&&(e=n.encodeUTF8(e)),e=n.BufferTools.convertToUint8ArrayIfNeeded(e),this.compressUtf8Block(e)},e.prototype.compressUtf8Block=function(e){if(!e||0==e.length)return new Uint8Array(0);var t=this.cropAndAddNewBytesToInputBuffer(e),r=this.inputBuffer,n=this.inputBuffer.length;this.outputBuffer=new Uint8Array(e.length);for(var o=this.outputBufferPosition=0,i=t;i<n;i++){var u=r[i],s=i<o;if(i>n-this.MinimumSequenceLength)s||this.outputRawByte(u);else{var a=this.getBucketIndexForPrefix(i);if(!s){var c=this.findLongestMatch(i,a);null!=c&&(this.outputPointerBytes(c.length,c.distance),o=i+c.length,s=!0)}s||this.outputRawByte(u);var f=this.inputBufferStreamOffset+i;this.prefixHashTable.addValueToBucket(a,f)}}return this.outputBuffer.subarray(0,this.outputBufferPosition)},e.prototype.findLongestMatch=function(e,t){var r=this.prefixHashTable.getArraySegmentForBucketIndex(t,this.reusableArraySegmentObject);if(null==r)return null;for(var n,o=this.inputBuffer,i=0,u=0;u<r.length;u++){var s=r.getInReversedOrder(u)-this.inputBufferStreamOffset,a=e-s,c=void 0;if(c=void 0===n?this.MinimumSequenceLength-1:n<128&&128<=a?i+(i>>>1):i,a>this.MaximumMatchDistance||c>=this.MaximumSequenceLength||e+c>=o.length)break;if(o[s+c]===o[e+c])for(var f=0;;f++){if(e+f===o.length||o[s+f]!==o[e+f]){c<f&&(n=a,i=f);break}if(f===this.MaximumSequenceLength)return{distance:a,length:this.MaximumSequenceLength}}}return void 0!==n?{distance:n,length:i}:null},e.prototype.getBucketIndexForPrefix=function(e){return(7880599*this.inputBuffer[e]+39601*this.inputBuffer[e+1]+199*this.inputBuffer[e+2]+this.inputBuffer[e+3])%this.PrefixHashTableSize},e.prototype.outputPointerBytes=function(e,t){t<128?(this.outputRawByte(192|e),this.outputRawByte(t)):(this.outputRawByte(224|e),this.outputRawByte(t>>>8),this.outputRawByte(255&t))},e.prototype.outputRawByte=function(e){this.outputBuffer[this.outputBufferPosition++]=e},e.prototype.cropAndAddNewBytesToInputBuffer=function(e){if(void 0===this.inputBuffer)return this.inputBuffer=e,0;var t=Math.min(this.inputBuffer.length,this.MaximumMatchDistance),r=this.inputBuffer.length-t;return this.inputBuffer=n.CompressionCommon.getCroppedAndAppendedByteArray(this.inputBuffer,r,t,e),this.inputBufferStreamOffset+=r,t},e}();n.Compressor=e}(LZUTF8||(LZUTF8={})),function(s){var e=function(){function e(e){this.minimumBucketCapacity=4,this.maximumBucketCapacity=64,this.bucketLocators=new Uint32Array(2*e),this.storage=new Uint32Array(2*e),this.storageIndex=1}return e.prototype.addValueToBucket=function(e,t){e<<=1,this.storageIndex>=this.storage.length>>>1&&this.compact();var r,n=this.bucketLocators[e];if(0===n)n=this.storageIndex,r=1,this.storage[this.storageIndex]=t,this.storageIndex+=this.minimumBucketCapacity;else{(r=this.bucketLocators[e+1])===this.maximumBucketCapacity-1&&(r=this.truncateBucketToNewerElements(n,r,this.maximumBucketCapacity/2));var o=n+r;0===this.storage[o]?(this.storage[o]=t,o===this.storageIndex&&(this.storageIndex+=r)):(s.ArrayTools.copyElements(this.storage,n,this.storage,this.storageIndex,r),n=this.storageIndex,this.storageIndex+=r,this.storage[this.storageIndex++]=t,this.storageIndex+=r),r++}this.bucketLocators[e]=n,this.bucketLocators[e+1]=r},e.prototype.truncateBucketToNewerElements=function(e,t,r){var n=e+t-r;return s.ArrayTools.copyElements(this.storage,n,this.storage,e,r),s.ArrayTools.zeroElements(this.storage,e+r,t-r),r},e.prototype.compact=function(){var e=this.bucketLocators,t=this.storage;this.bucketLocators=new Uint32Array(this.bucketLocators.length),this.storageIndex=1;for(var r=0;r<e.length;r+=2){var n=e[r+1];0!==n&&(this.bucketLocators[r]=this.storageIndex,this.bucketLocators[r+1]=n,this.storageIndex+=Math.max(Math.min(2*n,this.maximumBucketCapacity),this.minimumBucketCapacity))}this.storage=new Uint32Array(8*this.storageIndex);for(r=0;r<e.length;r+=2){var o=e[r];if(0!==o){var i=this.bucketLocators[r],u=this.bucketLocators[r+1];s.ArrayTools.copyElements(t,o,this.storage,i,u)}}},e.prototype.getArraySegmentForBucketIndex=function(e,t){e<<=1;var r=this.bucketLocators[e];return 0===r?null:(void 0===t&&(t=new s.ArraySegment(this.storage,r,this.bucketLocators[e+1])),t)},e.prototype.getUsedBucketCount=function(){return Math.floor(s.ArrayTools.countNonzeroValuesInArray(this.bucketLocators)/2)},e.prototype.getTotalElementCount=function(){for(var e=0,t=0;t<this.bucketLocators.length;t+=2)e+=this.bucketLocators[t+1];return e},e}();s.CompressorCustomHashTable=e}(LZUTF8||(LZUTF8={})),function(n){var e=function(){function e(e){this.maximumBucketCapacity=64,this.buckets=new Array(e)}return e.prototype.addValueToBucket=function(e,t){var r=this.buckets[e];void 0===r?this.buckets[e]=[t]:(r.length===this.maximumBucketCapacity-1&&n.ArrayTools.truncateStartingElements(r,this.maximumBucketCapacity/2),r.push(t))},e.prototype.getArraySegmentForBucketIndex=function(e,t){var r=this.buckets[e];return void 0===r?null:(void 0===t&&(t=new n.ArraySegment(r,0,r.length)),t)},e.prototype.getUsedBucketCount=function(){return n.ArrayTools.countNonzeroValuesInArray(this.buckets)},e.prototype.getTotalElementCount=function(){for(var e=0,t=0;t<this.buckets.length;t++)void 0!==this.buckets[t]&&(e+=this.buckets[t].length);return e},e}();n.CompressorSimpleHashTable=e}(LZUTF8||(LZUTF8={})),function(f){var e=function(){function e(){this.MaximumMatchDistance=32767,this.outputPosition=0}return e.prototype.decompressBlockToString=function(e){return e=f.BufferTools.convertToUint8ArrayIfNeeded(e),f.decodeUTF8(this.decompressBlock(e))},e.prototype.decompressBlock=function(e){this.inputBufferRemainder&&(e=f.ArrayTools.concatUint8Arrays([this.inputBufferRemainder,e]),this.inputBufferRemainder=void 0);for(var t=this.cropOutputBufferToWindowAndInitialize(Math.max(4*e.length,1024)),r=0,n=e.length;r<n;r++){var o=e[r];if(o>>>6==3){var i=o>>>5;if(r==n-1||r==n-2&&7==i){this.inputBufferRemainder=e.subarray(r);break}if(e[r+1]>>>7==1)this.outputByte(o);else{var u=31&o,s=void 0;6==i?(s=e[r+1],r+=1):(s=e[r+1]<<8|e[r+2],r+=2);for(var a=this.outputPosition-s,c=0;c<u;c++)this.outputByte(this.outputBuffer[a+c])}}else this.outputByte(o)}return this.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence(),f.CompressionCommon.getCroppedBuffer(this.outputBuffer,t,this.outputPosition-t)},e.prototype.outputByte=function(e){this.outputPosition===this.outputBuffer.length&&(this.outputBuffer=f.ArrayTools.doubleByteArrayCapacity(this.outputBuffer)),this.outputBuffer[this.outputPosition++]=e},e.prototype.cropOutputBufferToWindowAndInitialize=function(e){if(!this.outputBuffer)return this.outputBuffer=new Uint8Array(e),0;var t=Math.min(this.outputPosition,this.MaximumMatchDistance);if(this.outputBuffer=f.CompressionCommon.getCroppedBuffer(this.outputBuffer,this.outputPosition-t,t,e),this.outputPosition=t,this.outputBufferRemainder){for(var r=0;r<this.outputBufferRemainder.length;r++)this.outputByte(this.outputBufferRemainder[r]);this.outputBufferRemainder=void 0}return t},e.prototype.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence=function(){for(var e=1;e<=4&&0<=this.outputPosition-e;e++){var t=this.outputBuffer[this.outputPosition-e];if(e<4&&t>>>3==30||e<3&&t>>>4==14||e<2&&t>>>5==6)return this.outputBufferRemainder=this.outputBuffer.subarray(this.outputPosition-e,this.outputPosition),void(this.outputPosition-=e)}},e}();f.Decompressor=e}(LZUTF8||(LZUTF8={})),function(s){var e,t,a,c;e=s.Encoding||(s.Encoding={}),t=e.Base64||(e.Base64={}),a=new Uint8Array([65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,48,49,50,51,52,53,54,55,56,57,43,47]),c=new Uint8Array([255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,62,255,255,255,63,52,53,54,55,56,57,58,59,60,61,255,255,255,0,255,255,255,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,255,255,255,255,255,255,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,255,255,255,255]),t.encode=function(e){return e&&0!=e.length?s.runningInNodeJS()?s.BufferTools.uint8ArrayToBuffer(e).toString("base64"):t.encodeWithJS(e):""},t.decode=function(e){return e?s.runningInNodeJS()?s.BufferTools.bufferToUint8Array(new Buffer(e,"base64")):t.decodeWithJS(e):new Uint8Array(0)},t.encodeWithJS=function(e,t){if(void 0===t&&(t=!0),!e||0==e.length)return"";for(var r,n=a,o=new s.StringBuilder,i=0,u=e.length;i<u;i+=3)i<=u-3?(r=e[i]<<16|e[i+1]<<8|e[i+2],o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),o.appendCharCode(n[r>>>6&63]),o.appendCharCode(n[63&r]),r=0):i===u-2?(r=e[i]<<16|e[i+1]<<8,o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),o.appendCharCode(n[r>>>6&63]),t&&o.appendCharCode(61)):i===u-1&&(r=e[i]<<16,o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),t&&(o.appendCharCode(61),o.appendCharCode(61)));return o.getOutputString()},t.decodeWithJS=function(e,t){if(!e||0==e.length)return new Uint8Array(0);var r=e.length%4;if(1===r)throw new Error("Invalid Base64 string: length % 4 == 1");2===r?e+="==":3===r&&(e+="="),t||(t=new Uint8Array(e.length));for(var n=0,o=e.length,i=0;i<o;i+=4){var u=c[e.charCodeAt(i)]<<18|c[e.charCodeAt(i+1)]<<12|c[e.charCodeAt(i+2)]<<6|c[e.charCodeAt(i+3)];t[n++]=u>>>16&255,t[n++]=u>>>8&255,t[n++]=255&u}return 61==e.charCodeAt(o-1)&&n--,61==e.charCodeAt(o-2)&&n--,t.subarray(0,n)}}(LZUTF8||(LZUTF8={})),function(s){var e,t;e=s.Encoding||(s.Encoding={}),(t=e.BinaryString||(e.BinaryString={})).encode=function(e){if(null==e)throw new TypeError("BinaryString.encode: undefined or null input received");if(0===e.length)return"";for(var t=e.length,r=new s.StringBuilder,n=0,o=1,i=0;i<t;i+=2){var u=void 0;u=i==t-1?e[i]<<8:e[i]<<8|e[i+1],r.appendCharCode(n<<16-o|u>>>o),n=u&(1<<o)-1,15===o?(r.appendCharCode(n),n=0,o=1):o+=1,t-2<=i&&r.appendCharCode(n<<16-o)}return r.appendCharCode(32768|t%2),r.getOutputString()},t.decode=function(e){if("string"!=typeof e)throw new TypeError("BinaryString.decode: invalid input type");if(""==e)return new Uint8Array(0);for(var t,r=new Uint8Array(3*e.length),n=0,o=0,i=0,u=0;u<e.length;u++){var s=e.charCodeAt(u);32768<=s?(32769==s&&n--,i=0):(0==i?o=s:(t=o<<i|s>>>15-i,r[n++]=t>>>8,r[n++]=255&t,o=s&(1<<15-i)-1),15==i?i=0:i+=1)}return r.subarray(0,n)}}(LZUTF8||(LZUTF8={})),function(e){var t,r;t=e.Encoding||(e.Encoding={}),(r=t.CodePoint||(t.CodePoint={})).encodeFromString=function(e,t){var r=e.charCodeAt(t);if(r<55296||56319<r)return r;var n=e.charCodeAt(t+1);if(56320<=n&&n<=57343)return n-56320+(r-55296<<10)+65536;throw new Error("getUnicodeCodePoint: Received a lead surrogate character, char code "+r+", followed by "+n+", which is not a trailing surrogate character code.")},r.decodeToString=function(e){if(e<=65535)return String.fromCharCode(e);if(e<=1114111)return String.fromCharCode(55296+(e-65536>>>10),56320+(e-65536&1023));throw new Error("getStringFromUnicodeCodePoint: A code point of "+e+" cannot be encoded in UTF-16")}}(LZUTF8||(LZUTF8={})),function(e){var t,r,n;t=e.Encoding||(e.Encoding={}),r=t.DecimalString||(t.DecimalString={}),n=["000","001","002","003","004","005","006","007","008","009","010","011","012","013","014","015","016","017","018","019","020","021","022","023","024","025","026","027","028","029","030","031","032","033","034","035","036","037","038","039","040","041","042","043","044","045","046","047","048","049","050","051","052","053","054","055","056","057","058","059","060","061","062","063","064","065","066","067","068","069","070","071","072","073","074","075","076","077","078","079","080","081","082","083","084","085","086","087","088","089","090","091","092","093","094","095","096","097","098","099","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160","161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200","201","202","203","204","205","206","207","208","209","210","211","212","213","214","215","216","217","218","219","220","221","222","223","224","225","226","227","228","229","230","231","232","233","234","235","236","237","238","239","240","241","242","243","244","245","246","247","248","249","250","251","252","253","254","255"],r.encode=function(e){for(var t=[],r=0;r<e.length;r++)t.push(n[e[r]]);return t.join(" ")}}(LZUTF8||(LZUTF8={})),function(e){var t,r;t=e.Encoding||(e.Encoding={}),(r=t.StorageBinaryString||(t.StorageBinaryString={})).encode=function(e){return t.BinaryString.encode(e).replace(/\0/g,"耂")},r.decode=function(e){return t.BinaryString.decode(e.replace(/\u8002/g,"\0"))}}(LZUTF8||(LZUTF8={})),function(a){var i,t,r,n;i=a.Encoding||(a.Encoding={}),(t=i.UTF8||(i.UTF8={})).encode=function(e){return e&&0!=e.length?a.runningInNodeJS()?a.BufferTools.bufferToUint8Array(new Buffer(e,"utf8")):t.createNativeTextEncoderAndDecoderIfAvailable()?r.encode(e):t.encodeWithJS(e):new Uint8Array(0)},t.decode=function(e){return e&&0!=e.length?a.runningInNodeJS()?a.BufferTools.uint8ArrayToBuffer(e).toString("utf8"):t.createNativeTextEncoderAndDecoderIfAvailable()?n.decode(e):t.decodeWithJS(e):""},t.encodeWithJS=function(e,t){if(!e||0==e.length)return new Uint8Array(0);t||(t=new Uint8Array(4*e.length));for(var r=0,n=0;n<e.length;n++){var o=i.CodePoint.encodeFromString(e,n);if(o<=127)t[r++]=o;else if(o<=2047)t[r++]=192|o>>>6,t[r++]=128|63&o;else if(o<=65535)t[r++]=224|o>>>12,t[r++]=128|o>>>6&63,t[r++]=128|63&o;else{if(!(o<=1114111))throw new Error("Invalid UTF-16 string: Encountered a character unsupported by UTF-8/16 (RFC 3629)");t[r++]=240|o>>>18,t[r++]=128|o>>>12&63,t[r++]=128|o>>>6&63,t[r++]=128|63&o,n++}}return t.subarray(0,r)},t.decodeWithJS=function(e,t,r){if(void 0===t&&(t=0),!e||0==e.length)return"";void 0===r&&(r=e.length);for(var n,o,i=new a.StringBuilder,u=t,s=r;u<s;){if((o=e[u])>>>7==0)n=o,u+=1;else if(o>>>5==6){if(r<=u+1)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(31&o)<<6|63&e[u+1],u+=2}else if(o>>>4==14){if(r<=u+2)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(15&o)<<12|(63&e[u+1])<<6|63&e[u+2],u+=3}else{if(o>>>3!=30)throw new Error("Invalid UTF-8 stream: An invalid lead byte value encountered at position "+u);if(r<=u+3)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(7&o)<<18|(63&e[u+1])<<12|(63&e[u+2])<<6|63&e[u+3],u+=4}i.appendCodePoint(n)}return i.getOutputString()},t.createNativeTextEncoderAndDecoderIfAvailable=function(){return!!r||"function"==typeof TextEncoder&&(r=new TextEncoder("utf-8"),n=new TextDecoder("utf-8"),!0)}}(LZUTF8||(LZUTF8={})),function(o){o.compress=function(e,t){if(void 0===t&&(t={}),null==e)throw new TypeError("compress: undefined or null input received");var r=o.CompressionCommon.detectCompressionSourceEncoding(e);t=o.ObjectTools.override({inputEncoding:r,outputEncoding:"ByteArray"},t);var n=(new o.Compressor).compressBlock(e);return o.CompressionCommon.encodeCompressedBytes(n,t.outputEncoding)},o.decompress=function(e,t){if(void 0===t&&(t={}),null==e)throw new TypeError("decompress: undefined or null input received");t=o.ObjectTools.override({inputEncoding:"ByteArray",outputEncoding:"String"},t);var r=o.CompressionCommon.decodeCompressedBytes(e,t.inputEncoding),n=(new o.Decompressor).decompressBlock(r);return o.CompressionCommon.encodeDecompressedBytes(n,t.outputEncoding)},o.compressAsync=function(e,t,r){var n;null==r&&(r=function(){});try{n=o.CompressionCommon.detectCompressionSourceEncoding(e)}catch(e){return void r(void 0,e)}t=o.ObjectTools.override({inputEncoding:n,outputEncoding:"ByteArray",useWebWorker:!0,blockSize:65536},t),o.enqueueImmediate(function(){t.useWebWorker&&o.WebWorker.createGlobalWorkerIfNeeded()?o.WebWorker.compressAsync(e,t,r):o.AsyncCompressor.compressAsync(e,t,r)})},o.decompressAsync=function(e,t,r){if(null==r&&(r=function(){}),null!=e){t=o.ObjectTools.override({inputEncoding:"ByteArray",outputEncoding:"String",useWebWorker:!0,blockSize:65536},t);var n=o.BufferTools.convertToUint8ArrayIfNeeded(e);o.EventLoop.enqueueImmediate(function(){t.useWebWorker&&o.WebWorker.createGlobalWorkerIfNeeded()?o.WebWorker.decompressAsync(n,t,r):o.AsyncDecompressor.decompressAsync(e,t,r)})}else r(void 0,new TypeError("decompressAsync: undefined or null input received"))},o.createCompressionStream=function(){return o.AsyncCompressor.createCompressionStream()},o.createDecompressionStream=function(){return o.AsyncDecompressor.createDecompressionStream()},o.encodeUTF8=function(e){return o.Encoding.UTF8.encode(e)},o.decodeUTF8=function(e){return o.Encoding.UTF8.decode(e)},o.encodeBase64=function(e){return o.Encoding.Base64.encode(e)},o.decodeBase64=function(e){return o.Encoding.Base64.decode(e)},o.encodeBinaryString=function(e){return o.Encoding.BinaryString.encode(e)},o.decodeBinaryString=function(e){return o.Encoding.BinaryString.decode(e)},o.encodeStorageBinaryString=function(e){return o.Encoding.StorageBinaryString.encode(e)},o.decodeStorageBinaryString=function(e){return o.Encoding.StorageBinaryString.decode(e)}}(LZUTF8||(LZUTF8={})); 

if(Object.keys(exports).length){window['lzutf8']=exports;}
exports={};

//libraries/preact-10.4.6/preact.min.js
exports={};
!function(){var n,l,u,t,i,o,r,e,f={},c=[],a=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n)}function h(n,l,u){var t,i=arguments,o={};for(t in l)"key"!==t&&"ref"!==t&&(o[t]=l[t]);if(arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(i[t]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(t in n.defaultProps)void 0===o[t]&&(o[t]=n.defaultProps[t]);return y(n,o,l&&l.key,l&&l.ref,null)}function y(l,u,t,i,o){var r={type:l,props:u,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function d(n){return n.children}function p(n,l){this.props=n,this.context=l}function _(n,l){if(null==l)return n.__?_(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?_(n):null}function m(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return m(n)}}function w(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!k.__r++||i!==n.debounceRendering)&&((i=n.debounceRendering)||t)(k)}function k(){for(var n;k.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,t,i,o,r,e;n.__d&&(r=(o=(l=n).__v).__e,(e=l.__P)&&(u=[],(t=s({},o)).__v=t,i=N(e,o,t,l.__n,void 0!==e.ownerSVGElement,null,u,null==r?_(o):r),z(u,o),i!=r&&m(o)))})}function g(n,l,u,t,i,o,r,e,a,s){var h,p,m,w,k,g,x,C=t&&t.__k||c,A=C.length;for(a==f&&(a=null!=r?r[0]:A?_(t,0):null),u.__k=[],h=0;h<l.length;h++)if(null!=(w=u.__k[h]=null==(w=l[h])||"boolean"==typeof w?null:"string"==typeof w||"number"==typeof w?y(null,w,null,null,w):Array.isArray(w)?y(d,{children:w},null,null,null):null!=w.__e||null!=w.__c?y(w.type,w.props,w.key,null,w.__v):w)){if(w.__=u,w.__b=u.__b+1,null===(m=C[h])||m&&w.key==m.key&&w.type===m.type)C[h]=void 0;else for(p=0;p<A;p++){if((m=C[p])&&w.key==m.key&&w.type===m.type){C[p]=void 0;break}m=null}k=N(n,w,m=m||f,i,o,r,e,a,s),(p=w.ref)&&m.ref!=p&&(x||(x=[]),m.ref&&x.push(m.ref,null,w),x.push(p,w.__c||k,w)),null!=k?(null==g&&(g=k),a=b(n,w,m,C,r,k,a),s||"option"!=u.type?"function"==typeof u.type&&(u.__d=a):n.value=""):a&&m.__e==a&&a.parentNode!=n&&(a=_(m))}if(u.__e=g,null!=r&&"function"!=typeof u.type)for(h=r.length;h--;)null!=r[h]&&v(r[h]);for(h=A;h--;)null!=C[h]&&j(C[h],C[h]);if(x)for(h=0;h<x.length;h++)$(x[h],x[++h],x[++h])}function b(n,l,u,t,i,o,r){var e,f,c;if(void 0!==l.__d)e=l.__d,l.__d=void 0;else if(i==u||o!=r||null==o.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(o),e=null;else{for(f=r,c=0;(f=f.nextSibling)&&c<t.length;c+=2)if(f==o)break n;n.insertBefore(o,r),e=r}return void 0!==e?e:o.nextSibling}function x(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||A(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||A(n,o,l[o],u[o],t)}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===a.test(l)?u+"px":null==u?"":u}function A(n,l,u,t,i){var o,r,e,f,c;if(i?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else{if("string"==typeof t&&(o.cssText="",t=null),t)for(f in t)u&&f in u||C(o,f,"");if(u)for(c in u)t&&u[c]===t[c]||C(o,c,u[c])}else"o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),e=l.toLowerCase(),l=(e in n?e:l).slice(2),u?(t||n.addEventListener(l,P,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,P,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&"download"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u))}function P(l){this.l[l.type](n.event?n.event(l):l)}function E(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,i.__e&&("function"==typeof i.type&&i.__k.length>1&&E(i,l,u),l=b(u,i,i,n.__k,null,i.__e,l),"function"==typeof n.type&&(n.__d=l)))}function N(l,u,t,i,o,r,e,f,c){var a,v,h,y,_,m,w,k,b,x,C,A=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof A){if(k=u.props,b=(a=A.contextType)&&i[a.__c],x=a?b?b.props.value:a.__:i,t.__c?w=(v=u.__c=t.__c).__=v.__E:("prototype"in A&&A.prototype.render?u.__c=v=new A(k,x):(u.__c=v=new p(k,x),v.constructor=A,v.render=F),b&&b.sub(v),v.props=k,v.state||(v.state={}),v.context=x,v.__n=i,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=A.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=s({},v.__s)),s(v.__s,A.getDerivedStateFromProps(k,v.__s))),y=v.props,_=v.state,h)null==A.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else{if(null==A.getDerivedStateFromProps&&k!==y&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(k,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(k,v.__s,x)||u.__v===t.__v){v.props=k,v.state=v.__s,u.__v!==t.__v&&(v.__d=!1),v.__v=u,u.__e=t.__e,u.__k=t.__k,v.__h.length&&e.push(v),E(u,f,l);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(k,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(y,_,m)})}v.context=x,v.props=k,v.state=v.__s,(a=n.__r)&&a(u),v.__d=!1,v.__v=u,v.__P=l,a=v.render(v.props,v.state,v.context),v.state=v.__s,null!=v.getChildContext&&(i=s(s({},i),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(m=v.getSnapshotBeforeUpdate(y,_)),C=null!=a&&a.type==d&&null==a.key?a.props.children:a,g(l,Array.isArray(C)?C:[C],u,t,i,o,r,e,f,c),v.base=u.__e,v.__h.length&&e.push(v),w&&(v.__E=v.__=null),v.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=T(t.__e,u,t,i,o,r,e,c);(a=n.diffed)&&a(u)}catch(l){u.__v=null,n.__e(l,u,t)}return u.__e}function z(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u)})}catch(l){n.__e(l,u.__v)}})}function T(n,l,u,t,i,o,r,e){var a,s,v,h,y,d=u.props,p=l.props;if(i="svg"===l.type||i,null!=o)for(a=0;a<o.length;a++)if(null!=(s=o[a])&&((null===l.type?3===s.nodeType:s.localName===l.type)||n==s)){n=s,o[a]=null;break}if(null==n){if(null===l.type)return document.createTextNode(p);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,p.is&&{is:p.is}),o=null,e=!1}if(null===l.type)d!==p&&n.data!==p&&(n.data=p);else{if(null!=o&&(o=c.slice.call(n.childNodes)),v=(d=u.props||f).dangerouslySetInnerHTML,h=p.dangerouslySetInnerHTML,!e){if(null!=o)for(d={},y=0;y<n.attributes.length;y++)d[n.attributes[y].name]=n.attributes[y].value;(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""))}x(n,p,d,i,e),h?l.__k=[]:(a=l.props.children,g(n,Array.isArray(a)?a:[a],l,u,t,"foreignObject"!==l.type&&i,o,r,f,e)),e||("value"in p&&void 0!==(a=p.value)&&a!==n.value&&A(n,"value",a,d.value,!1),"checked"in p&&void 0!==(a=p.checked)&&a!==n.checked&&A(n,"checked",a,d.checked,!1))}return n}function $(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function j(l,u,t){var i,o,r;if(n.unmount&&n.unmount(l),(i=l.ref)&&(i.current&&i.current!==l.__e||$(i,null,u)),t||"function"==typeof l.type||(t=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(r=0;r<i.length;r++)i[r]&&j(i[r],u,t);null!=o&&v(o)}function F(n,l,u){return this.constructor(n,u)}function H(l,u,t){var i,r,e;n.__&&n.__(l,u),r=(i=t===o)?null:t&&t.__k||u.__k,l=h(d,null,[l]),e=[],N(u,(i?u:t||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:r?null:u.childNodes.length?c.slice.call(u.childNodes):null,e,t||f,i),z(e,l)}n={__e:function(n,l){for(var u,t;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(t=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(t=!0,u.componentDidCatch(n)),t)return w(u.__E=u)}catch(l){n=l}throw n}},l=function(n){return null!=n&&void 0===n.constructor},p.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this))},p.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w(this))},p.prototype.render=d,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,k.__r=0,o=f,r=0,e={render:H,hydrate:function(n,l){H(n,l,o)},createElement:h,h:h,Fragment:d,createRef:function(){return{current:null}},isValidElement:l,Component:p,cloneElement:function(n,l){var u,t;for(t in l=s(s({},n.props),l),arguments.length>2&&(l.children=c.slice.call(arguments,2)),u={},l)"key"!==t&&"ref"!==t&&(u[t]=l[t]);return y(n.type,u,l.key||n.key,l.ref||n.ref,null)},createContext:function(n){var l={},u={__c:"__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var t,i=this;return this.getChildContext||(t=[],this.getChildContext=function(){return l[u.__c]=i,l},this.shouldComponentUpdate=function(n){i.props.value!==n.value&&t.some(function(l){l.context=n.value,w(l)})},this.sub=function(n){t.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){t.splice(t.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Consumer.contextType=u,u.Provider.__=u,u},toChildArray:function n(l){return null==l||"boolean"==typeof l?[]:Array.isArray(l)?c.concat.apply([],l.map(n)):[l]},__u:j,options:n},typeof module<"u"?module.exports=e:self.preact=e}();

if(Object.keys(exports).length){window['preact']=exports;}
exports={};

//libraries/preact-10.4.6/hooks.js
exports={};
var n,t,r,u=window.preact,o=0,i=[],c=u.options.__r,e=u.options.diffed,f=u.options.__c,a=u.options.unmount;function p(n,r){u.options.__h&&u.options.__h(t,n,o||r),o=0;var i=t.__H||(t.__H={__:[],__h:[]});return n>=i.__.length&&i.__.push({}),i.__[n]}function v(n){return o=1,s(A,n)}function s(r,u,o){var i=p(n++,2);return i.t=r,i.__c||(i.__c=t,i.__=[o?o(u):A(void 0,u),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}))}]),i.__}function x(r,o){var i=p(n++,4);!u.options.__s&&q(i.__H,o)&&(i.__=r,i.__H=o,t.__h.push(i))}function m(t,r){var u=p(n++,7);return q(u.__H,r)?(u.__H=r,u.__h=t,u.__=t()):u.__}function y(){i.some(function(n){if(n.__P)try{n.__H.__h.forEach(h),n.__H.__h.forEach(_),n.__H.__h=[]}catch(t){return n.__H.__h=[],u.options.__e(t,n.__v),!0}}),i=[]}u.options.__r=function(r){c&&c(r),n=0;var u=(t=r.__c).__H;u&&(u.__h.forEach(h),u.__h.forEach(_),u.__h=[])},u.options.diffed=function(n){e&&e(n);var t=n.__c;t&&t.__H&&t.__H.__h.length&&(1!==i.push(t)&&r===u.options.requestAnimationFrame||((r=u.options.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),l&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(r,100);l&&(t=requestAnimationFrame(r))})(y))},u.options.__c=function(n,t){t.some(function(n){try{n.__h.forEach(h),n.__h=n.__h.filter(function(n){return!n.__||_(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],u.options.__e(r,n.__v)}}),f&&f(n,t)},u.options.unmount=function(n){a&&a(n);var t=n.__c;if(t&&t.__H)try{t.__H.__.forEach(h)}catch(n){u.options.__e(n,t.__v)}};var l="function"==typeof requestAnimationFrame;function h(n){"function"==typeof n.u&&n.u()}function _(n){n.u=n.__()}function q(n,t){return!n||t.some(function(t,r){return t!==n[r]})}function A(n,t){return"function"==typeof t?t(n):t}exports.useState=v,exports.useReducer=s,exports.useEffect=function(r,o){var i=p(n++,3);!u.options.__s&&q(i.__H,o)&&(i.__=r,i.__H=o,t.__H.__h.push(i))},exports.useLayoutEffect=x,exports.useRef=function(n){return o=5,m(function(){return{current:n}},[])},exports.useImperativeHandle=function(n,t,r){o=6,x(function(){"function"==typeof n?n(t()):n&&(n.current=t())},null==r?r:r.concat(n))},exports.useMemo=m,exports.useCallback=function(n,t){return o=8,m(function(){return n},t)},exports.useContext=function(r){var u=t.context[r.__c],o=p(n++,9);return o.__c=r,u?(null==o.__&&(o.__=!0,u.sub(t)),u.props.value):r.__},exports.useDebugValue=function(n,t){u.options.useDebugValue&&u.options.useDebugValue(t?t(n):n)},exports.useErrorBoundary=function(r){var u=p(n++,10),o=v();return u.__=r,t.componentDidCatch||(t.componentDidCatch=function(n){u.__&&u.__(n),o[1](n)}),[o[0],function(){o[1](void 0)}]};

if(Object.keys(exports).length){window['hooks']=exports;}
exports={};
for(let key in hooks) preact[key]=hooks[key];
delete window.hooks;



(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  //@ts-ignore
  typeof define === 'function' && define.amd ? define(factory) :
  //@ts-ignore
  (global = global || self, global.caph = factory());
}(this, (function () { 'use strict';
//core/utils.js
exports={};
//@ts-check

/** 
 * JSDoc types lack a non-undefined assertion.
 * https://github.com/Microsoft/TypeScript/issues/23405#issuecomment-873331031
 *
 * Throws if the supplied value is _undefined_ (_null_ is allowed).\
 * Returns (via casting) the supplied value as a T with _undefined_ removed from its type space.
 * This informs the compiler that the value cannot be _undefined_.
 * @template T
 * @param {T} value
 * @param {string} [valueName]
 * @returns {T extends undefined ? never : T}
 */
function assertDefined(value, valueName) {
  if (value === undefined) {
    throw new Error(`Encountered unexpected undefined value${valueName? ` for '${valueName}'` : ""}`);
  }
  return /** @type {*} */ (value);
}

/**
 * @template T
 * @param {T} value
 * @returns {T extends null ? never : T}
 */
function assertNonNull(value) {
  if (!value && (value===null||value === undefined)) throw new Error(`Encountered unexpected undefined value`);
  //@ts-ignore
  return value;
}


/** @type {(obj: any) => obj is String} */
function is_string(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
}

// utils = {
//   unindent: (text) => {
//     let lines = text.split('\n');
//     let n = lines.filter(l => l.trim().length)
//       .map(l => l.length - l.trimStart().length)
//       .reduce((p, c) => Math.min(c, p), 1000);
//     return lines.map(l => l.slice(n)).join('\n');
//   }
// };
// _URL_resolve(url) {
//   return new URL(url, document.baseURI).href;
// }
// // _URL_is_absolute(url) {
// //   //https://stackoverflow.com/q/10687099
// //   return new URL(document.baseURI).origin !== new URL(url, document.baseURI).origin;
// // }

// _html_safe(str) {
//   // e.g. converts < into &lt;
//   return new Option(str).innerHTML;
// }
// _html_safe_undo(str) {
//   // e.g. converts &lt; into <
//   const doc = new DOMParser().parseFromString(str, "text/html");
//   const text = doc.documentElement.textContent;
//   return text;
// }


function assert(/** @type {boolean|any}*/condition, ...messages) {
  if (condition) return;
  throw new Error(...messages);
}

function sleep(/** @type {number}*/ms) {
  return new Promise((ok, err) => setTimeout(ok, ms));
}

class MyBoolean {
  static assert(condition, ...messages) {
    if (condition) return;
    throw new Error(...messages);
  }
  static all(arr) {
    for (let x of arr) if (!x) return false;
    return true;
  }
  static any(arr) {
    for (let x of arr) if (x) return true;
    return false;
  }
  static assert_all(arr, ...messages) { assert(this.all(arr), ...messages); }
  static assert_any(arr, ...messages) { assert(this.any(arr), ...messages); }
}


class MyArray {
  static any(arr) {
    for (let x of arr) if (x) return true;
    return false;
  }
  static all(arr) {
    for (let x of arr) if (!x) return false;
    return true;
  }
  static sum(arr) {
    return arr.reduce((p, c) => p + c, 0);
  }
  static max(arr, initialValue) {
    initialValue = initialValue || 0;
    return arr.reduce((p, c) => Math.max(p, c), initialValue);
  }
  static min(arr, initialValue) {
    initialValue = initialValue || 1e10;
    return arr.reduce((p, c) => Math.min(p, c), initialValue);
  }
  static zeros(n) {
    const l = [];
    for (let i = 0; i < n; i++)l.push(0);
    return l;
  }
  static arange(n) {
    return MyArray.zeros(n).map((z, i) => i);
  }
  static sEquality(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) if (a[i] != b[i]) return false;
    return true;
  }
  static hEquality(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
    return true;
  }
}

class MyPromise {
  static async sleep(ms) {
    await new Promise((ok, err) => setTimeout(ok, ms));
  }
  static async finish_all(promises, { debug = false } = {}) {
    // Ensures completion of all promises even if some throw exceptions
    return await new Promise((ok, err) => {
      if (promises.length == 0) return ok([]);
      let any_error = false;
      let cnt = 0;
      let outs = promises.map((p) => null);
      Promise.all(promises.map(async (p, i) => {
        try { outs[i] = await p; }
        catch (e) {
          any_error = true; outs[i] = e;
          if (debug) console.error(...e);
        }
        cnt++;
        if (cnt == promises.length) {
          if (any_error) err(outs);
          else ok(outs);
        }
      }));
    });
  }
  static async finish_all_log(promises) {
    try { var outs = await MyPromise.finish_all(promises); }
    catch (err) {
      var outs = err; console.error(...err);
      err.forEach(e => console.warn(...e));
    }
    return outs;
  }

  static async until(/** @type {()=>any}*/ func, { ms = 200, timeout = 0 } = {}) {
    if (timeout && ms > timeout) ms = timeout / 10;
    let t0 = (new Date()).getTime();
    let value;
    while (!(value = await func())) {
      if (timeout && (new Date()).getTime()-t0 > timeout)
        throw MyPromise.Timeout;
      await sleep(ms);
    }
    return value;
  }
  static Timeout = new Error('Timeout');
  static async timeout(promise, ms) {
    let finished = false;
    let [resp, _] = await Promise.all([
      promise.then(e => { finished = true; return e; }),
      caph.until(() => finished, { timeout: ms })
    ]);
    return resp;
  }
}


class MyDocument {

  /**
   * @param {string} tag 
   * @param {{
   *  style?: {[key: string]: string},
   *  id?: string,
   * classList?: string[],
   * text?: string,
   * html?: string,
   * eventListeners?: {[key: string]: (e: Event) => void},
   * parent?: HTMLElement,
   * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
   * }} options
   * @returns {HTMLElement}
   */
  static createElement(tag, {
    style = {}, id, classList = [], text, html,
    eventListeners = {}, parent, where, ...attrs } = {}) {
    let e = document.createElement(tag);
    if(id!==undefined) e.setAttribute("id", id);
    classList.forEach(s => e.classList.add(s));
    if (text !==undefined) e.innerText = text;
    if (html !==undefined) e.innerHTML = html;
    if (id !==undefined) e.id = id;
    MyObject.forEach(attrs, (value, key) => e.setAttribute(key, value));
    MyObject.forEach(style, (value, key) => e.style[key] = value);
    MyObject.forEach(eventListeners, (value, key) =>
      e.addEventListener(key, value));
    if (parent || where) {
      parent = parent || document.body;
      where = where || 'beforeend';
      parent.insertAdjacentElement(where, e);
    }
    return e;
  }
  static right_click(element) {
    element.focus();
    if (window.CustomEvent) {
      element.dispatchEvent(new CustomEvent('contextmenu'));
    } else if (document.createEvent) {
      var ev = document.createEvent('HTMLEvents');
      ev.initEvent('contextmenu', true, false);
      element.dispatchEvent(ev);
    } else { // Internet Explorer
      element.fireEvent('oncontextmenu');
    }
    // return;
    // element.focus();
    // let e = element.ownerDocument.createEvent('MouseEvents');
    // e.initMouseEvent('contextmenu', true, true,
    //   element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
    //   false, false, false, 2, null);
    // return !element.dispatchEvent(e);
  }
}

class MyObject {

  static indexBy(arr, key) {
    let M = {};
    arr.forEach((obj) => {
      let value = obj[key];
      M[value] = obj;
    });
    return M;
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
  static map(obj, func) {
    return MyObject._object_op('map', obj, func);
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(boolean|any))} func */
  /** @returns {Object} */
  static filter(obj, func) {
    return MyObject._object_op('filter', obj, func);
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
  static apply(obj, func) {
    return MyObject._object_op('apply', obj, func);
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
  static forEach(obj, func) {
    return MyObject._object_op('forEach', obj, func);
  }

  /** @param {Object} src */
  /** @param {'apply'|'filter'|'forEach'|'map'} op*/
  static _object_op(op, src, func) {
    assert(1 <= func.length && func.length <= 3);
    let dest = {};
    for (let key of Object.keys(src)) {
      let value = src[key]
      let result = MyObject._func(func, value, key, src);
      if (op == 'map') dest[key] = result;
      else if (op == 'filter') { if (result) dest[key] = value; }
      else if (op == 'apply') src[key] = result;
      else if (op == 'forEach') 1 == 1;
    }
    return (op == 'map' || op == 'filter') ? dest : null;
  }

  static _func(func, value, key, src) {
    return (
      func.length == 1 ? func(value)
        : func.length == 2 ? func(value, key)
          : func(value, key, src)
    );
  }

  static reduce_dots(obj) {
    // converts {'a.b':1, 'a.c':2, b:3} into {a:{b:1,c:2}, 'b':3}. Returns copy (shallow or deep)
    let dotted = MyObject.filter(obj, (v, k) => k.indexOf('.') >= 0);
    let no_dots = MyObject.filter(obj, (v, k) => k.indexOf('.') == -1);
    if (Object.keys(dotted).length == 0) return no_dots;
    MyObject.forEach(dotted, (v, k) => {
      let start = k.slice(0, k.indexOf('.'));
      let end = k.slice(k.indexOf('.') + 1);
      no_dots[start] = no_dots[start] || {};
      no_dots[start][end] = v;
    });
    return MyObject.reduce_dots(no_dots);
  }

  static deep_assign(obj, ...objs) {
    for (let o of objs) {
      if (!o) continue;
      for (let key of Object.keys(o)) {
        if (obj[key] === undefined || typeof (o[key]) != "object") obj[key] = o[key];
        else MyObject.deep_assign(obj[key], o[key]);
      }
    }
    return obj;
  }

  static deep_copy(obj, ...objs) {
    if (obj === undefined) return undefined;
    if (obj === null) return null;
    if (Array.isArray(obj))
      return obj.map(x => MyObject.deep_copy(x));
    if (typeof (obj) == "object")
      return MyObject.map(obj, value => MyObject.deep_copy(value));
    if (typeof (obj) == "function")
      return obj; // DOES NOT CREATE COPY FOR FUNCTIONS
    return MyObject.deep_assign(obj, ...objs);
  }

  static deep_default(default_obj, ...objs) {
    let obj = MyObject.deep_copy(default_obj);
    return MyObject.deep_assign(obj, ...objs);
  }

  /** @param {((value:any, key?:any, obj?:any)=>(boolean|any))} filter_func */
  static find(obj, filter_func) {
    for (let key in obj)
      if (MyObject._func(filter_func, obj[key], key))
        return key;
    return null;
  }
  static toEntries(obj) {
    return Object.keys(obj).map(k => [k, obj[k]]);
  }
}


class MyDecorators {
  static once(fn) {
    let returnValue, canRun = true;
    return function runOnce() {
      if (canRun) {
        returnValue = fn.apply(this, arguments);
        canRun = false;
      }
      return returnValue;
    }
  }
}


function get_property_handler(object, property) {
  let access, proto = object;
  object._hidden_modified = false;
  while (!access) {
    proto = Object.getPrototypeOf(proto);
    access = Object.getOwnPropertyDescriptor(proto, property);
  }
  return access;
}

function update_property_handler(object, property, create_handler) {
  let prev = get_property_handler(object, property);
  Object.defineProperty(object, property, create_handler(prev));
}


const Dequeue = class {
  constructor(arr) {
    this.data = [...(arr || [])];
    this.lr = [0, arr.length];
  }
  get capacity() {
    return this.data.length;
  }
  get length() {
    const [i, j] = this.lr;
    return j >= i ? j - i : this.capacity - i + j;
  }
  toArray() {
    const [i, j] = this.lr;
    if (j >= i) return this.data.slice(i, j);
    else return this.data.slice(i).concat(this.data.slice(0, j));
  }
  resize(newLength) {
    if (newLength === undefined) {
      if (this.length + 1 >= this.capacity) this.resize(3 * this.length);
      if (this.length - 1 <= this.capacity << 2) this.resize(this.length << 1);
      return;
    }
    const arr = this.toArray()
    this.data = [...arr, ...new Array(newLength - arr.length).fill(null)];
    this.lr = [0, arr.length];
  }
  _mod_add(lrIndex, retK, afterK) {
    const add = (i, k) => ((i % this.capacity) + k + this.capacity) % this.capacity;
    const out = add(this.lr[lrIndex], retK);
    this.lr[lrIndex] = add(this.lr[lrIndex], afterK);
    return out;
  }
  pushRight(x) {
    this.resize();
    this.data[this._mod_add(1, 0, +1)] = x;
  }
  pushLeft(x) {
    this.resize();
    this.data[this._mod_add(0, -1, -1)] = x;
  }
  popRight() {
    this.resize();
    return this.data[this._mod_add(1, -1, -1)];
  }
  popLeft() {
    this.resize();
    return this.data[this._mod_add(0, 0, +1)];
  }
}

if(Object.keys(exports).length){window['utils']=exports;}
exports={};

//core/parser.js
exports={};
//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />

/** @typedef {({children, ...props})=>any} ComponentType*/
/** @typedef {Object} AttributesType*/
/** @typedef {string|ComponentType|null} TagType*/
/**
 * @typedef {(type:any, props:any, ...children)=>(any extends Array? never: any)} CreateElementType
*/
/** @typedef {(text:string) => AstNode} RuleParser*/
/** @typedef {{regStart:string, regEnd:string, parser:RuleParser}} CustomRule*/

/**
 * @typedef {[null, null, AstNodeArray]|[string|ComponentType, AttributesType|null, AstNodeArray]} AstParent
 */
/**
 * @typedef {string|AstParent} AstNode
*/
/** @typedef {AstNode[]} AstNodeArray*/


const ConsoleProxy = class{
  log(...args){ console.log(...args);}
  warn(...args){ this.warn(...args);}
  error(...args){ this.error(...args);}
}


//https://stackoverflow.com/a/70329711

const BaseParser = (class {

  ESC = '\ue000';
  SPEC = `https://html.spec.whatwg.org/multipage/syntax.html`;
  DEBUG = false;


  static parseAst(/** @type {TemplateStringsArray} */{raw:strings}, ...values){
    const cls = this;
    return new cls(strings, values).root
  }

  /** @type {CustomRule[]} */
  static customRules = [];

  warn(...args){console.warn(...args)}; // Overriden during tests
  error(...args){console.error(...args)}; // Overriden during tests


  /**
   * @param {readonly string[]} strings
   * @param {0|1|2} debug
  */
  constructor(strings, values, debug=0){
    /** @type {typeof BaseParser} */ //@ts-ignore
    this.cls = this.constructor;
    let str = strings.join(this.ESC);
    let escaped = {};
    let regEscaped = new RegExp(`${this.ESC}|\\\\"|\\\\'|\\\\$\\\\$|\\\\$(?=[^\\\\$])`, 'g');
    str = str.replace(regEscaped, (match, index)=>{
      //console.log(`Escaping ${match} at ${index}`);
      escaped[index] = match;
      return this.ESC;
    });
    this.pos = 0;
    this.str = str;
    this.values = values;
    this.valueIndex = 0;
    this.escaped = escaped;
    this.errorStop = false;
    debug && console.log('PARSING', this.str);
    this.DEBUG = debug==2;

    /** @type {CustomRule[]} */
    this.customRules = this.cls.customRules;
    /** @type {(tag:TagType)=>(null|string[])} */
    this.optionalClose = this.cls.optionalClose.bind(this.cls);

    this.REG_EXP_TEXT = new RegExp(`.*?(?=${[
      '$', '<', this.ESC,
      ...this.customRules.map(({regStart})=>regStart),
    ].join('|')})`, 'ys');

    /**@type {AstParent} */
    this.parent = [null, null, []];
    /**@type {AstNode} */
    this.root = this.parent;
    this.parseRoot();
  }
  
  parseRoot(){
    try{
      this.parseChildrenAndParentClose();
      assert(this.parent===this.root);
    } catch (error){
      console.log(error);
      if(error.name !== 'caph-parser-error') throw error;
      if(this.pos==this.str.length && this.parent===this.root){
        // Pass. Safe error: expected </> at end because we simulate a fragment root
      } else{ this.error(error)}
    }
    if(this.parent===this.root && this.root[2].length == 1) this.root = this.root[2][0];
  }

  get parentTag(){ return this.parent[0]; }
  get parentProps(){ return this.parent[1]; }
  get children(){ return this.parent[2]; }


  childlessTags = {
    br:true, '!doctype': true, area: true, base: true, col: true, command: true, embed: true, hr: true,img: true, input: true,keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true
  };

  // spacePreservingTags = {
  //   pre: true, span: true, code: true, p: true, b: true, i: true,
  //   a: true, li: true,
  // };


  // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
  /** @type {{[key:string]:string[]}}*/
  static _optionalClose = {
    'li': ['li'],
    'dt': ['dt', 'dd'],
    'dd': ['dd', 'dt'],
    'p': ['p', 'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'pre', 'section', 'table'],
    'rt': ['rt', 'rp'],
    'rp': ['rp', 'rt'],
    'optgroup': ['optgroup'],
    'option': ['option', 'optgroup'],
    //'caption': [], // Disabled rule
    //'colgroup': [], // Disabled rule
    'thead': ['tbody','tfoot'],
    'tbody': ['tbody', 'tfoot'],
    'tfoot': [],
    'tr': ['tr'],
    'td': ['td', 'th'],
    'th': ['th', 'td'],
  };

  static optionalClose(/** @type {TagType}*/ tag){
    if(!tag || !is_string(tag)) return null;
    return this._optionalClose[/** @type {string} tag */(tag)];
  }

  run(/** @type {RegExp}*/regExp){
    // Execute the regular expression on str at pos, and move forward
    const {pos, str} = this;
    regExp.lastIndex = pos;
    const match = regExp.exec(str);
    if(!match) this.throw(`No match for ${regExp}`);
    if(match.index<pos) throw `Regexp must use 'ys' flag. Match for at ${match.index} is before previous match at ${pos}`;
    this.pos += match[0].length;
    return match;
  }

  tryRun(/** @type {RegExp}*/regExp){
    try{ return this.run(regExp); }
    catch(e){ return null; }
  }
  tryRunUndo(/** @type {RegExp}*/regExp){
    const pos = this.pos;
    try{ return this.run(regExp); }
    catch(e){ return null; }
    finally{ this.pos = pos; }
  }

  debugPosition(delta=0, length=50){ // Just for printing debug info
    const {pos, str} = this;
    const at = Math.max(0, pos+delta);
    const short = str.slice(at, at+length).replace('\n', '(\\n)');
    return `${at}...${short}...${at+length}`;
  }

  parseChildrenAndParentClose(){
    /*
      Parses the children of a parent tag or fragment.
      Called (i) from the root level,
      or (ii) after a parent "head" (`<div ...>`) has been consumed,
      or (iii) after a sibling has been consumed entirely.
     */
    while(true){ // capture children until parent close tag is found or end is reached
      this.DEBUG && console.log('parseSibling', this.parent, this.debugPosition());
      // Parse text preceeding the first sibling
      let [text] = this.run(this.REG_EXP_TEXT);
      if(text.length) this.children.push(text);
  
      if(this.tryRun(new RegExp(`${this.ESC}`, 'ys'))){
        let value = this.values[this.valueIndex++];
        for(value of Array.isArray(value)?value:[value]){
          if(value) this.children.push(['@injected', null, [value]]);
        }
        continue;
      }

      // Comment, DOCTYPE, or CDATA
      if(this.str.startsWith('<!', this.pos)){
        this.consumeComment();
        continue;
      }

      let endReached = this.pos==this.str.length;
      if(endReached && this.parentTag && !this.optionalClose(this.parentTag))
          this.throw(`Expected closing tag </${this.parentTag}> or </>`);
      if(endReached) break;
      
      if(this.customRules.length){
        const parsedRule = (()=>{
          for(let {regStart, regEnd, parser} of this.customRules){
            let m = this.tryRun(new RegExp(`${regStart}(.*?)(${regEnd})`, 'ys'));
            if(m) return parser(this.replaceText(m[1], this.pos-m[2].length-m[1].length));
          }
          return null;
        })();
        if(parsedRule){
          this.children.push(parsedRule);
          continue;
        }
      }

      // Parent close
      let /** @type {TagType} */ tag;
      if(this.tryRun(/<\/\s*>/ys)) break;
      if(this.tryRun(/<\//ys)){
        let result = this.tryRun(new RegExp(`([^>\\s]+)\\s*>`, 'ys'));
        if(!result) this.throw(`Expected close tag for parent ${this.parentTag||'fragment'}`);
        let _tag = result[1];
        if (_tag==this.ESC) tag = this.values[this.valueIndex++];
        else tag = _tag;
        if(tag!==this.parentTag) this.throw(`Unmatched close tag ${tag}!=${this.parentTag}`);
        break;
      }

      const optionalClose = this.optionalClose(this.parentTag);
      if(optionalClose){
        if((()=>{
          for(let tag of optionalClose){
            if(this.tryRunUndo(new RegExp(`<${tag}(>|\\s)`, 'ys'),)){
              return true;
            }
          }
        })()) break;
      }

      const /** @type {AstParent} */ newParent = [null, null, []];
      this.children.push(newParent);

      const grandParent = this.parent;
      this.parent = newParent; // change parent temporarily
      this.parseParent(grandParent); // this restores parent
      
      if(newParent[0] == null){ // shortcut fragment nieces as siblings
        assert(this.children.pop() === newParent);
        this.children.push(...newParent[2]);
      }
    }
  }

  parseParent(grandParent){
    /*
      Parses an element from the "head" opening (`<div ...>`)
      until the "tail" close  (`</div>` or `</>`). 
      Called just at the beginning of the head opening.
    */
    this.DEBUG && console.log('parseParent ', this.parent, this.debugPosition());

    let reg = new RegExp(`<([^\\s>\\/\\.]*)`, 'ys');
    let _tag = this.run(reg)[1];
    let /** @type {TagType} */ tag;
    if (_tag==this.ESC){
      tag = this.values[this.valueIndex++];
      if(is_string(tag)) this.throw(`Tag must be a component, not a string.`);
    }
    else if(!_tag.length) tag = null; //null means fragment
    else if(_tag.match(/[^a-z0-9._-]/i)) this.throw(`Error with tag ${_tag}`);
    else tag = _tag;
    if (tag === undefined) this.throw(`Undefined component`);
    
    this.parent[0] = tag;
    let admitsChildren = !this.childlessTags[(''+tag)?.toLowerCase()];
    let /** @type {'jsx'|'tex'|'raw'|'pre'|null}*/ spacing=null;
    
    while(true){ // While attributes

      this.run(/\s*/ys); // Consume whitespace after `<div` or after attribute value
      const endReached = this.pos==this.str.length;
      if(endReached) this.throw(`Expected closing end ...> or .../> for tag ${tag}`);
      
      // Handle head close
      if(this.tryRun(/\/>/ys)){ admitsChildren = false; break; }
      else if(this.tryRun(/>/ys)) break;

      // Read next attribute
      if(!this.parentProps) this.parent[1] = {};
      if(this.tryRun(new RegExp(`\\.\\.\\.${this.ESC}`, 'ys'))){
        this.parent[1] = {...this.parentProps, ...this.values[this.valueIndex++]};
      }
      else{
        let [key] = this.run(/.*?(?=\s|>|=)/ys);
        let _value = this.tryRun(/=/ys) && this.run(new RegExp(`\\".*?\\"|\\'.*?\\'|${this.ESC}`, 'ys'))[0];
        let value;
        // .innerHTML may transform `<div attr >` into `< attr="" >`
        if(!_value || _value=="''"||_value=='""') value = true; 
        else if(_value==this.ESC) value = this.values[this.valueIndex++];
        else value = this.replaceText(_value.slice(1,-1), this.pos-_value.length+1); // slice for quotes
        if(key.endsWith('-eval')){
          key = key.slice(0,-5);
          value = eval(value);
        }
        const prevValue = this.parentProps[key];
        if(key=='class') value = !prevValue?value:prevValue+' '+value;
        else if(key=='style') value = !prevValue?value:prevValue+' '+value;
        else if(prevValue!==undefined) this.warn(`Replacing attribute ${key}.\nPrevious and new values:`, prevValue, value);
        
        if(key.startsWith('(')){
          if(key=='(component)') key = 'data-caph'; // ?? temporary code
          else if(key=='(spacing)'){
            if(!['jsx', 'pre', 'tex', 'raw'].includes(value)) this.throw(`Invalid spacing mode: ${value}`);
            spacing = value;
            continue;
          } else this.throw(`Invalid attribute: ${key}`);
        }
        this.parentProps[key] = value;
      }
    }

    if(admitsChildren){
      if(tag=='style'){ // Style is closed differently
        let m = this.tryRun(/(.*?)<\/style\s*>/ys);
        if(!m) this.throw(`Style tag not closed properly.`);
        this.parent[2] = [m[1]];
      } else if(tag=='script'){ // Script is closed differently
        let m = this.tryRun(/(.*?)<\/script\s*>/ys);
        if(!m) this.throw(`Script tag not closed properly.`);
        let code = m[1];
        if(code.match(/^\s*(String\.raw)?\`(.*)\`\s*$/ys)){
          code = eval(code);
          code = this.cls.htmlSafe(code);
          this.parent[0] = 'div';
          this.parent[1] = {'data-caph':'@code', ...this.parentProps};
          this.parent[2] = [code];
        } else{
          this.parent[2] = [code];
        }
      } else{
        this.parseChildrenAndParentClose(); // (Huge step)
        if(!spacing){
          if(!is_string(tag)) spacing = 'jsx';
          else if(tag=='pre' || tag=='textarea') spacing = 'pre';
          else spacing = 'jsx';
        }
        if(spacing=='jsx') this.parent[2] = this.cls.spacingRulesJsx(this.children);
        else if(spacing=='tex') this.parent[2] = this.cls.spacingRulesParagraphs(this.children);
      }
    }
    this.parent = grandParent;
  }

  static spacingRulesJsx(children){ // JSX spacing
    // https://reactjs.org/blog/2014/02/20/react-v0.9.html#jsx-whitespace
    // https://www.w3.org/TR/REC-html40/struct/text.html#h-9.1
    // https://stackoverflow.com/q/433493
    
    function trimText(text){
      // End spaces are preserved only if they are inline
      return text.replace(/^(\s*)(.*?)(\s*)$/s, (_, l, middle, r)=>{
        if(l.includes('\n')) l='';
        if(r.includes('\n')) r='';
        return `${l}${middle}${r}`
      });
    }
    const ESC = '\ue000';
    const stack = children.filter(x=>!is_string(x)).reverse();
    const text = children.map(x=>is_string(x)?x:ESC).join('');
    const newChildren = [];
    text.split(ESC).forEach((str, i)=>{
      if(i) newChildren.push(stack.pop());
      if(str.length) str = trimText(str);
      if(str.length) newChildren.push(str);
    })
    assert(stack.length==0);
    return newChildren;
  }

  // https://html.spec.whatwg.org/multipage/syntax.html#element-restrictions
  static spacingRulesPre(children){
    const first = children[0];
    if(is_string(first) && first.startsWith('\n')) children[0] = children[0].slice(1);
    return children;
  }

  static spacingRulesParagraphs(children){
    const ESC = '\ue000';
    const stack = children.filter(x=>!is_string(x)).reverse();
    const text = children.map(x=>is_string(x)?x:ESC).join('');
    /** @type {AstNode[]}*/
    const newChildren = text.split(/\s*?\n\s*?\n\s*/s).map(text=>{
      const elems = [];
      text.split(ESC).forEach((str, i)=>{
        if(i) elems.push(stack.pop());
        if(str.length) elems.push(str);
      })
      return ['div', {'class':"caph-paragraph"}, elems];
    });
    assert(stack.length==0);
    return newChildren;
  }

  /** @type {(reason:string)=>never}*/
  throw(reason){
    const error = new Error(`${reason}
      Ignoring what follows.
      Error occurred here:
      ${this.debugPosition(-5)}
    `);
    error.name = 'caph-parser-error';
    throw error;
  }

  consumeComment(){
    const regComment = new RegExp(
      [`<!--.*?-->`, `<!\\[CDATA\\[.*?\\]\\]>`, `<!DOCTYPE\\s*.*?>`,].join('|'),
      'iys',
    );
    let result = this.tryRun(regComment);
    if(!result) this.throw(`Unexpected <!`);
    let [text] = result;
    if(text.endsWith('/>')) this.warn(`Non compliant tag found.\n${this.SPEC}`);
    this.replaceText(text, this.pos-text.length); // Consume the fields inside, if any
  }

  /**
   * @param {string} text
   * @param {number} posOfText
   * @returns {string}*/
  replaceText(text, posOfText){
    return text.replace(new RegExp(this.ESC, 'g'), (_, index)=>{
      assert(this.str[posOfText+index] === this.ESC);
      const original = this.escaped[posOfText+index];
      if (original != this.ESC) return original;
      return this.values[this.valueIndex++];
    });
  }


  static htmlSafe(str) {
    // e.g. converts < into &lt;
    return new Option(str).innerHTML;
  }

  static htmlSafeUndo = (str)=>{
    // e.g. converts &lt; into <, etc. Prevents left trim caused by DOMParser
    const [, l, content] = assertNonNull(str.match(/^(\s*)(.*)$/s));
    const doc = new DOMParser().parseFromString(content, "text/html");
    const text = l+(doc.documentElement.textContent || '');
    // if(str!=text) console.log(`Converted ${str} into ${text}`)
    return text;
  }
  static parseAstHtml(/** @type {string}*/str){
    const astUndoHtml = (/** @type {AstNode}*/ root) => {
      if (is_string(root)) return this.htmlSafeUndo(root);
      if (!Array.isArray(root)) return root;
      //@ts-ignore
      root[2] = root[2].map(child => astUndoHtml(child));
      return root;
    }
    // Parse html, undoing html safe conversions, and then create element
    /** @type {TemplateStringsArray}*/ //@ts-ignore
    let tmp = {raw:[str]};
    let root = this.parseAst(tmp);
    return astUndoHtml(root);
  }

  /**
   * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
  */
  static evalAstFactory(post=null){
    const {createElement, FragmentComponent} = post||{
      createElement: (type, props, ...children)=> (!type||is_string(type))?
        {tag:type, props, children} : type({children, ...props}),
      FragmentComponent: ({children})=>({tag:null, props:null, children}),
    };

    const createTree = (/** @type {AstNode}*/ root) => {
      if (!Array.isArray(root)) return root;
      let [tag, props, children] = root;
      if(tag=='@injected') return root[2][0];
      assert(Array.isArray(children));
      children = children.map(child =>createTree(child));
      if(tag==null){
        assert(props==null);
        tag = FragmentComponent;
      }
      return createElement(tag, props, ...children);
    }
    return createTree;
  }

  static parserFactory(evalAst){
    const cls = this;
    return (/** @type {TemplateStringsArray} */ strings, ...values)=>(
      evalAst(cls.parseAst(strings, ...values))
    );
  }

  /**
   * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
  */
  static debugParserFactory(post=null){
    const cls = this;
    const evalAst = cls.evalAstFactory(post);
    const parse = cls.parserFactory(evalAst);
    const parse1 = ({raw:strings}, ...values)=>evalAst(new cls(strings, values, 1).root);
    const parse2 = ({raw:strings}, ...values)=>evalAst(new cls(strings, values, 2).root);
    const parseAst1 = ({raw:strings}, ...values)=> new cls(strings, values, 1).root;
    const parseAst2 = ({raw:strings}, ...values)=> new cls(strings, values, 2).root;
    return {parse, parse1, parse2, parseAst1, parseAst2, evalAst};
  }


  // asString(obj) {
  //   let out = `${obj}`;
  //   if (out == "[object Object]") {
  //     // let seen = [];
  //     // out = JSON.stringify(obj, function (key, val) {
  //     //   if (val != null && typeof val == "object") {
  //     //     if (seen.indexOf(val) >= 0) return;
  //     //     seen.push(val);
  //     //   }
  //     //   return val; // https://stackoverflow.com/q/9382167
  //     // });
  //     out = obj; //PROBLEM
  //   }
  //   return out;
  // }

});

const NewParser = class extends BaseParser {

  static customRules = [
    ...super.customRules,
    {
      regStart: `(?<!\\\\)\\$\\$`,
      regEnd: `(?<!\\\\)\\$\\$`,
      parser: /**@type {RuleParser}*/ ((text)=>['div', {'data-caph': '@math', displayMode:true}, [text]]),
    },
    {
      regStart: `(?<!\\\\)\\$`,
      regEnd: `(?<!\\\\)\\$`,
      parser: /**@type {RuleParser}*/ ((text)=>['div', {'data-caph': '@math', displayMode:false}, [text]]),
      inline: true,
    },
    {
      regStart: `(?<!\\\\)\`\`\``,
      regEnd: `(?<!\\\\)\`\`\``,
      parser: /**@type {RuleParser}*/ ((text)=>{
        text = text.replace(/\\\`\`\`/g, '```');
        let progLang = assertNonNull(text.match(/^[^\n]*/));
        return ['div', {'data-caph': '@code', ...(!progLang.length?{}:{progLang})}, [text]];
      }),
    },
    {
      regStart: `(?<!\\\\)\``,
      regEnd: `(?<!\\\\)\``,
      parser: /**@type {RuleParser}*/ ((text)=>{
        text = text.replace(/\\\`/g, '`');
        return ['div', {'data-caph': '@code'}, [text]]
      }),
      inline: true,
    },
  ];

}

if(Object.keys(exports).length){window['parser']=exports;}
exports={};

//core/script-loader.js
exports={};
//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="parser.js" />
/// <reference path="preact-globals.js" />

const ScriptLoader = class {

  constructor(/** @type {string[]}*/requirements=[]) {
    for (let a of requirements) this.attach(a);
    this.dist = '../dist';
    for (const e of document.querySelectorAll('script')) {
      if (e.src.endsWith('/caph-docs.js'))
        this.dist = e.src.slice(0, -13);
    }
    //console.log(this.dist);

    this.div = document.getElementById('core-sources');
    if (!this.div) {
      this.div = MyDocument.createElement('div', {
        id: 'core-sources',
        parent: document.head,
        where: 'beforeend',
      });
    }
  }

  _attachments = [];
  /**@param {string} ref */
  /**@returns {string|null} */
  getAttachment(ref) {
    for (let e of this._attachments) if (e.ref == ref) return e.content;
    return null;
  }
  attach(...attachments) {
    for (let s of attachments) {
      if (this.getAttachment(s.ref) === null) this._attachments.push(s);
      else this._attachments.forEach(a => {
        if (a.ref == s.ref) a.content = s.content;
      });
    }
  }


  /**
   * @param {string} ref 
   * @param {{
   * parent?: HTMLElement|null,
   * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
   * attrs?: {[key:string]:string},
   * auto_attrs?: boolean,
   * msTimeout?: number,
   * }} options
   */
  async load(ref, {
    attrs = {}, parent = null, where = 'beforeend', auto_attrs = true,
    msTimeout=3800,
  } = {}) {
    if (parent == null) parent = this.div;
    const ext = ref.split('#')[0].split('?')[0].split('.').pop();
    let tag = ext == 'js' ? 'script' : ext == 'css' ? 'link' : null;
    if (tag == null) throw new Error('Only .js and .css files can be _sources. Got: ' + ext + ' ' + ref);
    let /** @type {{[key:string]:string}}*/ defaults = {};
    if (auto_attrs && tag == 'link') defaults = { rel: 'stylesheet', type: 'text/css' };
    Object.keys(attrs).forEach(k => defaults[k] = attrs[k]);
    let content = this.getAttachment(ref);
    if (content && tag == 'link') tag = 'style';
    attrs = defaults;
    if (content) {
      delete attrs.src;
      delete attrs.href;
    } else {
      if (tag == 'script') attrs.src = ref;
      if (tag == 'link') attrs.href = ref;
    }
    try {
      await this._load_elem(ref, tag, attrs, parent, where, content, msTimeout);
    } catch (err) {
      console.error(err, ref);
      throw err;
    }
  }

  async loadFont(name) {
    return await this.load(`${this.dist}/font-${name}.css`);
  }
  async loadPlugin(name) {
    return await this.load(`${this.dist}/plugin-${name}.js`);
  }

  _loadStatus = {};
  async _load_elem(ref, tag, attrs, parent, where, content, msTimeout) {
    // Handle concurrent calls to load_elem(...) about the same ref
    if (!this._loadStatus[ref]) {
      this._loadStatus[ref] = 1;
      try {
        await this.__load_elem(ref, tag, attrs, parent, where, content, msTimeout);
        this._loadStatus[ref] = 2;
      } catch (err) {
        this._loadStatus[ref] = 0;
        throw err;
      }
    }
    while (this._loadStatus[ref] == 1) { // If being loaded in other thread...
      await sleep(80);
    }
  }

  __load_elem(ref, tag, attrs, parent, where, content, msTimeout) {
    return new Promise((_ok, _err) => {
      let e = document.createElement(tag);
      let done = false;
      e.onload = () => { if (!done) { done = true; _ok(null); } };
      e.onerror = (x) => { if (!done) { done = true; _err(x); } }; // HTTP errors only
      Object.keys(attrs).map(key => e.setAttribute(key, attrs[key]));
      if (content) {
        //@ts-ignore
        let r = window._loaded_resources || {};
        //@ts-ignore
        window._loaded_resources = r;
        r[ref] = false;
        content += `\nwindow._loaded_resources['${ref}']=true;\n`;
        e.innerHTML = content;
        if (tag == 'script') {
          (async () => {
            while (!r[ref]) await sleep(100);
            done = true; _ok(null);
          })();
        } else if (tag == 'style') {
          let ms = 10;
          setTimeout(() => { done = true, _ok(null) }, ms);
        }
      }
      parent.insertAdjacentElement(where, e);
      setTimeout(() => done || _err(['Timeout (12s) loading source:', e]), msTimeout);
    });
  };

  async injectStyle(styleStr) {
    MyDocument.createElement('style', {
      parent: this.div,
      where: 'beforeend',
      text: styleStr,
    });
    await sleep(10);
  }
}


const requirements = [];
requirements.push(JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL2NvcmUvcGx1Z2luLWxvYWRlci5jc3MiLCJjb250ZW50IjoiLsUuZXJyb3J7XG4gIGNvbG9yOiAjY2UxMTExO1xufVxuxiRmbGFzaGluZ8UnLXdlYmtpdC1hbmltYXRpb246IMQlRsckQcgXIDFzIGxpbmVhciBpbmZpbml0ZTvEQN841zh9XG5Aa2V5ZnJhbWVz1znlAJ8wJSB7IG9wYWNpdHk6IDAuMzsgfcQYMTDOGjHFGH1cbugA5WhpZGRlbsVEZGlzcGxheTogbm9ux33IJmJveC1zaGFkb3fFKsoPOiAwcHjGBC4zcmVtIDAuMDXECHZhcigtyzgp7AFay0Bob3Zl5gGJ3VUy31RoLWZ1bGxzY3JlZW4tbGF5x1R3aWR0aDrlAQblAYZoZWlnaHTLEXBvc2nmAZZmaXhlZMUUdG9wOiAwxQtsZWZ0yAx6LWluZGV4xT3MeWhib3h76gE9ZmxleOUBZcYedtQexAYtZGlyZWPGfGNvbHVtbss2Ym94Y2VudGVyeyBqdXN0aWZ5LecCwjogxhnLLXNwYWNlLWFyb3VuZNMwzB/RNmJldHdlZW7ZN8cgyzjkALx75QDC6AJO7QJJ6QDr5QJFyh/nA5XfJmJvcmTpAg/ECzogc29saWQgMnB45wH/dGV4dC1zdHJvbmfnAgAifV0=", {inputEncoding: 'Base64'})));
const scriptLoader = new ScriptLoader(requirements);

if(Object.keys(exports).length){window['script-loader']=exports;}
exports={};

//core/preact-parser.js
exports={};
//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="parser.js" />
/// <reference path="script-loader.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/

/**
 * @typedef {(props:Object)=>T_PreactVDomElement} Component
*/

const preactParser = new class {
  
  /** @type {'katex'|'mathjax'} */
  mathParser = 'katex';
  codeParser = '@codeFallback';
  scriptLoader = scriptLoader;

  officialPlugins = [
    'core-menu',
    'core-about',
    'katex',
    'document',
    'whiteboard',
    'hyphenator',
    // 'slides',
    'mathjax-svg',
    'fabric',
    'codemirror',
    // 'figure-editor',
  ];

  _parser = NewParser;

  parseAst = this._parser.parseAst;

  _evalAst = this._parser.evalAstFactory({
    createElement: this.createElement.bind(this),
    FragmentComponent: preact.Fragment,
  })
  /** @type {(literals:TemplateStringsArray, ...values)=>T_PreactVDomElement}*/
  parse = this._parser.parserFactory(this._evalAst);
  parseNoMarkup = BaseParser.parserFactory(this._evalAst);

  parseHtml(/** @type {string}*/str){
    //@ts-ignore
    return this._evalAst(this._parser.parseAstHtml(str));
  }

  constructor() {
    this.contexts = {};
    this.contexts['core-menu'] = preact.createContext();
  }

  createElement(type, props, ...children) {
    if (props && props.hasOwnProperty('data-caph')) {
      let pluginKey = props['data-caph'];
      if (pluginKey == '@math') pluginKey = this.mathParser;
      if (pluginKey == '@code') pluginKey = this.codeParser;
      if (pluginKey) type = this.plugin(pluginKey);
      else console.warn('caph tag without plugin attribute');
    }
    // if(type=='span' && children.length && is_string(children[0]) && children[0].startsWith('\\Prob')){
    //   console.log(type, props, children);
    // }
    const vDom = preact.createElement(type, props, ...children);
    vDom.pre = true;
    return vDom;
  }

  /** @type {{[key:string]: Component|Promise<Component>}} */
  pluginDefs = {
    'core-error': (async () => ({ children, tooltip }) => {
      const help = preact.useCallback(() => {
        const win = window.open('', '_blank');
        if (!win) throw new Error('Popup blocked');
        win.document.write(`
          <div>
            1. In tex, use \\lt and \\gt instead of &lt; and &gt;.
            <br/>
            2. In html, use \\$ instead of $.
            <br/>
            This prevents any parsing misunderstanding.
          </div>
        `);
      }, []);
      return this.parse`
        <a href="./error-help" onclick=${(e) => {
        e.preventDefault();
          help();
        }}>(help?)</a> 
        <code class="caph-flashing caph-error" title=${tooltip}>${children || tooltip || 'Error'}</code>
      `;
    })(),
    '@paragraphs': (async () =>({ children }) => preact.useMemo(
        ()=>this._evalAst([null, null, this._parser.spacingRulesParagraphs(preact.toChildArray(children))]),
        [children],
    ))(),
    '@codeFallback': (async () => ({ children, progLang }) => preact.useMemo(
      ()=>this.parse`<code>${children}</code>`,
      [children],
    ))(),
  };


  /** @type {{[key:string]: Component}} */
  _pluginComponents = {}
  plugin(key) { // key is either a tag or a url
    const cache = this._pluginComponents;
    return cache[key] || (cache[key] = this.componentWrapper(key));
  }

  /** @type {{[key:string]: Component}} */
  _componentWrappers = {};
  _randomSessionSuffix = ('' + Math.random()).slice(2);
  componentWrapper(key) {
    if (key.match(/[^#\?]*.js(#.*|\?.*|)$/)) key = this.resolveURL(key);
    const cache = this._componentWrappers;
    return cache[key] || (cache[key] = this.newPluginLoader(key));
  }

  /** @returns {Component} */
  newPluginLoader(/** @type {string}*/ key){
    const scriptLoader = this.scriptLoader;
    const pluginDefs = this.pluginDefs;
    const parent = this;
  
    //scriptLoader.load('caph-docs/core/plugin-loader.css');

    const loadStatus = {
      Component: /** @type {null|Component}*/(null),
      error: null,
      renderReady: false,
    }

    function FinalComponent({ children, ...props }) {
      try {
        const Component = assertNonNull(loadStatus.Component);
        const out = Component({ children, ...props });
        assert(!out.then, `Your component can not be a promise itself (${key}).
        Maybe you defined pluginDefs[...] = (async ()=>{...}) instead of pluginDefs[...] = (async ()=>{...})()?
        Please follow the IIFE pattern for async promises.`);
        return out;
      } catch (err) {
        console.error(`Rendering error in plugin ${key}:`, err);
        return parent.parse`<code class="caph-flashing">${children || '...error...'}</code>`;
      }
    }

    function LoadingComponent({ children }) {
      return parent.parse`
      <code class="caph-flashing" title=${`${key} is loading...`}>${children || '...'}</code>`;
    }

    function LoadErrorComponent({}) {
      return parent.parse`<${parent.plugin('core-error')} tooltip=${loadStatus.error}/>`;
    }

    const main = async ()=>{
      // 1. Put the plugin script in the document head and wait for the browser to load the script
      try{
        if (pluginDefs.hasOwnProperty(key)){} // already loaded
        else if (parent.officialPlugins.includes(key)) {
          const url = `${scriptLoader.dist}/plugin-${key}.js`;
          //@ts-ignore (Component instead of Promise<Component>)
          pluginDefs[key] = parent.componentWrapper(url);
        } else if (key.match(/[^#\?]+.js(#.*|\?.*|)$/)) {
          let isOfficial = parent.officialPlugins.map(k => `${scriptLoader.dist}/plugin-${k}.js`).includes(key);
          const url = isOfficial ? key : `${key}?${parent._randomSessionSuffix}`;
          await scriptLoader.load(url);
          pluginDefs[key] = pluginDefs[key] || pluginDefs[url];
          assert(pluginDefs[key], 'Plugin not declared in file: ' + key);
          if (key != url) delete pluginDefs[url];
        }else {
          await MyPromise.until(() => pluginDefs[key], {timeout: 3800});
        } // User plugin
      } catch(err){
        loadStatus.error = err || true;
        console.error(`Could not load plugin ${key}`, err);
        return;
      }
      // 3. Start the plugin promise but don't wait for it
      (async()=>{
        try {
          loadStatus.Component = await pluginDefs[key];
          loadStatus.renderReady = true;
        } catch (err) {
          loadStatus.error = err || true;
          console.log(pluginDefs[key])
          console.error(`Error while awaiting pluginDefs["${key}"]`, err);
        }
      })();
    }
    main();
    return ({ children, ...props })=>{
      const [trigger, setTrigger] = preact.useState(0);

      preact.useEffect(async () => {
        await MyPromise.until(() => loadStatus.renderReady || loadStatus.error);
        setTrigger(Math.random() * 1e12); // refresh this component
      }, []);
      const Component = preact.useMemo(()=>{
        if (loadStatus.renderReady) return FinalComponent;
        else if (loadStatus.error) return LoadErrorComponent;
        else return LoadingComponent;
      }, [trigger]);
      
      return Component({ children, ...props })
    };
  }

  /**
   * @param {string} eventName 
   * @param {(data:any)=>void} callback 
   */
  listenToEvent(eventName, callback) {
    preact.useEffect(() => {
      const actualCallback = (/** @type {Event|CustomEvent}*/ e) => {
        //@ts-ignore: event.detail is not defined for non-custom events
        try{callback(e.detail);}
        catch(err){}
      }
      window.addEventListener(eventName, actualCallback);
      return () => {
        window.removeEventListener(eventName, actualCallback);
      }
    }, [eventName, callback]);
  }

  _globals = {};
  dispatchGlobal(eventName, value) {
    this._globals[eventName] = value;
    let event = new CustomEvent(eventName, {detail:value});
    window.dispatchEvent(event);
    return;
  }
  async untilGlobal(eventName) {
    await MyPromise.until(() => this._globals[eventName]);
    await MyPromise.sleep(500);
  }
  listenToGlobal(eventName) {
    const initial = preact.useMemo(()=>this._globals[eventName], [eventName]);
    const [value, setValue] = preact.useState(initial);
    this.listenToEvent(eventName, setValue);
    return value;
  }

  resolveURL(url) {
    return new URL(url, document.baseURI).href;
  }
  // _URL_is_absolute(url) {
  //   //https://stackoverflow.com/q/10687099
  //   return new URL(document.baseURI).origin !== new URL(url, document.baseURI).origin;
  // }

}

preactParser.scriptLoader.injectStyle(`
.caph-error{
  color: #ce1111;
}
.caph-flashing{
  -webkit-animation: caphFlashingAnimation 1s linear infinite;
  animation: caphFlashingAnimation 1s linear infinite;
}
@keyframes caphFlashingAnimation {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

.caph-hidden{
  display: none;
}

.caph-box-shadow{
  box-shadow: 0px 0px 0.3rem 0.05rem var(--box-shadow);
}
.caph-box-shadow:hover{
  box-shadow: 0px 0px 0.3rem 0.2rem var(--box-shadow);
}
.caph-fullscreen-layer{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.caph-hbox{ display: flex; }
.caph-vbox{ display: flex; flex-direction: column; }
.caph-boxcenter{ justify-content: center; }
.caph-space-around{ justify-content: space-around; }
.caph-space-between{ justify-content: space-between; }
.caph-flex{ flex: 1; }
.caph-hidden{ display:none; }
.caph-plugin-hidden{ display:none; }
.caph-border{
  border: solid 2px var(--text-strong);
}`)

if(Object.keys(exports).length){window['preact-parser']=exports;}
exports={};

//core/preact-globals.js
exports={};
//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="preact-parser.js" />


const preactGlobals = new class {

  parser = preactParser;
  contexts = {};

  constructor(){
    this.contexts['core-menu'] = preact.createContext();
    const parent = this;
    this.menu = new class {
      constructor() {
        this.addOption('Default', { hold: true });
        this.latest = this.option = 'Default';
      }
      options = [];
      onEnter = {};
      onExit = {};
      hold = {};

      /**
       * @param {string} option
       * @param {{
       *  onEnter?:()=>void,
       *  onExit?:()=>void,
       *  hold?:boolean,
       * }} [options]
      */
      addOption(option, { onEnter, onExit, hold } = {}) {
        this.onEnter[option] = onEnter;
        this.onExit[option] = onExit;
        this.hold[option] = hold;
        if (this.options[option]) return;
        this.options.push(option);
        this.options[option] = 1;
        parent.dispatchGlobal('caph-menu-options', Math.random());
      }
      setOption(option) {
        parent.dispatchGlobal('caph-menu-option', Math.random());
        if (this.hold[option]) {
          this.onExit[this.latest] && this.onExit[this.latest]();
          this.latest = this.option;
          this.option = option;
        }
        this.onEnter[option] && this.onEnter[option]();
      }
    };

    async function inject(vDom) {
      // const node = MyDocument.createElement('div', {
      //   parent: document.body,
      //   where: 'afterbegin',
      //   id: 'core-body',
      // })
      const node = document.body;
      preact.render(vDom, node);
    }

    MyPromise.until(() => document.body).then(()=>{
      inject(this.parser.parse`
        <${this.parser.plugin('core-menu')}/>
        <${this.parser.plugin('core-about')}/>
      `);
    });
  }

  /**
   * @param {string} eventName 
   * @param {(data:any)=>void} callback 
   */
  listenToEvent(eventName, callback) {
    preact.useEffect(() => {
      const actualCallback = (/** @type {Event|CustomEvent}*/ e) => {
        //@ts-ignore: event.detail is not defined for non-custom events
        try{callback(e.detail);}
        catch(err){}
      }
      window.addEventListener(eventName, actualCallback);
      return () => {
        window.removeEventListener(eventName, actualCallback);
      }
    }, [eventName, callback]);
  }

  _globals = {};
  dispatchGlobal(eventName, value) {
    this._globals[eventName] = value;
    let event = new CustomEvent(eventName, {detail:value});
    window.dispatchEvent(event);
    return;
  }
  async untilGlobal(eventName) {
    await MyPromise.until(() => this._globals[eventName]);
    await MyPromise.sleep(500);
  }
  listenToGlobal(eventName) {
    const initial = preact.useMemo(()=>this._globals[eventName], [eventName]);
    const [value, setValue] = preact.useState(initial);
    this.listenToEvent(eventName, setValue);
    return value;
  }
}
if(Object.keys(exports).length){window['preact-globals']=exports;}
exports={};

//core/main.js
exports={};
//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="preact-globals.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/


/**
 * @template {Function} T 
 * @param {T} func
 * @param {Object} obj
 * @returns {T}
*/
const bind = (func, obj)=>func.bind(obj);


const caph = new class {
  
  // Exported utils:
  until = MyPromise.until;
  assert = assert;
  sleep = sleep;


  parseAst = bind(NewParser.parseAst, NewParser);
  _parser = preactParser;
  pluginDefs = this._parser.pluginDefs;
  parse = bind(this._parser.parse, this._parser);
  parseNoMarkup = bind(this._parser.parseNoMarkup, this._parser);
  
  parseHtmlAst(/** @type {string}*/str){
    return NewParser.parseAstHtml(str);
  }
  parseHtml(/** @type {string}*/str){
    //@ts-ignore
    return this._parser._evalAst(this.parseHtmlAst(str));
  }
  parseElem(/** @type {HTMLElement}*/elem, /** @type {('clear'|'hide'|'remove')?}*/action){
    const html = elem.innerHTML;
    if(!action){} // Do nothing
    else if(action=='clear') elem.innerHTML = '';
    else if(action=='remove') elem.remove();
    else if (action=='hide') elem.classList.add('caph-hidden');
    return this.parseHtml(html);
  }

  plugin = bind(this._parser.plugin, this._parser);
  
  _scriptLoader = this._parser.scriptLoader;
  load = bind(this._scriptLoader.load, this._scriptLoader);
  loadFont = bind(this._scriptLoader.loadFont, this._scriptLoader);
  injectStyle = bind(this._scriptLoader.injectStyle, this._scriptLoader);

  _preactGlobals = preactGlobals;
  contexts = this._preactGlobals.contexts;
  menu = this._preactGlobals.menu;
  listenToEvent = bind(this._preactGlobals.listenToEvent, this._preactGlobals);
  listenToGlobal = bind(this._preactGlobals.listenToGlobal, this._preactGlobals);
  
  constructor() {}

  mathMacros = {};

  set mathParser(/** @type {'katex'|'mathjax'} */value) {
    this._parser.mathParser = value;
  }
  get mathParser(){ return this._parser.mathParser; }

  get currentSrc() {
    //@ts-ignore
    return /** @type {string}*/(document.currentScript.src);
  }
}

caph.injectStyle(`
div.caph-paragraph + div.caph-paragraph { margin-top: 1em; }
.caph-paragraph h1,h2,h3,h4,h5,h6,ul,ol{ margin:0; }
`);





// tab effects: https://alvarotrigo.com/blog/html-css-tabs/
caph.injectStyle(`
.tabs-header>label>input { display: none; }
.tabs-parent { width: 100%; }
.tabs-header {
  margin-top: 0.1em;
  border-bottom: 1px solid;
}
.tab-label:hover {
  top: -0.25rem;
  transition: top 0.25s;
}
.tabs{
  border: solid 1px;
  border-top: none;
}
.tab-label {
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 0.3em 0.3em 0 0;
  background: unset;
  border: solid 1px;
  white-space:nowrap;
}
/* https://stackoverflow.com/a/10148189/3671939 */
.tab-label { white-space:nowrap; }
.tab-label > span{ white-space: normal; }

.tab-label-true {
  font-weight: bold;
  border-bottom: solid 2px white;
}
.tab-content-false { display:none; }
.tab-content-true {
  display: true;
  opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.15s;
}
@keyframes fadeInOpacity {
	0% { opacity: 0; }
	100% { opacity: 1;}
}
.tab-content-true { padding: 1vw; }
`);
caph.pluginDefs['@tabs'] = ({/** @type {string[]} */ labels, defaultLabel, children})=>{
  const zipped = preact.useMemo(()=>preact.toChildArray(children).map(
    (child,i) => ({label:labels[i]||`Tab ${i+1}`, child})
  ), [labels, children]);
  const [option, setOption] = preact.useState(defaultLabel || zipped[0]?.label);
  return caph.parse`
  <div class="tabs-parent">
    <div class="tabs-header">
      ${labels.map((label)=>caph.parse`
        <label class="tab-label" class=${'tab-label-'+(option==label)}>
          <input type="radio" checked=${option==label} onClick=${()=>setOption(label)}/>
          <span>${label}</>
        </label>`
      )}
    </div>
    <div class="tabs">
      ${zipped.map(({label, child})=>caph.parse`
        <div class=${'tab-content-'+(option==label)}>${child}</>`
      )}
    </div>
  </>`;
}

if(Object.keys(exports).length){window['main']=exports;}
exports={};


return caph;
})));
