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

//core/utils.js
exports={};

function assert(condition, ...messages) {
  if (condition) return;
  throw new Error(...messages);
}

function sleep(ms) {
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
  static assert_all(arr, ...messages) { assert(all(arr), ...messages); }
  static assert_any(arr, ...messages) { assert(any(arr), ...messages); }
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
    for (const i = 0; i < n; i++)l.push(0);
    return l;
  }
  static arange(n) {
    return MyArray.zeros.map((z, i) => i);
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
  static async until(func, { ms = 200, timeout = null } = {}) {
    if (timeout && ms > timeout) ms = timeout / 10;
    let t0 = (new Date()).getTime();
    let value;
    while (!(value = await func())) {
      if (timeout && (new Date()).getTime() > timeout)
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
      MyPromise.until(() => finished, { timeout: ms })
    ]);
    return resp;
  }
}


class MyDocument {
  static createElement(tag, {
    style = {}, id = null, classList = [], text = null, html = null,
    eventListeners = {}, parent = null, where = null, ...attrs } = {}) {
    let e = document.createElement(tag, id ? { id: id } : null);
    classList.forEach(s => e.classList.add(s));
    if (text != null) e.innerText = text;
    if (html != null) e.innerHTML = html;
    if (id != null) e.id = id;
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

  /**
  @param {((value:any, key?:any, obj?:any)=>(any))} func
  */
  static map(obj, func) {
    return MyObject._object_op('map', obj, func);
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(bool|any))} func
  */
  static filter(obj, func) {
    return MyObject._object_op('filter', obj, func);
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(any))} func
  */
  static apply(obj, func) {
    return MyObject._object_op('apply', obj, func);
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(any))} func
  */
  static forEach(obj, func) {
    return MyObject._object_op('forEach', obj, func);
  }

  static _object_op(op, src, func) {
    assert(1 <= func.length && func.length <= 3);
    let dest = {};
    for (let key of Object.keys(src)) {
      let value = src[key]
      let result = MyObject._func(func, value, key);
      if (op == 'map') dest[key] = result;
      else if (op == 'filter') { if (result) dest[key] = value; }
      else if (op == 'apply') src[key] = result;
      else if (op == 'forEach') 1 == 1;
    }
    return (op == 'map' || op == 'filter') ? dest : null;
  }

  static _func(func, value, key) {
    return (
      func.length == 1 ? func(value)
        : func.length == 2 ? func(value, key)
          : func(value, key, src)
    );
  }

  static reduce_dots(obj) {
    // converts {'a.b':1, 'a.c':2, b:3} into {a:{b:1,c:2}, 'b':3}. Returns copy (shallow or deep)
    let dotted = MyObject.object_filter(obj, (v, k) => k.indexOf('.') >= 0);
    let no_dots = MyObject.object_filter(obj, (v, k) => k.indexOf('.') == -1);
    if (Object.keys(dotted).length == 0) return no_dots;
    MyObject.object_forEach(dotted, (v, k) => {
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

  /**
  @param {((value:any, key?:any, obj?:any)=>(bool|any))} filter_func
  */
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

if(Object.keys(exports).length){window['utils']=exports;}
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




window.caph_requirements = JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL2NvcmUvcGx1Z2luLWxvYWRlci5jc3MiLCJjb250ZW50IjoiLsUuZXJyb3J7XG4gIGNvbG9yOiAjY2UxMTExO1xufVxuxiRmbGFzaGluZ8UnLXdlYmtpdC1hbmltYXRpb246IMQlRsckQcgXIDFzIGxpbmVhciBpbmZpbml0ZTvEQN841zh9XG5Aa2V5ZnJhbWVz1znlAJ8wJSB7IG9wYWNpdHk6IDAuMzsgfcQYMTDOGjHFGH0ifV0=", {inputEncoding: 'Base64'}));


/* lzutf8, utils, preact, preact hook are injected above this comment*/

const caph = new class {

  mathPlugin = 'katex';
  mathMacros = {};

  officialPlugins = [
    'core-menu',
    'core-about',
    'katex',
  ];

  utils = {
    unindent: (text) => {
      let lines = text.split('\n');
      let n = lines.filter(l => l.trim().length)
        .map(l => l.length - l.trimStart().length)
        .reduce((p, c) => Math.min(c, p), 1000);
      return lines.map(l => l.slice(n)).join('\n');
    }
  };

  constructor() {
    const requirements = window.caph_requirements || [];
    window.caph_requirements = requirements;
    delete window.caph_requirements;
    for (let a of requirements) this.attach(a);
    this.dist = '../dist';
    for (const e of document.querySelectorAll('script')) {
      if (e.src.endsWith('/caph-docs.js'))
        this.dist = e.src.slice(0, -13);
    }

    this.div = document.getElementById('core-sources');
    if (!this.div) {
      this.div = MyDocument.createElement('div', {
        id: 'core-sources',
        parent: document.head,
        where: 'beforeend',
      });
    }
    this.contexts = {};
    this.contexts['core-menu'] = preact.createContext();
    this._loadMenu();

    // this.user = { // Exported functions
    //   core: this,
    //   contexts: this.contexts,
    //   parse: this.parse.bind(this),
    //   plugin: this.plugin.bind(this),
    //   page: this.page.bind(this),
    //   Plugin?
    // };
  }
  get currentSrc() {
    return document.currentScript.src;
  }

  async injectStyle(styleStr) {
    MyDocument.createElement('style', {
      parent: this.div,
      where: 'beforeend',
      text: styleStr,
    });
    await sleep(10);
  }

  _loadMenu() {
    // this.contexts['core-storage'] = new class extends this.HeadlessContext {
    //   storage = {}
    //   constructor() {
    //     super();
    //     const st = { ...window.localStorage };
    //     for (let k in st) {
    //       try { this.storage[k] = JSON.parse(st[k]); }
    //       catch (err) { }
    //     }
    //   }
    //   value() {
    //     return {
    //       storage: this.storage,
    //       getItem: this.getItem.bind(this),
    //       setItem: this.setItem.bind(this),
    //     };
    //   }
    //   getItem(key) { return this.storage[key]; }
    //   setItem(key, value) {
    //     this.storage[key] = value;
    //     window.localStorage.setItem(key, JSON.stringify(value));
    //     this.update();
    //   }
    // }

    const menuObject = new class {
      constructor() {
        this.addOption('Default', { hold: true });
        this.latest = this.option = 'Default';
      }

      options = [];
      onEnter = {};
      onExit = {};
      hold = {};
      addOption(option, { onEnter, onExit, hold } = {}) {
        this.onEnter[option] = onEnter;
        this.onExit[option] = onExit;
        this.hold[option] = hold;
        if (this.options[option]) return;
        this.options.push(option);
        this.options[option] = 1;
        if (this.option) this.update();
      }
      setOption(option) {
        if (this.hold[option]) {
          this.onExit[this.latest] && this.onExit[this.latest]();
          this.latest = this.option;
          this.option = option;
          this.update();
        }
        this.onEnter[option] && this.onEnter[option]();
      }
      value() {
        return {
          option: this.option,
          options: this.options,
          addOption: this.addOption.bind(this),
          setOption: this.setOption.bind(this),
        };
      }
    }

    const MenuComponent = ({ }) => {
      const [trigger, setTrigger] = preact.useState(0);
      menuObject.update = () => setTrigger(Math.random());

      const menu = preact.useMemo(() => {
        return menuObject.value();
      }, [trigger]);

      return this.parse`
        <${this.contexts['core-menu'].Provider} value=${menu}>
          <${caph.plugin('core-menu')} />
          <${caph.plugin('core-about')} />
        </>
      `;
    }
    async function inject(vDom) {
      await MyPromise.until(() => document.body);
      // const node = MyDocument.createElement('div', {
      //   parent: document.body,
      //   where: 'afterbegin',
      //   id: 'core-body',
      // })
      const node = document.body;
      preact.render(vDom, node);
    }
    inject(this.parse`<${MenuComponent}/>`);
  }
  // const metaContent = document.querySelector('meta[content]');
  // if (!metaContent) MyDocument.createElement('div', {
  //   parent: document.head,
  //   where: 'afterbegin',
  //   name: 'viewport',
  //   content: window.innerWidth > 960 ?
  //     'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'
  //     : 'width=1024'
  // });

  // async createElementReplace(rootElement, vDom = null) {
  //   vDom = vDom || dataParser([`${rootElement.outerHTML}`]);
  //   const sibling = MyDocument.createElement('div', {
  //     'parent': rootElement,
  //     'where': 'afterend',
  //   });
  //   rootElement.parentNode.removeChild(rootElement);
  //   preact.Component(vDom, sibling.parentNode, sibling);
  //   //this.setReady();
  // }

  fileMode = (window.location.protocol == 'file:');
  href(route) {
    if (!this.fileMode) return new URL(route, location.href).href;
    const path = location.pathname;
    const params = new URLSearchParams(location.search);
    const missing = params.get('') || '';
    let base = new URL(route, `file://${path}/${missing}`).href;
    params.delete('');
    params.append('', base.slice(path.length + 8));
    return `${path}?${params.toString()}`;
  }
  baseUrl = '/';
  currentRoute() {
    if (!this.fileMode) {
      const out = location.pathname;
      if (!out.startsWith(this.baseUrl)) console.warn(`${out} does not start with ${this.baseUrl}`);
      return out.slice(this.baseUrl.length);
    }
    const params = new URLSearchParams(location.search);
    return params.get('') || '';
  }

  _attachments = [];
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

  async load(ref, {
    attrs = {}, parent = null, where = 'beforeend',
    auto_attrs = true
  } = {}) {
    if (parent == null) parent = this.div;
    const ext = ref.split('.').pop();
    let tag = ext == 'js' ? 'script' : ext == 'css' ? 'link' : null;
    if (tag == null) throw new Error('Only .js and .css files can be _sources. Got: ' + ext + ' ' + ref);
    let defaults = {};
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
      await this._load_elem(ref, tag, attrs, parent, where, content);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async loadFont(name) {
    return await this.load(`${this.dist}/font-${name}.css`);
  }

  pluginDefs = {};
  _pluginComponents = {}
  plugin(key) {
    // key is either a tag or a url
    let out = this._pluginComponents[key];
    if (out) return out;
    const plugin = this.pluginLoader(key);
    out = plugin.Component.bind(plugin);
    return this._pluginComponents[key] = out;
  }

  _pluginLoaders = {};
  pluginLoader(key) {
    if (key.endsWith('.js')) key = this._URL_resolve(key);
    let out = this._pluginLoaders[key];
    if (out) return out;
    return this._pluginLoaders[key] = new this.PluginLoader(key);
  }

  _URL_resolve(url) {
    return new URL(url, document.baseURI).href;
  }
  _URL_is_absolute(url) {
    //https://stackoverflow.com/q/10687099
    return new URL(document.baseURI).origin !== new URL(url, document.baseURI).origin;
  }

  _loadStatus = {};
  async _load_elem(ref, tag, attrs, parent, where, content) {
    // Handle concurrent calls to load_elem(...) about the same ref
    if (!this._loadStatus[ref]) {
      this._loadStatus[ref] = 1;
      try {
        await this.__load_elem(ref, tag, attrs, parent, where, content);
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

  __load_elem(ref, tag, attrs, parent, where, content) {
    return new Promise((_ok, _err) => {
      let e = document.createElement(tag);
      let done = false;
      e.onload = () => { if (!done) { done = true; _ok(); } };
      e.onerror = (x) => { if (!done) { done = true; _err(x); } }; // HTTP errors only
      Object.keys(attrs).map(key => e.setAttribute(key, attrs[key]));
      if (content) {
        let r = window._loaded_resources || {};
        window._loaded_resources = r;
        r[ref] = false;
        content += `\nwindow._loaded_resources['${ref}']=true;\n`;
        e.innerHTML = content;
        if (tag == 'script') {
          (async () => {
            while (!r[ref]) await sleep(100);
            done = true; _ok();
          })();
        } else if (tag == 'style') {
          let ms = 10;
          setTimeout(() => { done = true, _ok() }, ms);
        }
      }
      parent.insertAdjacentElement(where, e);
      setTimeout(() => done || _err(['Timeout (12s) loading source:', e]), 12000);
    });
  };

  // template literal parsers


  parse({ raw: strings }, ...values) {
    return this._parse(true, strings, ...values);
  }

  parseEsc(strings, ...values) {
    return this._parse(true, strings, ...values);
  }

  parseNoMarkup({ raw: strings }, ...values) {
    return this._parse(false, strings, ...values);
  }
  parseNoMarkupEsc(strings, ...values) {
    return this._parse(false, strings, ...values);
  }

  _parse_init() {
    // copied from xhtm
    const empty = {};
    const FIELD = '\ue000';
    const QUOTES = '\ue001';
    const ESCAPED_DOLLAR = '\ue002';
    const regex_FIELD = new RegExp(FIELD, 'g');
    const regex_QUOTES = new RegExp(QUOTES, 'g');
    const regex_ESCAPED_DOLLAR = new RegExp(ESCAPED_DOLLAR, 'g');

    'area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml'.split(' ').map(v => empty[v] = empty[v.toUpperCase()] = true)

    // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
    // closed by the corresponding tag or end of parent content
    const close = {
      'li': '',
      'dt': 'dd',
      'dd': 'dt',
      'p': 'address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table',
      'rt': 'rp',
      'rp': 'rt',
      'optgroup': '',
      'option': 'optgroup',
      'caption': 'tbody thead tfoot tr colgroup',
      'colgroup': 'thead tbody tfoot tr caption',
      'thead': 'tbody tfoot caption',
      'tbody': 'tfoot caption',
      'tfoot': 'caption',
      'tr': 'tbody tfoot',
      'td': 'th tr',
      'th': 'td tr tbody',
    };
    for (let tag in close) {
      [...close[tag].split(' '), tag].map(closer => {
        close[tag] =
          close[tag.toUpperCase()] =
          close[tag + closer] =
          close[tag.toUpperCase() + closer] =
          close[tag + closer.toUpperCase()] =
          close[tag.toUpperCase() + closer.toUpperCase()] =
          true;
      })
    }
    this._parseEnv = { empty, close, FIELD, QUOTES, ESCAPED_DOLLAR, regex_FIELD, regex_QUOTES, regex_ESCAPED_DOLLAR }
  }

  createElement(type, props, ...children) {
    if (type == 'caph') {
      const pluginKey = props && props['plugin'];
      if (pluginKey) type = this.plugin(pluginKey);
      else console.warn('caph tag without plugin attribute');
    }
    children = children.map(
      x => this._is_string(x) ? this._html_safe_undo(x) : x);
    return preact.createElement(type, props, ...children);
  }


  _is_string(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
  }
  _html_safe(str) {
    // e.g. converts < into &lt;
    return new Option(str).innerHTML;
  }
  _html_safe_undo(str) {
    // e.g. converts &lt; into <
    const doc = new DOMParser().parseFromString(str, "text/html");
    const text = doc.documentElement.textContent;
    return text;
  }
  _html_is_valid_attr_key(key) {
    return /^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/.test(key);
  }
  _parse(parse_math, strings, ...values) {
    // based on xhtm, which is based on htm. Differences:
    // 1. Replaces html entities
    // 2. Parses math markup.
    // 3. Solves some errors instead of blocking.
    if (this._parseEnv === undefined) this._parse_init();
    const { empty, close, FIELD, QUOTES, ESCAPED_DOLLAR, regex_FIELD, regex_QUOTES, regex_ESCAPED_DOLLAR } = this._parseEnv;
    let prev = 0, current = [], field = 0, args, name, value, quotes = [], quote = 0, last;
    current.root = true;

    const evaluate = (str, parts = [], raw) => {
      let i = 0;
      str = !raw && str === QUOTES ?
        quotes[quote++].slice(1, -1) :
        str.replace(regex_QUOTES, m => quotes[quote++]);
      if (!str) return str;
      str.replace(regex_FIELD, (match, idx) => {
        if (idx) parts.push(str.slice(i, idx));
        i = idx + 1;
        return parts.push(values[field++]);
      })
      if (i < str.length) parts.push(str.slice(i));
      return parts.length > 1 ? parts : parts[0];
    }
    // close level
    const up = () => {
      [current, last, ...args] = current;
      const elem = this.createElement(last, ...args);
      current.push(elem);
    }
    const setAttr = (props, key, value) => {
      if (this._html_is_valid_attr_key(key))
        return props[key] = value;
      // Fix the error to avoid blocking the whole render process
      const tag = current[1];
      console.error(`Parsing error near <${tag} ... ${key}.`)
      if (key[0] == '<') {
        const newTag = key.slice(1);
        console.warn(`Ignoring <${tag}. Assuming <${newTag}...`);
        current[1] = newTag;
      }
    }
    let s = strings.join(FIELD);
    if (parse_math) {
      s = s.replace(/\\\$/g, ESCAPED_DOLLAR);
      s = s.replace(/([^\\]|^)\$(.*?[^\\])\$/g, (match, p1, p2) => {
        // const i = match.search(/\<|\>/);
        // if (i != -1) {
        //   match = match.replace(regex_ESCAPED_DOLLAR, '\\\$');
        //   console.error('Parsing error:', match);
        //   const safe = this._html_safe(match);
        //   return `<caph plugin="core-error">${safe}</>`;
        // }
        p2 = p2.replace(/\</g, '\\lt ');
        p2 = p2.replace(/\>/g, '\\gt ');
        p2 = p2.replace(regex_ESCAPED_DOLLAR, '\\\$');
        return `${p1}<caph plugin=${this.mathPlugin}>${p2}</>`;
      });
      s = s.replace(regex_ESCAPED_DOLLAR, '$'); // \$ in html becomes $
    }
    s = s.replace(/<!--[^]*-->/g, '');
    s = s.replace(/<!\[CDATA\[[^]*\]\]>/g, '');
    s = s.replace(/('|")[^\1]*?\1/g, match => (quotes.push(match), QUOTES));
    // .replace(/^\s*\n\s*|\s*\n\s*$/g,'')
    s = s.replace(/\s+/g, ' ');
    // ...>text<... sequence
    s = s.replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx, str) => {
      let closeTag, tag;
      if (idx) {
        let ss = str.slice(prev, idx);
        // <abc/> → <abc />
        ss = ss.replace(/(\S)\/$/, '$1 /');
        ss.split(' ').map((part, i) => {
          if (part[0] === '/') {
            closeTag = tag || part.slice(1) || 1;
          }
          else if (!i) {
            tag = evaluate(part);
            // <p>abc<p>def, <tr><td>x<tr>
            while (close[current[1] + tag]) up();
            current = [current, tag, null];
            if (empty[tag]) closeTag = tag;
          }
          else if (part) {
            let props = current[2] || (current[2] = {});
            if (part.slice(0, 3) === '...') {
              const newProps = values[field++];
              for (let key in newProps) {
                setAttr(props, key, newProps[key]);
              }
            }
            else {
              [name, value] = part.split('=');
              setAttr(props, evaluate(name), value ? evaluate(value) : true);
            }
          }
        })
      }
      if (closeTag) {
        up();
        // if last child is closable - closeTag it too
        while (last !== closeTag && close[last]) up();
      }
      prev = idx + match.length;
      if (text && text !== ' ') evaluate((last = 0, text), current, true);
    });
    if (!current.root) up();
    return current.length > 1 ? current : current[0];
  }
}


caph.Plugin = class {

  async loader() { }

  Component({ children, ...props }) {
    console.error('Override the Component method of this object:', this);
    return caph.parse`<${caph.plugin('core-error')}> Override the Component method</> `;
  }

}

caph.PluginLoader = class extends caph.Plugin {

  constructor(key) {
    super();
    this.key = key;
    this.loader();
    caph.load('caph-docs/core/plugin-loader.css');
  }

  plugin = null;
  error = null;
  renderReady = false;

  async loader() {
    // 1. Put the plugin script in the document head
    // 2. Wait for the browser to load the script
    this.plugin = await this.loadPlugin();
    // 3. Start but don't wait for the plugin loader
    this.pluginLoader();
  }

  async loadPlugin() {
    const key = this.key;
    if (caph.pluginDefs[key]) {
      return caph.pluginDefs[key]; // already loaded
    }
    if (key.endsWith('.js')) {
      await caph.load(key);
      assert(caph.pluginDefs[key], 'Plugin not declared in file: ' + key);
      return caph.pluginDefs[key];
    }
    if (caph.officialPlugins.includes(key)) {
      const url = `${caph.dist}/plugin-${key}.js`;
      return caph.pluginDefs[key] = caph.pluginLoader(url);
    }
    return await MyPromise.until(() => caph.pluginDefs[key]);
  }

  async pluginLoader() {
    try {
      await this.plugin.loader();
      this.renderReady = true;
    } catch (err) {
      this.error = err || true;
      console.error(err);
    }
  }


  Component({ children, ...props }) {
    // eventually overridden by FinalComponent
    return this.TemporalComponent({ children, ...props });
  }

  TemporalComponent({ children, ...props }) {
    const [_, setTrigger] = preact.useState(0);

    preact.useEffect(async () => {
      await MyPromise.until(() => this.renderReady || this.error);
      setTrigger(Math.random() * 1e12); // refresh this component
    }, []);

    if (this.renderReady) return this.FinalComponent({ children, ...props });
    else if (this.error) return this._loadErrorComponent({ children });
    else return this._loadingComponent({ children });
  }

  FinalComponent({ children, ...props }) {
    this.Component = this.FinalComponent; // override the Component method
    try {
      return this.plugin.Component({ children, ...props });
    } catch (err) {
      console.error(`Rendering error in plugin ${this.key}:`, err);
      return caph.parse`<code class="flashing">${children}</code>`;
    }
  }

  _loadingComponent({ children }) {
    return caph.parse`
    <code class="caph-flashing" title=${`${this.key} is loading...`}>
      ${children}
    </code>`;
  }

  _loadErrorComponent({ children }) {
    return caph.parse`<${caph.plugin('core-error')} tooltip=${this.error}/>`;
  }
}

caph.pluginDefs['core-error'] = new class extends caph.Plugin {

  Component({ children, tooltip }) {
    const help = preact.useCallback(() => {
      const win = window.open('', '_blank');
      win.document.write(
        `<div class="tooltip-text" style="width:30em">
      1. In tex, use \\lt and \\gt instead of &lt; and &gt;.
      <br/>
      2. In html, use \\$ instead of $.
      <br/>
      This prevents any parsing misunderstanding.
    </div>`
      );
    }, []);
    return caph.parse`
      <a href="javascript:;" onclick=${help}>(help?)</a> 
      <code class="caph-flashing caph-error" title=${tooltip}>
        ${children}
      </code>
    `;
  }
}


