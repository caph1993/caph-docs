/*!
 LZ-UTF8 v0.5.5

 Copyright (c) 2018, Rotem Dan
 Released under the MIT license.

 Build date: 2018-07-30 

 Please report any issue at https://github.com/rotemdan/lzutf8.js/issues
*/
var LZUTF8;if(function(n){n.runningInNodeJS=function(){return"object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node},n.runningInMainNodeJSModule=function(){return n.runningInNodeJS()&&require.main===module},n.commonJSAvailable=function(){return"object"==typeof module&&"object"==typeof module.exports},n.runningInWebWorker=function(){return"undefined"==typeof window&&"object"==typeof self&&"function"==typeof self.addEventListener&&"function"==typeof self.close},n.runningInNodeChildProcess=function(){return n.runningInNodeJS()&&"function"==typeof process.send},n.runningInNullOrigin=function(){return"object"==typeof window&&"object"==typeof window.location&&("http:"!==document.location.protocol&&"https:"!==document.location.protocol)},n.webWorkersAvailable=function(){return"function"==typeof Worker&&!n.runningInNullOrigin()&&(!n.runningInNodeJS()&&!(navigator&&navigator.userAgent&&0<=navigator.userAgent.indexOf("Android 4.3")))},n.log=function(e,t){void 0===t&&(t=!1),"object"==typeof console&&(console.log(e),t&&"object"==typeof document&&(document.body.innerHTML+=e+"<br/>"))},n.createErrorMessage=function(e,t){if(void 0===t&&(t="Unhandled exception"),null==e)return t;if(t+=": ","object"==typeof e.content){if(n.runningInNodeJS())return t+e.content.stack;var r=JSON.stringify(e.content);return"{}"!==r?t+r:t+e.content}return"string"==typeof e.content?t+e.content:t+e},n.printExceptionAndStackTraceToConsole=function(e,t){void 0===t&&(t="Unhandled exception"),n.log(n.createErrorMessage(e,t))},n.getGlobalObject=function(){return"object"==typeof global?global:"object"==typeof window?window:"object"==typeof self?self:{}},n.toString=Object.prototype.toString,n.commonJSAvailable()&&(module.exports=n)}(LZUTF8||(LZUTF8={})),"function"==typeof Uint8Array&&0!==new Uint8Array(1).subarray(1).byteLength){var subarray=function(e,t){var r=function(e,t,r){return e<t?t:r<e?r:e};e|=0,t|=0,arguments.length<1&&(e=0),arguments.length<2&&(t=this.length),e<0&&(e=this.length+e),t<0&&(t=this.length+t),e=r(e,0,this.length);var n=(t=r(t,0,this.length))-e;return n<0&&(n=0),new this.constructor(this.buffer,this.byteOffset+e*this.BYTES_PER_ELEMENT,n)},types=["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"],globalObject=void 0;if("object"==typeof window?globalObject=window:"object"==typeof self&&(globalObject=self),void 0!==globalObject)for(var i=0;i<types.length;i++)globalObject[types[i]]&&(globalObject[types[i]].prototype.subarray=subarray)}!function(f){var e=function(){function e(){}return e.compressAsync=function(e,n,o){var i=new f.Timer,u=new f.Compressor;if(!o)throw new TypeError("compressAsync: No callback argument given");if("string"==typeof e)e=f.encodeUTF8(e);else if(null==e||!(e instanceof Uint8Array))return void o(void 0,new TypeError("compressAsync: Invalid input argument, only 'string' and 'Uint8Array' are supported"));var s=f.ArrayTools.splitByteArray(e,n.blockSize),a=[],c=function(e){if(e<s.length){var t=void 0;try{t=u.compressBlock(s[e])}catch(e){return void o(void 0,e)}a.push(t),i.getElapsedTime()<=20?c(e+1):(f.enqueueImmediate(function(){return c(e+1)}),i.restart())}else{var r=f.ArrayTools.concatUint8Arrays(a);f.enqueueImmediate(function(){var e;try{e=f.CompressionCommon.encodeCompressedBytes(r,n.outputEncoding)}catch(e){return void o(void 0,e)}f.enqueueImmediate(function(){return o(e)})})}};f.enqueueImmediate(function(){return c(0)})},e.createCompressionStream=function(){var o=new f.Compressor,i=new(require("stream").Transform)({decodeStrings:!0,highWaterMark:65536});return i._transform=function(e,t,r){var n;try{n=f.BufferTools.uint8ArrayToBuffer(o.compressBlock(f.BufferTools.bufferToUint8Array(e)))}catch(e){return void i.emit("error",e)}i.push(n),r()},i},e}();f.AsyncCompressor=e}(LZUTF8||(LZUTF8={})),function(f){var e=function(){function e(){}return e.decompressAsync=function(e,n,o){if(!o)throw new TypeError("decompressAsync: No callback argument given");var i=new f.Timer;try{e=f.CompressionCommon.decodeCompressedBytes(e,n.inputEncoding)}catch(e){return void o(void 0,e)}var u=new f.Decompressor,s=f.ArrayTools.splitByteArray(e,n.blockSize),a=[],c=function(e){if(e<s.length){var t=void 0;try{t=u.decompressBlock(s[e])}catch(e){return void o(void 0,e)}a.push(t),i.getElapsedTime()<=20?c(e+1):(f.enqueueImmediate(function(){return c(e+1)}),i.restart())}else{var r=f.ArrayTools.concatUint8Arrays(a);f.enqueueImmediate(function(){var e;try{e=f.CompressionCommon.encodeDecompressedBytes(r,n.outputEncoding)}catch(e){return void o(void 0,e)}f.enqueueImmediate(function(){return o(e)})})}};f.enqueueImmediate(function(){return c(0)})},e.createDecompressionStream=function(){var o=new f.Decompressor,i=new(require("stream").Transform)({decodeStrings:!0,highWaterMark:65536});return i._transform=function(e,t,r){var n;try{n=f.BufferTools.uint8ArrayToBuffer(o.decompressBlock(f.BufferTools.bufferToUint8Array(e)))}catch(e){return void i.emit("error",e)}i.push(n),r()},i},e}();f.AsyncDecompressor=e}(LZUTF8||(LZUTF8={})),function(i){var e,u;(u=e=i.WebWorker||(i.WebWorker={})).compressAsync=function(e,t,r){if("ByteArray"!=t.inputEncoding||e instanceof Uint8Array){var n={token:Math.random().toString(),type:"compress",data:e,inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding},o=function(e){var t=e.data;t&&t.token==n.token&&(u.globalWorker.removeEventListener("message",o),"error"==t.type?r(void 0,new Error(t.error)):r(t.data))};u.globalWorker.addEventListener("message",o),u.globalWorker.postMessage(n,[])}else r(void 0,new TypeError("compressAsync: input is not a Uint8Array"))},u.decompressAsync=function(e,t,r){var n={token:Math.random().toString(),type:"decompress",data:e,inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding},o=function(e){var t=e.data;t&&t.token==n.token&&(u.globalWorker.removeEventListener("message",o),"error"==t.type?r(void 0,new Error(t.error)):r(t.data))};u.globalWorker.addEventListener("message",o),u.globalWorker.postMessage(n,[])},u.installWebWorkerIfNeeded=function(){"object"==typeof self&&void 0===self.document&&null!=self.addEventListener&&(self.addEventListener("message",function(e){var t=e.data;if("compress"==t.type){var r=void 0;try{r=i.compress(t.data,{outputEncoding:t.outputEncoding})}catch(e){return void self.postMessage({token:t.token,type:"error",error:i.createErrorMessage(e)},[])}(n={token:t.token,type:"compressionResult",data:r,encoding:t.outputEncoding}).data instanceof Uint8Array&&-1===navigator.appVersion.indexOf("MSIE 10")?self.postMessage(n,[n.data.buffer]):self.postMessage(n,[])}else if("decompress"==t.type){var n,o=void 0;try{o=i.decompress(t.data,{inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding})}catch(e){return void self.postMessage({token:t.token,type:"error",error:i.createErrorMessage(e)},[])}(n={token:t.token,type:"decompressionResult",data:o,encoding:t.outputEncoding}).data instanceof Uint8Array&&-1===navigator.appVersion.indexOf("MSIE 10")?self.postMessage(n,[n.data.buffer]):self.postMessage(n,[])}}),self.addEventListener("error",function(e){i.log(i.createErrorMessage(e.error,"Unexpected LZUTF8 WebWorker exception"))}))},u.createGlobalWorkerIfNeeded=function(){if(u.globalWorker)return!0;if(!i.webWorkersAvailable())return!1;if(!u.scriptURI&&"object"==typeof document){var e=document.getElementById("lzutf8");null!=e&&(u.scriptURI=e.getAttribute("src")||void 0)}return!!u.scriptURI&&(u.globalWorker=new Worker(u.scriptURI),!0)},u.terminate=function(){u.globalWorker&&(u.globalWorker.terminate(),u.globalWorker=void 0)},e.installWebWorkerIfNeeded()}(LZUTF8||(LZUTF8={})),function(e){var t=function(){function e(e,t,r){this.container=e,this.startPosition=t,this.length=r}return e.prototype.get=function(e){return this.container[this.startPosition+e]},e.prototype.getInReversedOrder=function(e){return this.container[this.startPosition+this.length-1-e]},e.prototype.set=function(e,t){this.container[this.startPosition+e]=t},e}();e.ArraySegment=t}(LZUTF8||(LZUTF8={})),function(e){var t;(t=e.ArrayTools||(e.ArrayTools={})).copyElements=function(e,t,r,n,o){for(;o--;)r[n++]=e[t++]},t.zeroElements=function(e,t,r){for(;r--;)e[t++]=0},t.countNonzeroValuesInArray=function(e){for(var t=0,r=0;r<e.length;r++)e[r]&&t++;return t},t.truncateStartingElements=function(e,t){if(e.length<=t)throw new RangeError("truncateStartingElements: Requested length should be smaller than array length");for(var r=e.length-t,n=0;n<t;n++)e[n]=e[r+n];e.length=t},t.doubleByteArrayCapacity=function(e){var t=new Uint8Array(2*e.length);return t.set(e),t},t.concatUint8Arrays=function(e){for(var t=0,r=0,n=e;r<n.length;r++)t+=(a=n[r]).length;for(var o=new Uint8Array(t),i=0,u=0,s=e;u<s.length;u++){var a=s[u];o.set(a,i),i+=a.length}return o},t.splitByteArray=function(e,t){for(var r=[],n=0;n<e.length;){var o=Math.min(t,e.length-n);r.push(e.subarray(n,n+o)),n+=o}return r}}(LZUTF8||(LZUTF8={})),function(e){var t;(t=e.BufferTools||(e.BufferTools={})).convertToUint8ArrayIfNeeded=function(e){return"function"==typeof Buffer&&Buffer.isBuffer(e)?t.bufferToUint8Array(e):e},t.uint8ArrayToBuffer=function(e){if(Buffer.prototype instanceof Uint8Array){var t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);return Object.setPrototypeOf(t,Buffer.prototype),t}for(var r=e.length,n=new Buffer(r),o=0;o<r;o++)n[o]=e[o];return n},t.bufferToUint8Array=function(e){if(Buffer.prototype instanceof Uint8Array)return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);for(var t=e.length,r=new Uint8Array(t),n=0;n<t;n++)r[n]=e[n];return r}}(LZUTF8||(LZUTF8={})),function(o){var e;(e=o.CompressionCommon||(o.CompressionCommon={})).getCroppedBuffer=function(e,t,r,n){void 0===n&&(n=0);var o=new Uint8Array(r+n);return o.set(e.subarray(t,t+r)),o},e.getCroppedAndAppendedByteArray=function(e,t,r,n){return o.ArrayTools.concatUint8Arrays([e.subarray(t,t+r),n])},e.detectCompressionSourceEncoding=function(e){if(null==e)throw new TypeError("detectCompressionSourceEncoding: input is null or undefined");if("string"==typeof e)return"String";if(e instanceof Uint8Array||"function"==typeof Buffer&&Buffer.isBuffer(e))return"ByteArray";throw new TypeError("detectCompressionSourceEncoding: input must be of type 'string', 'Uint8Array' or 'Buffer'")},e.encodeCompressedBytes=function(e,t){switch(t){case"ByteArray":return e;case"Buffer":return o.BufferTools.uint8ArrayToBuffer(e);case"Base64":return o.encodeBase64(e);case"BinaryString":return o.encodeBinaryString(e);case"StorageBinaryString":return o.encodeStorageBinaryString(e);default:throw new TypeError("encodeCompressedBytes: invalid output encoding requested")}},e.decodeCompressedBytes=function(e,t){if(null==t)throw new TypeError("decodeCompressedData: Input is null or undefined");switch(t){case"ByteArray":case"Buffer":var r=o.BufferTools.convertToUint8ArrayIfNeeded(e);if(!(r instanceof Uint8Array))throw new TypeError("decodeCompressedData: 'ByteArray' or 'Buffer' input type was specified but input is not a Uint8Array or Buffer");return r;case"Base64":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'Base64' input type was specified but input is not a string");return o.decodeBase64(e);case"BinaryString":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'BinaryString' input type was specified but input is not a string");return o.decodeBinaryString(e);case"StorageBinaryString":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'StorageBinaryString' input type was specified but input is not a string");return o.decodeStorageBinaryString(e);default:throw new TypeError("decodeCompressedData: invalid input encoding requested: '"+t+"'")}},e.encodeDecompressedBytes=function(e,t){switch(t){case"String":return o.decodeUTF8(e);case"ByteArray":return e;case"Buffer":if("function"!=typeof Buffer)throw new TypeError("encodeDecompressedBytes: a 'Buffer' type was specified but is not supported at the current envirnment");return o.BufferTools.uint8ArrayToBuffer(e);default:throw new TypeError("encodeDecompressedBytes: invalid output encoding requested")}}}(LZUTF8||(LZUTF8={})),function(o){var t,e,i,u;e=t=o.EventLoop||(o.EventLoop={}),u=[],e.enqueueImmediate=function(e){u.push(e),1===u.length&&i()},e.initializeScheduler=function(){var t=function(){for(var e=0,t=u;e<t.length;e++){var r=t[e];try{r.call(void 0)}catch(e){o.printExceptionAndStackTraceToConsole(e,"enqueueImmediate exception")}}u.length=0};if(o.runningInNodeJS()&&(i=function(){return setImmediate(function(){return t()})}),"object"==typeof window&&"function"==typeof window.addEventListener&&"function"==typeof window.postMessage){var e,r="enqueueImmediate-"+Math.random().toString();window.addEventListener("message",function(e){e.data===r&&t()}),e=o.runningInNullOrigin()?"*":window.location.href,i=function(){return window.postMessage(r,e)}}else if("function"==typeof MessageChannel&&"function"==typeof MessagePort){var n=new MessageChannel;n.port1.onmessage=function(){return t()},i=function(){return n.port2.postMessage(0)}}else i=function(){return setTimeout(function(){return t()},0)}},e.initializeScheduler(),o.enqueueImmediate=function(e){return t.enqueueImmediate(e)}}(LZUTF8||(LZUTF8={})),function(e){var r;(r=e.ObjectTools||(e.ObjectTools={})).override=function(e,t){return r.extend(e,t)},r.extend=function(e,t){if(null==e)throw new TypeError("obj is null or undefined");if("object"!=typeof e)throw new TypeError("obj is not an object");if(null==t&&(t={}),"object"!=typeof t)throw new TypeError("newProperties is not an object");if(null!=t)for(var r in t)e[r]=t[r];return e}}(LZUTF8||(LZUTF8={})),function(o){o.getRandomIntegerInRange=function(e,t){return e+Math.floor(Math.random()*(t-e))},o.getRandomUTF16StringOfLength=function(e){for(var t="",r=0;r<e;r++){for(var n=void 0;55296<=(n=o.getRandomIntegerInRange(0,1114112))&&n<=57343;);t+=o.Encoding.CodePoint.decodeToString(n)}return t}}(LZUTF8||(LZUTF8={})),function(e){var t=function(){function e(e){void 0===e&&(e=1024),this.outputBufferCapacity=e,this.outputPosition=0,this.outputString="",this.outputBuffer=new Uint16Array(this.outputBufferCapacity)}return e.prototype.appendCharCode=function(e){this.outputBuffer[this.outputPosition++]=e,this.outputPosition===this.outputBufferCapacity&&this.flushBufferToOutputString()},e.prototype.appendCharCodes=function(e){for(var t=0,r=e.length;t<r;t++)this.appendCharCode(e[t])},e.prototype.appendString=function(e){for(var t=0,r=e.length;t<r;t++)this.appendCharCode(e.charCodeAt(t))},e.prototype.appendCodePoint=function(e){if(e<=65535)this.appendCharCode(e);else{if(!(e<=1114111))throw new Error("appendCodePoint: A code point of "+e+" cannot be encoded in UTF-16");this.appendCharCode(55296+(e-65536>>>10)),this.appendCharCode(56320+(e-65536&1023))}},e.prototype.getOutputString=function(){return this.flushBufferToOutputString(),this.outputString},e.prototype.flushBufferToOutputString=function(){this.outputPosition===this.outputBufferCapacity?this.outputString+=String.fromCharCode.apply(null,this.outputBuffer):this.outputString+=String.fromCharCode.apply(null,this.outputBuffer.subarray(0,this.outputPosition)),this.outputPosition=0},e}();e.StringBuilder=t}(LZUTF8||(LZUTF8={})),function(o){var e=function(){function e(){this.restart()}return e.prototype.restart=function(){this.startTime=e.getTimestamp()},e.prototype.getElapsedTime=function(){return e.getTimestamp()-this.startTime},e.prototype.getElapsedTimeAndRestart=function(){var e=this.getElapsedTime();return this.restart(),e},e.prototype.logAndRestart=function(e,t){void 0===t&&(t=!0);var r=this.getElapsedTime(),n=e+": "+r.toFixed(3)+"ms";return o.log(n,t),this.restart(),r},e.getTimestamp=function(){return this.timestampFunc||this.createGlobalTimestampFunction(),this.timestampFunc()},e.getMicrosecondTimestamp=function(){return Math.floor(1e3*e.getTimestamp())},e.createGlobalTimestampFunction=function(){if("object"==typeof process&&"function"==typeof process.hrtime){var r=0;this.timestampFunc=function(){var e=process.hrtime(),t=1e3*e[0]+e[1]/1e6;return r+t},r=Date.now()-this.timestampFunc()}else if("object"==typeof chrome&&chrome.Interval){var e=Date.now(),t=new chrome.Interval;t.start(),this.timestampFunc=function(){return e+t.microseconds()/1e3}}else if("object"==typeof performance&&performance.now){var n=Date.now()-performance.now();this.timestampFunc=function(){return n+performance.now()}}else Date.now?this.timestampFunc=function(){return Date.now()}:this.timestampFunc=function(){return(new Date).getTime()}},e}();o.Timer=e}(LZUTF8||(LZUTF8={})),function(n){var e=function(){function e(e){void 0===e&&(e=!0),this.MinimumSequenceLength=4,this.MaximumSequenceLength=31,this.MaximumMatchDistance=32767,this.PrefixHashTableSize=65537,this.inputBufferStreamOffset=1,e&&"function"==typeof Uint32Array?this.prefixHashTable=new n.CompressorCustomHashTable(this.PrefixHashTableSize):this.prefixHashTable=new n.CompressorSimpleHashTable(this.PrefixHashTableSize)}return e.prototype.compressBlock=function(e){if(null==e)throw new TypeError("compressBlock: undefined or null input received");return"string"==typeof e&&(e=n.encodeUTF8(e)),e=n.BufferTools.convertToUint8ArrayIfNeeded(e),this.compressUtf8Block(e)},e.prototype.compressUtf8Block=function(e){if(!e||0==e.length)return new Uint8Array(0);var t=this.cropAndAddNewBytesToInputBuffer(e),r=this.inputBuffer,n=this.inputBuffer.length;this.outputBuffer=new Uint8Array(e.length);for(var o=this.outputBufferPosition=0,i=t;i<n;i++){var u=r[i],s=i<o;if(i>n-this.MinimumSequenceLength)s||this.outputRawByte(u);else{var a=this.getBucketIndexForPrefix(i);if(!s){var c=this.findLongestMatch(i,a);null!=c&&(this.outputPointerBytes(c.length,c.distance),o=i+c.length,s=!0)}s||this.outputRawByte(u);var f=this.inputBufferStreamOffset+i;this.prefixHashTable.addValueToBucket(a,f)}}return this.outputBuffer.subarray(0,this.outputBufferPosition)},e.prototype.findLongestMatch=function(e,t){var r=this.prefixHashTable.getArraySegmentForBucketIndex(t,this.reusableArraySegmentObject);if(null==r)return null;for(var n,o=this.inputBuffer,i=0,u=0;u<r.length;u++){var s=r.getInReversedOrder(u)-this.inputBufferStreamOffset,a=e-s,c=void 0;if(c=void 0===n?this.MinimumSequenceLength-1:n<128&&128<=a?i+(i>>>1):i,a>this.MaximumMatchDistance||c>=this.MaximumSequenceLength||e+c>=o.length)break;if(o[s+c]===o[e+c])for(var f=0;;f++){if(e+f===o.length||o[s+f]!==o[e+f]){c<f&&(n=a,i=f);break}if(f===this.MaximumSequenceLength)return{distance:a,length:this.MaximumSequenceLength}}}return void 0!==n?{distance:n,length:i}:null},e.prototype.getBucketIndexForPrefix=function(e){return(7880599*this.inputBuffer[e]+39601*this.inputBuffer[e+1]+199*this.inputBuffer[e+2]+this.inputBuffer[e+3])%this.PrefixHashTableSize},e.prototype.outputPointerBytes=function(e,t){t<128?(this.outputRawByte(192|e),this.outputRawByte(t)):(this.outputRawByte(224|e),this.outputRawByte(t>>>8),this.outputRawByte(255&t))},e.prototype.outputRawByte=function(e){this.outputBuffer[this.outputBufferPosition++]=e},e.prototype.cropAndAddNewBytesToInputBuffer=function(e){if(void 0===this.inputBuffer)return this.inputBuffer=e,0;var t=Math.min(this.inputBuffer.length,this.MaximumMatchDistance),r=this.inputBuffer.length-t;return this.inputBuffer=n.CompressionCommon.getCroppedAndAppendedByteArray(this.inputBuffer,r,t,e),this.inputBufferStreamOffset+=r,t},e}();n.Compressor=e}(LZUTF8||(LZUTF8={})),function(s){var e=function(){function e(e){this.minimumBucketCapacity=4,this.maximumBucketCapacity=64,this.bucketLocators=new Uint32Array(2*e),this.storage=new Uint32Array(2*e),this.storageIndex=1}return e.prototype.addValueToBucket=function(e,t){e<<=1,this.storageIndex>=this.storage.length>>>1&&this.compact();var r,n=this.bucketLocators[e];if(0===n)n=this.storageIndex,r=1,this.storage[this.storageIndex]=t,this.storageIndex+=this.minimumBucketCapacity;else{(r=this.bucketLocators[e+1])===this.maximumBucketCapacity-1&&(r=this.truncateBucketToNewerElements(n,r,this.maximumBucketCapacity/2));var o=n+r;0===this.storage[o]?(this.storage[o]=t,o===this.storageIndex&&(this.storageIndex+=r)):(s.ArrayTools.copyElements(this.storage,n,this.storage,this.storageIndex,r),n=this.storageIndex,this.storageIndex+=r,this.storage[this.storageIndex++]=t,this.storageIndex+=r),r++}this.bucketLocators[e]=n,this.bucketLocators[e+1]=r},e.prototype.truncateBucketToNewerElements=function(e,t,r){var n=e+t-r;return s.ArrayTools.copyElements(this.storage,n,this.storage,e,r),s.ArrayTools.zeroElements(this.storage,e+r,t-r),r},e.prototype.compact=function(){var e=this.bucketLocators,t=this.storage;this.bucketLocators=new Uint32Array(this.bucketLocators.length),this.storageIndex=1;for(var r=0;r<e.length;r+=2){var n=e[r+1];0!==n&&(this.bucketLocators[r]=this.storageIndex,this.bucketLocators[r+1]=n,this.storageIndex+=Math.max(Math.min(2*n,this.maximumBucketCapacity),this.minimumBucketCapacity))}this.storage=new Uint32Array(8*this.storageIndex);for(r=0;r<e.length;r+=2){var o=e[r];if(0!==o){var i=this.bucketLocators[r],u=this.bucketLocators[r+1];s.ArrayTools.copyElements(t,o,this.storage,i,u)}}},e.prototype.getArraySegmentForBucketIndex=function(e,t){e<<=1;var r=this.bucketLocators[e];return 0===r?null:(void 0===t&&(t=new s.ArraySegment(this.storage,r,this.bucketLocators[e+1])),t)},e.prototype.getUsedBucketCount=function(){return Math.floor(s.ArrayTools.countNonzeroValuesInArray(this.bucketLocators)/2)},e.prototype.getTotalElementCount=function(){for(var e=0,t=0;t<this.bucketLocators.length;t+=2)e+=this.bucketLocators[t+1];return e},e}();s.CompressorCustomHashTable=e}(LZUTF8||(LZUTF8={})),function(n){var e=function(){function e(e){this.maximumBucketCapacity=64,this.buckets=new Array(e)}return e.prototype.addValueToBucket=function(e,t){var r=this.buckets[e];void 0===r?this.buckets[e]=[t]:(r.length===this.maximumBucketCapacity-1&&n.ArrayTools.truncateStartingElements(r,this.maximumBucketCapacity/2),r.push(t))},e.prototype.getArraySegmentForBucketIndex=function(e,t){var r=this.buckets[e];return void 0===r?null:(void 0===t&&(t=new n.ArraySegment(r,0,r.length)),t)},e.prototype.getUsedBucketCount=function(){return n.ArrayTools.countNonzeroValuesInArray(this.buckets)},e.prototype.getTotalElementCount=function(){for(var e=0,t=0;t<this.buckets.length;t++)void 0!==this.buckets[t]&&(e+=this.buckets[t].length);return e},e}();n.CompressorSimpleHashTable=e}(LZUTF8||(LZUTF8={})),function(f){var e=function(){function e(){this.MaximumMatchDistance=32767,this.outputPosition=0}return e.prototype.decompressBlockToString=function(e){return e=f.BufferTools.convertToUint8ArrayIfNeeded(e),f.decodeUTF8(this.decompressBlock(e))},e.prototype.decompressBlock=function(e){this.inputBufferRemainder&&(e=f.ArrayTools.concatUint8Arrays([this.inputBufferRemainder,e]),this.inputBufferRemainder=void 0);for(var t=this.cropOutputBufferToWindowAndInitialize(Math.max(4*e.length,1024)),r=0,n=e.length;r<n;r++){var o=e[r];if(o>>>6==3){var i=o>>>5;if(r==n-1||r==n-2&&7==i){this.inputBufferRemainder=e.subarray(r);break}if(e[r+1]>>>7==1)this.outputByte(o);else{var u=31&o,s=void 0;6==i?(s=e[r+1],r+=1):(s=e[r+1]<<8|e[r+2],r+=2);for(var a=this.outputPosition-s,c=0;c<u;c++)this.outputByte(this.outputBuffer[a+c])}}else this.outputByte(o)}return this.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence(),f.CompressionCommon.getCroppedBuffer(this.outputBuffer,t,this.outputPosition-t)},e.prototype.outputByte=function(e){this.outputPosition===this.outputBuffer.length&&(this.outputBuffer=f.ArrayTools.doubleByteArrayCapacity(this.outputBuffer)),this.outputBuffer[this.outputPosition++]=e},e.prototype.cropOutputBufferToWindowAndInitialize=function(e){if(!this.outputBuffer)return this.outputBuffer=new Uint8Array(e),0;var t=Math.min(this.outputPosition,this.MaximumMatchDistance);if(this.outputBuffer=f.CompressionCommon.getCroppedBuffer(this.outputBuffer,this.outputPosition-t,t,e),this.outputPosition=t,this.outputBufferRemainder){for(var r=0;r<this.outputBufferRemainder.length;r++)this.outputByte(this.outputBufferRemainder[r]);this.outputBufferRemainder=void 0}return t},e.prototype.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence=function(){for(var e=1;e<=4&&0<=this.outputPosition-e;e++){var t=this.outputBuffer[this.outputPosition-e];if(e<4&&t>>>3==30||e<3&&t>>>4==14||e<2&&t>>>5==6)return this.outputBufferRemainder=this.outputBuffer.subarray(this.outputPosition-e,this.outputPosition),void(this.outputPosition-=e)}},e}();f.Decompressor=e}(LZUTF8||(LZUTF8={})),function(s){var e,t,a,c;e=s.Encoding||(s.Encoding={}),t=e.Base64||(e.Base64={}),a=new Uint8Array([65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,48,49,50,51,52,53,54,55,56,57,43,47]),c=new Uint8Array([255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,62,255,255,255,63,52,53,54,55,56,57,58,59,60,61,255,255,255,0,255,255,255,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,255,255,255,255,255,255,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,255,255,255,255]),t.encode=function(e){return e&&0!=e.length?s.runningInNodeJS()?s.BufferTools.uint8ArrayToBuffer(e).toString("base64"):t.encodeWithJS(e):""},t.decode=function(e){return e?s.runningInNodeJS()?s.BufferTools.bufferToUint8Array(new Buffer(e,"base64")):t.decodeWithJS(e):new Uint8Array(0)},t.encodeWithJS=function(e,t){if(void 0===t&&(t=!0),!e||0==e.length)return"";for(var r,n=a,o=new s.StringBuilder,i=0,u=e.length;i<u;i+=3)i<=u-3?(r=e[i]<<16|e[i+1]<<8|e[i+2],o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),o.appendCharCode(n[r>>>6&63]),o.appendCharCode(n[63&r]),r=0):i===u-2?(r=e[i]<<16|e[i+1]<<8,o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),o.appendCharCode(n[r>>>6&63]),t&&o.appendCharCode(61)):i===u-1&&(r=e[i]<<16,o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),t&&(o.appendCharCode(61),o.appendCharCode(61)));return o.getOutputString()},t.decodeWithJS=function(e,t){if(!e||0==e.length)return new Uint8Array(0);var r=e.length%4;if(1===r)throw new Error("Invalid Base64 string: length % 4 == 1");2===r?e+="==":3===r&&(e+="="),t||(t=new Uint8Array(e.length));for(var n=0,o=e.length,i=0;i<o;i+=4){var u=c[e.charCodeAt(i)]<<18|c[e.charCodeAt(i+1)]<<12|c[e.charCodeAt(i+2)]<<6|c[e.charCodeAt(i+3)];t[n++]=u>>>16&255,t[n++]=u>>>8&255,t[n++]=255&u}return 61==e.charCodeAt(o-1)&&n--,61==e.charCodeAt(o-2)&&n--,t.subarray(0,n)}}(LZUTF8||(LZUTF8={})),function(s){var e,t;e=s.Encoding||(s.Encoding={}),(t=e.BinaryString||(e.BinaryString={})).encode=function(e){if(null==e)throw new TypeError("BinaryString.encode: undefined or null input received");if(0===e.length)return"";for(var t=e.length,r=new s.StringBuilder,n=0,o=1,i=0;i<t;i+=2){var u=void 0;u=i==t-1?e[i]<<8:e[i]<<8|e[i+1],r.appendCharCode(n<<16-o|u>>>o),n=u&(1<<o)-1,15===o?(r.appendCharCode(n),n=0,o=1):o+=1,t-2<=i&&r.appendCharCode(n<<16-o)}return r.appendCharCode(32768|t%2),r.getOutputString()},t.decode=function(e){if("string"!=typeof e)throw new TypeError("BinaryString.decode: invalid input type");if(""==e)return new Uint8Array(0);for(var t,r=new Uint8Array(3*e.length),n=0,o=0,i=0,u=0;u<e.length;u++){var s=e.charCodeAt(u);32768<=s?(32769==s&&n--,i=0):(0==i?o=s:(t=o<<i|s>>>15-i,r[n++]=t>>>8,r[n++]=255&t,o=s&(1<<15-i)-1),15==i?i=0:i+=1)}return r.subarray(0,n)}}(LZUTF8||(LZUTF8={})),function(e){var t,r;t=e.Encoding||(e.Encoding={}),(r=t.CodePoint||(t.CodePoint={})).encodeFromString=function(e,t){var r=e.charCodeAt(t);if(r<55296||56319<r)return r;var n=e.charCodeAt(t+1);if(56320<=n&&n<=57343)return n-56320+(r-55296<<10)+65536;throw new Error("getUnicodeCodePoint: Received a lead surrogate character, char code "+r+", followed by "+n+", which is not a trailing surrogate character code.")},r.decodeToString=function(e){if(e<=65535)return String.fromCharCode(e);if(e<=1114111)return String.fromCharCode(55296+(e-65536>>>10),56320+(e-65536&1023));throw new Error("getStringFromUnicodeCodePoint: A code point of "+e+" cannot be encoded in UTF-16")}}(LZUTF8||(LZUTF8={})),function(e){var t,r,n;t=e.Encoding||(e.Encoding={}),r=t.DecimalString||(t.DecimalString={}),n=["000","001","002","003","004","005","006","007","008","009","010","011","012","013","014","015","016","017","018","019","020","021","022","023","024","025","026","027","028","029","030","031","032","033","034","035","036","037","038","039","040","041","042","043","044","045","046","047","048","049","050","051","052","053","054","055","056","057","058","059","060","061","062","063","064","065","066","067","068","069","070","071","072","073","074","075","076","077","078","079","080","081","082","083","084","085","086","087","088","089","090","091","092","093","094","095","096","097","098","099","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160","161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200","201","202","203","204","205","206","207","208","209","210","211","212","213","214","215","216","217","218","219","220","221","222","223","224","225","226","227","228","229","230","231","232","233","234","235","236","237","238","239","240","241","242","243","244","245","246","247","248","249","250","251","252","253","254","255"],r.encode=function(e){for(var t=[],r=0;r<e.length;r++)t.push(n[e[r]]);return t.join(" ")}}(LZUTF8||(LZUTF8={})),function(e){var t,r;t=e.Encoding||(e.Encoding={}),(r=t.StorageBinaryString||(t.StorageBinaryString={})).encode=function(e){return t.BinaryString.encode(e).replace(/\0/g,"耂")},r.decode=function(e){return t.BinaryString.decode(e.replace(/\u8002/g,"\0"))}}(LZUTF8||(LZUTF8={})),function(a){var i,t,r,n;i=a.Encoding||(a.Encoding={}),(t=i.UTF8||(i.UTF8={})).encode=function(e){return e&&0!=e.length?a.runningInNodeJS()?a.BufferTools.bufferToUint8Array(new Buffer(e,"utf8")):t.createNativeTextEncoderAndDecoderIfAvailable()?r.encode(e):t.encodeWithJS(e):new Uint8Array(0)},t.decode=function(e){return e&&0!=e.length?a.runningInNodeJS()?a.BufferTools.uint8ArrayToBuffer(e).toString("utf8"):t.createNativeTextEncoderAndDecoderIfAvailable()?n.decode(e):t.decodeWithJS(e):""},t.encodeWithJS=function(e,t){if(!e||0==e.length)return new Uint8Array(0);t||(t=new Uint8Array(4*e.length));for(var r=0,n=0;n<e.length;n++){var o=i.CodePoint.encodeFromString(e,n);if(o<=127)t[r++]=o;else if(o<=2047)t[r++]=192|o>>>6,t[r++]=128|63&o;else if(o<=65535)t[r++]=224|o>>>12,t[r++]=128|o>>>6&63,t[r++]=128|63&o;else{if(!(o<=1114111))throw new Error("Invalid UTF-16 string: Encountered a character unsupported by UTF-8/16 (RFC 3629)");t[r++]=240|o>>>18,t[r++]=128|o>>>12&63,t[r++]=128|o>>>6&63,t[r++]=128|63&o,n++}}return t.subarray(0,r)},t.decodeWithJS=function(e,t,r){if(void 0===t&&(t=0),!e||0==e.length)return"";void 0===r&&(r=e.length);for(var n,o,i=new a.StringBuilder,u=t,s=r;u<s;){if((o=e[u])>>>7==0)n=o,u+=1;else if(o>>>5==6){if(r<=u+1)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(31&o)<<6|63&e[u+1],u+=2}else if(o>>>4==14){if(r<=u+2)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(15&o)<<12|(63&e[u+1])<<6|63&e[u+2],u+=3}else{if(o>>>3!=30)throw new Error("Invalid UTF-8 stream: An invalid lead byte value encountered at position "+u);if(r<=u+3)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(7&o)<<18|(63&e[u+1])<<12|(63&e[u+2])<<6|63&e[u+3],u+=4}i.appendCodePoint(n)}return i.getOutputString()},t.createNativeTextEncoderAndDecoderIfAvailable=function(){return!!r||"function"==typeof TextEncoder&&(r=new TextEncoder("utf-8"),n=new TextDecoder("utf-8"),!0)}}(LZUTF8||(LZUTF8={})),function(o){o.compress=function(e,t){if(void 0===t&&(t={}),null==e)throw new TypeError("compress: undefined or null input received");var r=o.CompressionCommon.detectCompressionSourceEncoding(e);t=o.ObjectTools.override({inputEncoding:r,outputEncoding:"ByteArray"},t);var n=(new o.Compressor).compressBlock(e);return o.CompressionCommon.encodeCompressedBytes(n,t.outputEncoding)},o.decompress=function(e,t){if(void 0===t&&(t={}),null==e)throw new TypeError("decompress: undefined or null input received");t=o.ObjectTools.override({inputEncoding:"ByteArray",outputEncoding:"String"},t);var r=o.CompressionCommon.decodeCompressedBytes(e,t.inputEncoding),n=(new o.Decompressor).decompressBlock(r);return o.CompressionCommon.encodeDecompressedBytes(n,t.outputEncoding)},o.compressAsync=function(e,t,r){var n;null==r&&(r=function(){});try{n=o.CompressionCommon.detectCompressionSourceEncoding(e)}catch(e){return void r(void 0,e)}t=o.ObjectTools.override({inputEncoding:n,outputEncoding:"ByteArray",useWebWorker:!0,blockSize:65536},t),o.enqueueImmediate(function(){t.useWebWorker&&o.WebWorker.createGlobalWorkerIfNeeded()?o.WebWorker.compressAsync(e,t,r):o.AsyncCompressor.compressAsync(e,t,r)})},o.decompressAsync=function(e,t,r){if(null==r&&(r=function(){}),null!=e){t=o.ObjectTools.override({inputEncoding:"ByteArray",outputEncoding:"String",useWebWorker:!0,blockSize:65536},t);var n=o.BufferTools.convertToUint8ArrayIfNeeded(e);o.EventLoop.enqueueImmediate(function(){t.useWebWorker&&o.WebWorker.createGlobalWorkerIfNeeded()?o.WebWorker.decompressAsync(n,t,r):o.AsyncDecompressor.decompressAsync(e,t,r)})}else r(void 0,new TypeError("decompressAsync: undefined or null input received"))},o.createCompressionStream=function(){return o.AsyncCompressor.createCompressionStream()},o.createDecompressionStream=function(){return o.AsyncDecompressor.createDecompressionStream()},o.encodeUTF8=function(e){return o.Encoding.UTF8.encode(e)},o.decodeUTF8=function(e){return o.Encoding.UTF8.decode(e)},o.encodeBase64=function(e){return o.Encoding.Base64.encode(e)},o.decodeBase64=function(e){return o.Encoding.Base64.decode(e)},o.encodeBinaryString=function(e){return o.Encoding.BinaryString.encode(e)},o.decodeBinaryString=function(e){return o.Encoding.BinaryString.decode(e)},o.encodeStorageBinaryString=function(e){return o.Encoding.StorageBinaryString.encode(e)},o.decodeStorageBinaryString=function(e){return o.Encoding.StorageBinaryString.decode(e)}}(LZUTF8||(LZUTF8={})); 

function assert(condition, ...messages){
  if(condition) return;
  throw new Error(...messages);
}

function sleep(ms){
  return new Promise((ok,err)=>setTimeout(ok, ms));
}

class MyBoolean{
  static assert(condition, ...messages){
    if(condition) return;
    throw new Error(...messages);
  }
  static all(arr){
    for(let x of arr) if(!x) return false;
    return true;
  }
  static any(arr){
    for(let x of arr) if(x) return true;
    return false;
  }
  static assert_all(arr, ...messages) { assert(all(arr), ...messages);}
  static assert_any(arr, ...messages) { assert(any(arr), ...messages);}
}


class MyArray{
  static any(arr){
    for(let x of arr) if(x) return true;
    return false;
  }
  static all(arr){
    for(let x of arr) if(!x) return false;
    return true;
  }
  static sum(arr){
    return arr.reduce((p,c)=>p+c, 0);
  }
  static max(arr, initialValue){
    initialValue = initialValue||0;
    return arr.reduce((p,c)=>Math.max(p,c), initialValue);
  }
  static min(arr, initialValue){
    initialValue = initialValue||1e10;
    return arr.reduce((p,c)=>Math.min(p,c), initialValue);
  }
  static sEquality(a,b){
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for(let i=0; i<a.length; ++i) if (a[i]!=b[i]) return false;
    return true;
  }
  static hEquality(a,b){
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for(let i=0; i<a.length; ++i) if (a[i]!==b[i]) return false;
    return true;
  }
}

class MyPromise{
  static async sleep(ms){
    await new Promise((ok,err)=>setTimeout(ok, ms));
  }
  static async finish_all(promises, {debug=false}={}){
    // Ensures completion of all promises even if some throw exceptions
    return await new Promise((ok, err)=>{
      if(promises.length==0) return ok([]);
      let any_error=false;
      let cnt = 0;
      let outs = promises.map((p)=>null);
      Promise.all(promises.map(async (p, i)=>{
        try{ outs[i] = await p; }
        catch(e){
          any_error=true; outs[i] = e;
          if(debug) console.error(...e);
        }
        cnt++;
        if(cnt==promises.length){
          if(any_error) err(outs);
          else ok(outs);
        }
      }));
    });
  }
  static async finish_all_log(promises){
    try{ var outs = await MyPromise.finish_all(promises); }
    catch(err){
      var outs = err; console.error(...err);
      err.forEach(e=>console.warn(...e));
    }
    return outs;
  }
  static async until(func, {ms=200, timeout=null}={}){
    if(timeout && ms>timeout) ms = timeout/10;
    let t0 = (new Date()).getTime();
    let value;
    while(!(value=await func())){
      if(timeout && (new Date()).getTime()>timeout)
        throw MyPromise.Timeout;
      await sleep(ms);
    }
    return value;
  }
  static Timeout = new Error('Timeout');
  static async timeout(promise, ms){
    let finished = false;
    let [resp, _] = await Promise.all([
      promise.then(e=>{ finished=true; return e;}),
      MyPromise.until(()=>finished, {timeout:ms})
    ]);
    return resp;
  }
}


class MyDocument{
  static createElement(tag, {
      style={}, id={}, classList=[], text=null, html=null,
      eventListeners={}, parent=null, where=null, ...attrs}={}){
    let e = document.createElement(tag, id?{id:id}:null);
    classList.forEach(s=>e.classList.add(s));
    if(text!=null) e.innerText = text;
    if(html!=null) e.innerHTML = html;
    MyObject.forEach(attrs, (value, key)=>e.setAttribute(key, value));
    MyObject.forEach(style, (value, key)=>e.style[key] = value);
    MyObject.forEach(eventListeners, (value, key)=>
      e.addEventListener(key, value));
    if(parent || where){
      parent = parent||document.body;
      where = where||'beforeend';
      parent.insertAdjacentElement(where, e);
    }
    return e;
  }
  static right_click(element){
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
    return;
    element.focus();
    let e = element.ownerDocument.createEvent('MouseEvents');
    e.initMouseEvent('contextmenu', true, true,
      element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
      false, false, false, 2, null);
    return !element.dispatchEvent(e);
  }
}

class MyObject{

  static indexBy(arr, key){
    let M = {};
    arr.forEach((obj)=>{
      let value = obj[key];
      M[value] = obj;
    });
    return M;
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(any))} func
  */
  static map(obj, func){
    return MyObject._object_op('map', obj, func);
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(bool|any))} func
  */
  static filter(obj, func){
    return MyObject._object_op('filter', obj, func);
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(any))} func
  */
  static apply(obj, func){
    return MyObject._object_op('apply', obj, func);
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(any))} func
  */
  static forEach(obj, func){
    return MyObject._object_op('forEach', obj, func);
  }

  static _object_op(op, src, func){
    assert(1<=func.length && func.length<=3);
    let dest = {};
    for(let key of Object.keys(src)){
      let value = src[key]
      let result = MyObject._func(func, value, key);
      if(op=='map') dest[key] = result;
      else if(op=='filter'){ if(result) dest[key] = value; }
      else if(op=='apply') src[key] = result;
      else if(op=='forEach') 1==1;
    }
    return (op=='map'||op=='filter')? dest : null;
  }

  static _func(func, value, key){
    return (
      func.length==1? func(value)
      : func.length==2? func(value,key)
      : func(value, key, src)
    );
  }

  static reduce_dots(obj){
    // converts {'a.b':1, 'a.c':2, b:3} into {a:{b:1,c:2}, 'b':3}. Returns copy (shallow or deep)
    let dotted = MyObject.object_filter(obj, (v,k)=>k.indexOf('.')>=0);
    let no_dots = MyObject.object_filter(obj, (v,k)=>k.indexOf('.')==-1);
    if(Object.keys(dotted).length==0) return no_dots;
    MyObject.object_forEach(dotted, (v,k)=>{
      let start = k.slice(0, k.indexOf('.'));
      let end = k.slice(k.indexOf('.')+1);
      no_dots[start] = no_dots[start]||{};
      no_dots[start][end] = v;
    });
    return MyObject.reduce_dots(no_dots);
  }

  static deep_assign(obj, ...objs){
    for(let o of objs){
      if(!o) continue;
      for(let key of Object.keys(o)){
        if(obj[key]===undefined || typeof(o[key])!="object") obj[key] = o[key];
        else MyObject.deep_assign(obj[key], o[key]);
      }
    }
    return obj;
  }

  static deep_copy(obj, ...objs){
    if(obj===undefined) return undefined;
    if(obj===null) return null;
    if(Array.isArray(obj))
      return obj.map(x=>MyObject.deep_copy(x));
    if(typeof(obj)=="object")
      return MyObject.map(obj, value=>MyObject.deep_copy(value));
    if(typeof(obj)=="function")
      return obj; // DOES NOT CREATE COPY FOR FUNCTIONS
    return MyObject.deep_assign(obj, ...objs);
  }

  static deep_default(default_obj, ...objs){
    let obj = MyObject.deep_copy(default_obj);
    return MyObject.deep_assign(obj, ...objs);
  }

  /**
  @param {((value:any, key?:any, obj?:any)=>(bool|any))} filter_func
  */
  static find(obj, filter_func){
    for(let key in obj)
      if(MyObject._func(filter_func, obj[key], key))
        return key;
    return null;
  }
  static toEntries(obj){
    return Object.keys(obj).map(k=>[k, obj[k]]);
  }
}


class MyDecorators{
  static once(fn){
    let returnValue, canRun = true;
    return function runOnce(){
      if(canRun) {
        returnValue = fn.apply(this, arguments);
        canRun = false;
      }
      return returnValue;
    }
  }
}


function get_property_handler(object, property){
  let access, proto = object;
  object._hidden_modified = false;
  while(!access){
    proto = Object.getPrototypeOf(proto);
    access = Object.getOwnPropertyDescriptor(proto, property);
  }
  return access;
}

function update_property_handler(object, property, create_handler){
  let prev = get_property_handler(object, property);
  Object.defineProperty(object, property, create_handler(prev));
}

const mathString = (text)=>{
  const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;
  const latexMatch = text.match(regularExpression);
  
  if(!latexMatch) return text; // no math in text

  const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;
  
  const stripDollars = (stringToStrip) =>(
    (stringToStrip[0] === "$" && stringToStrip[1] !== "$")?
      stringToStrip.slice(1, -1)
      : stringToStrip.slice(2, -2)
  );

  const getDisplay = (stringToDisplay) =>(
    stringToDisplay.match(blockRegularExpression) ? "block" : "inline"
  );
  let parser;
  if(window.katex)
    parser=(formula, mode)=>katex.renderToString(formula, {
      displayMode: mode=='block'});
  else if((window.MathJax||{}).tex2svg)
    parser = (formula, mode)=>(mode=='inline'?
      MathJax.tex2svg(formula).innerHTML
      :MathJax.tex2svg(formula).outerHTML
    );
  else{
    console.warn('No math parser loaded for html`..$..$..`');
    parser = (formula, mode)=>`<span class="math-${mode}"> ${formula} </span>`;
  }

  let result = [];
  text.split(regularExpression).forEach((s, index) => {
    result.push(s);
    if(latexMatch[index]) {
      let x = latexMatch[index];
      let formula = stripDollars(x);
      let mode = getDisplay(x);
      let block = parser(formula, mode);
      result.push(block);
    }
  });
  return result.join('');
}

"use strict";

var exports={};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = a;
exports.render = T;
exports.Component = d;
exports.createContext = U;
exports.useState = q;
exports.useReducer = B;
exports.useEffect = $;
exports.useLayoutEffect = j;
exports.useRef = z;
exports.useImperativeHandle = G;
exports.useMemo = J;
exports.useCallback = K;
exports.useContext = Q;
exports.useDebugValue = X;
exports.html = void 0;

var e,
    n,
    t,
    _,
    o,
    r,
    u,
    l = {},
    i = [],
    c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

function s(e, n) {
  for (var t in n) {
    e[t] = n[t];
  }

  return e;
}

function f(e) {
  var n = e.parentNode;
  n && n.removeChild(e);
}

function a(e, n, t) {
  var _,
      o = arguments,
      r = {};

  for (_ in n) {
    "key" !== _ && "ref" !== _ && (r[_] = n[_]);
  }

  if (arguments.length > 3) for (t = [t], _ = 3; _ < arguments.length; _++) {
    t.push(o[_]);
  }
  if (null != t && (r.children = t), "function" == typeof e && null != e.defaultProps) for (_ in e.defaultProps) {
    void 0 === r[_] && (r[_] = e.defaultProps[_]);
  }
  return p(e, r, n && n.key, n && n.ref, null);
}

function p(n, t, _, o, r) {
  var u = {
    type: n,
    props: t,
    key: _,
    ref: o,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: r
  };
  return null == r && (u.__v = u), e.vnode && e.vnode(u), u;
}

function h(e) {
  return e.children;
}

function d(e, n) {
  this.props = e, this.context = n;
}

function v(e, n) {
  if (null == n) return e.__ ? v(e.__, e.__.__k.indexOf(e) + 1) : null;

  for (var t; n < e.__k.length; n++) {
    if (null != (t = e.__k[n]) && null != t.__e) return t.__e;
  }

  return "function" == typeof e.type ? v(e) : null;
}

function m(e) {
  var n, t;

  if (null != (e = e.__) && null != e.__c) {
    for (e.__e = e.__c.base = null, n = 0; n < e.__k.length; n++) {
      if (null != (t = e.__k[n]) && null != t.__e) {
        e.__e = e.__c.base = t.__e;
        break;
      }
    }

    return m(e);
  }
}

function y(r) {
  (!r.__d && (r.__d = !0) && n.push(r) && !t++ || o !== e.debounceRendering) && ((o = e.debounceRendering) || _)(g);
}

function g() {
  for (var e; t = n.length;) {
    e = n.sort(function (e, n) {
      return e.__v.__b - n.__v.__b;
    }), n = [], e.some(function (e) {
      var n, t, _, o, r, u, l;

      e.__d && (u = (r = (n = e).__v).__e, (l = n.__P) && (t = [], (_ = s({}, r)).__v = _, o = H(l, r, _, n.__n, void 0 !== l.ownerSVGElement, null, t, null == u ? v(r) : u), S(t, r), o != u && m(r)));
    });
  }
}

function k(e, n, t, _, o, r, u, c, s) {
  var a,
      p,
      h,
      d,
      m,
      y,
      g,
      k = t && t.__k || i,
      x = k.length;
  if (c == l && (c = null != r ? r[0] : x ? v(t, 0) : null), a = 0, n.__k = b(n.__k, function (t) {
    if (null != t) {
      if (t.__ = n, t.__b = n.__b + 1, null === (h = k[a]) || h && t.key == h.key && t.type === h.type) k[a] = void 0;else for (p = 0; p < x; p++) {
        if ((h = k[p]) && t.key == h.key && t.type === h.type) {
          k[p] = void 0;
          break;
        }

        h = null;
      }

      if (d = H(e, t, h = h || l, _, o, r, u, c, s), (p = t.ref) && h.ref != p && (g || (g = []), h.ref && g.push(h.ref, null, t), g.push(p, t.__c || d, t)), null != d) {
        var i;
        if (null == y && (y = d), void 0 !== t.__d) i = t.__d, t.__d = void 0;else if (r == h || d != c || null == d.parentNode) {
          e: if (null == c || c.parentNode !== e) e.appendChild(d), i = null;else {
            for (m = c, p = 0; (m = m.nextSibling) && p < x; p += 2) {
              if (m == d) break e;
            }

            e.insertBefore(d, c), i = c;
          }

          "option" == n.type && (e.value = "");
        }
        c = void 0 !== i ? i : d.nextSibling, "function" == typeof n.type && (n.__d = c);
      } else c && h.__e == c && c.parentNode != e && (c = v(h));
    }

    return a++, t;
  }), n.__e = y, null != r && "function" != typeof n.type) for (a = r.length; a--;) {
    null != r[a] && f(r[a]);
  }

  for (a = x; a--;) {
    null != k[a] && D(k[a], k[a]);
  }

  if (g) for (a = 0; a < g.length; a++) {
    P(g[a], g[++a], g[++a]);
  }
}

function b(e, n, t) {
  if (null == t && (t = []), null == e || "boolean" == typeof e) n && t.push(n(null));else if (Array.isArray(e)) for (var _ = 0; _ < e.length; _++) {
    b(e[_], n, t);
  } else t.push(n ? n("string" == typeof e || "number" == typeof e ? p(null, e, null, null, e) : null != e.__e || null != e.__c ? p(e.type, e.props, e.key, null, e.__v) : e) : e);
  return t;
}

function x(e, n, t) {
  "-" === n[0] ? e.setProperty(n, t) : e[n] = "number" == typeof t && !1 === c.test(n) ? t + "px" : null == t ? "" : t;
}

function w(e, n, t, _, o) {
  var r, u, l, i, c;
  if (o ? "className" === n && (n = "class") : "class" === n && (n = "className"), "style" === n) {
    if (r = e.style, "string" == typeof t) r.cssText = t;else {
      if ("string" == typeof _ && (r.cssText = "", _ = null), _) for (i in _) {
        t && i in t || x(r, i, "");
      }
      if (t) for (c in t) {
        _ && t[c] === _[c] || x(r, c, t[c]);
      }
    }
  } else "o" === n[0] && "n" === n[1] ? (u = n !== (n = n.replace(/Capture$/, "")), l = n.toLowerCase(), n = (l in e ? l : n).slice(2), t ? (_ || e.addEventListener(n, C, u), (e.l || (e.l = {}))[n] = t) : e.removeEventListener(n, C, u)) : "list" !== n && "tagName" !== n && "form" !== n && "type" !== n && "size" !== n && !o && n in e ? e[n] = null == t ? "" : t : "function" != typeof t && "dangerouslySetInnerHTML" !== n && (n !== (n = n.replace(/^xlink:?/, "")) ? null == t || !1 === t ? e.removeAttributeNS("http://www.w3.org/1999/xlink", n.toLowerCase()) : e.setAttributeNS("http://www.w3.org/1999/xlink", n.toLowerCase(), t) : null == t || !1 === t && !/^ar/.test(n) ? e.removeAttribute(n) : e.setAttribute(n, t));
}

function C(n) {
  this.l[n.type](e.event ? e.event(n) : n);
}

function H(n, t, _, o, r, u, l, i, c) {
  var f,
      a,
      p,
      v,
      m,
      y,
      g,
      b,
      x,
      w,
      C = t.type;
  if (void 0 !== t.constructor) return null;
  (f = e.__b) && f(t);

  try {
    e: if ("function" == typeof C) {
      if (b = t.props, x = (f = C.contextType) && o[f.__c], w = f ? x ? x.props.value : f.__ : o, _.__c ? g = (a = t.__c = _.__c).__ = a.__E : ("prototype" in C && C.prototype.render ? t.__c = a = new C(b, w) : (t.__c = a = new d(b, w), a.constructor = C, a.render = N), x && x.sub(a), a.props = b, a.state || (a.state = {}), a.context = w, a.__n = o, p = a.__d = !0, a.__h = []), null == a.__s && (a.__s = a.state), null != C.getDerivedStateFromProps && (a.__s == a.state && (a.__s = s({}, a.__s)), s(a.__s, C.getDerivedStateFromProps(b, a.__s))), v = a.props, m = a.state, p) null == C.getDerivedStateFromProps && null != a.componentWillMount && a.componentWillMount(), null != a.componentDidMount && a.__h.push(a.componentDidMount);else {
        if (null == C.getDerivedStateFromProps && b !== v && null != a.componentWillReceiveProps && a.componentWillReceiveProps(b, w), !a.__e && null != a.shouldComponentUpdate && !1 === a.shouldComponentUpdate(b, a.__s, w) || t.__v === _.__v && !a.__) {
          for (a.props = b, a.state = a.__s, t.__v !== _.__v && (a.__d = !1), a.__v = t, t.__e = _.__e, t.__k = _.__k, a.__h.length && l.push(a), f = 0; f < t.__k.length; f++) {
            t.__k[f] && (t.__k[f].__ = t);
          }

          break e;
        }

        null != a.componentWillUpdate && a.componentWillUpdate(b, a.__s, w), null != a.componentDidUpdate && a.__h.push(function () {
          a.componentDidUpdate(v, m, y);
        });
      }
      a.context = w, a.props = b, a.state = a.__s, (f = e.__r) && f(t), a.__d = !1, a.__v = t, a.__P = n, f = a.render(a.props, a.state, a.context), t.__k = null != f && f.type == h && null == f.key ? f.props.children : Array.isArray(f) ? f : [f], null != a.getChildContext && (o = s(s({}, o), a.getChildContext())), p || null == a.getSnapshotBeforeUpdate || (y = a.getSnapshotBeforeUpdate(v, m)), k(n, t, _, o, r, u, l, i, c), a.base = t.__e, a.__h.length && l.push(a), g && (a.__E = a.__ = null), a.__e = !1;
    } else null == u && t.__v === _.__v ? (t.__k = _.__k, t.__e = _.__e) : t.__e = E(_.__e, t, _, o, r, u, l, c);

    (f = e.diffed) && f(t);
  } catch (n) {
    t.__v = null, e.__e(n, t, _);
  }

  return t.__e;
}

function S(n, t) {
  e.__c && e.__c(t, n), n.some(function (t) {
    try {
      n = t.__h, t.__h = [], n.some(function (e) {
        e.call(t);
      });
    } catch (n) {
      e.__e(n, t.__v);
    }
  });
}

function E(e, n, t, _, o, r, u, c) {
  var s,
      f,
      a,
      p,
      h,
      d = t.props,
      v = n.props;
  if (o = "svg" === n.type || o, null != r) for (s = 0; s < r.length; s++) {
    if (null != (f = r[s]) && ((null === n.type ? 3 === f.nodeType : f.localName === n.type) || e == f)) {
      e = f, r[s] = null;
      break;
    }
  }

  if (null == e) {
    if (null === n.type) return document.createTextNode(v);
    e = o ? document.createElementNS("http://www.w3.org/2000/svg", n.type) : document.createElement(n.type, v.is && {
      is: v.is
    }), r = null, c = !1;
  }

  if (null === n.type) d !== v && e.data != v && (e.data = v);else {
    if (null != r && (r = i.slice.call(e.childNodes)), a = (d = t.props || l).dangerouslySetInnerHTML, p = v.dangerouslySetInnerHTML, !c) {
      if (d === l) for (d = {}, h = 0; h < e.attributes.length; h++) {
        d[e.attributes[h].name] = e.attributes[h].value;
      }
      (p || a) && (p && a && p.__html == a.__html || (e.innerHTML = p && p.__html || ""));
    }

    (function (e, n, t, _, o) {
      var r;

      for (r in t) {
        "children" === r || "key" === r || r in n || w(e, r, null, t[r], _);
      }

      for (r in n) {
        o && "function" != typeof n[r] || "children" === r || "key" === r || "value" === r || "checked" === r || t[r] === n[r] || w(e, r, n[r], t[r], _);
      }
    })(e, v, d, o, c), n.__k = n.props.children, p || k(e, n, t, _, "foreignObject" !== n.type && o, r, u, l, c), c || ("value" in v && void 0 !== v.value && v.value !== e.value && (e.value = null == v.value ? "" : v.value), "checked" in v && void 0 !== v.checked && v.checked !== e.checked && (e.checked = v.checked));
  }
  return e;
}

function P(n, t, _) {
  try {
    "function" == typeof n ? n(t) : n.current = t;
  } catch (n) {
    e.__e(n, _);
  }
}

function D(n, t, _) {
  var o, r, u;

  if (e.unmount && e.unmount(n), (o = n.ref) && (o.current && o.current !== n.__e || P(o, null, t)), _ || "function" == typeof n.type || (_ = null != (r = n.__e)), n.__e = n.__d = void 0, null != (o = n.__c)) {
    if (o.componentWillUnmount) try {
      o.componentWillUnmount();
    } catch (n) {
      e.__e(n, t);
    }
    o.base = o.__P = null;
  }

  if (o = n.__k) for (u = 0; u < o.length; u++) {
    o[u] && D(o[u], t, _);
  }
  null != r && f(r);
}

function N(e, n, t) {
  return this.constructor(e, t);
}

function T(n, t, _) {
  var o, u, c;
  e.__ && e.__(n, t), u = (o = _ === r) ? null : _ && _.__k || t.__k, n = a(h, null, [n]), c = [], H(t, (o ? t : _ || t).__k = n, u || l, l, void 0 !== t.ownerSVGElement, _ && !o ? [_] : u ? null : i.slice.call(t.childNodes), c, _ || l, o), S(c, n);
}

function U(e) {
  var n = {},
      t = {
    __c: "__cC" + u++,
    __: e,
    Consumer: function Consumer(e, n) {
      return e.children(n);
    },
    Provider: function Provider(e) {
      var _,
          o = this;

      return this.getChildContext || (_ = [], this.getChildContext = function () {
        return n[t.__c] = o, n;
      }, this.shouldComponentUpdate = function (e) {
        o.props.value !== e.value && _.some(function (n) {
          n.context = e.value, y(n);
        });
      }, this.sub = function (e) {
        _.push(e);

        var n = e.componentWillUnmount;

        e.componentWillUnmount = function () {
          _.splice(_.indexOf(e), 1), n && n.call(e);
        };
      }), e.children;
    }
  };
  return t.Consumer.contextType = t, t;
}

e = {
  __e: function __e(e, n) {
    for (var t, _; n = n.__;) {
      if ((t = n.__c) && !t.__) try {
        if (t.constructor && null != t.constructor.getDerivedStateFromError && (_ = !0, t.setState(t.constructor.getDerivedStateFromError(e))), null != t.componentDidCatch && (_ = !0, t.componentDidCatch(e)), _) return y(t.__E = t);
      } catch (n) {
        e = n;
      }
    }

    throw e;
  }
}, d.prototype.setState = function (e, n) {
  var t;
  t = this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof e && (e = e(t, this.props)), e && s(t, e), null != e && this.__v && (n && this.__h.push(n), y(this));
}, d.prototype.forceUpdate = function (e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), y(this));
}, d.prototype.render = h, n = [], t = 0, _ = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, r = l, u = 0;
var A,
    M,
    F,
    L = [],
    W = e.__r,
    R = e.diffed,
    V = e.__c,
    I = e.unmount;

function O(n) {
  e.__h && e.__h(M);
  var t = M.__H || (M.__H = {
    __: [],
    __h: []
  });
  return n >= t.__.length && t.__.push({}), t.__[n];
}

function q(e) {
  return B(te, e);
}

function B(e, n, t) {
  var _ = O(A++);

  return _.__c || (_.__c = M, _.__ = [t ? t(n) : te(void 0, n), function (n) {
    var t = e(_.__[0], n);
    _.__[0] !== t && (_.__[0] = t, _.__c.setState({}));
  }]), _.__;
}

function $(e, n) {
  var t = O(A++);
  ne(t.__H, n) && (t.__ = e, t.__H = n, M.__H.__h.push(t));
}

function j(e, n) {
  var t = O(A++);
  ne(t.__H, n) && (t.__ = e, t.__H = n, M.__h.push(t));
}

function z(e) {
  return J(function () {
    return {
      current: e
    };
  }, []);
}

function G(e, n, t) {
  j(function () {
    "function" == typeof e ? e(n()) : e && (e.current = n());
  }, null == t ? t : t.concat(e));
}

function J(e, n) {
  var t = O(A++);
  return ne(t.__H, n) ? (t.__H = n, t.__h = e, t.__ = e()) : t.__;
}

function K(e, n) {
  return J(function () {
    return e;
  }, n);
}

function Q(e) {
  var n = M.context[e.__c];
  if (!n) return e.__;
  var t = O(A++);
  return null == t.__ && (t.__ = !0, n.sub(M)), n.props.value;
}

function X(n, t) {
  e.useDebugValue && e.useDebugValue(t ? t(n) : n);
}

function Y() {
  L.some(function (n) {
    if (n.__P) try {
      n.__H.__h.forEach(Z), n.__H.__h.forEach(ee), n.__H.__h = [];
    } catch (t) {
      return n.__H.__h = [], e.__e(t, n.__v), !0;
    }
  }), L = [];
}

function Z(e) {
  e.t && e.t();
}

function ee(e) {
  var n = e.__();

  "function" == typeof n && (e.t = n);
}

function ne(e, n) {
  return !e || n.some(function (n, t) {
    return n !== e[t];
  });
}

function te(e, n) {
  return "function" == typeof n ? n(e) : n;
}

e.__r = function (e) {
  W && W(e), A = 0, (M = e.__c).__H && (M.__H.__h.forEach(Z), M.__H.__h.forEach(ee), M.__H.__h = []);
}, e.diffed = function (n) {
  R && R(n);
  var t = n.__c;

  if (t) {
    var _ = t.__H;
    _ && _.__h.length && (1 !== L.push(t) && F === e.requestAnimationFrame || ((F = e.requestAnimationFrame) || function (e) {
      var n,
          t = function t() {
        clearTimeout(_), cancelAnimationFrame(n), setTimeout(e);
      },
          _ = setTimeout(t, 100);

      "undefined" != typeof window && (n = requestAnimationFrame(t));
    })(Y));
  }
}, e.__c = function (n, t) {
  t.some(function (n) {
    try {
      n.__h.forEach(Z), n.__h = n.__h.filter(function (e) {
        return !e.__ || ee(e);
      });
    } catch (_) {
      t.some(function (e) {
        e.__h && (e.__h = []);
      }), t = [], e.__e(_, n.__v);
    }
  }), V && V(n, t);
}, e.unmount = function (n) {
  I && I(n);
  var t = n.__c;

  if (t) {
    var _ = t.__H;
    if (_) try {
      _.__.forEach(function (e) {
        return e.t && e.t();
      });
    } catch (n) {
      e.__e(n, t.__v);
    }
  }
};

var _e = function _e(e, n, t, _) {
  var o;
  n[0] = 0;

  for (var r = 1; r < n.length; r++) {
    var u = n[r++],
        l = n[r] ? (n[0] |= u ? 1 : 2, t[n[r++]]) : n[++r];
    3 === u ? _[0] = l : 4 === u ? _[1] = Object.assign(_[1] || {}, l) : 5 === u ? (_[1] = _[1] || {})[n[++r]] = l : 6 === u ? _[1][n[++r]] += l + "" : u ? (o = e.apply(l, _e(e, l, t, ["", null])), _.push(o), l[0] ? n[0] |= 2 : (n[r - 2] = 0, n[r] = o)) : _.push(l);
  }

  return _;
},
    oe = new Map(),
    re = function (e) {
  e = [...e.map(mathString)]; // MATH SUPPORT!!!
  var n = oe.get(this);
  return n || (n = new Map(), oe.set(this, n)), (n = _e(this, n.get(e) || (n.set(e, n = function (e) {
    for (var n, t, _ = 1, o = "", r = "", u = [0], l = function l(e) {
      1 === _ && (e || (o = o.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? u.push(0, e, o) : 3 === _ && (e || o) ? (u.push(3, e, o), _ = 2) : 2 === _ && "..." === o && e ? u.push(4, e, 0) : 2 === _ && o && !e ? u.push(5, 0, !0, o) : _ >= 5 && ((o || !e && 5 === _) && (u.push(_, 0, o, t), _ = 6), e && (u.push(_, e, 0, t), _ = 6)), o = "";
    }, i = 0; i < e.length; i++) {
      i && (1 === _ && l(), l(i));
      for (var c = 0; c < e[i].length; c++) {
        n = e[i][c], 1 === _ ? "<" === n ? (l(), u = [u], _ = 3) : o += n : 4 === _ ? "--" === o && ">" === n ? (_ = 1, o = "") : o = n + o[0] : r ? n === r ? r = "" : o += n : '"' === n || "'" === n ? r = n : ">" === n ? (l(), _ = 1) : _ && ("=" === n ? (_ = 5, t = o, o = "") : "/" === n && (_ < 5 || ">" === e[i][c + 1]) ? (l(), 3 === _ && (u = u[0]), _ = u, (u = u[0]).push(2, 0, _), _ = 0) : " " === n || "\t" === n || "\n" === n || "\r" === n ? (l(), _ = 2) : o += n), 3 === _ && "!--" === o && (_ = 4, u = u[0]);
      }
    }

    return l(), u;
  }(e)), n), arguments, [])).length > 1 ? n : n[0];
};

exports.html = re.bind(a); 

window.preact = exports;
window.html = exports.html;
window.htm = re;
exports = undefined;


window.caph_requirements = JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL2NvcmXFBS5jc3MiLCJjb250ZW50IjoiLmhib3h7IGRpc3BsYXk6IGZsZXg7IH1cbi521BnEBi1kaXJlY3Rpb246IGNvbHVtbsYxYm94Y2VudGVyeyBqdXN0aWZ5LcdoOiDGGcYoc3BhY2UtYXJvdW5k0yvMH8wxYmV0d2VlbtkyxyDGM+QAqHvlAK46IDHGE2hpZGTEP+gA0m5vbmXGGnBsdWdpbi3ZIeUA3HJkZXJ7XG4gIMYLOiBzb2xpZCAycHggYmxhY2s7XG7nAQUtc2hhZG93xy3IDzogMHB4xgQuM3JlbSAwLjA1xAhyZ2JhKDAsxQIuNzUp0Uk6aG92yXzbTzLaTlxuZGl26ADobG9hZGluZ+0AzTVweOcA0SNmM8QCO8QeLXdlYmtpdC1hbmltYeYB8XNwaW4gMXMgbGluZWFyIGluZmluaXRlxS/fJ8gnxnQtdG9wzXg1NTXMH3JhZGl1czogNTAlxRd3aWR0aDogMjBweMUQaGVpZ2h0yxHpAqppbsR2LWJsb+gBlvIA/S5mdWxsc2NyZWVuLc4a5QEXcG9zaeYAyWZpeGVkxWBib3R0b206IDA7IGxlZnQ6MMUWei1pbmTlAmYwxAHGcFxuQGtleWZyYW1lc+YBC8VWMCUgeyB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKeUCaSDERtYlMzbKJ8ViLuUD3m1lbnXFXO4DqMQS9wOr+ADf5QGP5gJMxRBy5gFfyxLuAOvFE29wYWNpdHnkARXED2JhY2tn5QO5LWNvbG9yOiAjZWXmAfVwYWTkAV7EUTHIUe8B6shq5AL+6QDdLW11bHRpcGxl5gMGLCDLG3Nob3du5QD+6QCIMcdZ8gMn5AJqxAj0AyEg5QGzbWVkaWEgcHJpbnTmAbDKa8UP6wFl5QQbxBTmAY7oAl1lcnJv5gOpdGV4dC1hbGlnbjrlAi7FLWZvbnQtZmFtaWx5OiBtb25v5QS5yhtzaXplOiA45wLx6gFNOiAjZmY4ODg49AE2MecBTekBYcYR8ACWLXN0YWNr5gLdyCowLjXHPdF/5gJj6wMlbGF55wSE5wOJ5AKq7QOJyRH6Al7FC+UDPccM7AJTxnYuYWJvdXQtb3XkBkjvAQcjZmZmYekBHGRyb3AtZmlsdOQEwGJsdXIoNHB45AHP6wDiM+QFGekBEMZbaW5ux1ttYXgt5wDOY2FsYyg4MHZ3IC0gMmVtxkfPe8UUbWFyZ2luOmF1dG/ZJMl/MeQBYcRQIDTGCPwBwfYCHiwgYXJpYWzkAMIifSz3B9rkAqMuau4H2VxuxCUuxBsgPSBuZXcgY2xhc3PnAy/kAaBzID0gW13FfGNvbnN0cnVjdG9yKCnFIyAgdGhpcy5lbGVtID0gTXlEb2N1bWVudC5jcmVhdGVFbGXEDignc2VsZWN0JyzHNSAgaWQ6ICfpAzknLMgYxX5MaXN0OiBbyyBdxyF95gFz5AJfbmRvdy5hZGRFdmVudMQyZW5lcign5AWgJywgKCk9PsltZOgAlmJvZHkuaW5zZXJ0QWRqYeQIb+kAo2FmdGVyYmVnaW4nLOoA1shwyXnFGnB1c2hP5QEeKCdEZWZhdWx0JyzmBA7EAeQEcjrlAILJSC7pANkucmVtb3ZlKOoA3uYEoifkBbbpAQhoaWRl2kNhZGTdQO4ArsU98gEqY2hhbmdl5AEsZewBLcUzb25T5QGyKMpBdmFsdWX2AQ/mAe1f5QM5KMYa5QQaICDrASnkBOwsIHvkAKw95ADZbnVsbCzlAOjJD309e33oAlhsZXQgxHhlbnT9AlrmAqXrAlrFaMgNcGFy5Qn86QDHyRp3aGVyZTogJ2JlZm/kBLtk6AKE7gDbxl/mAfIoe8Vc5QHf5gC6LOgAo8k1aWbmATPIOGxlbmd0aD4x6ADX7AGT+QHQ6AbNJ8hW5Qf1/wGb7QF4ySXmA3llZD3pAqjoAIppZighyUMpIHJldHVybuUD429sZS53YXJuKCdDYW5ub3Qgc3dpdGNoLiBN5AQmxBHkA2VlZOkAn+8Aij3IdfQBSWZvckVhY2go8gFNfewChuQBSGV4dD3JTCnFKucCXsQBZWxzZcU4yRTnAYXlAS3uApPHV/8ENe4ENeQCgcU//QJ/ZGl26wJ87wTA8AcZJywgJ+sGuScgLCfmDE7pBODsArTtBLbLIOgCuuUEsesCucQBaHRtbDogYMoRPGRpduYAlT1cIuoI8eYA2uYG5VwiPsowICA8aDE+Q+gGOTwvaDHOHnA+QSBsaWJyYXJ5IGZvciB3cml0aW5nIEhUTUzpALNzIGFuZCBzbGlkZXMgdGhh5AIyb2sgbmnmBqplIGVkaXRhYmxlIGluIHBsYWluLeQB7sU2Y2FuIGJlIGV4cG9ydGVkIHRvIHN0YW5kYWxvbmXGZ2ZpbGVzLCBzb8ZcdGhlecg3b3BlbmVkxFdhIGJyb3dzZXIgYnkgYW55b27EfG555QE/LCBleGNlcHQgSUXEJ3N3ZXIgKExvTCkuPC9w8ADxSXQgc3Vw5ACPcyBzZXZlcmFsIOYJNXMsIGluY2x15AfIIG1hdGgsIGRpYWdyYW1zLCBjaGFydMQibWFn5ACvY29kZSBzbmlwcGXnASFhIHdoaXRlYm9hcmQuIFdlIGVuY291cmFn5gDoK2NzcyDkCs/kCE9rZG93bsU2b3RoZXLpAWsgbGFuZ3XEYiBiZWNhdXPLPGlzIHVuaXZlcnNhbMU75AvtaWJsZS4gWW91IHdpbGwgbuQA0SByZWdy6QLwbGVhcm7oAdTESfIBFWgzPkF1dGhvcjwvaDPOG3A+VGhpcyBzb2Z0d+QB63dhcyBkZXZlbG9wZWTkAYxDYXJsb3MgUGluesOzbiAo5AT4MTk5MyksIENvbG9tYmlh0nFwPnd3d+ULai5pbmZv0SBoMz5MaWNlbnNl9ACSV+QA6ucCHiBzb3VyY2Ugb25jZSBpdCdzIHJlYWR5Li7PdTwvZGl2yxDpA1XpBezzCA1B5AFB7AgL7AgN5QFe8wgJ5wQE7QgA7AgC0DjlBi7UNekAmscJ5gx3+goRa2F0ZXgubWlu8AoWIWZ1buUOECh0LGUpe1wib2JqZWN0XCI9PXR5cGVvZucDn3MmJtMcbW9kdWxlP8YHLscqPWUoKTpcIshZyy9kZWZpbmUmJsYILmFtZD/GCyhbXSxlxDXYfj/HCC7lAMnFYnTKDH0oXCJ1bsZLZFwiIcg9c2VsZj/EBTrkAb8s6QDrKXvnBwTJEnQpe3ZhciBlPXt9O8gVIHIoYSl7aWYoZVthXSnHMsQM6ADpO8Qzbj3EEz17aTphLGw6ITEsxx06e319O8c1dMQ1Y2FsbChuyDwsbizKDHIpLG4ubD0hMMoUfcc7ci5tPXQsci5jPWUsci5kPewBryxhKXtyLm/ECyl8fE/lATsu5gEGUHJvcGVydHnFJ3tlbnVtZXLkBYY6ITAsZ2V0OmF9KX0sci5yy1DkAf30AUVTeW1ib2wmJsYILnRvU3RyaW5nVGFnJibYdNIsLHvlCDE6XCJN5QItXCJ9KSzYP1wiX19lc8gpyDshMOYAtXTtAQXlAaIxJmUmJih0PXIodCkpLDgmZegBr3Q7aWYoNMQe8wJcdCYmxAMuym3KN+QB22E95wCh5ggKKOQKuSnEUXIu5AIb9wC/YSxcImTmCYLkALzuAXzmAMp0fSksMuYAlXPlASHrAW90KWZvcijEf27kBtx0KXIuZChhLG7qAr5l6QK/dFtlXX0uYmluZOUAnCxuKSnoAnNh5AEqbu0B38RUZT3vAPI/8gMV5QDS5AC/fTrTHekC1eQAmGUsXCJhXCIsZSksZcRxb8tx5AGbxyvnASlwcm90b+QA5y5oYXNPd27oATPmAxvEMcREcD1cIlwiLHIoci5zPTEpfShbzFQscil7feoBDMcSXCLkBw7kAUzkAeE75AGgZSk7cigwKecByckxKXvICyB0yD7lBdxsZXhlcj12b2lkIDAsxRJzdGFydM0SZW5kzRDGNHTML2XKKnLoA8R0LnLkDYDqAIXFdscdcj9lJiZlLmxvYyYmcsYHxQ7HXT09xRXGDj/kD7Z0KMsgLMYMxXwsxiplbmQpOuQCDzrIWX0sdH0oKSzrAg7wAQbnAQTlC4jtAOFvY80QxSHnAPDEHGXqAOPqAd37AO3mAMByLGHGJeUM2SxlKSnnAKJpyTbkAObpAZvoEkDnAIvmAdMsbj1cIkthVGVY5AtHc2Ug5RLWOiBcIitlLGk9cucBTuQDr2kmJmnmASM8PWnlASDlAwxvPWnmAUUuaW5wdXQ7YT3HJsVhc8YrO2E9PT1v5w3dP24rPVwiIGF0IGXkCZ5mIMU5xHQ6yRroAK3kAIkoYSsxKStcIsQixVVoPW8uc2xpY2UoYSxzKS5yZXBsYWNlKC9bXl0vZyxcIiQmXFx1MDMzMlwiKTtuKz0oYT4xNT9cIlxcdTIwMjZcIivJQC0xNSxhKTrIEDAsYSkpK2grKHMrMTU86QCxyB9zLMQY5ACMyUvJO3MpKX3kAJ1sPeQBn0XkAUcobukESWwubmFtZT1cIlDkAWbFHlwiLGwuX1/lAfJfXz3rAfwsbOoBrWEsbH07acocyzLFRsoa5QEbbz1pLHM9LyhbQS1aXSkvZyxoPXtcIiZcIjpcIiZhbXA7XCIs5AzAxRBndMYPPMYPbMUPJ1wiJ8QOcXVvxx8nxh8jeDI3O1wifSxsPS9bJj48XCInXS9nxXZt7QJy6AKoXCJvcmTkE8Vw5AYuPWUu5ACmPzHFC+USWecBXuQDi8QQWzBdKTrkBtzlFuXfNNA05BPnzDPIISk6ZX0sYz175AmsYWluc+oFjesFWy0xIT09dC7lFTVPZijkBUJkZWZsdNUtIOYDQD09PXQ/5AaFLGVzY2FwZcssySrmB7godOoCpGzrBXXJJ2hbdF3kB5VoeXBoZW5hdNVM5Ar/xkRzLFwiLSQxXCIpLnRvTG93ZXJDYXPkCcDkCJRCYXPlD206bSxpc0NoYXJhY3RlckJveM1U5gbFbSh06AKhXCLkDY5vcmTrAUR8fFwi5ASr0hZhdG9tyxN9LOUChWNvbEZyb21VcmzTbC9eXFxzKihbXlzFAS8jXSo/KSg/Ojp8JiMwKjU4fCYjeDAqM2EpL2kuZXhlY+oAmyDkBYYhPWU/ZVsxXTpcIl9yZWxhdGl25Aj9fSx1+AWP5wT25xhcTW9kZe0FhG91dHB17wWnZXFub80SZsQTzRJ0aHJvd09u5QN7zRnlBTjkDY/OF21hY3Jvc84TaW5SdWxlVGhpY2tuZXPOHeUC+0lzVGV4dNJN5geazRN0cnVzzhJtYXhTaXruAO1tYXhFeHBh6wd4PXR8fHt9xh7sASNj5Ai2bHQodMwWLCExKe0BNsomxhEsXCLkEUlBbmRNYXRobWxcIscw5gFTyi/FEMpP5gFgyh/FEMof7QFtyibMFywhMMct6wGByivKFSxcIiNjY+QbYukAnecBnHTHCeoBEfEBouQA1uQBRSgwLMpc0CYsMCnHWfEBxco10BvqAO3nAd3KK8YRLFwi5BRb6QC15gHxyibFEMpG6AH+9gCyxh0sMS/pAKvqAhrYMsYfLDFlM+cG4WXsBqvoA6Rl5ASeb3J0TuUY8uQAyfAKXcQ7YT3rAOvkCFT1DuBhJiYoYT1hxzkpLGHkC+JpZ25vcmXkC+I95g5PIeQFgmHkBI7lAeXEQD1hKeUCHOUJIW8oXCJM5AjZLWluY29tcGF05BHJ5ghs5hNu5QCG5A99ZeQR+XNldOQTOyfFTifmCQIrXCIgW1wiK3QrXCJd5AtOKTvoAY/Ebj/2DevnFhMmJu0WHP8AjvcAjsQ79gCN5A/o337fft9+byB1bnJlY29nbml6ZWQgJ1wiK2Er5Agd9QCOfX0sZS51c2XkBvNjdEJlaGF2aW/sDxn/AgbyAgYpdHJ5e+oCCH1jYXRjaOQF2GE96QH05ws5ISgh5QIK6AIl5QILJib2AiR8fCjtAcX3EPb/AUj/AUj/AcbqATjkA7s6/wCD/wCD/wCD/wHL9gCT5AxNZS5pc1TkBF9l7BExKXt0LnVybCYmIecEB2PkENcoyg09Y8kL5wgPKMUyKeYORuQLBfMB7+oE3T/KCyh0KeUSdMYO6ARsQm9vbGVh5A/C5wzxcP8OmcRCae4OdOQflc0RY3JhbXBlziVpZOkOlsQv5w6VyCpy/AUOc3XtAJXHGGRbZlvHWl1d5AFhc3Vi1SdnzidmcmFjTnXqC2bMK3jSK0Rl7Q6lySt2zivlAMnVKWLOKeUOsNQoec4oaXNU5CC00yvpAUU+PTLnAbVkPVvkBadw5SI15AbAxg4xxA4wyA4yLDHLHDPEDskcNCwyyxw1xA7JHDYsM8scN8QOMCldLGY9WzQsNSzEBDYsN8QEXSxnPVs1LMYCN8YCXSx4PVsyLDPOKHY9WzMsM84oYj1bMSwxLMsYXSx5PVswLDEsxEDHBF0sdz17RElTUExBWTpkWzBdLFRFWFQ6ZFsyXSxTQ1JJUMQMNMgMyRI2XX0saz1be+QOOTpcIuQK9G5cIizlJYBzOltbMjU2LDU5MV0sWzc2OCw4NznkAYXILmN5cmlsbGljzDExMDI0LDEyzilicmFobc4oMjMwNCw0MjU1zChnZW9yZ2lh7QCCNOQAgzQzNTHNemprzXUyMjg4LDEyNTQzXSxbMTk5NjgsNDDkAK4sWzY1MjgwLDY1Mzc2zELkH2d1bM1pNDAzMiw1NTIx5ACUXeUESFM9W13qFmVN5ASZ6BPzZT0wO2U8U+cOLDtlKz0yKeQdID49U1tlXSYmdDzECSsx6BaPITDnA7khMX1r6R1x9Q2E5gCT3CRT5RjgLmFwcGx5KFMsdCl9KX3mBPp6PXtkb3VibGXkI6thcnJvd+QVyDI2MiAxNTdcXG5sMTAtMTBjMzQtMzYgNjIuNy03NyA4Ni0xMjMgMy4zLTggNS0xMy4zxAc2IDAtNS4zLTYuNy04LTIwLTgtNy4zXFxuIDAtMTIuMi41LTE0LjXkIystMi4zIDEtNC44IDQuNS03xBYwLjUtNDkuMyA5Ny4zLTEyMS43IDE2OS4zLTIxNyAyMTYtMjjETTE0LTU3LjMgMjUtODggM8VwIDItMTEgMy44LTEzIDXEYCAxLjctMyA0LjItMyA3LjVzMSA1LjggxQxcXG5jxSEgNi7kAMc1IMY2IDY4IDHEWzEyOC4yIDQ3LjggMTgwLjUgOTEuNSA15AC1NDMuNyA5My44IDk2LjIgMTI0xVDkAS/EKC4zIDggMTXFRMQFOCAxM2g2YzEyLeQAzjgtNMQFMTAgMC0yLeQAojctNS0xNS0y5AFMNDYtNTItOOQBdy3mAWNsLeUBf2gzOTk3Mzh2LTQwSDIxOGMzMjggMMgCxSQ4Yy0y5AF3MjAtNjUuNy00My0xMTctNjkgMi7FUDIgNi3kALoxMC01IDPEKzE2IDcyLjMtM+UA8TA3LTY05AHtOMVtODLEbXpcXG5tOCAwdjTnAIMwxRZtMCAxOTTPFVwiLOYCSeUoTekCSsUiOCAzOTJs5ACHMTAgMTBjLTM0IDM2LeQCTyA3Ny04NiAxMjMt5AJGOC3kAYwuM8QHNiAwIOQBSeQB3zggMjAgOCDkAKsw5AFaMi3nAXbkAj7kAZzkAMoxIDQuOC3kAmI3xBbkAbjkAlAt5AJQIOUCUC3lAlAgMjE3LTIxNiAyOC0xNCDkAk0tMjUgOOQCXi0zxXHkAkAxLeQB5jEzLeQCGuUBriAzLTQuMiAz5AKwcy0xLTUuOC3FDWPnAc425AFQxHzFNS02xVLkAlIt5QJSLeQCUi3lAlIt5AJSLeQCUi3kAlIt5AJSLeQCUi3lAlIt5QJPLeQAvjgt5AJP5ANBMy0xxlEzaC02Yy0xMiDkANI4IDTEBeQCVCDmAtU3IDUgMTUg5AJUIDQ2IDUyIDjkA7TkAWVs5QGBSOkB0jgy5AMMLe4CUTEwIDhj5AJP5AF15AJPIDQzIDExNyA2OS3kAbMyLTYg5AC0MTAgNS3kAkwgMTYt5AJMIOQCTOYB5zcgNjTkApogOMVtek0w5AMi/wJJ6AJJ7QSMNOUrbSAyNDFIMTEwbDMtM2M2OC435AE8NyAxMeUAiTIw5QINMzUtMjAy5AEQNOQD3C0yM8QFNSAw5ASILTctMTEtMjHEBjjkBJIzLjLkAY7lAd7oBJLkAzsuMuQEKuQAx8QbMcQcMeQBSuQCFsRzMOQBtCAxxHcgNOQAijPkBMc5Mi02OMQwMzBTNuQCtzIyOMRSOCAyNOQDgmPkAQ005QN25gG2MTEgMCA45ACo5ALGxSoxN+QEdMQL5ALz5AR+NDflArk1IDg1UzE5NiA0NOQAizIw5QUJNDkwY+QBjyDEFDUgMiA5czEuMuUDMMUzY8RLxATkBaogMiA2czLkBNYuNeUE8zUuNWPJHsRPMS44IDbkAQtzNiAx5AJQMWMxNOQCVeQDCeQFgeQFY+QEuDLkA1wzLeQBW+QEcTfkAqY25AXc5QRX5gGFxFFsLTMtM+QB2zg5MHpNMeYBxecB7jkw7QHuYnJhY+UcQjYgNTQ4bC02LTZ2LTM1bDYtMTFjNTYtMTA05AHf5QMD5QECMzgtMjMy5wO85AEvMTHlBOg0NSAxNzktNcVlNTc3djEyMEg0MDNj5ANnMyA3LTgxIDE1LTExMyAyxFcw5APWMy0xNznkBdcxLTIzNyAxNzTkAerkAMM1LTYgOeUEtjPlBcHkAkkgMS0yMCAxSDbtAL3kDSxy5ADCMCA2bDYtNmgxN2MxMi42OOQDWjE5LjPlBybEOSA0IDTkBMoxMyDlAiLEXcRs5ADf5AaI5ADgODAuODEz5gZoMTM25QKI5AZgNTXFUjPlBcsxNy4xODjEFOQGp+QB2DY2LsUhxE/kBA7kArfkAcw4xTblBW82IOUCbTcyIDXkASM0NTDmASMyOeQBdjHkBFc0xC7kB8IzNS02MeYGQDMzMS0xNjFDNjAuNjg3IDEz5AF0MzIuMzEyIDnkBVQ3IDU0TDAgNDFW6QEY5Rdn6wPDOOQDpkg0MzVDNjQgODAgMTbkAQAyMjkuNCAyMSAyNjBjLTUuOSAx5AUG5QOjxAUyIDAtMy0x5AJMdi0zOEM3NiA2MSAyNTcgxE8gNDM1IOYB7TY1zXnpAZHHfjI25AKVyH/lCOLlAIAx5AGm5ACAODLFfy3TfyAxLTMgM3YzOGM3NiAxNTjFfzIxOegAgTIxOe8Ag2hhcnBvb27mAhEyNjfkA6nkBBblAfA3IDE0xDA5OTPlB9Q5M2PmA4TlBwQxMC4yLTnkBJbkBigxOOQIvOUGOOQB6DLlBKswLjVjNTDlBQUgODgtMeQDkOQAyS0xNzXkBGXlBBHEUDHkAOLkCUHkBMMtNOUFCDYtMTgtNucFBOUGQzUgMnMt5QUz5Am6IDE2Yy00MiA55ATcMTDlAvI3NOYCB+QEhDIyOOUJc+QFETHkA0A45AUK5Aip5AHOLeQFPuYHQHptMTAwLTI29gPz5wEicGx1c/8BJu0BJu0BI+QBgP8BJv8BJsU76gEj5QRD/wEm/gEm8AEjxFL/ASb1ASZNMOQCWsQV5gLA6QmQMOYJkMwW7QFR5CZj5AFRN+QFbmMtNCA05AiXM+QEbTY2Ny3kAVbmCVkzM8QRIDnkBkExc8UR5QTzxS3lAKxjOTDFIzU0IDE1NuQG2yDnAN7kBjTEJsYgxmAxxgc55AbHMiDGOcRRMcQTaDVjxy3kA/jECeQA/TgtNuQBDMUYMS05xRflAYsz5AsIxE8tOMUe5QkQNjbmAU41Mi0yMTHpBl45MDfmATI5MyAyODEgSOcD8cQVTOUBBvMBIugCd+QI3DXpASbkB5DrASLkBhPpAR7EESAx5QbZ5gEa+AEY5AEW5gxa5AES6QEQ5QmW6gEL5wEJ5wud6QEK5gEI7gEG5AEE5gECxAb1AP1IN3ptOTPlBRLyAkjyB3boAkXzA5Zvb2vsBTXkAVAxMDNzLeQHJeQFGjYxLTMzLjVT5ADz5wuPNjRzMeQNaDbkCH40MuUDly04My41QzcwLjggNeQNTOQHweQIzTTkDVcgY+QA+uQGojXlCK4y5ATsxEoyLeUHy+QBhjI2IDIwLTQw5wie5AldN+QNWeUMLzPlCn3kA8o1IDLlCBY1IDTEQjLkAUI55Ak55AFiMuQFRuQBpeQH3eUHgDTkCPoyMeQBxTflDDfmCKA1OeQIoOUCP+QBDcUUOeQKrugBF+Q2ZnNlZ+QprOYBHsQrIFY0MjggSDAgVjk05AJ2IFYyNOsCf8Q+XG7fLMssxmptYXBzdG/NZTQ4SDBWNzRINDDENcc00V/aJsZZVG/kFPrEWTAgMTQ36ARBNDBI5QIQMjE0YzbkATggMeQBZiA5xAUx5Av5NjdoMjJj5Q7UMCAy5QGN5QmCLeQKDuQGV+UBgeULiDYt5AGaOC3lCarkCqstNjktN+QOwzFsLTfmDlw5MDXmBc81bDct5AiqY+QJwC3kCc0y5Q69IMYx5QNH5Q8Z5AxfM8QZxWAgMC3kA6XEby3kAIVoLTIyQ+YAtDLkC3nkAdw2OCAzMuQLYDM2MXptMC0xNzToAdjkAvDkAwLkCo8xNegMfewDBm9uZ2VxdWFs5gErNTAg5wEr5AGmSDB6IOYMtsYVxhPkAYjfKsgqIixtaWTpCu4yMDDkAhczMzTnDCLkAPM45AFPOeUBQjQtMjjkAQ04LTXFEOQLeuQMpDnkAXE5LTE1M2wtOS0xNGPlBDo0LeQBBeQBTTkgMcRSLTXlD1TlC5cy5QozNeQEWDEgMTk5LTbkA3ozNi0x5RABNeQOuzIxMiA2MkgwVjIxNOQrzjU2OGMxN+UAkOYKByAzxAktxBMgNDAzLTIwMSDkByTkBLLkBjIx5w6V5wcl5Ap6LTHkB5jlAcY45AxS5QJGNeQKl+UDhuQNROQHVDXkCkTkAN3EBuUFPDfkAqcxczE05QV85Aq1MjI5IDYw5QCZNzLkCrbsAU/pCe/GH+QC0OQBVOYL4uUJ6OQBUyA0NCAy5Ap7MOULODMgNOQEm+QPNTkzIDEzOeQBImzkAT5j5AVzNOUHpeQEeeQBZeUHHeUS9OUNYuQBUeQBgiAy5AD3OTnkC3035BMm5QFRLeQBUSAyMTItNjLnAUvlC2jkAfIzMmMt5QFXxFLlAVHlAVcgxBMtNOQEhzAxLTYgOOQGCeUE5THEBi7kAvPFeuUOPnPmEFjlDRLlC7fkAVnlAfQt5AjbLTEyLeQBWS3kAVnlAjbEBuQB5THkA180xEDkAVot5AFaLTIyOS02MOYB+eQBVW9paW505B2XMeQBUjXlCyI3MS42YzI3xAswIDMy5QlMMDbkE1PGDDfkBecwIOQF8+QQ6OQNRzcuNuUK1cchNy42UzE5My4xxTM2IMYMMjQ5LjhjMC03MS40IDQ25AuBxUszMTnkCdnEDOUI+DM2OC4xxmdjMOQBhDQtNjAuOS0yMTUu5BSeOC7kD97FDDA2LjTkC7c25hH5OccKxR7kD3XmD9/EPuQCJ+QAw8cgxQwwN+UAycZSMTI5xwrFHu0BHTLlCEE15RQmMDAuMWMzOOQCyzAgNDUx5ACrMzcuNscMMjPkBp455QUS5ACd5BAd5RBjxx/EDy0zOOQCNDAtNOQQ2+UDmDXHDMUgIDAtOTIuNOQCaDQtxFHHHDPmChg1MMQdMjMwYzAtMeUHqzgyxCk3Ny4yLcUdxgxzLTXkD002NsUIxRPkAynkBfgwIDjEEjYgxho2c8Y3MTbEEsZB5Q3db2ntAiA2OOQBu+UCIDQwOC455AEC5RU25gIgxwzsAiDELOoCIMgh5AIgMjAy6QIgxgztAiA35QvtxUs05RB46gIgNTLlDwjsAiA4Ni445wIUxB7kE/XEDDQzN+QApS01MuQBr+QCIMYKxR7lA0XkAiLkBTg45wIUyCDEDDQz5gDjxlLkAiDIXOoCIOwCITEwMuQJGDUzYzYwM+UDPTcw5QIzNsRlxgzlAYbkCQHlFe/kEoIyN+cShMgh5BRsNjDkF2M35Qz+xT/HDMUeQzMxMSAyMeQCKTQxNcVyIMl85QEiNzcw5AIiNzcuMeQCJDPlDuky5AEpMzI3LjYtxCA1xgxTMjQ4LuQJOeQA7MYMMzMwLuQFs+QCKuQK8eUCkzPEPyA3N+QGf8UMc8ZFMTnGGMZRNi7lBFbuFhrsCpg4OeQMquQDhOUIOjg0IDflDbDEZuUL8+UGrOQA6eQGWuQFeeQMaTXkATLkBQQy5BDbLeQV7+QImsUT5hYS5BLr5AFx5xZG5AEh5hQqMSDlEZcz5BZJ5Rew5BQAxjTkBYrkCs7kE/3EGDHlCijnGOXkAejESC00MeQTtjflBWTEUjM5LeURgjfkByw5LjVzN+QApjYw5Ar7MTktN+QTbjYtMiA55QekOS0xMXMtMy055Ae+5AD75grE5AD75Qs9NOUBRMc4cy015AYZN+QW3chfY+QOiS0xNOUILTLlFmExLTTmCY/lBofkAdvkA2o15guO5RTG5wDe5Bax5ADuxHHHCeQFLjLkFAnkAsfmFJoy5Az55AW4NuYLn+QHRuQBA+UNhCAxNeUZnjM5IDIwNfcMT+UB7+kI6+cJGjU05hgJNiA2aC0xN+QSb+QFMy3kEyLkBs0yMC0xLTTnD4TlCHrkAqrmClHkExot5BMa5hcu5RMYLeUTGFxcbnPkGPHkAbfkAxflEw7kBWo1Y+QIjOQUteUQ/+QHO+YVxy03Ni3kBvoxNzItNecI8uUUMjFsNiDlAufkEwjlGHkzNSDkEwYgMzMxIDE2MSAz5AdrM+UCD+QHoeUC/Dg1IDExOGzkARN2M+USBeoA/ukImuUQzDQgMGw2IDZ2MzVsLTYg5AH95A5CMDTkFTnlCSXkAOUyM8R4MuUa6OUQ5OUQZeQWH+QE/jkgNTBILTMw6QC2ODk3Y+QU3y03IDgx5A0MMTEz5A1B5gpQ5A+b5BTfLTnkBojmD0M3NOUDMzUgNuQKLOkQ4+QDKi3kAyUtMWgxN+kAx+kTyeQTxOcS6WMzN+UCJ+UKRzE05BPENDHkGt7kDzrlE8TkCfEwxgUy5hOsxFznE8dj5AGBMTU4LTI15AJ0OS005BY4MTnmCyTKdusVVzI2MtN8Lcl85BlZxHzkE8HIfOgVCTDkElMg5xPELeYTxcR75BO6xHvECMt77hO+6g8/OTNj5QP15AH35BmdIMR/5AeY6BO+5AoS5gONMTjkB6435AoIxBU5LTHkFbXkCiktMjPkF1IzxDbkEmfEUjjkDTzkGkTkGKfkDtct5AeV5hI5MOYE/+UUleQEQ8RWMeQLcyDkCLPmHG00MuUb1SA45RfF5Atd5RRB5QVS5AU0NeUBCjY5LjIgOTIgOTQu/QO18hOb/wED5gED7AEA5hR9/wED/wED5QTD6AEA5QMH/wED/wED7gEA6xNM6wEDIOYOGekalv4RMuwBLugTeOQayzQ3IDUxMWPvBnrqBnfmBnXkBXxz5AD7NuUH6+QUIuQGJzQwLTk05RdV5Al65gtb5R8D5R0Z5B0K5xwP5RmT5RKY5h085BxR5BqK5gXz5R9U5QbO5Rxq5AMU5x0Wc+YGCsRH5AGY6RwOOTA45R2b5RFSNuUNljct5AEvxVDmAUo4LeQa8yA35QyN5QFlx3zkBE3kH5ogMTb2EnTzAS/oAmHnATM3MDX9ATPmBnnsATb/ATP/ATPlBVvrATb/ATP/ATPETu4BNv8BM/ABM+cV7+wBM+QCoy3nAo3rFfH2FgTmAV7nE8DmEtbmFgM3NuQM9sgCNDDFf+UdROURNjjlEVbkBgXkIfUt5wDLxAvkE1Mt5BNTLTnkDdXlEZDkASg1NOQHsOQMo+Yev+QFuuQLoOQgyOce7+QGxTbkGkQ25Bst5Q6ZxC7lAPYy5AW7xAYz5AHbN+QIceQDmDnkB1XkCdTkF/s15hmU5QT65AZXxCLkCKLqE8A2Ni445A7F5AedMuQXiuQUcmMtMuUX/jMt5Aep5ACax1dM5QKTeiDkApvrE+U1OecTIuUBPe8T5uQBijbFOOUTtmjkE7bkEa9o5AEZVuUVG+YWZuUSAd8uzC7Hb+oTkucJHTE2N2MtN+QBZ+QR6uQFP+US58QNNjdoLTIzY+UFX+QBlTMg5Qgn5hdg5QsH5hag5RHm5BUh5AcC5QhS5R4yNjkg5BFQMDFsN+cfkucTi2zkCDTkATblC2HlEEAy5R/0LcYw5gWD5SKfxFfEGcZfMOQW0uUP5yAyMyAxaDIzYzI0LeUhXzflEG0y5ALdxVIxNjd6IOUeADE06CAD6xafM/QEK3R3b2hlYWTtIArmASHlFKXmC8X9FKj/FKXuFKXmDWrqFKgxMjVsOSA35Ro/IDPlI9Y15SFDMDMgMeQDejZjMOULg+URUuUDSznlAbXGV8RPNDAt5BBWLTY2LTk25BOn5RwjNzE25iPHODRsOS05Y+QDCeQBfDTkDd7kDN3ELuQgdeYU++QJvOUAneQSVMUNLTQyaC005CH/OCA15A7Y5RGI5AI05wCcbC05IDfnFV73FVvmGMTLY/8VYOgVYOQB2eUlJDLmGL7lCiLnAaruDd3qAtHlFNk25AQ+LcVFLeQBsS0x5CSh5QLU5BMM7gLU/wLR5R108QLUaOQCceQBZjdjLeUb9OQBtS04NeUlSTAzLeQBteQBNzDkG5TmGZ3lGFE5IOUCpMhd5BcA5RIMNjYgOTZsOSA56iMsMeQBxiA55CVq5guRNDgg5AG0LcUs5gzJ5gFR5h0q5SMO5Bk3xGTkAjIxOC01NOUmRucgeecAmWw5LTflAnLtA4zrA4nmAbDrA4zEVv4DjjJj5Q4W5QGyN+UNJuQDJeUDi+QBtGlsZOYRvDLkDZQ1LjXlCxfmCWw4IDczLjk15AXKN8gL5AGg5hqrLjE3NS3kDsY0MzdMMiA55A3D5SIUNC3kJBgwLTQgMi03IDUtOWzkDEfkAjvkAtAgMeYLszA3IDBjODbmDBAx5AW+OCAxOTHEBzflB+k2OC3EEzc3xAfkBrjkGz05IDVsxEQ5YzEg5QCCIOQiyOQLtyA2LjXkI+LET8QSLTIgNy425CWA5AofODhs5AF/MTMuMDVj5AeVNjMuMDfkDUs2LjkzNyA3NS4zMOQOLzMgNzYu5xBtNjguMjY3Ljg0xCgzLeUBAjItMTkxxwvpAUHlEd8zNDTkAUEyNuQDkzTlIC4wMC42MzjkCokz5ANS5RBB5BKQ5iW+OC4w5Q9qNjLkB1vlKPjlInjmEG82MkzkFe4w5gFW5CD2MS3kC181IDMtOeQI7zBsMTguNC05QzHkFMDmF5TkEaQ45AT2MzU4IDBjMTTmDP3kA6ky5g63MjJzMzE0LTnlEaYt5A4v5BUI5Q/jIDds5A0HLjHnFzHkAWHkIjUzLuQHgOQRC8RONS4zNOQpUDkuNjI25B0jMC425ATX5Ads5ASvNjIyQzg15BYdMeQQrjcyIDc15gRo5BQd5CG05A11xgzkASnkE4AxODnlEoDkHOoz5hKLMuUdrOUBXjPlFV44NiA1OUM0NeQYIiAz5AJHNS4y5Be15AnkxQtj5QJ2MeQI1jTlKrPlDX4wLjM3TC7kDwvkAtoxLeQnvOcfgDNsMTnkHK4uNEMzN+QS2uUcLDYz5Bhj5A7hxQhjM+QDVuYEbOQMUTE1NyA3NOQKc8QK5icwN+QJCDEyIDflEZYyIOUSkOUOajEgOWzlEiEwNzVjMSA4LjA2Ni0uNjnmETw2LjU5NS02xBDkKm80OTJsLTIxLjA15AK8MzFj5RavOeQgWjE0Ni02MDnlAMgyMuQBci03NzjLD8RQLTPkCUgtNDDkGhE2LjU35BIsNMgM6QFQNOkBUDjmAVDkE77lFXY05SPRyAvrAVAzNOYSPeUBUDAzNeYBUTTkCIfuAVEy5AFPN0MzOOQJp+QRMDM3xCvkAU7GCeYBTyA0MOUCsuUEWTTkJ0TtAUsy5AslxFbkHyvxAUs3OTRj5BChODA15CORMy4zOC3GTjQuNDk1bOQh8OQKODU3NOQBQjYuODXkDBI35Bja5RgI5AYSNzItNzflBf7HDukBPMRK5CIZLjIzNuYBQMYM5AFAdmVj5QPrN+QpEmPlLOXkBzYuOOQFiOQDHOQTQ1MzOeUccjnkBOI05yDr5SF0IDHGBjLlIRDmB3PmIPTlIQnkIBTkDnPHDuQlf8QHMMUoNOYhpTQxIOQCgcYTxk7kA17nIVPkGiHkAUY25Bty5SSvMnPkAmDkIYLkCyLkBrTnAIrFPeQcGMQOMzXFDjfkAbHlAenFYMUGLTMuMcQi5Q0I5B+mNXPkISXlAPPmKDwtMeUh5OUVOMYz5BUA5SMjxUbEUTcg5BTdxWzkECIx5CHJxUMxx1lT5AIYMTjkFl7kAwzkF+jkBE3kAKrmAJzkJmPkAPTkGsnkJb8yMeQtFTcx5Brz5iLR5BzCxDXlBxXlB27kCZrEQ+UAieUj5+QAkOQUXGgzxUZj5RBr5QHGLTI0LTQ1xAY1OeQB63dpZGVoYXTmGvgyOSAwaDVsNeQGQzE1Y+YhwDXmAbAw5A4q5BCSIDNs5Ab05itJMSA15AZ65BuzOWgtMkw1MzIg5ADN5BxZxBFjLeQqjjnmG6M5bC015gkB5SH9MTLkBeDlA7HnAIbmGEAxODEgMGgybDHkB0MxNzZj5BhE5AJ3xAXkIgsyIOUMGiA25A5L5g1r5AIIaC0xTDExOOYAgTUgMjLEEukD3uYcJTBs5Ae8xD4tNuUlE+UD0eUFhecAhOUFh+4AhDIz/wCE+gCEOP8AhPYAhOUEu+8AhDn/AIT5AIQz5AoK/wCE8ACEY2hlY2voAhQs5AHL5QIWLOQK02M1LC0xLDksLTXEBTEwYzDEEMQDMsUG5AIfLOYB5yzlDWDEKi3FPCwt5AIUbC01MTIs5AYFNTEzLC05MuYCKCwwxCY0xSjkAiosxkM2LDIsMTIsOCzqAirlAJ7pAiws5AHp5gEmLC3lAi8sMCwxMMR2xAblASks5gDsLC02xBctMTDlAJrkAJHlAS9s5AkhOCzlIF8xMTY3LOQe6OYBNeQAljEw5wCX5QE3LMZLNiw0LMUTLO8BN+kCQSzkAf7oAJnlAkT/AJn5AJnmBAXlAJky5C8N/wCZ9wCZ6QJWLOQCE+kAmeQCWf8AmfoAmTfqAJk3/wCZ8QCZYmFyYWJvdu4ziucNSTbkA73mLUpsMyDnLwMg6y8EIOQvBeQtIyDnLX5jNCDnLwcg5S8IIC0y5BNe5SzBLcQvMSDkGezlGn/kBjzlLxAg5CWw6S8TxEboLxcg6C8YIOkvFuYgdMRj6S8YIOUvGeUwm+US9OgvGyDpLxzlGao3xEzlE6jlM+fkLt7mLx8g5y8gIOYvIWPyLyFj8S8h5AcHx0Vz5Ajz5Qt45BLfxXBj5Q0z+S8i5SCZ7C8j5ACg+S8m+y8jIOcvJOQBUeYdJS0yxQPmARfmAX/kEvTlLy8gLTY15AGf5ACJ5Bn55QG1bC3kAdroLzDkElPkETM2MvEWo/UVX9UV7R115QJdYmHoGU7/HX3mHX3oHXrnFgH/HX3/HX3qFdDkAbT/HXz/HXzoHXwgM+URH/8dfP8dfOkdfOUdecRQ/x18/x18/x18/x18/x187x17OeQQAOUSWzjlFijmJ87nAgbHEesEXXNob3J07y6hNTA35DkyYy005ASmNi4zLDguNywtNywxNGMwLDUuM+RdPiw55AZ55h0aLuQ6Q8QYxAQxMiznKxAsNTQsMTU2LDEzMCwxOTYsMjI45C2yLOQQtyzEV+QrECw5LOUxqmMyxVY1LOQHPDFj5Dtx5AbzNSww5Sse5AWCNuQAhjIsMTgsLTZj5AWCLjcs5Ac0xBcz5AX75zS8LOUrJizlKyfkBqs3xgfEMuQEROQFgTPJA2wzOTkzNTEsMGwwLC3lFEljLTM5ODU3xig5OTQzxH3JCnogTTU55AuINeQn1iBI5ByC5yxd5yf45BXbxA/FHDkwOMQo6BZp0hnvGQfqAZXoA5os5BZCbDAsNDBjMzk5MTLkBkHEQDkzywnlBeHkAOfEBTfkARQzxAflAbHFDeQEj+QBBcQL5QamOOQRAMQU5BuOxBrkCILkG5As5BuR5QbOMuUOfMQyxUI2xFDEIDgsLeQu7eQIz8QY5QGV5Eqk5Ain5wGs5QQoLMQXOCzkBUTELsVuMSzkAa8zLDIx5RWaLDQyLOQbpizkG6YsNuQHAeQDUuQDRizkG6YsNTgs5BumLDkyLOgbpuYErekBfuUBSegFCDQ3NeoBY+UBmNwZXCIs6AFr6Qdq6wMI/wMG/wMG/wMG8wMG7QMD5APa/wMG9wMG+AMD5y8s+QMGOTA36AMG5AMD5wJrxArmAmzJCuUBhewDBOsvYeQDH+Y12d8bzhvoAYrxAwvnAwY1M+QDB+gDBucDnukDncgJ/wMG/wMG/wMG/wMG/wMG/wMG/wMG9AMG7QFM5AEC6gMIxBv1AZ3kTRpB/0qNY2hpbGRyZe5KU+VWqGXuSgfmYf3NE2RlcHRozRJtYXhGb+Ym/s0Yc3R5bM4SyXjnQs/Ic1tdzW/NatNlzWB7ffxDAGhhc0PEZe1EOcceYy7oTY3mXZPnAI7kPyvkQm1vTuRKick46j/XdD3pW+LmVEvoXGRGcmHlHEkoKSzmP/vtAPXqQAcrKXTkP5hlbmRDxBzHfscnW2Vdx3wo6lQA5E3eLnRvTWFya+5D0eoAlOVTZ993dCvmRvPObMZWKNBt5EoczGvGZ/VAjsYtKCnqVyPMZi5tYXDkTnxqb2nkRjbkR6XmQ3tU1k7mY/X1QPh9yUYgxUdC8UfZ6F/I6AJbdHx86AJeYXR0cmlidXRlcz3oS2L/AnH1AnFy5UuhZSl7ZcYR6ERvKCkmJsx75mB7XCJtdMQe5FID5kh1ZS5nZeZLdSgpO+RKZMpc5kuXPWHkSMZD81Xu7wJ46F7NdCk76AII5GmMIGXmAINO5FHqVO0BD+lL5HlsZSnLeO5Vwihy5Ei15wDfW3Jd6Ekoxg7KbWHEbe8BW8ZWyhDQW+RJEGUuc2V0QcgjKGHwAZ/kWaHJZW49MDtu9gLTbisrKWX7A0pu8wNKZX0scfMBWuVSfSt0O+0BwcZn5AELKz0n6V+NJytjLuZRayjvAV0pK+RSteYB6HLlA5HzASv/AXzlASEocis9Yy7pUYcoYeVUd+QAock3W2FdK1wiO+QCV+1YYnLoAK/FJu4Ar3LnAKHwAXD/AbQobuUCD+VVE1wiK24rJ85Xzz5bbl3HaORE8uVT5ekAo2k9MDtp9gHNaeQBzfAEoGn0BKDFVjwv50oqPuQG8U78SXrkW1n6BvfrBBb/Bw7/Bw7HEuVocv8HIPMHIELnWTfkV0N05QC07wczZeQEyf1J6+sDVO9ZufABonRdPWXkBeX/Bx7/Bx7uBx7HN0PrAMhcInNw5EeqxzLyBr7HNHHWNOUGJEn/Adr/Adr/Adr/Adr/Acj/AcjlXdPvAcZy6gaP7QUEXCJocmVm5Bu4/VDd/wHk/wHk/wHk/wHk+AHkYf8B4fEB4cYx5QHeUv9NMuUBKHLuWrZhbO4Bqf8B0P8B0P8B0Mpz50125ACO8Aq+XCJt5Vac6AHZxUD9TZf/AZX/AZXuAZX1CpPoCBtcImltZ+wGJeVlunTmAMfnANAsdOUA4egA6iznYrPlCD/oANv/CDjnBill5AYp5FQy5AahZe0IOGVd/wrN6QDKXCI8aW1nICDkAKPkUCLGRXJj5FAfJ+QAqckVYWzkBgEnIOUK+e0Hb+UJB/8As+wI6+4Hb3LzB29y6Qdv6AHF5ADr9wdpZekHaeQGqycv5Qak5QLxT+RbB1xceGVlxWLkXCAxMzHEBzMwMuVa5sQdZtIdOMkdZNIdMckdY9IdMMR9Rf4FRyxuLGksbyxz+F46/wNQxhJpdGFsae4DrHNrZXf/Bx74A4b0A9fyA5rsXsPnAKVlfHztAKNyyRDnAKFhyRHlAJ9uyQ/mAJ1pyRDoAINv6wW15QCC7Fek7Awn514W7APV7k4Ma+wNjsgbcj1rW2VdLGE9MDthPHLoTdvHKWErK+YDGW49yBtbYV3kVK50Pj1uWzDmTkduW+lORSBy5V3j6F/L5W2f5gRJ5AEsLuRo3UNvZGVBdCgwKSk7aPQMtGgrXCJfZmFsbORw/uRTiS9b5gKz5QKb5QKD5AJrXS8udGXkUx3IXeUD/sgNPU/mUZXEDF39BtX/BQ3/BQ3/BQ3kBQ3kDp3EKesAqixlPeQBGvMEMeYCJT4wJiYoKPkNcukIpinnBFbmcjhS5QKBy0crXCJlbelZNO4MWMhjZXx832YpKfoN0f8N0u0E599t7gDT8w346AGyPyjvDXYp5Gfv/wXX5GdM5AXcxmb3DWl05Gc27g1uxA/5DXHFLP8NdO4B1HLkBZLmAa4t5ncE6AXo6wGy5AXo/wFY/w2u+g2u5A2h6gDn+w2m52iQ7g1n5QK96QdJP+YNlj7kBwErPW7EBeQNGuQBYz7kWZpu5wZ2TP9kLP8LQfALQcgs9hFcZeQFHfwD8P8Dtu8CmU5T5AsddHRwOi8v5GxLdzMub3JnLzIwMDAvc3Zn5Qb6xQjwCOTuAJcp/2a26gqiyzUs5AjRdO4LqucKCMol5QjbyHtyPTA7cvYO4XL/E/hy/xP49gkr5QD7/wD6/wD6+QD65Ajg5g/05Fmc6wl4ySdbZeQC2CfkAX3FLOwP7P8BC/EUjOUBAPEUjOcC0nZn6glESP8CznMucGF0aOUFLe8LxWVy5AOhzRbJK+cIRcomZf8CxP8CxP8CxPECxOQAiesKX+4AjT/vAoVcIukLlMkk5G1E0yV65geH6ADoXSks+QJV1ntcIjzEPSBk7Qt5xh3kAf3kCt46ziXQdMgn5wHBUP8Yn/cEeMsX5WI2/wGg/wGg/wGg8QGg5DQp/wRl/wNr/wRl/wRl/w1A7QQV5gCs/wCr/wCr/wQW/wQW6AQW7APH6gIC6lkwROQB9eQKzSBpbuR0LmPkXYRF6m256mFI5mjKXCJFeHDldlggc+VuluQB5yBidXQgZ2905ACU6WbrK1wiLuQQaeQBAUbkDXZBTVMtUmVndWxhclwiOns2NTpbMCzkUPc4OeV+Ly43MjIyMl0sNjbQGTY2NjY3XSw2N9gyONgZOddLNzDRGTExMTFdLDcx0Us3Nzc4XSw3MtgZM9AZM8QLXSw3NDpbLjHEcM0eNV0sN/IA+8dM+AD7N/EA+zk0NDTES/gA+zc51X7HaTj4AQA4Md038gEFxm448QEFNTU1NTZdLDg00WnEXV0sOPgB/zjxAQTIGfABBOQAr/gA/zjxAfrHGTnyAPrmAJExMNBg6ADEMegCqzc1LC4wMuQgLS43NV0sMeYB4jU1NTksLjY5MjI0xjc5NDY2Nl0sMjTRa8dRMjnxAP01NDAy5AIBMcY0OMVmMCzlLWMzNOQCZuYBe8YvyhfnAsnSMOcCyc8wOeQBGC4wOOQpLy41xQfsAeAxMDDmAVE0MzA1NiwuMOQAluwBtTI05gC6NTQ5OOQgujAsLjLkAQs4NDbyAgLEPcQb8QG56QGlNDnxAcDoAjg1MPECbOkCOjDRbDTmAw44NTD6AnAx0TY2M+UDqTg1OTI6Wy3kMW45OCwuNDY0MDLGIcVTOTTaHTbkAKYtLjEzMzEzLC4zNjY45gFR5AKbNuQAp9kcNuQBiDEzNTQsLjUyMjPqAtI25AGD1xvkAh7TGy7kA7zGIeQDv90h5gMY6gHAxRYy5gJG0BYx7ADANzc45AILxE7nBOE4NjL7AP4y5wGK6gMY5QExMucC+88XM+YAguYCeMlEM+YCxdAW5AN3MDgx5AGQNcUH7ALEODYzNd8g5AFhMeQFQe0AiDQx5gIpNjPlBTvaIDQy3yAz3yDlBDc4MDjmBFPpANg05AIU1Bg31xj2AMg45gPrODY05QDI0jg15AJG2zg19gJFxRvkAPvXG/sC7jXlA0PXHDXaHOQICy4xM+YGjsUHyhvlARXWGzn2ArjEHOQHxy0uMDY05AJWxzQu5wD45AXP1xw3MOYCt+gFaOUCtTfnBS3zBL43MP0FaDg3MeYFFOoC2i40Mjkx5AIfN+YDVfYEcDfkA1boAtzrAbzJWDLlBFjaeDPnBQXTOzPnB3nLG+gHeTPnBcLUG+UErjM1McRx6QISyyD2AQnEH8Ug5AclLjI1MTQyLC43NDEx5GX4xCDoAJY05QKN0UDoBIM35QON0kDlAS018QDS6AYNNzXxANLJGzb2Aq3qASnkCA/zAmDLIe0CgdNC5Ae25AHjNjI15AHjM+cDnssh5AHnMzAyNzQsLjc5MzjkKBzNIDbFQTE2OOQCJDgzMecCJMoh5QGX+gII5AnKLjA2MDYy7QfNyiDkBMTcIP4FZDfkCcbdIOQDv9sg6Amn8wKoOeQCEjIyOTU45AJnxAfPIMt7OeQFdM4gOOUHezI1NTgz5AnHxAfPIOQAm9wg5AFb6AJyNTflKcLNIOQC8tsgMeYCstBg5AKyODHkAfgyMDU3NiwuN8UHzzzkAXfcIOQA3PoCODjkBHfdIOUA3PkBXDjkCD/cIOQEvO8Gc8sd5QcY2B3EevEF0MsgxHrbIOQIQfwAmuQIS90g5QGW+gFa5AU53CDlBMj7AVrlBMjcIOUBOjM1OeUA4MQHzyDlAT3bIOUDUecFiPIDsTjlCC3bIDXFIPkDkTg15wXI2CA25wWo2SDnC8/xAfnoDDnSGecKQdIZ6g2PzhnoD6TrBdXnCvg46A+m8gbCOOQFbM4bOOcGXTjzD5DJUfEM1cob+Q6VOOQPltcb5gWS+gGh5gWS2yDlClb6AyHlBbLcIOYAtspb6gw2OOQFjugKMusIs+gI7jjlBZPyClLpARLkDWDbIDkw5gvoynzpCAA55A1F+wbJOeQJmd0g/gkROegP9vIGaTnoCd/UG+UH4vIJpMkh5w/I7AGpNjA05RCZ5A2k2Bv+AgQ55A7D3SDmAsvLG+gI1jnkBjrYG/kJJznlBhAwMzkxLC41xAbPb+UEFNge5A5V8gCt5T4a5QtUOeQOYN4h5AEPMzg1NjnkA5TEB89i5AEP3CD1DD/LIPUMRMsg5AD++gW0OeUGlNsg5Q6pMjMyMu4KnMog5QfO2yDlCKrbIOUIqtsg5QfO+Qa0OeULnNsg/wbUOf8G1DnkETrzA/fKIOUEk9ggOTTlCM7zE2Aw5hPKNOgUXcobNcUX8QO4xRfkBIXkDDrqC7HGF+YC/s8XNeYFL+cAnOoFr+cGGzk15QrhxyDrAXzIIDbnE7DwBqU5NugNgtEZ5A+X7wQY5xSz5Q+S2BvlDhH4BBM5NjbaVuQHs9gb31bmFPrEAfQEODnlDmfzAdrnFrUxMDDoE8PxEH8xMDDyBJDJHDflCcfZeTEwOOYRRcZ66wte5wZrMTDlB7n6A/XEIf0KijEw5gdK+QwhxCH9DGLEIeYAhPcJzcQh5gCE2yHlA7s25QbX8gxlMTDmB7PdIeQBSjQ45HO7LjnFB9Ah5AV+2yHlB7b8ASk55BUd3SHmC1X4DSvEIeUFQtwh5QGM+gDn5wVE3CHlBUXcIeUFRtsh5RNo+wHvOeUTcd0h5QDGODQ4MfQFScQh5QDG2CE1NzPFY/kRZ8Qh/RFIxCHlCHzRIctj5gOz9xgbxCHmAvf3Aa3EIeYPWtsh5AFrNDE5NTHkD7vEB9Ah/QdyNTcz5ATv3iHlAvfbY+UUdPwApeUUet0h/RAhxCH9ECI1NzPkEiD6A//EIeYDe9YhfSxcIkNhbGlncmFwaGlj7B115A4G7hR3NV0s5ALA0RXnBo7PFesL6M8a6wvizxrrBgvPGucHv+QZvcoV6wd4zy/nBhfOL+UFStQv6R5gMzPkAgXFJTXkAhU4NOQeTMdNxR4uMDMwNDEsLjHkGhAsLjY1Njgx6x5vxiM1ODM0ySM1MjY1M+seecYjMjc3OCwuMDgzxCo3NzEzOeseg8YjODnkAKrnBsE1xDHrHo3GIzk5M+QAjMYjNzE45Btg5QHwMDk35AnqyCg1OTPKSjk0OOQeJ+gbNMYiMDk2NckjODQ0NeQeGOgbBsYjNzM45Ay7LjXHHuUH+M1oMTg0NzIs6R4U5gKD6R7CxkYx5QFbMOQOD+QMzjE55ACz7AFi5AGA5wFdODk3xGnsAV3JHjEuMjAw5B877QFYMTQ3M+QEcuYBWDgyMDTEI+4BWOYBe+gBNTk25Q5Y7gFYOOULKMdGNjnmDrvxAVjkAIzGRjjnGbDsAVQwyUE4NOUc+O8BTuQBb+cA6DDuHwDFITI1NDHkA6vkAW825Azj7gFH5gH6x2E2MjU4M+sfD+sAxcQQMTLkAYjpHVvzAOM55BYG6x8jxSMxNDY0xAfmAKU3MTPEY+UNx+4CXc1KNjY45R497gFQN+YCy8dKMjQ3M+UEekZyYWt0dXLsBHbpGHUxNOgX3zk1NzRdLOQH388ZMTQ3MV0s5Ad0zhk3Mzc4Nl0s5Ayz0DIyMDFdLOYYSDQ5OOUNDDk06gbgNuQE4+UT/tke5wHjMjEx5wvnMjc35AGg5RN1MDgzMeQD8zgy6QZONTYyM10s5BvI5AIvMDgwxxnIN+YQlNg35gHS0zflBlnxAKU1MDHkBI/oBbs3NTPoBP/HGecFv9EZ6AXD0hnlBcfkERzVHuYVxNge5hXF2B7xAdHIGeUF19k36Avy0TfmHPvYN/EBEzIxNjA2XSzlCCcxMjYw5AYW0R7kCAPkGZ8wOTnkGZ84NugHgOYBoOgUkeoAjTM2MuQMt+gGUsoZNzE3xFDxAL44ODM56ySxyhk25H8B6gY4yzIzMTU46gYuyzI25QPp5ggS5gDSzVAxMeQFDecktsoZNzg15AZ+5AYRLjA2MzDkA9vLHjIwM+oGC8oYNTU0NMRt5Q3e0W01NTIz5CUj8QEHNjY45SSM8QEINjY2MOsF7ckZMS4wNDnkB0HoBenKMzgzMjHnJL/PGTI2OeQVleUBCeYCEs0eN8RQ5gXQMzfkCyjTPOgWIMsZODDkBeTxAQo4Mjg25AZD8QLQNjY4xUvyAQU0NeQCDegFsMtLMzHkATfoBavJGeQBBeUBH+kQsMkzNzE56CTF9ADsMzI5M+YFj/QCEzDlBRDmGybxBE3nBGs55Q152R7xAPY0OTnkBSk55x627AOKMDQ25CRY0DI1MTMxxDLxBJ0zODnEMjEw5wZO6gV1NOREdcQa5yH2yjQ0MDDkAd4x5g5R8QERMzI2MsVT+AScM8VX5iF30D01MjHGPfEB0jI35QHrMeQWQ88aODA45Q2Z8QPh6QDe8QERMjflAvIx5BY77gDeNzY25AI6MecWNMsaNTLlJkox5xYzyxo05BfRxBrrARI1MjM56AsA5gGXMeUWMfIBEjTkFmvEH+YB6csaM+QV1sQa5gEOzDQ0MuYAjOcBDuoBuDMzM+QCcjHoINTKNDUx5AnsMeQWRsQO6wCgMTHkAUDoJI7KGTfkDqpdLDHlFj3yALnnB7Ex5RY70h80OTg45BIo5xyH0T45MOQFfjgy6RJi8Ah4ODLnAMXSGzU45QFt8AKzN+QKjcQc5wRDzBzkCcDEG/YCeTMzM+QnIMQh6wcdzCEyOeQGkMQh5iQa8wLZNMch8gKJ5gGVxBznAovsAbE05AtmxBzzCDww5wnJTWFpbi1Cb2zkOPDqCcPpDX0zNesJwMkWNjDlBq/lEZfpFADJHjk1OOQKceURlOgMLugjUeQLT+URjM8ZyDToA1HJTeQNS+QKROgGKskZM8R56AoS5A3zx0o0NDfkBVbmCgzTGOYB3u0AkecdduUK8TbFB8x75iXJxXnlFqfnAsToAIDnA0PqDrAz5As66goB0jLmEFrwAITnAPrKSMYX5wD4zxfnCfXRF+cIItAX5wLS0BfnAe7QF/IPscUX5wU60BfyD7DFF+cCq9AX5wnMyhfnARXmCcznD+LRHuUR8DA45QIyNcUH7AGh5wnq5BUv5AP+6hemxx/mEvPYPfEC8zXkEGJdLOgemfECi+kQczbJacQl6xBuyhkxOMVL6A3AyhkzMDXEGegNtsoZODE5xEvoDvjJGTfkHYfrEEbKGTIz5AjE6S7TyRk5MDQxNusQLsoZ6xAgyRU0M+UPTugfJ8oZNeYA9ukQDMtgMTPsLs7JGTbkI5DrD/3IGTEuMMca8QD37A/ryRXkKcTkDtvyAPPEC+guxugZvdE38QD45CqX6w/NyRjoLCHxAPvERvIB7eQRKusPssQZLjAx5hOe6AIL6Q+yzR4xLjHkGjrrD67wAkPpLtHGODI45QQkyB7pD5vJNzfkERPoCgfrBFPnAzjlF93MGOUDheYKF9Mu8QLyxi/kBeblEq0zxBkuMMQvyh7nCA/rA+k1OeQK8OkKLckZ5wFo6AotyzLoGbfoJg/QM+kKLcs0Mjcw5Qmd6AvuxBou5BiP5RHAMzXlE5jnCi3sBFjqAazlAMDlCjHXdegKLPAEj+UKLPMG+cl16AeoylMwNuQD1+oKMdJT8QEW5wcT6QoxyhroAKHoCjHKGuYA0+YKL/EFTck38QEU7QCk6AovyhrkE5rlCfvxBuw0Ncca5wMOMzQ55yEk5wdv6Qov8wCH7AYM6gGW6QCH7AERyh/nBTrlCjvPWMc55go29gHzySTmAjbzAoTlIG7xAzMx5SuS8wM0MeQu6tQw5SejNSwu5AM07QGd6RAWzxjnBajrAJM35Bl1xBroCsjJGucEEDHnHOb3CLkx5iQtNzAxxjfrAObpMZLrBZzkLrpdLDLmCqfYVOULVS4wNDg2MeQTruQWNc0f5AE/7wDe5BRzXSwy6C/86gDg5wHLMuYu+tly5ibUxEbkB5zpGrPmCkvnA6TLVucBmTPoCkvrAOMx5gE3M+cKTcs1x2w15i5w8giH5gPZ6DO48AG8N+cDiTbnBRrKGOYBDjXkFqrNGPYFajfnA2HRGOQio9UY+AsWN+cBbvICNOg0Y9FM8gv8xRjoJFPyB+DpJFLKGucEs+UkFc4a5wFh5SPNzxrkDArEGtFO5wMA5SOhz2jkBsXxCPHnAlDlHnDWfugMytM00X7JNPgJvTgy7QWA7wcYODLnDkjPHjEuMTQ55hKn6Q6g8AG+6w6g0hvoAVzKG+cNjjgy5AT62BvtI6XwBPY4MuUEx9sg5w035SgMxhvlBNnkCTbnBu43MsU9MTU05SJI5wEG6TYyylQ2Njc15Qlv6RVq8AQSODTpFVTwBoTkCX31A6M3NDAy5BPkNPMFLsdWNecIRssb5wlA6DYc8QxE6gGuNeUJNvMBIuUA5+c2P91A9wFix0DlL+vdQPUONzg15AXL0ljMOe006dIhNuQJd94h7Sn50yHkAz79AL425ANG3iLkD8nfIvYN6Msi5A6N3yLrBeHzAgg25A6h30L1AU/KQuQOrN5C5SCd7AHKyDw3+QqMODfpFJ/FeTA2M+UmrC42MuUe6Tg38wp0yTvlG/rzEYk46Qa58QXDODfmKqbxDzfnBZU45Qas3CDmE574B9Y4N+YwKNsg9QlZ5zT81BjlAmLnHiPkCn3oNVHHH+UB2TAyNjM55wRNzh/mK+vYH+UweDE45Bgy7wEn5wZt8ghMODfnBm7KG+oCBP01h+YiOPEKa+c1JvMA++QSwO4FnekBhuccvtUb5yws1BvmAJ7VG/EDQS4x5QF0xDA25SDH6TVd+BGSODflIz3NRu4A6uYhCuQqAuQUrOkBzMlA5AXlLjDmBnI1xQfOIOYaItlAOOUE0twg5gcv5iENxQfPIOYFzdkg5jvD8AMd6gIAOOY7w9sh5zfj9xK2ODjlLNbbIOc7P9og9gO/yiDmAaL5AOLnOz/ZIPoCQzjmOrLaO+c6utog5yrS01vnFOrVG/4EcDjlK2PcIP0NGOQumd8g/QzmODjpHmDxBlM48gkOyhv4FzE4OOkeZtEbOeQH8voE7uUp89Qf6AOf5Snz+gVsOecnG+sEqOgyA+cnFNMa5R771hrxBPbIGucJdeYinOQUwPAHa+UufNwi5i119Ajc5AQV5i17/AZY5i1f3UDkAb3aQOUHgtRA6AChOOYLujI5NuQCOPEBzOQrs98g5QKY2yDlApjaIOcNAO8ZRznoBCHwBcPKIPYJKMcgMTDmEErzGaLEG/AK7Mkb5Tkc8Q4NMTDnMeb4BDXEIf0E0eQpbvUT1TDuGyZJ5U6/8Rss5HXk5iX0M+YWnO0bNOQlRuU9My42MuUMi/IbOS4w5CVxxCPED+QQpe4bJeR3Q+UDh8kg7AP55AXJ5iuo5ASoxGHsA/zkAd405RZIM+YYRewbNC4xNTgw5Q2xNDfmGrjrA28uMDMzzh3pGz4uMTTnJys15Afg6BtFMMQVLjbGB8k+5wCW7RtK5AHS5wRX5wCW7BHL5AR+5QHhLjQx5huG5xtP0jfrAizqAM3oAJXsG1YuMTPmEj7JHuwbXdEe7Rtk0h7sG2vSHuw3C9cj7Bt+0h7sG4XSHuwCQNcj7BuY0h7sG5/SHu4VmjY2OewCPvIbq9Ej8xuS6gLh5wIN7RAZ5ANA5RRL6ACD7Rt+LjA5MjDsAt/0G4PGGe4ZljnlFo7lKeTkJcLtGZUxNMhU5iF/7RuMLjA55D8VxB7kG3nvG5HkAK4zxHnkJk3EPO0bluQDb+YYhTcy5QS27Rub5CuN5SOJLjg5NeQQsu0boC4xN+gAljnlG9bsEssuMeQss8QdNDfmG0jsEs8uMeYD5DYx5QRj7Ruw6wDtOTTkBlf0G7U35AhS7Ru16QCOMS4wN+UIce0buvEAre4avekBQjXFc+0bx+kBmzc4NzL1G8vSQO0BKDAy5DYwxR7mCJTuASkxMjbkBb8uNucICe4BKekBoOUAt+0b4+sA1Dgw7Suaxh7kHETrAnDuG+jIHjEuMTXGeO4BL+gBv8g97gJUOeYqKsge7Rvt6gHBN+Q0N+4b8i7kLj7EHDM15QZ87Bvg5AFp5gNZyB3uA1k2NzDlAUfnA3fxG+w5OOYFhsgg7BnOLjA5NOUw1ske7gaU5B2nxR7kOLzvG/jke5TmLOTHHu4b/eQEPMc9xlvuHALkBvDNPO08esUHMjHnDpXlB/7yHAYxMM5C7wRw7gDZ6hwLMzI25AJfM+VD7egE7+8cEMYkNugBd8cj7AvE5y597ACA7QE76QD+MjnmGgPtHB7qAJ/nCAzuHCPKH+cC/u4cKOsBmOcA3fIcL9Mk/wFC7xw36wDhMDHlN7TtHDznNILEEOQYl/AcQS4wOeQMe+UJTuUc0PYCducJTe8cSfEBW+4cSckfN+Qw5fAcSS4x5C+QxT7kL9v2HE7oAPk25QWF7hxM5wxsxBA5x0HuHArxBuox8hciODY45ShF7Q3dxTnsCXHzHBjkOxbkHxXzG/nnAQ3tG/npBsjlDK/kAQ7zG9/rBYnmB33lG+TwCr455DG9xFnkJ7nuG+zoA63nB2jzG9DkAdPlQ6voANvuG9fqAfLnA03uG9zrAMYxNOUn++4b4e8AgPMb5OQro+YCFeUCcO4b5/EFJO4b7uQxRTfsAyvqG/XFPjEwxAfMH+4EaugLuckf8hwDxxrtHAXnC2rMH/0L8/McEecCLe4cEfECn+4cGNEf7hwf6gdb5whP9Bwk5gS07hwk8QJl9Rwp5xwPzFMuMTUw5whK5gPQ7hwu8Aij7hw26gnI5wIc7hw7LjEw5wZE6ACV7RxALjA1NjPFe8k+7gCa0T7uJBXoCp3GPfEcTu8HevEcUMcg5CRUMuUJQ+4cUPECAu8cVdMg7Rxa5AbB5gHq5wVn7xxf8A7U6Q8m+Q8iMugPIjDlNXLvDyI2OecGceYN7/UPIjYx5g5OMeUB6vEPIjPnBjXIIO4Ijjk25h2e5xQR8A8i7gCd7g8iNucd2TTkDNHxDyLHWMgd7A8iOcZV5xKx5jRoNeUQguQGPeQE+cg+5wCW7Q8i5DZc5w7r5wCW5wUW5zucMjjoBRblNgPpNHLRN+0PIugAzegAle8PIsY9yR7vDyLOHvAPIs8e7w8izx70DyLPI+8PIs8e7w8izx70DyLPI+8PIs8e7w8izx7uVUE15jlf5wFw7Q8h1SLoNJzrTjvqAt/nAgvvDyAy5gx45wCA8A8f5yTfyDvuOxXEGeQRrfA7EDEwMjXGNzAz5AK77jsLMTTnBpo35CzD8TsGOTTnDUTtDx7GOjLoPjU35Rsl7jr6MTMz5glANuQ7GesPHsZY5Bw5xVjmH/DuOuwx6Bz35wDQ7jrn6RH9M+YFcekPH8Ye6D7LNeQqBu462+oA7OREBfE61sQL5w/L7gEj6ACPOOYLp+860fAAre46zOkBQecYoe4BJegBm+cBQ+4PINZB7jwWMzg25gDSMu4PIMZfMecOFTU251ej9QGi5wH67jrA8ADX7jq7MTjmGC7JHu4BMcgeOTnuKwjuAcDIPO4CVuc/6Mge7jqo6QHCNuQZY/gPIOYDfu0PIDEwxznIHe8GlzY07AP46g8gMuYD2OgSmcgg7FPxLjA3NucKG8ce7gaSNuZR0S7lNVvsP57kBiU15QDs7TVE8An5xlXpDxrIdDXlC/bHO/QPGecGAecA8e4PHcdF5CzlykXvFszuANXpDxw1NeQ9wDEw5TKAyl7sDxvHIzQ05g39ySTuCJkwN+YRve41Y+4A/TLoD1fuATjoAJznCAPpDxnPH+cC9+kPGccf6AGR6ADa7Q8Z2CT/AT7pDxjGHOoA3TLmDj7oDxjIO+cCUOcITukPGDE15FFRMDnnJV0z6A7c9wJwM+c2Uu0Gp8p8xRztATrJHDbkBvLrDxfHHzIwNOcCrOUGK+4PF/AA9+YFf+kPGchDMuYK8egA2+oPGTE3OMQhMTXnEdbnAVvyDxk3NjnkNNPpDxk2xjkwNDfsCNP0KzEzMTLEOfIPGeUBDOkPFu4GwOQfZvIPFeYN9u8FfvQPFTEw5wOL5wGP6Q8X7wOq5wVn7g8Z50JmOe4JrukPGcVD5ECoxigzMjLkAMnqDxnuAMk5OOUVQ+kPGPYAge4PGsli5kAeMzg05TxO8A8c7gUg6Q8c5CSXxDwy5hgYyR/nDxzmCv7wBMvwDxzoC7PJH/IPHMca8A8c6BoGyB/nBkrnAjAxNzXsCY70Ky3mAjDpDxzIOe4CovAPHO4JpOoPG+8I+OYIS+oPG+ogDOYEtuoPG/UH6eoPG8k55CRHxFPpDxvGcjUy5gFA5wPU6g8b9QfJ6g8c7gI95wIe6g8cxh/qE0jnDv3tCEQwNeZMT8o+7gCb0T7uCCjpCprGPuoPHecCuu8Hd+oPHc4g6R+H8g8d7g3w8g8d0CDwDx3oAgnmIVLwDxzvDs76YTnpDzfsQ0nlAMzGAi7kCq3yLZvnUznyOZr1Hl3FGuQBWuQPWfQ5lvY5lMgy8SJj50ii8jmU5wCX8TmU50qA8SbAyBjvOZTqQ5PkAg3kJ2roDMfHYPYPJsh+7gUjxGfEAfQPIcgy8Stb9TmQ9TmO9TmM9TmK9TmI9TmG+0k10hX4STDSFewIDewA//IOsMwe5jl89lP/8w7IzR/mVOnWO/EC1OUjHPQ5eMgy8g7W7B3yyhYw5UbI7Q7OxhnvaEjKGeYI1e0OxsUZNjgw5Eff7Q7Bxhk15kOw7AUyxkvmOB7tDrfGGeUVhdAW5SST7w6qxRk1MeUAk+0Op+wBDfQOosRi8QD15V0c7w6b6gCR8QDyx1/tDo7sAQvyDonNN/IA9+Y6V+0Of8UZ8Gg68AGm7Q51xhnlZEPLFuRio+cGwuwdi80b5AYC8kkhylDvSmDmDvfsHX7JL+dSXPE5a+cDJ/I5a/M5acgs9AW38Q5b6StW7w5XyTHyNBXmAVTtDkzFGeQECOZTktcz7g5FzjTtGB8w5ADCxB/kMVTqQ47uDAnoAZf2OV/Jc+cB4uUJXOwBH+4ONMofyXPxKQ/nTWPzOV/JU/EBFOcG3u4OI+0Aoe0IdMYa9Q4VzjX3TwnnAKLtDg7FGjM57h0hzBrmAYLtDgTGGuYHOO4N/+4Ah+4UoekBkugAh+4MCcgf5wN87g397QDA9A340F3tDfjtAkzyOV30OVvoAbTyMALyDjbJGOZXAsYC5Qk1MewMzuwGZ+cAjO0ORMlH6DmG6gC86FZ18g5V5jm3xGb5CKox5V3w8gCF6Fap8w6Q5wCf7Q6TxRo55jXM5jmh2XLzDq3NH/M5ofAOmsYw5gIL5jmd2m7yDrTIVPAOq+sKtu0OpsQaMeYCRfAOosxq9Q6d6gQV9Dmb8A6PyhboDobsALD0OZX2DnT2OZHwDmfsAPLzDmLmCBDsDl/JR/M5ivAOTsUW5Qfy9A5H524G7Q5H7AFM9Q5C5QJ37g5C7AMA7g49xk7EMe0ONewCOu4OMM1/7Q4rzjTRf8k0+AnP8Q4c6wc48Q4YxxzyHS/sAa70OX/JG/I5f/IdHMsX9jl35wPl+Tl3ySDnAjjnZ/kx5B7P9jmO52+g6DmM5A535BAB6FP4/2+88jmK6W+87zB86FM36Gzn7jmP6BI0xyU2MzbkEpb0OZTIYPM5lOhiMOg5lPRsNPk5jus5jNY49zmG6zmE1jjzDiP5OXz7OXb7OXD7OWrEG+VKYDDlVgfoMMbFF+UFoM0X5E4vxRvmcGPUG+c5sfVtj+c5q9Uc5zml1hz2Dg3sblLkAhTlFqLIF/sAh/c5qugCHug5qtY89jB8yTznOaTVPPE5nsg28zme6m4J7jmexBfpFTo1M+QWtPQ5oso/9Dmi7Tmg8AXd6Dmg7w9d6Wzf5ggl2B7lOZz5B9XnOZzcIPMJmvQ5mus5mOYmTDQ25htuyR3mOZbkAQnnBPbMHeY5lNYd5moKLC7HTukBF+g5kPEIQeo5kMkb5QHW/zmK9Aqa9DmK9jmI6QFy8jmIyhvxOYjKG/E3Rcob8zmI6BVV6AWd/27l+jmI6QDo5BDh/m7D5XIQMOUJ/+t3sf9uu+c5ot1a5Asb5QC85AQ0yBzEGuU5vdw75zm++mtG5jm+2iDmOb7uAz3kANbnObbTGeY5rvdnJOc5rNge5jmq2R70A8nKHv1iQug5ptog+gJh5zmm2jvmOabbIPE5pslb8jmmyhv+BHrmOabcIP0NHec5ptwg/Qzv9Dmm6Wr/8jmmyhv4F0P0OabJG+UJWzI05Ft46BeS5mmw5zm/9QUZ6Dm90R3qa2zndHr0BZE55QM7MDA15C25xznlOUnlbrkwM+h6a+RVNsUX5nYP5DPm6Qhi5QqjOeQE1i0uMek/MjEuMjjFGfE6HegK7fI6Hcka8TodyhryUefHGucKBjQy5CBzMzXmHt/mA6/oOhfTHDkx5mRL5AURN+kLj+RVRzkx5mRE0xr3OkXqaCfnOkT0AXP4OkLKPec6QdU9+Do/+zo56A1R+Do5yiD2OjnKIPY6Ockg7zo55xK0+To5yiD2Cb3HIPQ6Ocsb8AunyhvlCPTzAb7EG+ZZKNUb5Qma7gtENuUghDDlDZ3RHORRE8Qc5nlezRw45Eb3xBzlA0wy5UC75gCny1TlBQDPHMhU5QOczhw45FxQxBzmfGr0AIzqOzPtD7rpOzT6aIDnOzTYIf87NE1hdGjvOzT/UzvHGeQSvjPmL7M25Fqp7je4MDY5N+cr5+UyO+83uOhJhTkzOOQBw+43uDA1NOVmCy44MTDkXBLvN7jkTKvEHuUPI/RTU+QF5eQhBe42izgyMuUAkTnECfA3tOkXMeggNO42izAw5W7Q5DBN7SiX7gDr5APo9VNr6FQW7jaHMTTlCsvkMRDlXCbvN7bHHy455Fha8Te36AFBOOYite43t+kBIzcy5gzW+FOD5l1Y7gEoMDQyxCAu5Axg8FOJLjDoEKw2OTLlWaTuASjIeORqYeQoG+4wdugA0jgw5koF7QJO5SYrxTzoClvUWuRUneVV+O43tOkBvznmPoLuN7TLWzTkA4nuN7TpAb83NzLkXPPyUys2MzLkZdHzGcoy5Th99FMrM+RyRfRTK+QVhusZyss051Gl8ygNMTHnJdg1NjjkYTX1UzAzNzDESuRkz+UEpfJIpeZL0u43JsUaNDDkYGr0NyAwNuYr6DTkHa/xKAQwMTjmI6M2513W7ik6MOVvxS4zNDjkXn7yUzwxLjAzMvE3GcQaLjfkBrL2UzzmHbv5Uz4wMDnFH/0BIjIx5VOz7TcM6k4Z5QHu81NHNeYD/vRTRzE15BOj9FNHODHkVWfwU0fpAIvnUj3vU0foFR04MzHlAZrzU0c1OeQl6fVTR8ldOeUUOe82++QD4OYlzzU15AQd8DQc6QPENeUFuf9QQPQEkzbmJTr/UEXKOeQDlsUfNOUBYO80HPAFue80HeoGLTg15AYt8DQd6QDP5gLC81Bd6STd7jQYMecr3TfkLpPyNBjpBv035QkQ8lxhNzYw5mHA8Qd95Aom5zWA5ACexCTzNu3oJfg1OTDkAeo56CLryEM45ivC5DuhxUPyBIUyOOQLzOZu8u8AgTYyMeYlGuQNRcQk+wJH5AEc6CMUyH3oAys25AbxOehujsp8NOQqi8Qa7ANj7ASG5W9n7wSg5wGi5kej8QPaNzA35QWG5yM2xhrkQLDlet8uNTc25DgWOeVut/ABbzDmBtPpAO7yASzmBFY553Oi8QEDODI05Auu7AwFyz425Qf4OeYjSeYbZshCN+c0XeQMxcVC7AErzGE15T4w5yNXxx8x51W66QZp5wma0T7nUx/lby/zATrnRe33VTc35lz/5g3z8AE6x2I35wPz5wmp8ACBNzE35QJr6WZdyV02OTHlAJvtCIPKHzfmA/LnCIPJV+gKHuYLAuUVePgBdjEw5xwoyxo05AtE6gre8wra5gtk6Wsx8CSiLjA1MOR1b+huPzU45GMJ726FNzE1xAfHI+Q5cvhuheYWMzgyN+QGm+9uheUO18lGM+QBR/AziuUApMciNjQz5AgC7yTTyUDmXT3vbns4MeQNbOgAhucKw+0qJzDkJRHqGjYzOeQJJ+4zmTA5NuRPWuduezXkBXbxbnvnARLHaTQ55Wii7hws6AEU6CW07ypR5DqY6W005B9x8TOvzSM45A9w926AxyM35mm07zO57wFU5QuA9CU1yUY55iVY72/UNzfrAgI1OeQGn+9uhu0B3zYxM/Mzx+wAizU4NOQOD+8zzOcA9OgBOuYA0e0CsOV0XOYEyfQz0eg+7uQA3ewLPewB/elv0+ZSq+0BU8tf5QEI8G5+7AMKNjgy5Qb48iL1MuUPW/ILRzQyOTHkBdruIFXoAkg0MzLlZ5LvC0zpAormcIPwJRvJPjY15AyK9QtW5TFNyEg0ODnmCx7zJSozNeQXIOlMHTbkbFD0JTM3NuRhy+ozaznlCx7mV4blZ0ruM2fEH+QCIuYNFjQx5W1I8Atj5AoCxV0y5gv67ggGMTk26gLrMuQRtvYlRjc45mgW8SJBNjAw5GbY8CVG6QE/9AtuySTGdzUwM+YLT/oBOsYp5HFo5QCG7TNs7gUlNDUx5QFE7yVoyR/mUrzwJW3IYucpqfAlcshk5AFr8yV37gHf6ADy7iV8MjbkF9zHZzcxNeUMZe8lgcpnMeVCGfQlhsds5wDO7wuhxyQ0MznLJDY15Qee8DCn7QTB5gx/8CJl6ALb5xt28DCx9AUn8CJ0yEPkAnDxInnkMpvkf+/IQ+QI5PEwwPUGfu8wxe8HBTc55HJe8DDK5wDyxkjnBOfwIqTIQ+gjDvAwz8lANjHnIsruB9PuB/Y35A6d6Qva5wGdMDPEIucFi+VwWvUL4uQseslKNeYEhe4L58dQ5xle5Guf5BK18QvnNzjqAT7lCOPrC+zvA4k0NjbkBmD1C/Hkc7PKKTPlJBXyeELxAqDld1rwC/7tAjk0xBbrDATvA7EzNTPlDkboDAnrBg/mBS7zDAnkAd3FNOwKz+8DZDbkSlvrDA7FH+QNNTbqBFM0OTM55Qyf8wrZNDYw6nfZ6AEQ9waB7wwc7AEq5QDI5g2g7Qwc8AUjMTflDkTtDCLHSOQC7skpMzYy5QzG6Awn0Wwx5gyI7jiuMTPkBknnAPUzN+Vv7OgMK/QE5OckUu4MMO8Aszbkdx/wDDXvARo2MjU25Rj99Aw6xXHoJGPmYZrpDD/vANc2MuVz1PAMP+kBPjkx5lLl8wxEyiTld6LpDErsBlzlQ7845Qak7gxM9gGm6gxS8AIJMDU56gxW6zQL/wxX+QRh/wxX/wxX/wxX/wxX/wxX/wxX/wxX/wxXzCP/DFf/DFfqAKr/DFf/DFf/DFf/DFf4AVT/DFf/DFf/DFf/DFf/DFf/DFf/DFf/DFf/DFfUX/8MV/8MV/8MV/UDzf8MV/8MV/8MV/8MV/8MV+8HD/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV8ok/wxX/wxX0Wz/DFf/DFf/DFf/DFf/DFfVQ/8MV/8MV/8MV/8MV/8MV/QHCP8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV/8MV9Fs/wxX/wxX/wxX/wxX/wxX/wxX/wxX/wxX/wxX/wxX/wxX/wxX8QxXU2Fuc1Nlcmlm/Hnq5gSD80BTNeU9UPh57eYsbPVAV/ZAWOQ7k+V8mfN57eQAwfV57eY15vJ57eY4c/J57ccY70BZ6Xns5AC15AVV6mAH5i+L5kBaxG3kBcHpA/vIf+cCo+QD8O0BNehAWtIy8TI360Bb7AFj6kBczhboQF3PFvI0butAX88W8jZO60BhzxbyBNvrQGPPFvMwz+pAZesBI+YBCuYxk8QM1B7mQEkwOeQtzC40MOZbR+oBl/N5pTE55AOC80At5gg88zTSxxnyNIvHGfEA0ORlZeRAePIrveYIXfIruzbkVs/qDxDLGecl/fJugcZ96A8B0WToDvfKGeRGR+td/PEBE+gO48tL5kDf8jWF5w0d8h1c5FW95A9R+AD66A7A0RnoDrbxAUXmBQvmAf/TN/IA/8c38QD/6C1U+AH56A6K8QD/6A6AxRnkdhLnRt7HN+8kf8Ye5CRI5m1F8gEKxzjtVEcwMuZOaccd6A52yjbkIsHvTp7FGDPmESbyeZrHGPUDruZAMuVOxOQDUOQgjucJm+tAM+oDa+VQ+PMma+YMg+gOzcow5Fgf5Q5h8gSDxjPpDsPLZOc82PBANehbz+ZCDu4OtMU+6gGR5k3X8gDxyHTxAeDkJ4XlDmr2eZXkZTjxDqfGU+YDSvRANshT8QEVOOc+DugOmcoa6ACh6A6ZyxrxQDfTNvEBEs4f5wlA7wEsM+ZFM+kOfco55E5f5QCo5zHhODnlJOvEGjDlCSjpDnPTbewFxMpt5QDG7AERyhs36D/g8gEW8A5X01XoDk7KNjTkAjH4eUb3eUXEF/M6aOdB5vIEmcUx8z+A5gL26T6+6gCV5wIV7j6Jyx/mAmj0PonteCM15SlxyRfnBOEz6j6L9z5g93fw5z7/8z5h5wZa83fw9z5l7A+28QYl6Q+syhrnCfvpD6fKGucHt+kPnfIFAegPmPEAsOkPjvEGJekPhNMa0WjoAILyCs/JNPEAgsk08ggKxjTqPmvnAsbsBXHqPmzOHTHkLeXlFa/0d/HmAb/1d/HIG/M+cuYLkvU+dsUb7gv0+FuSMDU35hCF5CUW5Aus7k9+MDPmWJD3arA1MOZjBOcRre8MAeQNSecBHPJbqjAzMeZausg87xBDMOYptuQmG8Qe7gdjNzjmAJfzTGzlaMnkAQn0THHkR97mYKTxTHbkUBLmB7n1THvKOu1MgMRYxijmBADHHO4nSTE55lEg7kyD0zftW6ToAMfrDC3mAT7sAVboDDHSGugMNdMa5wIx0xrnBCfTGucCNdMa5wIx0xroFlLSGucDBNMa5wMD0xruLOMyNTDlF9ztTL/lOgzWIehMpuQHMOsCufRMiS4xMTjmYe30TI7kFEDnL/DmCAfyDGbIGe4KbTgyOeYrlsce7QptMTE55ljZ53ex7mP2yXPkAJDkW8PtAw7JPOd/Zu0MeuQ7PehZ5+YMG+1Qpcp45gCW7QyELjA4MOdemuZNT+0Micpa6ETh72LVxzznAUXtDJPLeOcMTfIMmOcNR+4LlMhV5RdR7Qyb8gCt7wQz6AFD50yN7QEl6gGd5wvr5Qiu5AJP2D/vASjIPzQ1OOtbacceOTLnZi3mBlztDLfqAUboTV3tASjpANXnd1btAlMxNuYtZ+k+ENQdxA7rGz7Qdcc77gJRNzLmUrrHHu0Mw+sBu/JNDeQvEeYyTDLnN8rtaoc4N+YuVsgd7wNYOehMMekM1TDHGzjnXxfrDNTnA+fkYwPEGjTnCKLxBkbnYX3mAMnuLGA4M+YF0sQP8U0axHznA1fGPfBqfudIOco+7QITMjE35gH19U0kxkPkDbPoANfwW2HoarrJfecCFzc55QTAOTcxxR8y5gKw7gz4yCQx5mVO5GRc8lti6gD+6A3j7gE76AD+yWLuATzoAKDnCRbwan7wAL/vZNg2NucyJfUza+QPceYCC8g+8zNvNDHmNzXJJO4u3OgBWzPmBEfwanvoTsHmGZLpDSI3MTTlGiLnV8XwG5rYe+0Gm8l75GhQxT7tATrJH+QZv+xbZcddOcddyD71anzPYu8zgzjnWNs05C/h7Q1CMjY15Rr752Q17A1G5wI1NjPnVtX3DUo3NcRS+Uyz8Gm16AEr5wJG9ml4yCTnBoPvWl7qBBfxaXU05md77A1E5nJvMORCfckb7gNa6QWO/0vZ8gQI6w195wEuNzfmXHX7S+PmATLpDYI38QGC71pB7ACg7g2K6wfL5gLV8w2P8B028Aa+70v8yjnoBc3tDZTkdnHmBXnwTAHvBp7nB3PuDZ7qBirwTA7HPjkw53NB70wTxx80NuhzQu5MGNg+7wTf5weT8Uwi6AMl6gZT8WlXxxzzaVHwDHrwWjTSIO9aNDTqAd7xWjHqDW3uDbzsWhfyFgvzDbjoAsr/Wgb/Wgb/WgbFGfQNn+0M0/9aBv9aBv9aBv8NhvE3Nf8Ngf1aBOce88cV7A13yBXtDXLJFewNbckV7A1oyRXsDWPJFewNXskV7A1ZyRXsDVTJFewNT8kV7Aav7AD/8A1FzBztDUDsAYL/WcTMGf8NMfMZl/QNLMYZ8w0nxRn0DSLFGfQNHcYZ8w0YzH3zGZfzDQ7sASzyGZf0DQTGZP8M//IZl/IM+u0AlPIZlfMM8OwBQ/AM68018QD79AzhxRn0DNzGMvMM18cZ8gzS6VZH9QzTyR7ED/AM1OwBs/AZkewNJvMZkPhZ1fIMw80Y9AVy8Qy681nB6gNc9Ay1xkrzDLDGMvpZxfQMps407g60xAjEH/sMof9ZxfUMnMUa+gyXxh/0DJLFGvUMjc5T8QEU9QyD7QCh8z/o9Qx5zjXxARDOH+4/3+gBKvUMcMU59Qxsxhr0DGfObe4S/cht9gxiyR/1DGLFWPsMXdFd7Qxdxj72DFjpAVntDFPJFvIE5OhZVv8MTs18+gxJ7AJa/1gK6lkS8Qw7yhb0A9//DDHPFuwMLMUW+gwn6AZs7QwnyUr+WA3xBjX/DBjOGv8ME/UZp/UMDsZO9AwJxhr0DATtAILzGaf0C/rONPIZp/cL8PVYEs4c/1gS/1gSzxv5WBLlC9xjcmlwdPMx5TfkLrc5535f5Bhz6QkW5A5vNOcWtjkwN+RGTOcJF+QxBDbpBzcx6gkXxDM5M+ZsDjc3NDTqCRjEMzjpeuUxNuoJGcQaMzYz5ACuLjg5NeQmw+cJGsQaNzPmL1I25DFZ6Qkb5AC16GmnOTY55ACC5wkcxDQ5MedxIDA55Ulv5V3q5UdSzB8xLjA1MeQuzOcJJDfkDNoy5n/f5E2Q5ACI6QEJylQ3M+VJjOoBCTXmFBAx5A6c5THK6QELM+ZLMS45MOQoa+cJKeUrOTDnEssz5UID5wkqyxrkXJoy5AEk5Aksxxvoack4OOZO0+kBCuQkuOYAnOpI3+0AszY35Qij5gLt5QE76BiMNOUvpOcJKsQaNTjmFcQ3OTnkRrDnCSzEGjc1MuYVhDLlQwrnCSjMGjgwNeUxuOkBADI2MOZrEegJPukBAjLnd8U35gHW5wkixBk05Cw5xE0yMTLmArlpemUx7AK45Q3hMzUw5CqZ5RI65ANX5g4V5Q3k1xvkBb7PGzXnA9PUNugeZdo25Aet1jbmYHHQN+gHG+YJsNQc6AZE5QRRxxrmCuXoBabTGugDRtMa5wI80Ro4MuQGay05OWUt5AuFMO9T3+Va5jHGHO0FfuZayNUa5VBszRrITuVZFtUaN+QIRS4y5gEL6Arr6AIrN+QE4Nod5gs6zB3kA8/nWNjlTyLuAWPmV3TmV9owNTk55AD35wCP5w+j5lde0h/pWS7mAkIwNjHkV//kUqvkCAzEXugNbDg35WCXMzDkL8HXIeQA8twh5S6U3WU45Fww8AEZ5wdtODjnXDHXHeZTBNcd8wGNyB3mLLrwAu3nAJHmU0HYHeVTRNkd9AN6xh055QnU8QKk6AnB51GP1jzoUZLYHjflXBjwAj/lLYTGH+YNgNkf5mQ62R/6AaDEHvkBhOgE7TLxBO02NTAwMsRkxzDnEFnlBO7YHOQBANAcOOsOd9Ac6AF35AEa2DjkARfXOOYE89Ad6AGu5QT01x3pBPXGF+Vw4O0Tk8QS6ATlyxLnBN3JEucETzXlAVvkBA3GGepaVeUEUdsf5AEW0R/nDBfnBFTvAMPFduUBajg25BnAMS7kVdnFM+4EOuQB9Dg2xDrXIeQAutwh5QQX3WXmBBfxAMDnApfnBBnbH+QAo9sf9QFbyB/mBB/xAornawLmBCDZHuUEIdoe9QLkxh7oBAXQH+hm5ucEBtkf5gQH8QDW5CpN5wQn5ALU3CDkBAncIPwBk+gEDNcg6AQOM/EEDjk1MDAz5AKbxjHoEzrlBA7YHOQBCM8cMS4w5gLc5QQP0DnnAWPlBA/ZOeQBH9c55gQQ0B3lOJTlBA3UGvAECugDffAEEMkY7wQWyhjuBBzvA8XPe+oCwc8Z6AmW5wLB2R7lAsHaHvUBXsYe6ALB0B/mTCbmAr7THOgCGzTwAhsx5QZZxC7pXpzma+bkAhzaHeQJutAd6QUZ5AIe0jvoNnsy3TvkCkfYO+UCIdIe5FFS5BQb5AIl2R7oAik46liQ5lc65wIp0RjnAinSGOYCKdAY5gIp0X/pAirRGukW2uUCK9sf5ACJ3B/1AW3HHznlE+LkFxDnBM/HH+UW1TnlE+XtC2fIGOUFBNg15QW52B3wC7nHGOUHSdg15QdH0R3oEb/lE9v4CdU55whF2j3kBXDbH+RdX9pc5QYr2j3pDMDnEwboXQkx5VqO8QkTyR7lBBzkK2vFGcwb5xN06C/DyRfkAeXVauVbotlq5Vuk1mrlHLLkVDAy5BC7xjnpDRDnBGb6A2zmBGrZIDU3M+Qc9OQNGjTmDRrPYcQh5V7a2iE25xDj6GOQ5AWPxBbmA4DQFuYDxtAW5hDZyxbkBQhUeXBld3JpdGVy+XjL5TKB6BQE5TloyxfnFAHQF+cU6NAX62HG7BNhxRzrYcLRHOcUtdBP5xWuzxflB+XXSuUH5dgc5gE35VNbzBfmZSvkGfjmMnzpB6nEHeZks+UiwuQbkssa5gHS1zfnOHnOMvsBAuge0/AA6/YBAuge19AX5xTb0BfnFsHQF/YB8uge39AX9gHy6B7j0BfnFZfQF+xBMMsX5mTT5QFl0BzmahPoP67rHzXFHeYfAjk15GONNDE15SddyR3mY1DXOvYA/egfIdAX9gD96B8d0Bf2AP3oGYPQF/YB4+gfFdAX9gHj6B8R0Bf2AOboHw3QF/YA5ugaJdAX9gDm6B8H0Bf2AOboHwPQF+UbBOYCEdEc9gDr6B7/0Bf2AOvoHvvQF/YA6+ge89AX9gDr6B7qzxfoHuXQF/sEseUMXdgc6yOE0Rz2APXlHwkwOTXqG9TGF/YA9fRHeOs4qdAu8UYrxRfpHxXPL/N42McY9gHe5h8K5kg+0zX2APDpHwXRGOUSgcZN0h32Ae3pHv/RGPcA+vN4wMYY9wD65R77+ADi5R752R3yQxPGGOcdqtEY5x7uNTPlM9DKGPYB8u5G5swY9wD69Him6Thw+ADF8nidxxj7AujmCvDZHetqc9Id9gL15Qrm1BjteMfGE/cFGOcfO+cWlsoY83d4xRjmHzf3ARfoHx815F44zRjnbtPkJkfNGPcF2+gemdAY6B4v0BjoHw/QGPgGl/gGmPcBJekfKdEY1zDoHc3RGPYF9+kfIdEY9wS/6B8d0RjXYPcLGOkfF9EY9wZD6R7c0hnYMucKx9FjMuZHh8UXLjLkAoHKHn19LFY9e3NsYW505yU6xgRdLHNwYWNl5wLcXSxzdHJldGNoyhBocmlua8kPeEhlaWdoxEM05H8SyAVdLHF1YWQ6W+QTpjE3xAblIo1leHRyYVPNYG51beUO/zc35BN75A2N5ACEbnVt5RxH5C5CMzjFBTfFFuQD/OYiTzfkaULkHVdkZW5vxkTkRu7kL1bkRLg1xxnFRzTmPJnkC5YyXSxzdXDELzTkKSg15E7/xUdzdXDFLORrJeYAx8cWxHMy5Ah4MsRgMuRIdHN1YsRCMeQabeQwjMVVYsQ/MuRO8MUpxj1Ecm9wxFbEEjPkTss0x0DHGeQasDDkAMsx5ACwbGnkAMkyLjM55A5ULDEu5EhlxRflEjblFPUxNcQZ5GZbYXhpc+kBf+wBwmRlZmF1bHRSdWxlVGhpY2tuZXNzxGzlLbDkLtnkTtdiaWdPcOQBjGluZ+cCJ+U3zMUFzh/lJYPkSP7IBc4f5QEhLMUDzhnlEHzlApjFBc4d5Sz25wFAMeQg9nNxcvcAs8QEXSxwdFBlckVtOlsxMCzFA10sZG91YmxlxDVTZeQBTukAhmFycmF5xBhXaWR0aM9JZmJveHPFMOQrKSwuM8YTcnVsZc4qfSxVPXtcIlxceGM1XCI6XCJBXCIsxhA3xRBDyBBkMMUQRMkQZcUQb8gQZcZAYckQxkBjyBBmxkBkyRDOQHUwNDHGIugAgsQSMcUSQssSMtESM8USRssSNNFI5gCcRcsSNsUSS8sS5gCwM8sSOMUSTssSOdESYdFIYtEk5DzvXCJNyxLkSPdcIkjLEuYBDk/LEmbQSDLmASBQyxLmASDoAaTEEuYBIFTLEuYBIHnLEuYBIMtsMuYBIFjLEuYBIFXLEuYBIGjLEuYBIFfLEuYBIMwS5gEg6wGwMuYBIMxs5gEgzCTmASDrAYwy5gEgzDbmASBSyhIz5gEg6AKCxBLmASBiyxLmASDMJOYBIHLLEuYBIOsBMjPmASBlyxLmASBtyxLmASDMJOYBIG7LEuYBIMwS5gEgzBLmASDMEuYBIMxs5gEgzCTxA04z5gEgyyQ05gEgcMsS5gEg6AOkxBLmASDLSDTxAkA05gEg6wFWNOYBIHjLEuYBIMx+5gEgzBLmASB3yxLmASDMEuYBIOsBsDTmASDrAQ405gEgzCTmASDrAYw05gEgzDbmASByXCJ9O2Z1bmN0aW9uIEcodCxlLHIpe2lmKCFGW2VdKXRocm93IG5ldyBFcnJvcihcIkZvbnQgbWV0cmljcyBub3QgZm91bmQgZm9yIGZvbnQ6IFwiK2UrXCIuXCIpO3ZhciBhPXQuY2hhckNvZGVBdCgwKSxuPcRcW2FdO8RobiYmdFswXWluIFUmJihhPVVbxA9d2DQpLG58fFwidGV4dFwiIT09cnx8TShhKSYmKMcjNzfEJClyZXR1cm57ZGVwdGg6blswXSxo5gdKblsxXSxp5UGIOm5b5AfZa2V3Om5bM10sd+UGTG5bNF19feQAu1k9e33lAMRXPXtiaW46MSxjbG9zZToxLGlubmVyOjEsb3BlxBdw5AFCOjEscmVsOjF9LFjkBlVhY2NlbnQtdG9rZW5cIjoxLG1hdGhvcmQ6MSxcIm9wyxnkCZBpbmc6MSzkANbFI30sXz17xDE6e33FFjp7fX0saj1f6gGtJOYBrSxhLG4saSl7X1t0XVtuXT175QGGZSxncm91cDpyLHJlcGzkCY9hfSxpJiZhJiYoxSphXT3HMinlAOtaPVwibWFp5AKgSz1cImFtc1wiLEo9XCJixRRRxR/lAMBcIix0dD3sAMMsZcQQcmVsXCI7JCjGKVwiLFosZXTmAm8yMjYx5wJ7XFxlcXVpdlwiLCEwKSzXLjfoAs1cXHByZeQDoNwt6AOKXFxzdWPfLeQETcgtaeQDD9ssYTXJLHBlcnBcItgqYWFmyipyZWNlcd1ZYWIwyS/kALLfLzLkBIPIL2lt3y4y5Abxxy5taeQBrdssNuoBaGxs3yvqAWZnZ94r5AR/xythc3lt5AVx2y7kB33HLnBhcmFsbOQCR9kuYzjJLmJvd3Rp5ATk2l0z6wENc21pbN4uMjnqAqVzcXN1YnNldP8BbjI5Ms0zcN8zxDM16gH+ZG/fLjIz5AjSxy5mcm935ANu21ww6gGmbmneK+QJhccrcHJvcHTkBvTbL2HqAIh2ZGFzxB/cLuoBeMQt/wPv6wC2b3duc/EB/1wi5QVgxSUuyStsZG908gOVzCzFXeQL2ccyY9cy5wV2xSgjyS4jyCrEH98q3lQmySom31TTKtdU5ADcMeQJmccwYWxlcPUBldI3MjDqAoJmb+QDc984yG8w6gTnaGLkHFXfNsdu6gIMZXhpc3TkBlnfOMY4N8k4bmFibOQEq983xDc2NsgMXFxmbGHkAWXfNsQ2MeQNR8c2Zf8BEMtr6Ali5ACidHVyYd85yjnKbmNsdWJzdWn/AKjIOjHkDZXHOnf1BVnUbuoBt3NoYeQGyd83xzfqA/JkaWFtb25k/wCoyz0x5A31xz1S9QV21HHqBX9oZWFydN9vzW/KO0n1B9bUb+sHhnBhZGXPb/cDolxceGHqAplT3zHGMWI2yTHkDr7/AJ3kAJ0w5A7txzNkYWf/BDbfMt8yxDLEHGRhZ2dlcv8Ed8Y56gFuZN9s3zPfM/IAn2Ri8ggeXCLlC5bJOjNiyjpybW91c3RhY2j3AoXkC8DLOeoBEmzfOc5zN2XqA2Ry5Qt632/GNchBXFxs2TVKxy4y6wSj9glUySo56gJwb21pbnX1BXLJLjjqAIZ1cGzfLTnrCVFxY2H/ALLqAylhc3TxAbjKVTTMVf4BBzXrAWpiaWdjaXJj2lnkErHILHVsbGX6AITwAqH0AwrJV+QQSscsd/UHBsgqYeQQhscqYW1hbOkC+M0q6gf1QW5k+gr8N2bqB+5sb25nbGVmdGFycm/kEC/6CV0x5BS5xzZM3zLIaOoGZEzfaMw26gJ15ACecuQPbN835QCf6gZmUt8zyWrqAdbkAKDfaslq6wJm5ADT3zfKbuoCxegBdt87yXJkynLkAXvfN8py6g2W6AGA3zvJcmHqAYVtYXBz/wvVN2bqB6bkANzfM8ViOesJlmX/AJLEMGHqAa1ob29r/wJNyTbqAQPENv8A/8k3OeoCunP/AJ3FMGLrAQBlZnTkCR1vb272BIHKNmPqA1LlAJnfN8g3OeoBCnN3/wCdxDBi6grJ6wCdZP8OBDIxY+sG/usAn9855ACh6gI9bv8AocZp6gE+xWnrAKbzBkVLyjoy7As5bGVz3S5lMOQZGccuQG5sZXHlHNPvBSjNMOoBAcUwcdksMmE46wPebvQPjMstMjbqAl/ELd0uZTAw6gEfQGx2ZXJ0xjPZXmXrBUFu9RKdyy5hOOoCTmxuYXBwcm/kFn/aMTI46gFGbvYTVcwuZc8u/wEbMmXqARvEL/8AwOQTBOoAwMUx/wDDxWXkF7DHNN9h5AF/6gFPQG5zaG9ydOUTD9ld5BoXyF31EznMLWHqAdxu9xEPzS/qA8tudkTfLzIyZeoE/m50cmlh5AYE5ANd/AI96wCRzDP/AbgyOMpr5hLx/wMFZTDkG/PHMkB2YXLLNthlYWPsFaLHL99m6wo7zWbbZzLrDuhuZ3TzCZnMYesQzEBuZ/8EVcQw6gSzxTD9BFXqAw1n/wFQMjI26gMJxC3dLmUwMOoCSkBn/wRVxF7kHofJXv8DNDJh6wIOZ/8DksZfOOwDkvUXfcwuZc8u/wEbMmXrBzJ1Y/8EVeUEVewCzmP/BFXHZeQbq8c0bmNvbvMW3MouZTDrEpXnBFb3FrXMY+QeTshjyi/aZzIy6xhRblb/BDHkASnrFffoA/7lB5P8AhrrBJTNNP8EATDrEoNAbugW8/wChDjsA//EL/8DFGUw5CBF7QP+yTbYZWHrCI3JL99m6w4ezWbbZzJh6wi6Vv8F+eQCkesY3eQG5v8AlDJh6xIr5QLC3zFlMOQhyusBjuYYtPIAwukOvGLqBud1bmxo8gcSyirqALx1bnLTKukAtjE56wax+wvizTPrArP8C9/MNGPrArP7DszNM+sDSfwOYMw07AHk/w19zmzLOP8N8Mw4NWLqEVR2YXLoA4zxAW//F5FzbOUCjt81xG/IDFxcyGzmDBzfO3UyNWPrHDBvemVuZ/8ApsU2NOsbtOQRr2xlZFPfN+QVZeoBTcc1Uu8UNd81zzXZauQFoOoGmG1lYXN1cmVk5wGD8gG30z8w6wo66Bji3zZ1MjHkJFHIdWhv3zLFMuQjvccyRmlu8xtU1TbrCzVHYW3/ANTINjDrGlpiYWNrcHJpxDvfOOQCXeoApGJsYWNr/wLOzjzqBcPNPP8CnslAYeoMtMVAc3F1YXLfesU6OesHQMU6/wLdyzs2MOsBKWlnc3TkGxffNuQCcuseN3BoZXJpY2Fs/wJzzUAw6gHVY29tcGxlbWXkCr7fPOgoiMc6ZcUk3zPEbzU3ym9kaWFn5BDq3zXENe0aQGf/AcbJN2HKbP8BwdY1QuQJ8d8y7gTLROYa3t825ARf6gHseeUXyOgBPPsEktgz2WZ1MjfrF+pjaGVja21hcmvfbt4733PkBFzqCEdi/wIYzDbqBdpkYWzfOMw46wyWaW32Cw3RNzAzZMgM5AJSZ2FtbfMeFNU56wL1dmFya2FwcGHzARXtGZ016xG/dWxjb3Ju5BgS1G7uGgo16xKudXLcOM5v5Cu2xzds32/Ob+sSlNtv6w5w6xJn/wpeMmE37BSE6A8k3DE56gLwxzD/E+DkJcHqBCnELf8N5jJhOMpkxDD/DeXFY+QpSMczxi/2DILpCvxk7AElc3Nkb/wNSmTrAYP0IDzMLDfOWf8QpzIyZOsJcmVzc2Vx3zIyYesNbsYy3zPkJJLrBd/kJJL+AO816gRjcmlzaW5nZG90c/8PyzI16yTHYWxs3zbINuQr6cc25AiG/wIaMjLrDCHHMN9iYeskHusNPdxk6xtQU8Uy3i846yF95yZU3jE36gR45A4zY3VybHn/AMYy5DCNxzTHMP8V4sRoyjTELf8BXDJhYuoFtMQw/wN2xWPrCg3rDNn/FMrrDqHMMvwP/TJh6gOC/xVfxS7qA1RW/xW98ShEYWxs5yhJ2jDrCdzEMOcnt9gwMuQtiscwYnVtcP8B7DLkLcvHL0LfL8QvNusHa/8C3DJh6wIU6hUT3DHrGjPHMP8EbTIyN+oBT2d0cv8CdzJhOMpiZ3Ry+gJ26gW76wDxdHL/BbrrFXz0KtbMLDfNWP8G1sRc6ysxdHJlcd8y5ADr6gP6xTLfM8RlNewBgOYhDN0v6gDExC3/AjwyNeoAkegDi98y6y1fdOQ15eUB39ku5DECzC7oAd7YMWFj7BMe6RR5/QGG6gbbU8Uy3i856yYU5yvP3jHrCSHkE7D/Ba7GNGTqA/HHMP8XO8RoyjTELf8DNzJhYusfCnVj/wWuxmP2Eof/FkfsFCbNM/4FsOoDeP8VRcQu7AWB/xvI7i5Q/xegyTM26xB5ZXR3ZfYNqcow6yHYcGl0Y2hmb+0NoNMy6y1tdmFy6C1w2C816yBi7REK/wc75DW6xzd0aGVyZWZv5A8+/ACY6xpP5AkxZXBzaWxv+watNesWoO0Amv8CJzLsElBlY2F15QzD/AFj7QtU5QUI2iztBcbkBoD4BhzrCJH+FvvrCuPTKMp75DYwxyllcf8yUe0wvUpv5DNX2VjrC5JE9jAk6wCu6w475C7h9SfDzC/rBUXlCNBldOcoJdgy6yWkQ/Qn88wr6gE6Q/QjEcorYTXqCG3mO+ZiYXJ3ZWTkE3fbYTnrCS5vePco3swwymZib3j/AR0yMuQ798cvZGl2aWRlb250aW1l3zXrIYzfLsQu6gp/ct8uxC7sDc9mdHRocmVl3zbENu8jm983yTfvBpr/AY/EMu8MenblKtTaMDnqBHHnF6L4BgDKM+oBAscz5SpN2zLsMfNlbnRl9QoGyS7rHjVpxC1j9C/H9gMO5gK45SsH2S7rMwrGLvMVPsku7BbDb3j5AbHpBCkxZesAjWHkQbr/GnPIN8poxDf/G7TINusDHcQyyTb/AKTrCbbuG0/fOOsQ/Ez/AKLIM+sD7nR3b2hlYWTfOcg56zTfyTJ0YWn+Ec4xYesDnW9vcMU2xD/eNu8D0+wnpf8BEusHfmN1cnbmKOPfccQ36gFJ5gNC3zjJOOssO/8JpTHrBtx1cHXmAQv/AM5i6gRudXDnAQH/AJXEaewDUXdu3zjJODLrCxJtdeQFp/YGyspp6yW16QGnc3F1aWf/Ak/EPOsGEsU4/wL0yznqB8zpKVTfOMU46wQ55wL5/wQLyjrsE8/IM/8C+8Q37Cw75wL7xUDeN+sSRuoCwt84xTjwBgXfOco56glKUv8CxDHrB5rkAlvEBP8BfMZj7DFB5wKQ/wCaxW7sBkjpAsnfOcQ56xkH/wKV2ThsZWFk5S3r2i3qAXFS/wJL9AEJcmVz5EAi5D6pz2X1M+znGMZg3ywkyWAkyCrnGw3fKt8qxirEFmRvbOVVL/0AhyXJMyXfXdMq11RfySpf31TfKtUqxBZ1bmRlcnNj5Q4U/wGS5A9H6gRR9x6Z1TfkRcnHN2luZnTkQzffN8Q3MOsg2/Qga9Q07CM39yBm0zcwM+s0wkf2HEPWN+oFmURlbHTfN8o36gZ2VGhl3zfLN+oDfkxhbWLlCQrfOMY46gF/WPU+ANM06wY7UN80yjTqAUVTaWf/AUXLN+oLmVXoEGvfOcc56zlCaP8Apco16gF8UHPfNco16ge6T21lZ/8A2sQr6klpM+RAQd0s6kflM+RAOt0s6kmvM+QdVt0sWsssNt8s6kl3M+Qzzd0sScssOd8s6koFM+QoEN0s6koNMznyN8DOLOpKAzPkDj7dLOpJ1TPkECndLOpKSTPkIj/dLOpKUTNhNN8s6kmlM+Q8Kt0s5CIi6y+6ZfVDWtwzbG7xDtvSMeQOWesUG2//QQTHMusTst9kxzLrJQtlbXB0eeUXPc039iTMyjd2YXJub3RoaeQths9wUcYvMOw73WFscGj1A6HKLesmj/cFfsos6xqZ+AYZyi3rE3T4Bg/JLes5uekVYtxc6gTtev8AtTPrC1DfKzPrDQF0+AaLyi3qBQdpb98s6w5f5yNb3C3rDv35BtrKLuoC6m113iroAlJcXG7fKuoHJHj1BhbKKuoOoW9taWNy/wG46xe2cN5Z7Dej5Cn83CvsR/33B2rKLesD5mH+AQbrEyR1/wKUxC9kyi9w9geBylrrDePfK+sQNXD2B6LKK+oCkW/4B5jJLesalXZhcv8DdMUy6xwo5Br9/wMgMDPrJCHkGdH+ALxmzV3/AfIz6w4Y5DCW/wH1MDPrE1/kAIv2AXPwP5Qq8QVhxCIrxRwr1RzGPuYAnC3aIu9Hb/4AjO4uGddVeOs9gmT2TDrHKesGG3D1GYvHKOsgI/cVY8gr5A0J6gJ5/0DwMuRR7sgr/0HN7BmF9hmAzFjrFXhh80AjyinrGzZv+0DBy1H3F+PWVfUX3vYOCOw1isQZ0TPpKP8oyAbaI1vIBtojxHY36zqG+C1P0TXsHl/lO6ffZu0eYmxW1jHqKaUpyAbbJF3IBtskP8gG2yQhyAbbJOYBKOsUn/sBKM427AEpcvcBKdAy6gEqcvUBKuUSPD3FJT3WHTzFHTzWHT7FHT7WHTrFHTrWHeUAn+sigPghIc0v6wTb9TgpzC02yi3xMEnZKP5ODDHrIp5nZfEyZu0BFMUk9wFwxXgw6gD85VHh2Xdl7EgoQPQMb8pVOOsm+/co680v6wjc9yNszS/sI/7/T53GMeoE5/pPm+wYJOs7uek3TN8y6gNK6TkM/gCV6xCWbW9kZWz3AcfwAfH/QznIXjbsROXaWs4o+gCy5gN+xSb7Afgx61EG/0Or1DP8Fogy6zJ75D13/gGON+tAtvcA11wi51Vuxyp46xL/IPME0tYuft8qzljEGvQUnNoybm9icmVha8056xXl2jnpAMPfLusAw98q8wDD3zL6AMP1APxudWxszjTfL8kvYWxsb3fYMupSB8kD2yQ7yAbNJOwgJusmJP8iqMYw6g7odmXkItv9CWTrRhxv/ws2MusxY2//S7AyMutHr2/5Cuz0EZXrF5FhcnRp9lDbymfqBNVv5zqJ+wEc6zwv5yHS+Cq7yTPrNeFib3j/ASPsGBtiaWfoGB7xIXnMMuoQP8sy8za0yjTvT3L9TDLrD5nnUUzbLOsG5/I4T8opNesQG/soIcsx6xHV/Ce47Qrye8kze/MD/+wCON8q1SrEFmJyYWP2ALnsClB9yTR9317fKtUq6QCI/wEQ7AC8bMUx/wC1yC1y2C3vDOTJWekE0/cAvNgv9QCI5gxh6QCI31zZL/QAt+YNvsQsbHBhcsQV+wCI5g0NxVnNLfcAiOoIfsQW7CoG1zHqCvzEFmdyZWF09VLS7lH2MOs1ZGZsb+QPOf8NDsU26gXhcts2z2vrDqFjZfQhZNRq6w2u2jXuBcNcXMkJ5TUK80Ad0jXqDeR83yzMLMRk7A4P9wGcfO4Dbf8fZchj6gbs/wCT0TDsDnD3AJPQM+cAmetUZNc5fs0zYXNjaWl0aWzkNYbfcOsBl8Zt7wGb1zle0nDkBzJ18DFd7Qth6gcy5yWP/guR6xUCVd8wxmDuJYjfMsViyjJE3zLIZOwWpd9myWbKNFXeNHTINDLrO7Rjb3Byb/IHnsos6xe8Ymln5RMS2izKWGJpZ+cKNdguYetCSGJpZ+dVjNpc6xrbaWfyKoTNLO0JEPIqgsws5Gahxyxp8UsS2inzHFXLK+oLPWnfVeoDKmnfK+tE/f8Bs+tQEXPzAzTJKWHrCvZiaWfoCzHaL8pYxC/+AbFh6112xC7yLJTLLTLkZ/HHLW//ATLrGqX/ATLkaCLKK90sYetPP+RC2OZXl9la6wIM5TBUy1zrBNPlZTXHKeQLQMpjxCVlbGxpcHNp9F//2jnEJdA533LGOeRgPvcNDd813zXFNTLrWKZA5BkI3zbHNusaKWTaNfEGw+taSHZhcnbGOtE37maQxjww7DCOYWN1dPQKo9c56zjgcmF23znIOXjrEv/kAOPfNvAHbuwHZd5p5ACi61n+9Qhv1jfrNHticmX/ANnNcOwc+WX1CzfROeoH2mjkYKzfMcZqMjDrGsF25D3o3zfGNzDsNSn/AXvON+oCI8QscvwhnzHkbHTHLWnHHvECw8gtMutECGrPLfoJs85k3zPUat8zxSd46zml7TuF2jLrVcDlSojfMt8y1TJ1MDHrQX5v3zTHZutbz+weedox6xCBQeQmhd8y5gCX6gc6T980x2brA2fkJbbTMf8EsVxcJ/MF8tc16gSt6Sxk3zUw7BGJXt81yjVk6gjr9BVi12rqA5npGwffNe0EqHXfNfUEA+Rtod818gQB6QVH3zXtBQ523zXHKeYGHCfEMlwiJ98yyGfrLtVI32fINe1gRMQs5xSF6G6xcnTkbb8tLVwiOiEw5CDuygtgYMgKJyfFCn3lbPH6AxoyMOdJksRE/wMTyi3pCRNu5jce3znEOeYMPOUAq98uyi7JZ23fZ8o57y+o3yzMZXF1b3TtE+fdPOYCp/QD4dgszWjtE8fdPeYDr+QB2N8tyi3NamRibP8A1co/xgzkAjrfLcot0Gz4FKDOQHjrNbpkZWdy7SG32XbUNt8zzDPEGtFt7wf0eOsuOXDkcjjyCqnSKcQbc3RlcuRINvQAyN9b3CnEG9Nb5wCN9U1i6xf2bWFsdGXkE6rNaN821zbkAVz/G9ffLsYu3yrLKuQGnztmb3Io5XOldD0wO2F0PCcwMTIzNDU2Nzg5L0AuXCInLmxlbmd0aDthdCsrKXvEK250PdIm5HOtQXQoYXQp7nIC7AELbnQsbnQpfchzacRzac1zIUAqKCktPStbXTw+fFwiOzo/Ly4s6QCDaekAg2/tAIPXNucAk2nnAJP1AsRvdCxv6wCTc+RyyEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIixo5ADPaHQ8c3ToALBo6QCwbHQ9c+Z1BUF0KGjwASRRLGx0LGx0+wNrxiB9+wKb6XkEMjHkEMX9ApHVLNdY6TAtMjHkQizdWNUs11jpL9UyMeR6nt1Y1SzXWOkv1TIx5AYY3VjVLNdYUcss6TDd11jVLNdY6XnAMjHkBfLdWNUs11jpMhEyMeRg2d1Y1SztBZDECsci5F8IzU7WIukEWW3kA1NcIixj5AMfY+wDH2PpAx917AMfY/IDH3V0LG10PVN05A56LmZyb21D53gbKDU1MzQ5LDU2MzIwK2N0KfsDQ8VE8QDb31rEWjcy31rfWtlaNDI031rfWtlaNTj/AQ7fWtpaNzM231rfWtpaODjfWt9a2Vo4NP8BDt9a2lo5NP8BwshaY3Q8MjYmJijfYtJiNjP/An7/ALzaWjQ3/wHKx1rtBnbEW1wi5Ejs3142NjjcW8hE6gQncOQEH3B0PDHEBugEGGR0PXB0LnRvxmoo8QQYZP8A5jU3Mjk0K3D9AObFRPEBQN9aLDU3MzHfWt9a21oy31rfWttaM99ax1rpCRBm5AGWZnQ85Qo3YzfkEbYwxAVl5BK9xA9mZVwi6AXQZukBuGflBfTbMucF62byBetndCxn/AkKxiDlApTVIMV46VfvxQrbTugNbOgMEccM3zLsD0HHDN8y7A8OxwzfMuwO2McM3zLsDqDHDN8y7A5mxwzmEQF4dD1bW+YBl+c1A8Q5xwtNYWluLUJvbGRcIl0s3ybOJmRlZmF15CpIxyvldW/EK3RoLUnlf5DfLdUtYm9sZHN5bWJv5CEY0Q/pAIjfNN805wCVc2PmGa3kAJHIDFNjcmlwdC1SZWd15UA6xS3FGscF3xHIEcRgZnLkKMvHYckNRnJha3R1cs9j3zDVMOcolcQuxwtBTVPfKNgo/wDSx0pz6gIaxwtTYW5zU2VyaWbTeN8uzy7lAbfKMssPyjbwAqnfM9MzaegAi8QxyQ3KL/ECJd8xzjH/AUbHU3TqAwjHC1R5cGV3cml0ZfQB598vyC9dLHb/A+ntA8P/AeD/AbL/AX/5AX//AMzIYl0sYuQAzDEsMSwxXSxbMscIM8cINCwyxQg1xwg2LDPFCDcsNCwyXSxbOCw2LDNdLFs5LDcsNl0sWzEwLDgsN8QJMSwxMCw5XV0seXQ9Wy41LC42LC43LC44LC45xFwuMiwxLjQ0LDEuNzI4LDIuMDc0LDIuNDg4XSx3dD1m5CxgaW9uKHQsZSl7cmV0dXJuIGUuc2l6ZTwyP3Q6YnRbdC0xXVvGEy0xXX0sa8s2KXvICyB0KGUpe3RoaXMuc3R5bGU9dm9pZCAwLMUSY29sb3LNEsROzRHkAT9T0BVwaGFudG9tzRRmb2500RFGYW1pbHnRF1dl5BSN0RdTaGFwzmnkAI9N5El0cGxpZe4Aqm1hePEAmG1pblJ1bGVU5FYTbmVzc80dX8RjTWXkRl3OGeYBGGXGCOwBGWXGCOsBGuYBb3x8dC5CQVNFU0laRe8BJmXJC3x8yTfuATUhIWXIDOsBOmXFB3x85QMp8AFAxh3GDdAj5wFMxiPGDdAj5gFYxiLFDMwh7wFjeXRbyRctMV3uAWxlyAr3AW9l0RP5AXt95AgvZT10LnByb3RvdHlwZTvpAubmGMDqAs5l5godcj175QGjOuoBtizkAKfHEOUAl+cBfcYTyA4s5QHHxhTFCyznAYDGE8cNLOQApcYSxArFD+YBc8oVxhDFG+YBa8obxhDFG+UBZMoaxQ8s5wE6xhfHDSzwAS/HHs8WfeoVbSBpbiBlKWUuaGFzT3duUHJvcGVydHkoYSkmJihyW2FdPWVbYV0p6AFLbmV3IHQocil9LMQydmluZ1PlAuzqBF7pBFzrAwo9PXQ/xA/mAI3mAY0o6AF75gFyd3Qo7gFidCl9y2ZDcmFtcGVkz23ObOsAkMZMxWEuY8Q7KCnLTcRg+gCyxB09PXQmJu4DiP0AxMpuxDAoKecCRusCPsUS6gMWOuQDFuQFZesAl0Jhc2XvAOFlKXtlPekD+cth5hwdPeQBNuoEOWXpAafsAMpy8wDKyTTHHOgBp2X5AOPnAxly8QCxaXppbmfsAZPkAJp0O3N35FiO7AGIaWQpe2Nhc2UgNDrFBzU6dD0zO+UzMzvFETbGGDc6dD0xxxjnC3o6dD02fewA2/8Bf+cBf+YArHdpdGhD5QV++AHzyE7nA9XKN1DnBWH3AnHIOOgD/CEwyjtG5AWD33F75gQgyjVUZXh0xDnnBaXfP8U/xis65gQnOuQFhdJP5wXR30/FT8Yr3k/mBf3fTsVOxSrSTXPlAjRDbGFzc2Vz1UnEI2UhPT3pAsg/W1wixjflCXhyZXNldC3EGVwiK8Yu5BpcxxDINV06W13EcGLpAqjRdPID/MR26QMf3XfIMst6yTnIe+wGp9d17AbLfHzmAzLMFMo4dOYDXWU7aWYoIVlbZT10Pj01PzA6dD49Mz8xOjJdxiByPVlbZV09e2Nzc0VtUGVyTXU6Vi5xdWFkW2VdLzE47wX8VilW+gX8VlthXVtlXSnoA33EWX3nA9VpemUpKfIHjuQA9mdldO8Dcu4A8+cDMT9cInRyYW5z5TGAdFwi6wdQfSx0fSgpO2vqAVI9NuUE9FN0PWt0LE10PXtwdDoxLG1tOjcyMjcvMjU0MCxjyg0saW46NzIuMjcsYnA6MS4wMDM3NSxwYzoxMixkZDoxMjM4LzExNTcsY2M6MTQ4NTbGDm5kOjY4NS82NDIsbmM6MTM3MC8xMDcsc3A6MS82NTUzNixweMhOfSx6dD17ZXjkIYNl5AP8LG115AQCLEH0A2pcIuRQhOQCRyE95Aibb2YgdCYmKHQ9dC51bml0KSx05AGMTXR8fMUJeuUJcmV4XCLkBa59LFTMVOQLwOUB6OQCCMZAxj0pcj1NdFvGEl0v7QJ9KCkucHRQZXJFbS/mCnLqBos7ZWxzZSBpZuQS/XXGccVCKeQKr85D6gJSxTXlAIZh5ACGYegK7S5pc1TkBEIoKT/tCCEoyCDmBaEpOuQDNugA4MhvYc9veEjlBI7GbOUAoWVt5AFByDJ0aHJvd+UIk28oXCJJbnZhbGlkIMQbOiAn5QOPxAwr5iG8O9Jg5AMUfWEhPT1l5ALwKj1h7wEa8QEr6QMI5BH75AlVKHQubnVtYmVyKnIs6QrLKX0sQnQ95A6m6yh5xA7uKC/oKGbGGuwoFuggM8cPxCjrIBnGFeUO5s4V5SBNXSxD7gIsLHLpA3xqW3JdW3RdJibHCS5yZXBsYWPkAP50Pc8UKSx7dmFsdeQFvm3mATE6R8dPfX0scdBkLGEsbuYClmksbz1DdMcrLHM9by7HQOUCrj1vLsVXLHPGLmg9cy5p5RCFO+kUH+QItHx8YSYm6BDExRPmAb3kBJpoPTApLGk95AH4RSh0LHMuaOYLKXMuZGVwdGgsaCxzLnNrZXcscy53aWR0aCxuKX3kAkNcIuRSd2ZpbuQlX+kDh2NvbnNvbGUmJscJLndhcm4oXCJObyDkFhthY3RlciDnAMMgZm9y5gJa5AJV5AN15QLVxRNlxRNhbmQg5D9LxRNy5wJ76wCtMMkCbinlAzkpe2nkAjjlB1jkCZ3wAoQsYfADWSYmaS5j5gbILnB1c2jkA7h05yOL5QUjbD1h6QWCKCk7bCYmKGnHReYOhmzpAshpfSxO8ARbaWYoVCh0yGMpIT09VChlyQ/kDqrkAV3kAzbFCcQR6wDBxRjLECnGaiEx6QZ2cuQBOHTmAJEp5QTCxQvwBoVyKSYmxxtbcl3Gb8cN0lTmDMbKVMcL0FTkBtnIVGHMVGHLVMcJMH0sSe4FyshtZT0wLHI9MCxhPTAsbj0wO2485B4xaWxkcmVu6BiBbugYgGk9yh1bbl07aecCrj7kA3ZlPcgPKSxp5gK+PnLkBIw9xw7EF+sBTT5hJiYoYT3NFCl9dMdEPWUsdMY3PXIs7QGVPWF9LFLyA7PnI0TlAp1OyRXoDERJdChuKSxufSxP1DrrDhDKO30sRcwsxmBlxWBBKHTMWmUpLGV9LEzQWsYyYeUfp+kMQ+YMN1wiYW1zcm1cIjrEH0FNU1wi6ww95gQ8yR/kFDDTIOQT4cUg6RPj0yXkE9vFJeoT3ckm6AyQYT106ANDYSvlSoQr5wS/5BSx5A1J5AS+6Bgs5ATRP1wi7BfHOs4uxx7JGMc2xBjLMukUYyl9LEh0PXvmFSw65AE0aWHlC2LkFMZcIuULcE5hbWU67RU6fSzEMXJtzDFub3Jt5T9Q0DPJbH3lDsVpdMw25gWy0zboAK3Ga9811jViYsw15mCoLXN0cnXkMMXMPO0YB8Y8Y2FszD1z5RkPzjZDYWxpZ3JhcGhpY9A+5Bi1zD/EEHR15Blay0DxGNHGPHNjct968RmdxzntAcBzYW5zLXPmApnNPPIWycY/dO0BY21vbm/nQuXMPvQWpn19LFB0PXt2ZWM6W1wi5TG6LC40NzEsLjcxNF0s5TW/5AQ7McQfyg7EJjk1NywuNDk5yyYyzSbkL4AxLjQ3MiwuNjXGJ89Oy08xLjMwNMpQz1HNUjk4xlF9LER0PeUOYU1hcDpIdCxtYWtlU+UbNTpxxA50aHN5bTr5BLXmFDDkCFTlBU9bXSnvG3nkA7HlCG8mJuUIy+0DRyxlKegI0z9x0x7Eay5jb25jYXQo6xjRXSkp5A8DxAHEYOUL4W3lBKc9PT1qW2XlCX3EdM1V6QGwxlgpOscd7QL90XTnBSpd5BL15QEccGFuOlLnASh2Z8UPT8YPTGluxh/2BYlSdChbdF0sW13rEl1h6AZw5gsGYXgocnx88Awr5wUq7hW78hXOKekI4GJvcmRlckJvdHRvbVfkCbc9yGgr5gv4LGHtBtMxLGHmAN1BbmNob3LzAe7qBt1J+gbdxEJGcmFn5Hq1OkV0LHdyYXDJEPUZNOQNbXN0YW5j5Ao+QT/kASJdLOQBJWUpOnTGUVZMaXPQPukI/+0HIeUM1mlu5WfgdWFsU2hp5C3A5Q0VcG9zacQn5AO+yj/kFuHoCFAscj1bZVswXV0sYT0txAkuc8RAxgtlbGVt5wsRbj1hLGk9MTtpPGXpKsDpKr/EOmnIOm7GDcs8cz1vLShlW2ktMccX5wGUzBPFKik7bis9byxy5gqUe+QLXjpcImtl5A785hOQc30pyB/EZugKhXvoAM86cizFSjphfeUXzGjkCyFcIuU7z/sBEmzLGkRhdGEsbT0wO23zCZRt6AD0Y+wJlG1dO2wtPegAqj09PWMu5AC8P2PlC4k6Y+0A9scO5QCnfWg9bOUMWOYPPGLlArr0AKpoPS3KEuQAouoPPXXsAIowXeYA8cRj5Q7ndeUAiusO50Vycm9yKCdGaXJzdCDFOCBtdXN0IGhhdmUgxCwgyD4uJ+UMX1wi5QHY9wCWdesAzvUAo8VCZsRu5BXrbGluZecPf81K8ACg6g+LzCcg5Q+RzBIrXCLkM/g77wCKffECGOsC8sUiOmh9fSh0KSxhPXLKGm49csZALGk9MCxvPTA7bzxh6AH7b+gB+3M9YVtv7QFoPT09c+YBaOkOkcQZO2nqBN9pLMUI6AR7LGjoC7V9fWkrPTLnDXXkBAlcInDkCKt05R41XSk7bOgMiMUwPWnnBMvqKpI9W10sYz1uLHU9bixwPW4sZD0wO2TqALhk6AC4Zj1hW2TnALjpAqpm5gC4cCs9ZuUCreoCWGc9ZuUAxix4PWYu5ATTcGVy5xT8fHxbXSx2yhflEZ98fHt9LGLkAMN4LFtsLGddLOccz3YpO2LoEbpvcD0taS1wLWfmAWjoBZdmLm1hcmdpbkxlZuQS08gvyhU9zCIpyTBS5AET0THFFskyxQ4pLG3mBDZiKSxwKz1n6AON5wCIfWPnAappbihjLHApLHXHEGF4KHUscCnlBEx5LHfnAaF2bGnka7NdLG3lAyJ37gGidegA1mM8MOYBemvFOOUBzyxT0ERba10pO1POQy1jx0TlAhhNzDMtc8U15hAN5yTr5EW8KV0pO3k9W8wq5iCrdyxNXSks0hhTXSld5gR81jddKV3FfnrNfuUAs3npBwQyPT09eecCaiYmevAQVcc05S+WeukBICx65w5jLWMseuYG7k9yZPYIPixuPXQu5BEOLOQPBuQMRyxz5BMYbeUl+F0saD3oJ3A9PT1u5AkR6RIBbiYm5ghSLGw9aD/GCzrsHrXkAbzlKEw9PT1p5SfF5ChfQXQoMCnGfusZtuoVMj0xMDI0KuQQ3swxLTU1Mjk2KSvOGDEpLeUtzSkr5hX75A4T6QCuZT8wOjHkAIQxMTk4MDg85BtmcjwxMjA0ODTGbG7mAoblR48oKHItxikpLzI26AGBW3h0W25dWzJdLMYJYV1dfcRSMjA3ODLHUj0xMjA4MzHGU+cEk8pTxSopLzEwyVN2dFtpxVPGCcpTNDg15hNYxQw2xAznEPPkAIcw6ACHMMU05QDZxSg86ADYxGnHMOojejvuFYJV5FJ3cG9ydGVk6hM8OuUF+Sl9KGksbuQDnG1bMF0scD1tWzFd6AKJcXQoaSx1LG4sZSzkF//lCsZwKSnkALps5yt+LGbmBPzvC6Zs5gtGdGjoDsjEFMYzZz3SLj/5DBPpC+d0aO0nb+wL7eUMcukOudApxB3lBWPnD4fIeH06zjjqDCrMMugMJn3mASg65BHmLGPkAQ10YWlucyhCdCxhKe8AgusPO9FM5BBBfTovWzAtOV0vLnRlc3QoYegq6zApzkr1DxPRUuVwi/AAzespAdEx6Sk2fSk7ZD1n5QO8xDksZj1bxg7FLucEyO4A7GkpPyhk5xHIy2LlBD3nAN5dKTpoxCVIdFts5g05yF1sXSk6KGQ9THQobOcbguchSusisCnFKdkfXeUGHEPkAphkLG7pAgPnAwLmArFk7gKxZinFNHJ08BR1aSnkEgzsEk09PT1kLuRV1HRyKDAsMeQEsugIEXjkCBF2PTA7djxp6AgFdisrKXjmBZbEeVt2XdN86QXWRXQoeOQImeUZ0GF0aOUFbOUD7+UDF2L5E8ztAi3pMwMwKSl8fO4BnXT/AonzAon/Ajb1AjZ9KGnpANXlAXFi6gHm7QD+W8YZxUbkDvPmDDboLF/qAPt5PWrkBWdp5RkBxQnFOOYEWWFtc8UsecYsd+QCP+kPSfoCR+0AoXfuAJjfP8Q/5wCt5hAIIT09eSYm5wCBa+QAgXnfech5a855a9xxxF1TxF3qFTPfZshmU85m22TyDBJ1bmV4cGVj5AYa5Q4a5AYV5Bkf5Be45whE5RTXxAxH5Bp39Ae95gjMbecS4ucQlixhPVTlGm/pAK1y8wpR5BWm5QnYcn0sc3RhdGljU3Zn1WVQdOQPzGE9cuQGqG49clsxXSxpPXLkByBv5RBNSChh5BrYxAtMKFtvXSx75RpmOm7IY+YJKzroC+0s5iKlXCLGJ1wiK8kqdmlld0JveDpcIjAgMOQBEzFlMyrEHsgMaSxw5CB0cnZlQXPkAT9SYXRpbzpcInhNaW5ZTeQCNX0pLGg9T+UBGW92ZXJsYXnlARpz7BGx6AywPeQMyfUMkckY5QCkPeoAy30sc3Zn5A4ROlB0LHRyeUNvbWJpbmXkMc9z6wE/7RkdO2U86DdZLTE7ZegMw3I9dFtl5AFadFtlK+QH/ewRSEUmJuQZxMwQTnQo5ASe5BkP5Qo8Kz1hxQgscvISgMcSLOgSM+QQaeYKp8skxREsYcYIxCLmFpI9YccJLHQuc3BsaWNlKGUrMSwxKSxlLS3pGyp0fX076SsCRuYCcecA11bGDuUhlnLzDw5F6AL6buQcGeQf+ucPD+QPAiwgYnV0IGdvdMQRKHQ/5BeTziZ05Q3mOuc0eXTrBetyfekAkucAhOkSpOQa6MQ35iXUOuRYqcotVe0Av/YS5eQGtGHqENHETMRUZuYkmstW/AD8J/gA+8Za5R0uxlIgXCInK2UrJ+wBESfmARDvAIbHEsRNyTsr6ACZ5RjS/wE/9AE/R3TqGq5ZxAzlANH0ENvxANLmCeggZ3JvdXDFdf8B0v0Ak2XqAJPlAIfrAY/kBk/uAQp8fFjwCGzGGSkp6AGd5ADSV3Q9e+YgpTozLOUhHeYh6X0sWMoaNM4aX8oaNc4aauQaeG9yZDp7bW9wOld0LOQEEDpYdCxtcmVsOl905CqBbmVyOlfkFQtvcMQncmTFKMcv0yfEQsYoxEhvcMcHZcZYxilYxCnEPMYpxEJvcMcHZW7LUl/GeWVuOnt9LG3lVL//AKzmAIXlW4D6AK/FUsQRxlLECsYyxArLR8YL0UfQeclP00V9LCTvAWX1AUvoATnoARj5APfqAN3sAKDFGn0sWnQ9e30sS8UGSsQG6gTmUeUCguwWeeUC33I9dC5uYW1lc+QFy+QtbXBz5Q/paGFuZGxlcuUP7Gh0bWxCdeRNInIsb+QQBWF0aMoScz3mFh9lLG51bUFyZ3M6YeQjR8QKLGFyZ+QLK8QTyAss5EPIZGnlLM7qGbsuyhY/MTrMDyzlXYxlZElu5CiyOiEhYS7NEsog5AYdzFPNGXx8zxHkAK5PcOQBG2Fs6gC2zBJ8fDAsaW5maXjFdcUKLOcBFzpufSxo5EGWPHLoC9grK2gpWnRbcltoXV09czvkIBFpJiYoS+QHJz1pKSxvJiYoSsUNbykp6gQZdGXkAZdRdOcXZOcBluUBkjpbXSzlAZE65AO+5QCkMH3pAILIQijkMb7wBNhTaG91bGQgbmV2ZXIgYmUgY2FsbGVk5BWgfSzrAc467gHc7QHYOu8B6H3mCm1l7iosxRPmBzRcIm9yZOUFOeUloOcFAz/kGgxkeTpbdF19LHJlPUTEV+YaxCxhZeQOA+RG5W1v5X95XCLkAwXGCelY3+QDEMgTxgjnX11dLG7FQeVGuspCyS/qWO3KMmllPXtkaXNwbGF5OncuRElTUExBWeUfFDp3LlRFWFQs5h3tOncuU0NSSVDIEM8WxgZ9LG9l5wPb6BMH5QPO6ACr5QPS6QDU5QPY6QCg5gPe6gDo5wPl6wC35wPn6gC+6APvXCLGCeQFwXPsAY/pGyvvHRLlYNnEBV3qPRdu5A6baeRFKOkJ3+waR3VlKOQSc+cIDW/tGyXGJOQmDOgXrztu5Q7RLmFwcGx5KG4sc+YloyDGFyhv5Q0ZIegSoyBu5RTOaD3lKvsx5QcC5gCCxlps5QJQ5Aux6iuvKXx8yxV0eeYnKeYlD8om5BIW5ghXaD3sMB8obOYq4eQflMg8ySzlJoTuKN9pZVvnF+xdKecNZW09cmUoW2FbMF3kEqXqArToDLh1xyAxxSDrApPvHW9oZShuLPQMquklleQA5OQFjMoPO+gCROYwAOsPwG5l5BJJzDvkFNflAorpAnnmAgjLNWHkFdTkKCbUNyl9LHvkCOI6bX0sdSks+QCvbWXkI/ZhxAh0KeQNWiYmYT/lES7lD7rsJsc/JHTkKI5hXTpqyAnkAo3kAf1u6AIT5wQX5A4tKG4saO8AhuQFbuoC6eQ2s+gopOUWWuUCZW7qAtzmAtf0HR7kHKoscz1sZShv5QLZcyl0KHPrHYLkHlTrK0HnDpwhPeQC7OkBLMZNaD1yKG8sYS7kAKcpO2jkA2ouaW5zZXJ0QWZ0ZXI/zQ4oaCk6KGUudW7lG8Eo5CYKKysp5B8vxD89xEjLLvQvRckTcil7ZegM2nQrMSww5CmZaSsr5RFifX3mARFvcCgpfSz3M8rtA83mLKPJEEnoCmwsbcw97AxMPyjmKmPuAY/oIGPkLB3oKQzEEm495BSq5wQn5AHy6QPr5QFj50x26xbBIHQoblvIJuQ2YsklxVfmA3zSMuUEGcYbKegcdCBl5gzQKSxvZVvsAu5dfHzkAOUp5wDrY/AA6+YC41tcIsQgZGVsaW3mE+td6BEudPIwhijrDIvkLSHHKnLkIbZ1zmHkAS7kBRF06ADBcmUo5QDdS+Qt8OQElOcCZGE9yhLpDZpy5AHi5zDccsUJKXth5AR+7zGLKHIpLFth5QR8xExu5zid6y0Rxj7KETvoD3EqPW7oD1oqPW7pJxzrEgrkGCFHb3TnDSlvZiB1bmtub3du5xIQ5i2wxAznKzXrColwZewBZeQFNlwi5AFO5AUrxBnkEa7FFegdfOsiq+0Q7+gQKCvnEA3qIlrGJ+RgO2ljYWxBbGlnbj0tzybqHm3pA5dhKSzrDkZk7QCo5QSy7Aas5SgTYeYGSeQGmOgGTOQRGcQOYWcsdMYL5AkA600QLG49c8Vb5U4VaeQHiG/EBXM9MDtzPOkg4HMrK+Qq/G/nBN5bc10pLMQG7QVj5QXhKXx80RnlCGXTGe1o2eoMD2g9ITHLfS0xJiZuW3MrMc5V6GlyJiYh0h5uZXfmIFMpOylzKyss/QC56mmP5Qd+ITApO2h8fChpxjRwZShv5gO35CXO5whL0ELJbyYm5AEl5ATyLG/nAMA+MOUtJtNNLMcWxE8pKTvMMdAw5Cu7KGE9cGUoc2UocuYBrykp6ARG5AQe5QH/XchTYSnoLbHmAr9rYXRleC3kC2DFJeUDvGwuc2V0QXR0cmlidXRl5AGQcmlhLWhpZGTnCu10cnXlSwfnBT5t6wU+5AgJbe4DAmzHCSts7gLcyCfvAwLOJugD1+sSS2blDI3rLA3kK+jlCP9n7TmoyTHnEnvmOJLkEqHsPThh6ADo7j1P6ADQzRXFPXTROHt9zzRl5CDx/Dwc7AFg7wXWz11bdF09Zec04NQz7jTlzTjENnRvTuQHu8kw5gGxdD1kb2N15CZvLmPlZiVFbGXEDk5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC/kDo7FBU1M6D115RH46QQzZeUvZO4AhilPYmplY+sBA+8SPS7kDfPmNdzKNSxl5i8z7AKE5z2syiXkNiLJe3I9MDtyPO0BhOgEoXIrKyl05AvzZW5kQ8Qcxm7IJ1tyXecBJOsHGnTmATpNYXJrdXDyATzlZ5nmN4vlAdb/AQH/AQH4AQEodCs95heVZSsnPVwiJyx0Kz1jLmVzY2HkBpzOMuQBDsQgJ+RYOTvFOj7rI/P/ASB0K+Y49e4BFeYA/yjqARbEVjwv7AD7K8Vn5gEu5BDm+Dd8yXVtYXAo9AK8x0AoKX0pLmpvaeQzDOUL5eQ3kSx4+QPW6APUxHvwQe89dPwDgfIDGMcb7wMZ5ACWxCrqPinlOk70Ah3HQe4Bo+gA2Mc2/AElxF3nAPJ2ZT175ANrxHo6Z2Us6ACGOnhlLFPkBt/FDf4BFeYZVu4E0+chH80WxijnBNXKI3Q+PS4wNTU1NSYmdDzGCzY/6CQ/YeQ5OD49LjE2NjbGIDE2NjfJHznHHzIyMjLGH+RpLckfNcgfNzc3xx83NzjLH8xkLcZ7xSjGDDXJKmHFBzYzyCrkAIXHKeQAmskoOc8o5ACOxyjkAKPIKDVm0Cg3NzjIKDc36gDg5gCixSjpFvL/AmjqAavkNH7tAWvoC1/9AnrKLuUHvv8Fwf8FweQFwesJKekD4fAH9+UCG+gF7cUN5weVKSz5BSPuA/fnALU/XCI8beQC4D7oBD7JGyvkBFTIHDonPOYAliDFbuQE9sYvxn0nxHwvPif/A0zNes4POuUFUucDZm5ld0TnAUbqLX5lfSxi8g0Ixlwh5y8zfHzICug4unx86CYY7yXnfHzyIZ3kOFHlNXLrJlvlC6jnDjHLF+ghsjQsMsRLxRrRK8wlKeQ9zukv2+k5WOQJJnZlLuoCVCl9LHn1CEfsDD0/5AwZOsc86ASQ5Qu45WpRxEV3zEXnN8rqNNPkG7TrAM7nAurtMjTnLXDnNSnYMew0oOof9ug08Og00usgHT/sMtgt5CUcLeg0DO8078pPzjTPL9ZkxVnKNcUuzA/qAN7/AL7OWukA+O0AudxNyTLSLd9gZOcqNeg9esQ5IXLzJuTqFRnkDmXEM+QUAOQpa8Zs6zs4yCvwAI/wMvD8AOjoJp7RKM0hYs8h7zW8yirmTh7NLOk1bMom5U7VxCXoAQDlJoLNNug1Z8s18ACm8gIC6EvKzSfsAwbmEPzmKrHoBZDrFQ3zPdnpPc1dLG4pP+QBlDooauRBO27lJGzFCes9bW49zxQpLEcobixEdOUB9U1hcOQJ9ekk7GEpP84a6DXwxGgpfSxr9RIr8hclYT1N5BejMOwWXOQVhOwTzWflAwptb+YWBOgQoWHwBo1s6DZlXCIw5gaE0SNy0CPlElvpU85u6BDH5C+n6RhP6y+n5QCsb+gYT3PwAKVuzhHnBOzlBrzrL9PlAM3JFG7HFHPtDcDnAhLnAVVcIinFKt0i5xXPOyhoPW7pC1Ap7BjR5D6DyRk75AI7aW51Zecl7eYXYusAosYR5gCfxlxsOyhs2Fxs3FxpzVzkAgXxDGfXc23LKucyi23sAWV45QCsLsU4beYLfsU4YzsoY/gAq2P2AKvrMzbnALHoAZvkALHKTO0Cv3XLGecAoHXyAKDkQUszMzjFVXXlAKblGe/nAtLmARjlBFDsASnFEewBlucB4nDvARNw0HBwxWLsEkPGEj3HGXPlF3QwLDEpK+sAmyvNHjHlEmLkEo0pfX195xIac+QZIXPrP6ZT+AkIIHllKGvmFB3lFjlNzinvFjf4CEDlA2VK6hZMxy/KEsVM7y3v/xXO+BXOeucAruk3oyxpPeUAwnIpO2495AIC6Cr6JiZpWzBd7wP67gWK5wj/5APnYWJs5RYSxDTFeyk/xAv6CTRp5gvA5ifWziJhbm5v5Cgmb+QTZOUxsOwJsmXkMbBv8ATyZW5jb2ToQ47kAwBpY8VCL3gtdORE6sZu5ig5zm5zZW1hbnRpY+RD81tuLG9d5CfU0ifnBnHkFIg7aNB+eG1sbsRA/wxz5wxz6UIpP+cUduUJLsUKLcRn5BSC6AYk6x+AKFtsXSxbaF3mE+JB9Qq15AC4U3TpS5su5x88TW9kZT/pH0DoHzvpTsP7TsDyTr0pfSxU8wLnZcxs6xmT5gDXxxzkMLbkG+hxbm8mJuc4juQaB3Fub+QGyGUuZsQMyxvFEMQbdOwgiihy5Dnz6ygeLELyA6LoF71BZShy5xqL6AFd5Qwxb3V0cHXpA5znAxhu5BY2xi3mFgrMK8VTaT3lGGluKTth7QCT6ADr5R5C5Dlg6TYPbz3KXTHkKr3fQcRBbyxz6gDgVGUoYeRF+ixDZT3kKu9laGHkIGjkcDLEDuVwY+U83uhrbcQW5XEiOuZxNHXMDeUqqWVmdOV3DsY3MjE55Fsp5EWh1xt41hfETOUb7s4b5D4xxU3XHHjcNOV9IMcXM+VvfcRmzhbkCNvEFuUFAcgWZekAxM4X5D7o6AD103nkW8HpAPrXIOUA/9ccT/UBBGTlAOjlLP/SGOgAjmhhcnBvb+QiV8UcYuQvk8VrxxnpAMXGG+kBbs845Xhd5gFU0TnGHOQ3/O4Ah8kX8wC75QDyaG9va/EB9WHkXIrFG9I3YeRuHHhtYXBzdOQtJcYU5G857QCa5HmIyB7leUHsAPDMHWLkI57GO8si5DCpxjzpASzMXsof5FqteHR3b2hlYWTyArzkAkDIHvMAyuYC8m9uZ2VxdWHkJAU9xTBv5F9MyWLlASbpAKDFQcp/yh1lcXVpbGlicml1yjvpALzUHWLkEZdxZT177wNd5Fmgyg/kBCYuODg4LDUyMizkLpNheOYuk13vA+HEN8kO0TboLsld8QOw32/Kb+8ENt9wyXDsBATSbDEuNDY5023rBIjRac40ymrvA6HEOOYPHc5z5gCoNuRv081y6wPE2DsxLjUyNtQ86gN4yjvvALTMOuoAtPAEIugA7ccQ/AFYyyd1cN852DnlA4nPO8QU2z/xBJ3pAdXYe+sBKMwo5wC13zvVO+kAt9AV3EHqA+jEOskOyTMzMzTwASrxBFjEOtAV30HvBHvLQvMCl8hD8gPlz0PLfugjic5KNTLkM0vpB1HINMUOxTRtaWTKDcVBxw/kAq02LDU0OOcD89NBxRjNRsoSykvHFNBQ/wDO+gDO8Aed3zrkXaI1xzrvBwH1A6Us+AP0xEY2MOgCg+0GpfMDO+Z+FOgAjccZxhXHTTcxNuwAzdhN1UnKYs1N7gfF9wEZxCXGODDoAVLvB+LIOcYq8wFRyDnlApbkLgdl5hhFyDnLFMpAzRXsAdHmAg/fR99H5wCN5goKyEDFDso6xw/HNDM0yHvTNe8CyMwUzD/oCP/IPMYP9QEz6AKD5whWyDJUb0Zy5DJoyDLIEOkCtzjsAnHFUOYCImJhcmFib3bvArrKdsUd5Xz+x0s5MDHIS+wIh8xMc2hvcuwC2fECd8omzFrqAsnQWcgr6QCqzFnFHdFe0Fl9LE70DvrsLs7qNK505SXN5xDROjF9LEn1LYDnEQjoT8sr50/JKzIq5VXmL2Zib3h85VG+5zuh5BKk5Ckd8A3Bc3RyZXRjaHnkOdblLElh5ErdxD/mGHrGbG/kJCbETiYm7VIs5DBzbu1JkcUaPW8p5hO1xT1zPVtdOy9eW2J4XWPkEZlsJOkAlOQVXeYlLmV3IFAoe3gx5DjcXCIsecgJeDI6XCIxMDAlxBXLDOUAum9rZS3nHOnELy4wNDblJHgpKSwvXng/327PbsdZ0XHEId9u5y5uxFdMKHPoOeHJR+854X3kErjoAYfmS17lRDFo5AF96A9Cbuo5hOgBYfA5hG59LFL0MSzzEgrkA9HxEpdD5Cqz5xyAMSld5BKl9STl5BJy6gIm6iZCZX0sT/Yq2O8jd3I9NGU15S5ybGFiZWzKdOQCq+4ToOcQLMVo6RAqyQ7lEBXFDuYQIOQDZ2HnFX1uLGksbyxzPU5l5ys8xV5zPjUpy1bkGKbkFb7LW8QTPyhuPTQy5FOmMjM2NCxvPS40Mixp5TwF5GshOihuPTMxMsUfNORILC4zNCxpPVwi5QCFxCLqR0poPeVlyTIsMiwzLDNdW3PkL1z/AIBhPyhyPVvkP9o2MizlAILJBV3kAhZuxB0yMzksMzAwLDM2MCw0MjDFGW/EGS4yNCwuM8YDNiwuNDLFG+QAvuQuE8VZNjDEXTMzLDIzMzks5ADFy1g2MCwyODYsMzA2LDMxxj3HWDYsLsQaxVowxAjmAI/pAPpcIito5hPbbOc86mkpLG3oPOps6Tzq8AMJb/k80OU94+Q88vc8yG5v5CmRfegCqXtz5E6K8wNLbeUxMm1pbuVOGjowyXrmTCp1LHAsZOQaUGY9ceRVzSxnPWbkGul4PWbkPb92PWbkPb9iPXYvMWUzLHk9Z+kv6eYbKXkpdeQUKWhpZGUtdGFp5Qt6cD1bZlszXV3pL97lRy/HKWFsZuUG0y3kBkLmFXbJE+cufMVC7At17gs/6UthM+Q/9/M6aUNvcnJlY3Qg5ROSSW1hZ2Vz5D2IIG9yIHVwZGF0ZSBj5DpXaGVyZSB0byDnRXpcXG4g0wFcIit55AGL6Rla5ALk5QDL5QsQ6gDHxg/kfqjnCG3GEf0A1Glk9ADh6Rvrdz0wO3c8eTt36Bvda+cCXWfkSKgsU+gCYGvrAmA0MOUcNegB52L/AmEiK3b1AmFwW3ddxCHlGWrlPyxN8QWpdVt3XeVJUucca+YCEOwCkE3qAnl46QCSfTtN7gXH6QCkZOYGlE3pTuDtAtXxB6fkQ83sAtzLY+QjGeRM5MRB5UzgyCXkQJHHePFRlWnpLs7xBmDlGqLIHshM6T/tKeRRUUX1BgHkMzosaeg3tXN1cHN15Eq2O2nkBOkoYT1GdChp5QWk5Bj6Y+QCPuQdJsYSxhk9cixuy1rmJXvsG09O6TGb6xpm8T115AEKPEh0bWxEb23kBvQ+7D1s6T1Q505ZfSh1ZShp5S2a5wCFYSk66ACw5ADJ7wCr5xoOdeUtvPNmeCgp5Bc7MOUyqy5pc+VRrHnkGpFpc+RBEOUk1UJveOQxwecGO2PkCVzkTzvkJhPkGARzPUTkAJVo2GAp5VtT5gWDLG3qTNhv6EDh8FNn518j5jNA5ACV5wJYKWw9T+QXtGUpLGzoAvPlUpYoe+xPg+RW5u5P3yzpT3Zb6FHE5k8oLMQHOm99LNQXbOVTOOpOZeRVvnN2Zy3kSFrlEC3sTm06cz4wP+kD62NhbGMo5AZQIC3kAcUyKnPlApAp5C6V6U42OsgX5EZN52nv5C1U6wepdSxwO+YhjOVWzeUgwOUInz8odeQBAulD9uRM28Qi5AEccMUa5kLiLnZlY1sx5Eg8xDHGNedEmyh75CNbOmHmTM3lOfzHXX0s5AL06UZt5AHC50JWMCxwPXXmJy3rAYToBADmAnst5Awc5AEfW3Vd5gp15Ej16F/fY2lyY2zkXqzqAMw7ZCYmKGzwTarHTWZ1bOQxwyxtPegCL8ZUZj1zO2R8fChmLT1wLzIpLOhQleQF9T1m6AQe3XjFdupQB1wiLjLENf8CXf8CXfwCXexUOC1t9wJ15gID5jBu8AFh5ztd6gPlXSzkCMLqIvtuPyjtIFE9ZyzpC6TpRDXoUGzJGyksbvQ5BORLs2d9LEz2Cz906wOZP1LkCtDlAVUp9B6b5QvaYskk5F3I5BzOXeQGCtQvduUHqFvkIy/mBXBlKSxy7TUB7zI/5wEP7DI6fSxI5gxmUmVnRXhw6CTiYWN1dOYLnsQOZ3JhdsoOZGRvxkXEDeoLx8QO5Q8vyAxyZcs16gv9xA7oDBfpA7PIW8ta5Vyx5R9UXfcusMYo5CBv6i6vfOQDiTvpPyLrAPXnPyb/AOD/AOD/AOD/AOD3AODHEe4NJMgSzEvuDTjEEu4Zps0X7hGLxBbuGIvRLdcb6hK3yS3vEwnMRewRU+0AockZ8UCnMfNAp+w86+Y84yFI5GZB5UyfxCbkJx/kIykh5Q2E7QEt5RGByCTMHucBO9kg6g3GyiDoDJ7wAk7lBhV0LnBhcnNlcuYGHOUDtTrKOyzqA/o6YcQN5Qg1Om4s5AOsOnJ97kFdReRv1exBUkxlfSks/wLJXFzkRzbGCmDJCuQfm8YK5B9yxgrkHETGCnXJCi5cIiwnxAnkMtbGE+oC30jJCnb2BiLyAcjwQ30wyhHlQ24h/wHq5AHq/wFw/wFw6QFwITHqAXEhMP8Bcv4BclXnFX3tAXfuHHfqAVzuHMfOGPcDZOoV9c8v8wNm6hEr/wNE8QaG5gE55RG56QEwbvoBcugA9eUBd+0BcGHmAU1u7wFN1HbkQhfpBplh5AqVxB0sbucI6OgAzeYqrsRdPy4xMjowLGn+CFnoW24syBjlTKTpXjJu/whqYf8KsPYIiW72CIhy5wqL9CUw8QiJ6Rez5kMs5E7y7AJ/9AFD6wgy9ggFx1T/CAbyCAbIOOwIC33mCjRQ/xSJyHtwYWRk5AQJLHQ/W3TkbvX6FHToMsJcIiswLuUVauQlb/ssWi4zxyV97AfMeEHnAzrtA4zqH5bpAyjrH9/KFOkfD8oT6h9eyhT3A6fvG67KGO0a5s4X1C/rGZXqAKrtHi3UGusEHfAfKtUZzDDxHCHOMsxnzBvqHovIE/MeIs8b8wEI5hpi8wCOxSjLcfAaDMoa7xnM9QZ78Emg9wUR6kJ76QUT5C/v9wfu6QJw7A4D5gUHbizlSKnlCJ1iZWxvdzrkUjX/BRXlEU/pehzkQWTsRkhhLnPkOejkP+ZEdOVdo+g1D+QQOOYaTeRThynlEq7wDgl4LeYUg3Bh5A6MLHQu5QCW5TBy0mdixGcoctdoxDnIaek+w9Zo5ytHLHPpBd5oPS3wEKlheGlz5hCsKy41KulttGzcKi3LKi0uMTHlW3Eo6GspLjI16Am58gIe6gZQ5Du/bC3qa1HnAf1t3Hkr6UIp6wCCK+UAgm/+BpjxY8v/BolpLOVCSTps9gZbc8cfaNYfcscfbecPCuUWq/8Aov8Aov8AovsAou0HBepJ6uQtjtUMMV3wAlfrB4Ip5DMO7QdH6Eul5wJ85QdD5TIg/wdD5wNx6wdF5AJG5gNKxh9uPVBlKOYHO+QDXmXmWcnnAwTGI2nKI8QVxSRy+QeL6A+VYSxpLG7oQo/VL8oqySjQe2/fe857xk1vynVQZSgpLN986wgqcn3uCv/pEtruB29A5DlZ/wv/5gv/+AqU6j8P6wqYRnQo5QVN7U4Z5wT05W4U50yA6WMg5UmpbivEOWHkCVHsE4vmPcXEZHM9xWJJbuRn9eQB3GlzTmFOKHMp73RC6QDaIGhhcyBub24tbnVtZXJpYyBhcmflOpzlGszpGq7xASTsCyrEFudT4y7kBv7kFiPkOosoc+Qx6OYFNET2EjDkRe3nAozqer7kS33ECCnkLcPvCmzpBbzkLaNG1lXkMWPaVfcKWuUGpeRG+/oKS+U3msRE5AoFx04sYe0Js8gf7QJD5Q5IxhnxAkcy8g5G61IEM+pSJVvKXeQCNGlnaW7lJzj/DQr0AnLFSC10b2vkRVgp53/W5A0e6WCo8ADP7AHuxRTkDRjlCBFlKG7kdSbsCAdE8A5pRu8OafUBJfgBIfMPZ/8BIf8BFO4OHuVHa09uVOQBDcRgLG7/ASk7ci5ndWxsZeQCj2Nyb3PkAiXnA1FjdXLked5A6QDg5gL75BrCxXJFeOQbunPkAI/kEC3wA136AW3nCX5p/wFp8gFp8gFm6hDy6Ugl8lNJ8gpf7QFn5nwDXf8FAf8KhOoQx+ZcgG/nDyfnOwtuLHPkSXfoB2R8fChzPSHlA5J0aW5nc+wzAHx8zBl1c2XkBItjdEJl5AoH5RtVbmV35G39SW5EyjblAQhJbiBMYVRlWCwgxHvEAeQedesBHiBkb2XkBSB0aGluZ+RFacd45Xb65Tnr7QFs7As5x3U6c8QKUm93Om/mD1tpJibkHEXpfUsp5ngn/QtM5QcqxkfzBcljciDmaoVvbmx5IOQE8mluIGEgdGFi5GLhL2FycmF5IGVudmlyb27mEWDmApnlCxHtCHruXnDqQaLnAMzlQD7vCMrqSmzkXFVpesYl7F6XVG9w5V64xR4sZeQctOc7J3L/CNHmTF3zBazxQkPsAKHwD2hpbmXnS1Es9QCv0TLmCwVcIiz4ALbnBtRW9zUIPUcoauVWIOZ6gsgL6kG2xi3lPvNh8yEQ7GZd51t053mJ5lxHb250IOQAluhdWeUg4+gGtX0sVfknd+QfS+UNG+QaqOd8recNgOkCB+lxXW7xTzIp5W/8cuRMLsUd/U8v6DnR6U82b+h3+MYL7HDh0E4saX0sR/gBXegN3+oAxHLkE2UoMS3xT8TwemIpKvoNCTvpUQToAtrlUNzoIiDlAi/pHBbpYDboKMYtPW7oeJIrPW59LFnyAYTkIFjoCujQHOk4U+gBiuUB9uUfuuQBIecB6Otms8Q05VHALG7kKPdzPVVlKO8DzeUAv+hV/ekEbivkKStv5Sks5ziZYeQ6Hsd/ciYmR2Uocyxhxx0pLHN9LFf3AYrINeV4ZuR04+oAoOd30eUAgy3EeTHlKHnKEOQzs/QNZPoAxOdX1ixhXSxbzSbLEOgBNuQApOQoFX19LFhl51uC7x1pLjAwNX0sX/0BpyxzLGgsbDtvPWg9bD3ka9HpQoNt8gDz5x+SdXDnDbTkD5c/xDnEGOQ3RzDlAQPEJFXXJDAxNskk5BLrzCbkAIXSSkTZJsxMdXDQTijoB27pAK/lbKLJXyzmAJPtAIfoddRV2k7pANnJTuUAh8lO6wCvxE5bxkDoENts5CWB5xqRyFR1MjNh5Da5yFAzYeQ308ZQxA4z5Ad15wGNNOoBjcReXc5e5TFD017kAorKXjXNXuQAvNdexFNs5WyfzGd1MjPkSkLGZGg9ymb/ALbPWGNl5CeZzlfmP+nzARnKV8Rl21dy9QCv5kTL7wCv/wEHz1j0AK85+AFqylfEZddXKMxPXFxscGFy5AuDz1I55Dh46QG8OeQeeMleOeUOpdZeKc5ectde5Aojyl7kOxzJXuU4tddexFN7zmLlAtrnGfvLYmHkPD9zyQ44zWLkOf3JfuU579twfc5w5jQv0nDkATDKcO0BMOQU399wy3Bs6y/9xnV1Mjdl03LkAOL/ANTYZOgcJc5k5kb1zWTkANb/AMjYZGxtb3VzdGFjaOcAu8hoM2Iw/wDM32jPaHLLaOR2VudDwDIzYjHGEXx8+QDR/wE1x2nlBpdjPVbkVaFt5nB/Y+p3y+ZoEHDEH2jGH2Q9cMgfcMcfZsQfbMYf5HVWxx9mxx94PTAsduR5W2Yo5AcIIT09c+YHKGLEOHPFODt4PWLIOGLHOHY9MuZ0mD11K2creCxr6iR0MCzFC+QEQCgoZS15KS8odipkKSnkKyt5K2sqdipkLE09YfoJtORM0E0qPfEJ6Od0ElMvMi1NLEE95AftKihrKzEpLWQsVOQx1GlmKFTmCehX6AD0KeVgBuRFGSnoE7JCPTA7QjxrO0IrKynHL1hlKSzKOuYBTecnm8g2Qz0wO0M8aztD3zY7xxL0CKBBfdMxyBLOTuYBeupUlnE9MDtxPGs7cd9/fd9/33/IHeYCb+YBck7kfMnvC53oCklJ/x7m9R7meuoXslR9LE7pCqj/Cu7kORTlb1pdLFtJXSxO7QrsfSxq9An26Bb+zhope2UqPTFlM+dMeeQVmTtzd2l0Y2jkHixj5Vuac3FydORwGlwiOmH1XhdcIk05NeQeDSg2MjIrdCvlDk1cXG5jLTIuNywwLC03LjE3LMUNLTEzLjUsLThjLTUuOCwtNS4zLC05xBIxMMgJNMQ6MCwtMiwwxB4zLjMsMSwtNGMxxA7ERDIzLjjECzAuNyw2N8Q0NcU0NDQuMiwtM8QxNsZexEE2NsUiMcZAxAXEPCw1LC0yYzTlAJ84LjcsxWYyLDEwXFxuczE3MywzNzgsxwhjxGkwLDPlAK03MSwxMDQsLTIxM2M2xDotMTQyLDEz5QCIMjg1LDIwxXE0MjnkAJQ2OcQhNMQ0xSExNy435DJNxQ0yMVxcbmzkDvsvMi4wNzXkDwEt5w8KxD3FcTnmAJotMTQsMjDnAR9INDDEAXbkAXM0MCvlLSdIODQ1LjI3MsQgcy0yMsUNLDQ25AF5yg1zLTIzNSw0ODYsyAnmAaXkAQotOSzkAM85LDfEfS025AG65AGXMSwt5ACBM3MtMTk05ADa5ACOxwpzLTY1LDQ3LMYHelxcbk3kAJU4MzTmAJboD8No8wCyaC3GFXpcIn0oZSw4MCk75RDIO+oCd+UMhPwCeDI2M+YCeTAx6AJ55wGvMTgsMzkuNyw1MiwxMeUBjDM0LDfkAU42OC4xNjcsMTXkAb8xMDIuNSwyMzhjMzQuM8YhNTEuOMQ1xAvEHjEy5AIXY+Q0YS03MOQBKzUxxGUtMTA25AJjNeUBoDA25AE46QHPODTwAc/EOS035AHP5AFSMSwx5AIc5AID5gHP7gHOMTAxMi4z5gHMN+QCtjXlAcrIC2MtM+QAvjjlAIc4NCwxN+QDOzM2LDI4M2Mt5AD0MDgsLTg55gDqOOUCSjEx5DopMjMy5gObMi4zLDQ2xEAzMy44LDfmA27kAqc3MWMt5ACtxAQt5ACH5AIYMjMsN3PlAgnnAhDkALpzLTEwOSwtMjXEX8cKYy035gPqNjjFFcRXMjXEMeQCTTI1MmMt5QE+OOQCmSwx5gCCNCwyNucAlywx5AEk5gPIMjbHHHMtxAvKBHM3NiwtNTksxgfFDjYwxQ42MOkChjEw5AIW/wKH/wKH6QKHMv0E/zgzxGMoMTDrBP/mAgszLjEz8QIKLC3kAPflA13lAqotMTAg9APV5AIdMTAxMy4xcy04My7kAQrkATc2NC4xLDg0MGMtMeUCAjU3MuQCHDcsODc25QFvODksOTEz7gHGN+UBxjTlA97lAcnEfjIsxEXoBWgtM8UsMcQGxC01Yy3mBPYxMsYHMOYBrjfFLTIxNCwtNzTlBXzlAMjkAIUxLDI15AG9LDM5cy0zMiwzOSzGB+QEUeYF8DHlBebkALHlAcrFMDDGN+UDaDLGZeQAsuQCNzYz5QHYOTFzxQ4wxhUwczIwOCw3MjIsxwjEOjU2LC0xN8RlMTLlAQkzOeQCTDLkA3E2NjZjOOUBDDLlBbgxNeQC9i00ODguxETlBcA2NTguNcVJ5gEJ5QMUOOYFujY2LjgsOeQED+QBXy41/wJm/wJm+AJm5Fj9+QJmNDLkQbkrKDIzOTjtB2flAcHlBAszOOUHROQCEOYD7y01MTRjLTflA9vEFTA55QcaMeUBwjExMMcj6Qd05gOcMeQFDOQBuDQ55gJF5QOTxDsxNcRnMTXkBEo15AfGNyzlA+LFHOQBf+UFT+UHRy015AJyNSw3Yy005wJgOMQF5AcDLTHEf+QGU8UIyRDkAeoxMjLlAfIxMjJzN8QrMjEsxwjEVzIwOSw5NjgsxwjmALfmAdozNuQCuzI1NOQAxzc5YzE25QCcN+UEUjI1xSQxMDfkAIEy5QIsMDjqB4M0LjIy7QOq/QOnXFxu8QWxNC7kBMRzLTjEbzM35QgeMjcyLjYsMTE2NuQDreQCmzfFHy0y5QZrMTE45AVgLTI45AanOOUCfS0yLOUAnCzkBVA0LOUGvC045wOv5gHnxAkyeiD3AoBcXG7/AoP8AoM0/QKDN+YHcDI3MTPsAoMzM+UBajE3OcQINecF9jcwMOQHK8UKMiDmAWc1LjI5OPAFEeUCHeQBF8ZGMeYBbTH1BRTkAWo3LuYExjnkAsA0N+QFFDc2LjIsMTToAWg3LDk4xRfkClUxNOUKMTjkAxExNDg1/wFj6gFj5AJd5QNd5QS5M+QDH+QEizJj5Apc5AHeOecDSOQIai02xg4yMMU/5QIkzUHmCi/kO9DnBwMyxRvFBjTlBzQzMiw2NHPFJMRXxAfwBvrkAPjlAx415gUYMTUz5gMmNecDJjUx5gkC5ArW5AEIMjDkCA41LDYwNGM25AFkNDDEHDEwMiw2MMR25ArQXFxuNjA2ev8E0fMBh/sCTVRh5DTF7wJM6lLvXCJN5AIWxFTnAknoA1vLZuQHATc0MsV6ci01NC1lLcUYbC00IDTEBGMtLjY2Ny43IC0yIDEuNS00IDIuNXMtNOQI+SAxLjgzMy02LjXEFS01LjUgMeQMZSDkA/VoLTEybC0yOC04NGMtMTbERi01Mi05xQogLTI5NC4zMzMtMjQwLTcyN2wtMjEyIC02NDMgLTg1IDE35QHdLTTkBNczM+QE2DMzLTfFRTEzIC0xM2wtMTPEBzc3LTE1NSDFBzZjNjYgMeQDIjMzIDEzOSA0MTnEM1xcbjIxOSA2NjEgbDIxOMQJeugBHOQBf/UDBjc0MukBfORP0OkbICh0LORP4el64+R/g/R65fE7m8Rr8zubxn3lO6L/esPqO53wLUHoO6LvPZnketxuKX0sJOVxyyjpH7voFRAs5RTMxxXoFMcs5RdZyCrnFvYs5RcQyCrKFecUrcwu6jNufc4yyhnoFvnIHswP5xcDyQzkEs3HNuYWKMg1yw7nFuDJDOQS88Ymc3XkJG5dLFrlAQLuGLLGEOsYjccS7RjvxxTqGJrGEOsYiskizjZ8yRrKCuRoM8kNVswNbM0bcs0ObM0qcs447jEK7TEZ5xVTyQzkFoLyFLfIOtAT5xTFyQwx5AFHS+UBRzzFFz7KT2FuZ+Uk/MdLyg8vyRViYWNrc2xhc+pcCOQRYMcLZ+URa0pl5UIK5AZnLjgsMi40LDNdLFFlPekpbHNt5QTy534m8HQv3ibaIOQR2coebGFyZ+QAvOUSxzHXGDLXGDPXGDR9XSx0cv8Ayf8Ayf8AyfEAyeQBzWtcIn1dLGXfet9633r/AUP/AUP/AUPKGDT0ANpy7nHO5VYK5wCc6UhX6V645BNj6x1vxS3HY9It5x825iG+7R87xjnnAITWOesXWPM/okFkZOhCgyBmb3Ig5RR65nzx7loM5UKx5nhXYe5+fOYf8+p2buk+/TIsMy3oQLblcL07bul5ReQYNOcAt+Rw3eRfVMRqO27oQm1p5BeIdCxycijEHeRJDOZZR+QG6+ghhyvnIYTnAQbpAWzJT+RuMeQXUfEhZMQh5QCZKfAXbSxvPugBQCDEJ+gHa3Jb6AC7LTFdfSxu8gEE6x9sO+UEl+0bNec43OoZ/OgdA+RrDOwEuDrlBM3qGVjmBJHKEMQ8OcYR5WSo7gTn5AEf60fKS2UsdCk/UWU6yxQkxRTkefdy51raYXLlAMRv6ifG7AFO5l1bP/wiAvIh6e4C4Osh2G8sZfchpWXkIaAodCxz5zFjyGTqA33qAI1Z5AIcc+YkzskoX+lcocUQfSxp7gGl60MV7iN45RdpKOQkPGHkAxTqB6ssdCrxI87kJ/L0JDUsc+waC+VDqO1a/vEwt+QLNs0i5DGAMCxsPTAsbeRsbPEBiWnmAPwodDwxP289MTp0PDEuNOQC4z0uN+Q/0igxK3MpL2/kMhxq5Uot6RfLLGjFHSsuMDjEIW3kGAUrMWUzKnMrODAs5G0sKfBEXuQ1yDg15TXKLGE95AtbL2/uAYvoAI9tPTEwODAqSmVbaeUBE13kAIvKDuYAlGjOE+gAiuwAq+cE5sYkLOQZp/cAmTEuMOVAxixhPTHkAJUoaD10xlMsbMQK6EOB5QnJKOQA53QrcynkAOrMb+YMsdxoMC43NMlpLjA1Niks6DJgPWws6CgXxxHpcZLmRjdyLGFkduRFI8VNOmEscnVsxwwo/wIJc3Mrcykqb319LG/0BGXnBlr/BGD/BGD/BGD8BGDwBEp8fMsS5QRw6AU/5QOlZSwhMecAue9MZlrMLOUDvEplW2VdyzDuKh1JbGxlZ2Fs5gaj5Hem52Cv6GCqLHNyPW5yLGj9BZr7HYAq8B15LHM9NS/QMHB0UGVyRW0saOoD7mUtbyxyK2/kA4PJFGgvNTAwKjkwMSwyKmgtc+pCvuQFa2ws5C0y5wSlbHI9e+cKlmln5A9De23lJ7vrfjLoCLzGJ0LdJzLIJ2JpZ9woM8tP3Cg0y1Byzifofr/xAJ/cKO0AoNwp7QCh3CnsAKJtzijmNHzxAKDaJu0Anton7QCc2ifsAJrOJeYyd/EAmdkl7QCY2SbtAJfZJjR9fSxt5WFh/w+E/w+E/w+Eyi7/D4TFKP8PhP8PhMY1/w+E/w4r5wU0yE3QG+oPxu8OK8gW/w80/w80/w80/w80xTr/DzTkDzT7DwX3EBjKF+0AtvAQuPAQkvIQtPIQpPYQ2s4ULuRPcugFzyBj5Qqo6C9LWeRzqOd9J+sGV21yLHLmaOfpC8fwBklu5jBh7wZJKHI/xjk6SlNPTi5z5TYDaWbkcGzkE4QnIGHkf7LFK2XpMfHEGeZvx+kApnVy5w3/Iec4rfINdkJ1ZzogVGhlIOk9xCBQ5DJN5DATIHdhc24ndCDkShZ5IOUyZGTlDXjrMwvuIiDtMxTmBkXtBivuBhHKG84c6gN+5gXCyzbNG84c6j3q5gVYyzbNG84czBrNNM0z/0Mr8zFeY3LmNO108DSO7gEx80SQ5QUabHJb6jPLXeYKiOcFQ88bxhYsxVc65gI2/TLz6AvN5muH5C9cbGlt5G4f6iP2dMdVXSk65TfgxSPnMdcsZedKUCzLJ/oyb+hB+FvkVPQu5gnMxlAmJmXmJOzlSqrIY8Ra5yT19jpy5U116QyS5wgg5QDJ5gCN5WuJ5weVyxc/8TKNZmVu5wX250K6OtsjZmFsxFHmMqTsNgrpAzboUuDuAwPHFf8CPfk3Su83Emf4NxLoBHzlUhXlAlkhPeQAoW9mIHL0NNjMPiBzZXTkU/7kOqzGPuQ1j+sAvfACwfIA8/MCxeYCj+oDBeUCmOc3dnLkOr31AUXwAT/EGf8BPv0De+U4iuYAlzsrK+Q788dpROURrMQvbj1h8jhFMSk7LS3QLyxhLmXlUkXnAUboALLELsRKaeU8Q8ZNRugAl+QSLvEBMfkBUu826uU4nW4sxB/nA9osxSc65BJt5AMwxQ7lO4Y6aeY5Rv0D++UGD+p8RuUQfus8KeQMC+VGbuYLdOoDSF3kEJDkWOUw5Tg95BAcO2g86Xx0aCsrKW5baF0uaXNNaWRkbGU/cz0hMDooaeoMhMUf50GwaeQQs84a5irRb+Y/Nmkq5ELb7gz/b9MUcuRQROcD5eQBIz9j5H5Y6gDBXSk6aOQEvsQc5VoJ6gS6yyQsbi51buVAgOQ07+oqo2w9MTts6gDkbOgUDW09blts6gDrO23kQxtbbF09aHIobecBl8RtbS5v5Tnpc8l1XSkp5nFi6AC15QG+KWE96QC46QFv6lKTY8go5QHmP+49eMoZKTplO2HkAIPHFeUAg2PJe8xc6lxO5QV+YfJBJ+c0El3lQ7z+OErmAlLxPh7nbH3oBfDkAYLoNmb+ULDkAavpUK878T4p8QW0LHLpAb5h6gFexXXmAV7Fdm7edsUqy3du33flNrTqAXwmJtEx7j7RyivkALDmXm7pAYd55Ddn7wUQbeUCW/AFDcgW/wUP/AiK5goK5wWo7gTe8wYnxnHlOvhvdXQgcHJlY+Q+H2flBh3nWe/pP9bxALz5BhX/CKTpALnpAkTqCKcpcucDLegDI3I96wihMesD4udVDGE9e8Z1yCTnA5U6ZX07cukDxT1h6Rdb/zs55QFR7Ayc6gCc5Ah5fMwRP2LkAgvmDLbmdkEpOvII7PdTlOQCnfxLfvICk/13Yi4wNf93Zc4m6DuKcPoWt/pIXOVH8eViiu9f3Cxv8gXGcz0wLORY5u9ZAcZL5wRIc2915gFraSnmSG33Yq7IKl0pKegVDPAU4WRlZmF1bO4U5C/kSHjkSCnQLedZGuYCay/mYjvnYjppKT9ofHzpVcnoOtvGJOdI1TrRH2JveMYb53M85hdfL2JveMpXKOhZtOQTz+8AkeRjhOQVvvMX1OQT89Qvc2VwK+QAmeQEf+hjwmk/MDptKSk6bD1oPy7kTypyPUllKORhLmzkAbrmZCpib3hlZHxmyDnpAKHrPofmY9/lGsg95AF8bGnkEdrOHuYWwm3pXCFzPW7nO8/kVpnkD/nkEGduZOcFS8pczhrkQlLOEsQ+6mRfzDrKFsQ2yg4p6iKt0k/oDQL/SPL/SPLwSVZz9kjybscf51qC6Due33zffNJd1XzpAJvwUMDxAuHvUNE6W13mAK8s0CrlXhPnA3HoWOYsYeYB5+gB79Q2IWjuDnjrUOrGLC1sYeVo2+RhkOoBJ84tyB59LGT1BK09MPMFY+gEm2luZGV4T+QEZOoDISk+LTE/61CY5AbVZW7oFejnUSHmBOhdKekytcZR6DK75Q1m5QDD5CaJ8AV063gZXCJ1cGRpYWfkRBLkDX5r5UF/7CbSxEti30zITOQSst9O5BxR5QUl30tob3JpeuQSydtJ5mgT30nFJNM86gFxOsoWyxXkDtL4BNLxBaroGQvxAIvrUjLlXhrkYe3kf+/zBwrpQp7fLO0HXNskdm9mZnNlxFHKJfEA/OYMvuYCO+wgtP8F/fAF/fILK+hJd+QBgeQFAjrlSnjlBYcg5QWq7GDv7wUm8AGseP8Cf/gCyyD1ApDpePHyBf7RX+QJjcom5QtOzzXwSinqA6rySQblAXL/Sir/SQnpSirmCdL3SRL/R5ss5RAr/Eo1b/RKNeoA2/VSSO4BGDpp5hA/5B297AtpcHLvCuJkcu4MffcBQesCtPEBQjP/AUL2AUL/AUz/AUz/AUztAUzFITHZIXM9ZVsy/wFt/wFtbyzrA0LoAXtz/wF7/wF76gF79gF27ko8aMcl/0o87xYH0nr5WyHsAIzqVLXwE8v4A3/nBEHoF2DPEOkEYccQ5wvH/w7p/wIi6wIi81qg/wHg9EwX9QHA5mMfcj17feoaHWflGXfoEkpl5ycLLOQKj+UBFuYUl+QA3OUAqecA1OZvvMpwLG/kFr7McSxz50V0ZeRMSeUBE2Euxwp8fO0DdfFN3vJW2zDpAU1ufecT0+gmWDsrK2gpZnJbcltoXV09cztpJiYoS3RbZV095BO9JiYoSsUNb+saa3jlAPTpF+3kT8duc3Vt5AmtY2VzKOsUd+QBm+QNsijmFhXnReBo5ko+5Ccz6CJJaGRhc8sXOynJVSjkWffnDVTTKuQRoM9/5QF9zXfnBoZl6gDDduYmfOxJEXNraXBCZWZvcmVBbmRB5Bt15SWxYWRkSm905AJZ5ARDc+QEQi7lTA7nDo0saMYaU2VwYXLlByDkA6jmVBPnF9NiZWdpbkfkHWIo5ACv+E77xQHoAxfkTQspLCHnQB9sPck3ZXhwYW5kTcQ9QXPkAfDHPuwAlOcYJuY/jGwpcz0x6WyXISjnUt9GbG9hdChsKSl8fHM8MO8SE+gcrNBZ5QhabCl99QDb50fWW10sYz3kbYN1xAtw5AIi5AIQcOYBxeUCPCk7O+YA2GToA8ftF5LsAQM7yWtlbmTxAUTMfyxk6Uim6lQP6ATk6hdkZH0s5A5Cyi3kCT7tG6HFLMQWZTpyxjRbZF19KSxt5gDCZOhnJ+8CZeUQvyblApZm7AK/6W275gDWZeQI3MUke+RsPG3tKprnAIo9PT1k5ypKMMUM5ACG5FcO63Qd5B5+cG/kAPhwxxI8Y8cJKzEmJucBb+QTHeUJ4+YVMegBVyHlAKTtAfPpazUm6E+/xAHIDGNyyArlAMAs5E4ueHTlUfLmAQ9n5Wsm8xkSxG8pO3XmAI9n5iuSLO0CDSzmAjTGE20pfeoKNfsB+ssU6AHJ5QKp7wHH5gO+Om4s7QLGc+YB12PkGqVzOmkscm93R2Fwczp1LPMEBjphLGjkTxhzxhfkUIZwxDnuA/E6aH3qBF5i5QUh6By55gHw6XNsMCwxKeRL2OZRBeUOdOYJFeZD4voThu12HOYGQu4AmOcTYeQB0kHkAO8obuQSKltd6Wwb8wxq5QEY5Axh5m4q9BJtdT0xL9A36A2FcD01KnXlBgLvARDlAtDrLofTIShw71xn6C9l8C0eL/AUSiouMjc3OOhrAzEyKnUsZj0zKnUsZz107QWdKmQseD0uNypnLHY9LjMqZyxiPTDqB7zkIWTrB7swO2U85BiY5wcWZSll5W8CYis9LjI15GsI5kPrcG9zOmIsaXNEYXNoZWQ65AcefSnlcL95KGlbMF3kBoAwO3I87QGvOysr5wZsa+cByFtyXSxTPXgsTT12O3M8a8coJiYocz3IDehFg+oB0coaxHBhPTA7Yck75Bz2xmNB5GNHa+YRKztNPEHmEZbkRec9xwwpLFM8QecRviYmKFM9yA0pLHpbYV09QeUCjFTkGVvmAxvkAK7kRcpUJiYoQuRSilTkKr3lASBNPChCKz125BIaTT1CKcQn5AOo5gN6xBUrPWYpLHrHYT1TLHrnEi5NLGIrxQ9wb3M9YsQNTStCLGhbcl09eizkAUxyKzFd5muwQyxxLE49Yi8y5CME9ylJLEnmAmdzfHxbXSxS6AZ4YT0wLORFz2E8c3x8cTxJ6wEuLCsrceoCAU89SVtxXXx8e30sRT0hMDtcInPmArHnS/BP5jAr5SNkRXx8KChD8W2m5AGk5ACCZeYSyuQWnOYUqOUQm/IWoeV9puQDblNlcOgryVLmAmdDKeQFPXzlBatPLukAiuQDVzrQFfcHvckg5TFZ5Qe7zDXlAl1MPegYyssbP+kV4eQixOUC51wiLEjwAO/kGRZpY2FsLck56lT2SPdy7sgY5g1D5WNM7hY21CLmFnZMyRvmVRPkLSvlO+FtLzLQPegAm0HkFNA9LShiLU7oVH3oAWFIKSzkAfIrK+oB9DHkByUhKGE+PXPncZRQPeZwPjsoYT4wfHx09AomKSYmMCE9PShQPeRKJGZsdChPLnByZWdhcCxwKeQDFv8CKfMCKVDyAg3mXAHoAtXmBGJu6gRWRj3kAzgsVj1GW2HlSZpWxhhVPUbkA18tTjtW5wN2RsYILFboAZxGxwksRO5IzOwWSVbnFklVfSl9fUT/YDL6FsRE5RZTyUDoAQ9jb2zmFnrkAc4oTy7FDOQMGmNcIinkUptdKegBCkQpLChhPHMtMf8Bje0BjW9zdP8Bjv8BjvEBjn3kAipo0EltdGFi5h22UuQGL+YEaT4w6gRjR8gy5Ae4xTZcIucMzCxlLG0pLFnUIeoM8cYlV+o2y+wBpGjqGGk7yn3nC2lYPWznCi5fPVjnAhJYLugGxT9X+gH7WcdXX30pOtsnR8onfekBGf8CIfICIVflYpjvO9nwGANo5hgDd3I9e2PkWjXlVl4g5E3w5yNgxAxyOud/+SBcIn0sa/YYL/MdjucBw+UacmR593BG5QVr0DnmIAHfMcwx5AVV5Rhj5RhefSnEA+Qy9TXlCTHsCMc/LjE6LjE2K84WLTErKOgHaD8uMDk6MCk78SbY5GcxcGFj5gzh5HzS5Rub5yUP52EkxAfmDrHkAwboMLPGDuZQ7OQzyyEx5zQlb+gHQ/AHIm/kDKPnNwFuK+R8J29w5QGYPTHkBs3QLchILTHONuZMx8Q5bS09MeoQTmM9bDtjPG07YysrKVwi5xqrxUpjxkE/KGkrPXdyW8URxSBdLOUJUsRW5Hw8IOQPVGg9ITDkNFPwAI/HRSYmyTPmBxnFGvEHHCDrBx3kAKvkASDzAX9jb2x1bW7nAKwsaS50cmlt5GdJL1tzZF3nGx9zKfNbQMY55W3R5C9CyDnmDcfHUPYLWeoEb3XsCRHkdYfkem89MTtkPHXoAcNkKyspcCs9ZCUyP1wiMGXkAXbkfbDFCfgAzuoCUHDpAJfkDuTnAJjpcVDxAJryKZnQUeUAhOZR8/0MPd9KxkrlDCXGT98vxC8x6gMZZuYBK+QMTe8NYjtuKz1n5ALm6AVfP+kEcuQVNSIsxSDofjDkAtnLKegEj8Uq6QLWeD0xO3g8yjM7eCsrKWYrPeQP+WdbeMhCP+kCwjrEFlswXeQOROgCf+QBMOcClucS7ewCYWb0AmFyb+VdxeQCXmbpApfkAJohPT1u5B9j9AUe6x0ccuUHJ/kaIm7JVO4EtSYmzhA8Mdhs6BrW1WpzY3JpcHRsZXbnFkox5iuxLFP3Dz/kDwZuPeQT9ugWN3vlD/xh6BAi5Bc+6w+V5ikG6BWE/hJSW+QYzuR87vJmjeQFVmjqA5HlVJHkVHwwO208aO0OIG3kKHVs5WabxhnkE0LyZqByPU51bWJlcihs5ACiMipy5Q0fYz0haTtuxlBmb3JFYWNo7QaF6g7kMewO5GUrPTLoFQHkEb7kNwfrEoYpO+Uq5ecSfPNnZuknkHPlBJhjKWnJXCYmKOUkFcUN6yjk5BDGxhUvMuUsyTxu7wy+VG9vIG1hbnkg5BcP5CyfYSByb3c6IOYrkOUC7uV/xyzsfcxuLHTkD3rkJMvqBP0wO3U8aTsrK3XmAOTkBQHkB6RkxBklMj09MT/EE+Qc63XkDslj5RQWMSksYVt1XekB+egFu8UIOnDkRJ5nYXA6ZORTZOQKVjow6RKwbvIEqD1jP8lDyE3ld51ufTtncup0NucSuukZSMgR5APjxgv/GSHxCNvmAt8oWeYClik/W8QHXTr6aTMp8Qi7xEllPUfkMvDpFOItMSE95AE15BPW6SFSZegy9PYBNWV9xDroB0/oPufILOsHhyzJDDrFLsc4Ot84zjg6xDjuAlNVbmtub3duIOYF9SDlAJbkJsjlDxPkOg99KfUT+SEwfegYO+wEOnIs5BPgLmVuduV4UinuGjp58Bo6a+Qb+vwB7W1hdHJp5BtqXCJwywxiywxCywx2ywxWyAzyZoD0Ah/oAdR7xjc65BghLMd05ACK5jeaKcRPx37EFuY3hl3EFucAiOgb6+o3cn3EHucAmsQe5ikLfMQW5wCkyDTtNdHGDV19W+kBT10scu4Fp/UBmTF97wGE6RnjP/kvae0Fs3Jd5i9r5QMNxSc65R436y9m5g/6fTpy/wHg/wHg5wjK/wGp9wGp7QEK7RbDLjXkBrDmBwfrZLvzGovkJ6/nRKxl/wDL/wDLXCJzdWL/BJD4BJD/BIr/BIr8BIr/BInuBIn/BBnyBBnEa+gdKz4x7wase+gBEH0gY2HER+U4DeZoQ+QJrcZY6ApXYecFlXL2BG3kH+TuAeHEfChh7QIFYewB9eYBL+sKj/8AoPsAoOgpLf8CIf8CIeQnzHPlClNcImTHC/8C8f8C8eoBEORJFOUBP+kQ/e4B3eUHyugHnzDpB5/rR3zfMMYw5Smn9QRc/wRZ5wRZ5EKI5ARZ6gUhxSw65S7e8wRf/wFx/wFx5wDV9X1c6wFoU3LfZt9mImdhdORHid9n8xD48gty+QG/Y+VIz/cLj/8BJ/8AwcdtZWTkCXz8BLr/ASnGaO9y8Mxn6yDe5wbi6xO+0Xnrfu33fv75I9PsA+jqIv/kUU/zbMbzbLzoL/VNcj1mcu4nVMsn7zvk5B9t6QDZ5R4I/ySp/SXt8DkB9X5p5QoB6gYh5A6c5kps9hjz6wC+IOQAvOZwQegME+YS6uQdJjtzPOcNL+kaDnMpaeUNfsYY5FA28Q1+5gCO6wELPT09YeY9dE3kbBZzT3duUHJvcGVydHkoafB0L05vIHN1Y2jsAKTlBmhp6HDkaD1NcuR0lmzocOxB53RHc8x2e8QzK1wi5EDVaOQfPGwuYXJncyxjPWzkNofkAYYsdT175QSa5yXV5wTKOmksxVfkOZYscD1o6CSNKHUsbSxj5BK97Tj05h/p6DjyZD1y6h/zLGbkASrnAKbtH+7vbyJpZihm5SUIIeQx0e4BEE1pc21h5iJU8QDc5A39Y+QQ22J56CB1xBzGTOcA/WTpBrZw5w2C9gLE7AEKxD86acUH5SA+Om7pdV167TJu6h4lQe0//u45Q+kAgnpy6z1KLHLkFqDJQVTMQSxh7jc8xkDqN4nsPMd2ZeRvk0RvY+UCBekzfWEpOuU0N+QCmMwvdO8zWD8ocj1h5Aly5QMxPcRkXCI69RFraeQFhyk6KN9DxHbYQ+Q0xmHlTTBi5wMa6QCZKHIuYegRu3Mu5i1P5UjoMuZI580f5jSkyx/kFAxtcOQBTd9WxzfdUzE3yVPmOhXlOD/GUuQdW+g5O8sXfHzfatVq6HDn7UFAxlHxN+xhdGjoMQvIEOUBRMsQ6HrOyTDoO7fIEegTl8oS5wEzyxLpOez/C7r/BaDtBaDvOBHoAOHsA3TqRg5cIivlfkrkIwY1Ket2/SzuAnc68TYj8XcgQfAHmlToKaBC7lEQxBPkAZLqBkTpULDkFIvrBgQ/xg5bMF066CgyXCJh5WVRIT09ZcUz5ByV5QGcxRJmYW1pbHnkAjjlAaDLFOQyVOUB1OcA98gY7S6/9gIPQGJpbsVP8i69/yvg0FfzK9/GHDpC5jon5wGDW+QO+l3/AYR45S1X5XqM7Tq/9QDE5VFj7AK05Hw95jEgxhDlfH3FEf8A5vMVyvor+THkdwLmApfnObnqAInkCDo/QnIo5U/Z5kku51CH6RXj6RXdaecsIeRFp3PmCZZ3YXlzSOUAl1N1cFN1YsQW5UiodElzyBIxLOZ0acUKdXDlKNHlT+nlHRn0AJHpAwPkS5Jo6iiSdXBzdeRIcOUAjm/nDF9hc+R3CHN1cMdL6gFE5HfrP+QRzOR3H3Vi1iBv5RHu6BLR9gIt5y0axhXpKP1o/wIcb3goaP8DoOsDoEP2HYt05SMcLOQriuQKt+R01yjqfEfqOnFhKX0scd9D1UPqNczEQ07pTP9CYmLpceXlBXvqSelib2zmA8PJHOpJC2Zy5HcNyxzGEcg65EueykXmAhjkFJnrAzvkAK30Bgxy6ka0xA9p7gXF6wCDxA9ub3Jt5HzDzCLqAMHED2PPH+0AqMQRc+t60MUQzmJ06gCA5QEr7QEc7QEN8wwN6y6m/gPY/QZm5FMi6XcM5BgTTuQrwmk9TuQLL+oqAOcBUewGfMQTOmku5Vw05DyV5kNm7wKsQ/ACrHHvDeb2BOXsAdnrAff/AQb/AQbqAQblAPlu8j0u8Xzz/Ad1QnLkQfXmA8f/ASflbEDrANLFNWF98QP85Qsy7AEe9ALI6wLE6wJP6wJL6wLH5ALh/w8b/DLd/gI/836d5H5L5QD2b/Z+VG7wAWHsATFp6AEs5lgX5AjQ7QJc+Bwwx3PFJG99/wKB5QKB5QUtSfYE6mXpCKDpESLlU3VyPXIuaWQ+PegrSS5pZOdMXSgpOncuRElTUExBWekQuMQ05R4a5HpAPT3JIcURP3I95lrV5AaR5xRyx2XIX8kazCDlHc/uW1XlHZpS+B2aSeQSI8RyLGXnWR0s5EepZnJhY051beZXIMUORGVuKCk75Dop7Cw15w89b+Qq9HTkMyLlGaLmRJflL4Z0aW51ZWTGcHM9OC41+SzNaD0z2h47b+gnMcgJPHM/czrIDSxv5ydgxwg8aD9oOscMffAAtGnnQBXkD3gsdSxwLGQsZixnLHgsdixi5gDIZGVub23rAMhoYXNCYXLkII0/5AbHYXLkVrfkQEDlfV/HEOQnXWzzJkLkAT0t6yZC5EAO3ybmEFnnANvkEFvGCyk6KGzlecLkHsQsY/9Bc+guQeZU4vECYuQLTe0CwMUWPyh10VdudW0xLHA9bT4wPzMqYzo3KmMsZNN8bm9tMSk6KMQn1kUyLHA9Yyk61h0zLHA9Mypj5DJI1VsyKSznO7l50SHrc091LecB9i0oeSsuNSptKTxwJiYodSs9cC0o0h0pKSx55EKQbS0o6HP2LWTGM2TFM9Me5yoOaz3IHik7Zv8nc/9AWMQk7CfOYucnzmT2QFhsxx9r1h9vxx8tdeZAReUkHuUBOlM96wEC6wDSO1PoASUuNSoocC1TKSxkygwpLP8A3/8A3/8A3/8AwOookfADx2EpLOh14io98H+98TC1LOd2Bd8rxStn53WP8gWW8gKbbGltMTrVFzIseOUDrehJmETEFfNLO3PoSzvFISxn5Ewd8QDq9EtQduUlnOcFYu5B4F0p5Qxw6Umez3zpSqPGfcoj337MO/FKzeYqIeQAkmNh5BSf5lF650L05BwdLFt40TXkBPflKldm5ADR5ipbT/8qL+oS98Y+50Iq5gZ9ZSksxQ7mBcPlQjnvBcPlFjPpBbbGXmHwBcryJ37kBZx06AVW7CnOfeUDYSDfMeQJcDBw5UGhxHFu8wd55Tg1xRPlEMzrYUR7/yWj50mEaedeoPICuOhIveQJUOZRYfIA4ecGDchWaeRLQ/8l+DDkAP/peU7rAsZ8fMgT6gJc6Cra5ni80TPGH+ZoxvRJpMcY5ApF6ERZyDsucmVwbGFjxCzkCtPmCtwiKeVENf9Jz+RhPOYtV+YlRscNcuZ5S/QAweY14v8AosUYzDz7AKNo/wCj6gCjaOxMzG/JDXLtDtlnZW7nAxfuPhjHFcYOZM0OzQ10ziliaW7leNXGD84OdM4PxAFhdG9wzUHFNuRZ99UWa8YW80Iq/w22/xKU6j6N50Hh5EkO5Ak5aMYH5CgLYXV0b+p5DG7tRlHmAJfrRS/nATHLEtER5wE5OnLkNL/wQ9nuARzEJDHRJOgBbMtU0hLoAXTFQ+UuH+QkN+RguilcItV36wF+yjXEGeQfH8Q5xAx92z3nAaXKPeQkk8Q5Xck15wp6OvJY9lVucmVjb2duaXplZCDnApwgY29tbWHkGuEpff8Bf/kBf+kBLeQBy+kKyPEAxOgBlfMBQcQ55zn77g5y6gNC7BOX6Qdq5xJa5wCl5BPe5D/xZeRCjeUGdTpvLOoGbTpy5SCR5QQEOnPmIILGDWjnWH8s5wZ15hQh7g6bUvAOm0/vERxpbmblJoztA+vkFe/pA2pjaG/sGJzkAoTJDe5dj+ddz/MQDcVm9xAF5xfk5T/2+BAF5UQG6ANpYewB6uYAqzrkGCPqA1TxAcXoAMTJKOcBw9Ep5gDeySfuA3XRLucA/80v6wMt1TDkFHbQMOcDIP8DC+8DC+UBVPQDEe4CjOgB4ewQx+cGS1dpdGg6ZSzlAV3rHUpF5V/m6QMS6UX16yS7yQvIEV0sTPQZuOQCkugT+ugsOeU6deQBAuZSLyhlPXQp5hb+5FCN/waK5QE3yRfxAmo27AX2Nu0gzOYR8elqEeQAwuVmOuwA388k/yD57RPtNOQT7WVbNeQU7eouS+YafynlQ5VpPVXJGOYLgucOCG89aT9Mcihp5l5/5inVc8ZF5UcJyEVz5TxdxUXFGOcLScdGaCxsPXPESHPMSG3mR1EyxDDmAPApLGPmAZdoPSEhbS5pc0JsYW5rfHwoYz1tLnZhbHVl5Q9OYmVyPjDFWXXpBuoscOYAljPzLyZw5QsVcOwbkeQ3OsRBZOQAhMYa5gD+6iGXO3U9RXJb5y8TZOYAuV3nCw9wxDfHbcoyLMwycMcy7xPx7wV/6CA85QVjYecFY27rBY/kWSfqBXBo6QVQY+sFem/sBXps5gV6df8Fbf8FbecCzmFib3b1VivtAr/EccQl/AVK9QKb6yRfLOcFSfAVIf8EI+cGr+kArOcBXOUBA+oqBucCXuYCQ+cEVGHwFmz3A9HPW/RKtfQDysZz/wOv/wEULOYdSW7wb4UhdPNhgelDZORdgeUDYOwwxehNouosznR9KOpK0OcBZuZBHeQVFuUDl+RsEukDb/8Cx/MCx2n5Asdv6ggX6wLH5QC16wLKxRDlAcroA+X/AtTlAtTlBBhI/G0n5m2M5QUL5G3Y6B0SKTtp5CKUaS5zdXA/dWUoxQnvEC5uxBTkNHllKTrHI2LTI2LGIyzlMvtpLuQdX+hRC0LmB5cpKTrFHeQAgc0Y5gV2LHPkFathxjrtbdnFZOkPACnkOHNPZSjkbmvkBOphLmlzT3Zlcj8o6W7C9hLWZmlyc3TEUecVlf4S1OtUf2tl5Bgb5gGXLusrAcwvaOYS2ykuyFbkLEfVDDFd8Fbb61QqKTr/AMbnOc7kBf3HGERhdGE6c+dWGS4xK2jpFmf9AOBo/wDgzy9z/wDgzgz6AODoSiPpFzLvVL/pAc7EEuYKTFwibeUffOUSVm/lQQ/kbAHHKP8B8/8B8+4Vh/cBE+t0WMwvcv9WgvsBr2zoAa8yK+hujCtyxhT/AKRy/wCkzy9s7hVy/wF0/AF07QoJ7AO/8gyr7gyGxUjHE/8lLP8ch+cGI+8Fl+0AjOwFmuZOkWEs5gDdOi9e6ACg5znH5B3K5CIF5k+M7QVmSPAFZvQAnVLpVwzqbhjxVyz7AVroVxDlBPApLHLlN3DsB55ocuVqLO4tDsUU9FOJ6weSdXLmE85vcmlnaW7kILH/UN3+C0wx5AtM6ghaxV4pLnVy6QxL5RRXdGluZ3MuaXNUcnVzdGVkKHvnDQPnCK/nAM11cmw6bn0p6TRXxxfsAbjEE+hQSGXkFq59OnLkOYdtYXRVbud25mVkQ21k6E7CxUPvLtP0ANXtKm3kPl7tAxVBbmNo5V8SxFDkRXflKnf/AgjEV1PyKoEgciBpbnN05FGab2YgZ2XkKPXlFGZn5RRd5msY5TuJ8hWT5wES5gCI8mc29AIV5QGS/wqxxyT/Agf6Agf1AgDkCZn/Af3qAKHlAfxhfepr0fwB1cZl6S5rbuQ8cWk9MDtpPORmXOUuZGnoZFhvPWFbaeRpJX7mQGHldU3GR+QMkGFzY2lpdOQBwOQGgOdjvOwwcuYFBuUCg8YR5AF/5AEfb33mSS/qJtXHHvMh7chu5SGV5yMY8ASq9wLsYcYwZWXkFrPwAe90beQ27Ght5AFB7gQKdG1sQMgb/1ea/1TO7ACkzHDzKPLEIOQAquYLp8YqxhDlKM7/A4TnA4TEJfUDhOktlXL/A3rHN+UDe8Yo5AOt5wsKUPF7wy9eWy0rXT8gKihcXGQrKFxcLlxcZCopP3zGCispJOcGFOlub+QBSWJlcjordCx1bmnlI85w5CZxxGBlPS8oxVApyFE/OtJTICooW2Etel17Mn0pLy5leGVj527pIfgxbuUHyup1DuhqTGluY2x1ZGVncmFwaGljc+gLMXI96QCk5QF+K+QMwCnmAK7kD6flNu8hQeQBTNdwxSvFcORmC2ncdeRuu+kE3O0IC88p8AKm0R/zBKfwVV7uBLlyYeZwRfYEwf9W2O0YS+gBMDDoAdPkCSh9LGnJGS45zhpz2DPlF2XlReRy5AMI6kCQ5DHH5gUm5QC35Ej55A6FLnNwbGnkMgnkPA/nQLDoSFTmQKvEP2M9bFttXcks5BgCxGMyPT096FKLxil1PWPkDEfmQhLoFYdj5UYuxRPoFZFh5HLlOmg9de0U+udd2DpuPVByKHXuXl/oXck6adMddG90YWzJInPNIvIVJewCamtleeYCaeQApf8CZ3195QV05xJv9ghy5AF+PT095EEXaD3GA3Ap6RuSL14uKlvEXlxcL10v5xuY5y8p5BASMCxoLmxhc3RJ6WDCxHjkSC3/Bsv1AtHlBtdw6wjT0iLsGHZhbHQ6aCzlAYQ6bizmAU46aSzrAVzkLJZyYzpwfTrkeLb5ByLRZ/8JAuQEMuUfFMZm5g+sMDvkEoTJe+kQ++Ril8Yuyx4sZSkt5AgL5xPuYS50b0ZpeGVkKDLoI0NuxVHlAN3MS27GS8UY5A5FxSxpPXvGVzpyK+gfe307bsUxacYsPeZfdeVgI8cY706K7kmCb+UJZFLkH4dy5GvCYWzkbTPoBLjpJnFy6SZdYSxv/wni+CCpZ2x5cOQS9uRWEfEJw+UDeOYAgOg8q+8BeuQBKeUgtfcBfW496AE1yyHkAYBhKesBdvIKPeQDb+U6Blwi5E396QFA0yvGVOUg+MknLPABveYBAmnuAcDyAPHoYivkNm3FSekeytAqc3LkE0HlAaHyCtznDtLtBkHHFMYNbc0O5T33yhzGDv8LB+gVuP8JHv8OiOgbCvEVb+Y+3+kERuQEcWPnGX7kOS5t5jjk5jFa5A4KxRBu5hWl5QeE5BORb3x8y0RyZeQD+k5vbsZN52HaVuVarFVuaXTmIopMYVRlWCdz5BT45AMUIOcEMXPmOrptdeUH7XMsIG7nReHLc8QvxR7mY2bEXuUxT+YJ8udI6/8AjP0AjHdvcmvnAIlpbuZGiMRa5RQSb99g32DFYGRvZeV3bOcA9OkA7vIbfecCP+wLgmRpbWVu5CysOucBFP92AuwKr0ds5ipdyEP/DjHtBYbMNe8QP+VdeeUEafFu3+Vn1fIw5GzGGMoRctARY8UR9AMd/wMJ/wMJ+ja9xXHtAWvqQhDoLefoNrbwMEPTezvkG2HEU+ZPzshL5Ba/7icpLFvsbU/lWD/NIeQHoec3ueREt2UpKTrbIs5M5wXNzy7lGEjlUunmbdzKHOsAqcRuLOVYQyxp0EFzdHLmbXzpMZbuVe/oahkr6GwA51NByCfvBxXPJm7pFZzpSmFp6wCq/xU6/xU652s452re+FJjbuYoCP8DG/YHauhqTPFqP+U+PuYC6eU6YOkBa8ZNYeREzvQCMlwiLTHlE4ktMC419Cc46Wii5ARe5wbb+gbSxyHpKA7xBtbqXxHtA7jmDA4k/zGt9kDI/xU36wOb7Q0B5gqD5Gjx5QwzTecBYuUF8egJlekAneRiDj/GDinlAS8kXCIs5Bd582Bh6gll6XfpaeULT8pobuo0We9gIucLGcQW6xFj6THb/0Ih5QCe5wTp5UlU/wFN/wFN+EIV6j9g5k0z6gFj6RB3RPAbgecNme4p+eQNSyDuKc066SGS5yHl5Q1wIOYyL88i5UE4xx/nMpXOIeYiAs4j2ynHL+gNv81ofe47X+QGRmhvafIX9Mwa8QGANP8SeNRe8xJ45wEa6hJ75ROh6BJ5LOYAx8YQ5BEG7ADdxhYz/xKf5gM6ROZAXSxh5BKpcv4SpOQ4+P8E0spSyEVTxVfpAjRG7gI0LOUdsOR4gsY/cyxoLOUVZnTxBuV0XeQdb8UmbeQdOWUsYfYdt2EpO2g9e+UFp20s5AkBOulgveQOYOwu5mJpZ09w5Ah+aW5nMSzcHjMt5Hmx5F765Vm75xFuY+QAiXLzAInlHh1hKTtz5wCJY/8AicxrMv0AiTQtY+gzTOZaRSYm51dydeQ059k4NStzLuQAi8c9yA7mBzlzLuQAnyvkLnTED2876Ryu/xvl7RvldfMHNewbtP0An/cdhuUApizmXbFM5EkYLegNc/YcGOYAytZNdNYzaNszaPEAgN5//gDjXX3kPDzoZ0rnAbdw5FYm5jLI/wF45VkQ8AF1cP8Bdf8Bdf8Bdf8Bdf8BdcRNdOsA9uUi2GjoGQ9050YY/wJ2/wJ2OmT/Cav/Afb/Afb/Afb/AWTrAfb4HpHmDLZvcC3mQC7lCj5sXcQyLFblKQjkBnHlT4Bp5DpGXSxV+SL3LGnkLN9v8iL0b+QMNW/lIuthxQhi5g/Lb+gituQAhuQLp+Ra2cUaxEDFFeZA5OVqpOYjU2zkLfjkBHj2MajlfOHlPAMmJiFj5TPdYWlucyhWcixu5Ud95F9DbMRpLMgp6AXUbD9cIuQkMDItUmVndWxh5h49xBIxyhIs5CgO5haK5x+AaeUBGOVJ2cRg5ENOxxjOGXx8KHXHC+t6ZsYR5EPgxi89PT115woFxhHoFQbGDuR4lOgBw+UAvSjGQSxt6im+6DTk6AHZ6T0S5ADhbGFyZ2UtxB3oWqPFDeQYyO8otnA9cy5pdGFsaeQ4rER0LnPkWRtjU3ZnKHUr5gEX5GDtxFQyxU3lWMJl5AZz/zbr/zbr8AQN/ngiZMcfbD8uMDjoeKTqAVblFpQiK3Usc+kjJOgNk+cBJCks6ADnPXDnKXnlNEXlUcnlAQlm5AibxhHnSTXkavhm6VgpZlswXesefUU/KHM9xBQpyHNbMF3lSHvkAXXqAb/sA4Jd5A3JdHJ5Q2/kSH5l5D6wcyhm5AFP5gS46BjwZ+QdluZbcecCSucY0+RbdGfnYmLEYHRoc3lt5wIcW3hdLG7nS0kp6wGg7wCCZ8RuxGV2PTDlaGfmBDIoc+wfWkXobvDqAq/GZcsYzhnkeTvlCRvuRE8mJih2PShz6AZ65yVPKS8yLftnIWLpApMpLGk/RnIoc+UJwGUsaCxiLHYpOih25Cwi5wv+6AJ45Fk2ZWxhdGnkKmUsyB50b3A9dup76Sl9LEf1BNjmFjXnBCnsIFPlNLDlfyPlA4DnfyJdKSzuBHXGH/RcwOUDiucDpuc2UuZaaOQCgOd+U9Bx7Et7xi3nNtjGI+RLB+U1RHjoAJjpP97qEUzOUuQAw+QBunUyMDYx6y4NxDDnEn7rRiQ/zz3kEWEpOmZlKMYK6jVPLFnnRKB1MjIwZukExnByb+hDdXUyMjEwyRljb88b5hAxxBtzdeg1IHUyMmPKM2JpZ3dlZGfoJPjEHco1YmlndmXMG+YEpMcbY+kTrMQbM80b5UDzxhthMM1ub2Rv6EIAxBzNbW9wbHXmFSzGHc1vb3RpbedUVcYeNMwedc87Nswdc3HlAJHtDhjlAjTuNprsAT7vAP3xASnRde8BE+8BB+Qa+Owy8s1q6gGc8gDp8QEY8AFF7ADhyFDpCGjoAZ7kAj3IDOQCMMkM5gKt6QIVyQzMGDLLDDPuAdfJDMow5QG2yQw0yww2/1Q3/xW48CdJIOQGQOgjVuUb+VlyW2HrRgnqScroJ1rpScr6SbQw5lAdYe8PdVXwJ1pH7y+U8gJPxDDEFv8oPf9F/fAWn/kA1TH9SonrJpb/ANnkANnlBORX6gR8MupJHO0CVzLkNtLHGM4Z6kkx5wbKyRrmO/3EGm/OGeoE4OcHFsgaM+oEQOgHGP8DymFyY3PrTzthcmNjb+oDQGFyY3RhzR505mP8yCzND8oM5HVRyAvLT2Nvc2XqOlFjb3PMJ+oDpmNvy1djb+cVfMUNc8s/zCXLJGRlyhhkaeoEL2V46gP3aOs7A2vrN3psyjts6gD3bG/KF+wAwewBOXNpbuoAg+sA2OwBP3RhyyTrAL7lMUv/A+/oJOvmJJ7qX1r6KzbqAv9l/wL/7QL/5QPUcv8C+/8D1OYBh+oB0Wdj6gXCaW7qSMls6wGfbWHmX6HFDOsBWVDqAZ5z5AW5/wEp/wEp/wEp/wT9/wEp/wEp9wEp6gPB7QQb7gQP7QQD7gP36gPrxQ/nBITJDOgCr+cEa8kM6wis5ARQyAzkBEL/AWP/AWPxBnnoXg3lSOhXcuQrFfMGef8CpfMGef8BfOsFoFj7EEIsb+Y9I/IzOGYo5FU0PXPnEEfECOcQR3PqEEdl5WNG5lk6KcRM7hBRzh/tWULsbudoPccb9l/I5xgV6CUa5iTl5Azz5AFGb2brYcTvKu3nRAXEFjplfTp0feRI73NlKOR2t+lP8uYPyORMgSnkDm3/Jr07Y+0NnyYmKGPlAJ49xgfqJaPmCTYy5CWeLeQl3M8ZN8QZKuQgIn3xHS7nDiHlKfLmDKHXIuZzO+gj/uQNoWnnDaHoEb4wLDApOmnrfn9f6XzI6AF95RgKxBQh5BEf5BH47kZs8EZ9/yym6Q/46GFk5SI752ggbzwwP+V2meR+4nRv5AG25Q9FLmFwcGx5KMxA5ADD7UWPcuQ1X8shW28rMV095GHTcmVzZXQt5iKhK8U35G4b0izPKuYA2eRnv2ld6UeWbsYP50d5bu8Tx+wZG+0E1uwC6e8yMM4c0hUq/wn5/wrt/yClz3/sChDrV0/zVLD1AKnkC0j8BKTvBJNY/jJm6n/26w9o9QOZ5Bqw5AT4PTA7bjzoBVE7bugCemk9cltu5UWk5FHu6QOe7CJq6g/r0CPoH4sp5xzOaeZeMOcqYuVbBMcL5GmUxwtzywvEY8oP5g/POuwqV+VbBeYDImnsNkflEtjKEukGKG/vAKLoRZ8/b+YEa8YH/wRr8wRrOmHqQ8ToHRDEE+YEZcUK5Dhv6EbXcvhynOQntOQAlCgpfSkuam9p5E4N5S0/PfFGUXMpXeUS5PVGg+QRP3LzRk7kAfd2YXJpYecH1uhUtOdPBdRL/xFb6kAT8xFg1EtoLGxdKTr3XVHGHuQfuXRl6gQE6lHB/yVe5R6cZW1pc2ltcGxl6DfgyV7vM8XpN3/wInTNKDDlFLz/MFLqMFLKN+8gf+Q1xOcjEfE29vdilf8ErP8Opcpw8QSb8A9a1F7rJL7nHZRDcmFtcGVk5h2b5QQ58lC6yHbrUL7kBvn/UJtlc3PqJNr/JFX/JFX9OOszKvcap2HWMOcknO8fxu85A+wBa10s5GI2/wIw+iSw9Uo65wN5M+QJ6fQsMudnludD3+ZKJesVIdBj5kYQ7SUR5DhA6iOFz19hY+R31sxdLGHvAttwaGFu5hxP7QLayRf/KDv/KDv/AurMf/QHhPERbtRh6wPy5QcmUMZTKCn/NGn/AefvB4H5OezkJqvGcuUFuPA1yPcBYMoY/wFh/wFh/wFh7QCB/wRL1l77KWXuAW7nJ5voPNg9MCznPNrFCugD8+kzNOQwhGE8yhnoCL5hKyspyhZbYegKhM1GxBfHXOk0nv8Eg/8Eg/U94/ko2OUqQP8CQegCQWXoATHnQSf/AkAsbtUi6SkNYeoD7275L9vpKJTRI+UBNs0i7wKxdvcCscoY/wKx/wKx/wKx7QCB/wKx1l7/K9P2ArrqBxDyK93/BkLnKovqK+j/Ahj/Ahj/Ahj/Ahj2AhjxKqvwAfVyYWlzZWJv8UcUyhj/PnrpRgNoxy7/AhL6AhL4RsrkDccx8AIs6wC47S/ceeg7XP8uYfAJLeQBiOYvpuwF8v0EWeUfxvAjjS1h/wRh5wRh/wIr/y0b8S0b5Q75ZHnnM8bkJsjkeFxp6BIk8izEdm9mZuZkUGHyLMBydeVUP+4CEcUU8wIN/jnM6QIfzwn3SCv1OcblOWBp8gIgLG/GFOVH3ccU8AIn5gDK7Sx25SGvbiYm5Gyr8QJt5jenaccO5zavb/8yKPkEg+oEKucBPuUSoegCa+g1XiznNfnqNi3kefrlAKg/xRnFC+REeeoG9OcgRmJvcmRlclLEOFfETj3oNx/kNf7LIlRvcMYg6DX5yyDkJlQ96CXgLHLnN4lhLOkH0G4raekH0i3EC21heOQQkeQjgz0xLjEyNSpuKvFZgnL/AuPqMxnpAQjzNzX3AQjkSb3kdalvciYmZS5nZeZyEygp5WhfbOVP5ORJ2fNXceYQnSk7b/QPZWJhY2vkDrXlbblp5FW19wVQ5HtA5iG60SPrN2bsOKr1VxbqA89v6wXFPj0wP/FW9clXXCIr7DfoOuQicNcrySXkInb4CA7ETi3JKtMr6gQry1DoLM9q6SejdGlu5gzNxA1zaXhwdOkD88US5i2gzBNmb290bm90Zc4o53dqxg7mEOrNIeUit8kOTM4OQVJHRckOaHXLG0jFDV3sHP7oFYfnBOlqcv8wSv8GzeQGzfFjLPFTSecE1uRZ6PMxV+lnbvEApOUEw+clRuUO5mpy6RZSYSkr5x6oaf8EpOQApulLyml65AZExE3IduUXDuYGVv9FDN1O7W+k+AjB6Fql6WWP8gi+xH7nAfzwF3XpAorwCNFzbWHlHW/tBr3HFf9Aiv8K0v8GqSxu5Bo55yqC5Aaz5QZi50Ac71Gsb+kNDeVXyeRXizA7aDxv73NSaOVCy1wi5ibPKHM9xiFbaF3mUXcpbuRYqOgsWVwiYuUp7nMpe+kAi+YU3X3kKtnnKFzEM8Qb5lJbbPQLiOgBQ+wHNsR45FF2xBvmJw06bsYOROQESv8Cef8OUek13iF0LstiJibIEMVk6UZG5ycTzCnuDn3pDnP/DnT8DnTLZcV+xWTzDtbJY+gXjNBj5BeVy2Nu6g7AxDb/E0D/Dr32Clz9DLf/Euz/CoH6N5zHdO8BmPo+hOkMku4BZdEx8Q638TdtceV/D+4D8MUU/wPv+xWs/AqH9AMxxW/yAzBpLOUFov8MjP8VuegVuTsw5R885gFB7ALy8BWoeOYBfec7B3dyYXDqEvzkAh7EcORt4/8V3uQV3m49YTvoNs1pZDznNqBpZOVAsNh4xWFpPWErbi805Woj7k7vK2krYSxzPWlyKG/kCeNo5B9JcGFu5B6JLuQLJ+UKqCxtPXMuYWR25Bn0xhFj5HdvxUktbDtjPtJW5VfhKGkrYy3IHC3HHCkvMuYAlXXKRMkkaS1s5BWd5iuyYWRkaW5n5DDxPW3nBmLFOXD/A6b/A6bvA6Ys5AGUcGVy5x3J5Q0n6lExXfYW1S3pAfErdSn4UpLVOudQEuYE0eUCkeYCdORnpuw1t/Bqc2bmApTFMixk5AGsZz0uNioocOgBO3DnAV8seP4BH/YPKWf/ASdm5xOKdvANVXJv5CYcXSxbeP8RouQN3ecECVt2LHDlBPbfMMkwxi7/BSTnCfTlcRM95wEq6ReS9BtL5gC75QU86GTn5FTV5GXr0i3nBFbILeUbYeUCjiRyPXvoOR7pMn3mIdXmA6LoOR3oAdLuOR3uAejtKBD3PLnvZFfGFcRwzhLHZtQUzBr/O7H/C2f/C2f/C2fESiEw5AqU5DzY5y6cLOghuy018Qt/7jy56AuA5Ty5b/8Lc+sAsiRyW+QywHlsZV3lc17sA3dyKewf4utLduoLjOQCJP8CjN9nxGcsbusLlmHkEGX7C5Zu5AEi6QJmW+VmKOkaTF3mAm3JFucwPl3oAnhb5TON0hnKH+Ys6cgffekAt+tBD/xmt2/lPBHRJe8CqG/lPClp5AM36x6Y6XYc/wG193Ui5CXq6RGGP+YmsuUHmcRfP3Iu5iIN5F9h6z4F8226ci7yImQpP1Vy5VoR8SKozGLSON9uxW7mAJgpP1jJYugcI8pc8XMrcuUA7yk/ReZi2+9VfMk55gupdWLFEedVAEjHaMQFfeY9EeU8N+gBO8YT5QiM5yd351UZc+QR9HVwLGjFCGIsbOQGh+UIK23wCHMsdT0wLHA9MCxk5FID8QC+b8Vz5zpmZu8DEOkBMeU9NDthxGZzLGbEaGTlNyrob7ItZs51xDJEcm9wKmb/bIVy5WiO503BZ9l/5D0qO27Ef2jlNQPFf3A96FgxZ9F+YsV+Z99+xH7oOLTsAhE/beQAweRs8MUbLmPmCmbGFzM6xQcy5QGYeCx28Sb9LGI9LjUvbehx0y/oNMIseeZg0+Q2uuYA8WvnAdDkOI/nAyTGEep8OsQN5jiy7jjLyiv3NdnLHik7KGzvNiBr5DlieT0tbOc1q+lKouQjzCYmbil7dT3pPoh1LGksYelZnDUqbeoLP3DKJnAs5AEYYucKR1M9NCrkPjnyCzHkAQB1LcdQLSjoRcYtcCk8Uyl7cD1T5HDBxx8pK8gfxVVNPS44yn7MKDtN5UwhdSs9TSxwLT1N5jclej32RZjnFuBw5zu95RYbOmLsO8t59yFNxzotdc47fV07/wng+zlSeulwvuU41eQBBPABVTEs6QEn7AEC5gFrQfgA5uwA0P8AsP8KkPI+R0HqcXPkEJRh82CI5gZFIG11c3QgaGF2ZSBlaXRoZXLkSpEgb8QHYuVTQP8CaecCaf8Ar/YLP/RAbO4Bz+8BFuUA1eQBVFQ9bWUobOQYlcQbXCLlFzXmCwL1C09U5D2R8R8R6AdH5guI/wsu6i1j5BKZbuUtXfVgMTtuJiYh5QZNcOU5weYGTeU0o+QJt8kSKSwhxkHkALzkBF/lSBDrBF/wB0HOIHx85wCA7yb/5C2v5g6/LG897Vut5SlN5QaRJibnbcvFH+VhGynlEMZ1cNAbcMUbYSlp5UdY8lwQ6zluc3ViKccJcOYBLeQHCMR9O2k9c+sFRXPnAOFz6Qhq9AXlyGTHc8dB7whSykv8CFPMWHx8yHcp0GPlAhNi5TGT6nSu5AfE5wDEaOsAxGjHeWjxCS7ObWj1CSTIeeRU6fUA2Mpf0j/kVEDHdnx803XNX+YA1OwA0WzqANFs6wDRbMdybP8A0Wz4ANHnAUXHVO8A0Mpe0j7kQE3/ANDJXuYDtultLPEk0ORGhe8pxeZo+v8pwegEMeY99OYwneh0cOZADOZJP2FtaWx5Xf8EKPkUeuo88Mtg6UwWYuQ0I+UIG8ZnxklhPXflL8spO+Z9nC3mCBLFKmHzFG3uK2nnQ7VcInDkAKLNXz/RO3NlcGHlAbfsJ3TmC8hu5wR/xjvkAePnajnLFudSAfkoIuk9oek84ucQDVpyPXttaeQHhucA2yxtbjrqLCMs5S2AyxF97A0M5Tlp5RD7/wHi6QYTT3JkxBfnQe3FPP8B0fkB0eU+LfAB0eggzucBuOQF3+gA2ekRWiE9PVpyW+YMe13/AcbqIODrAPfqMxb/APfzAPfJPP8A9+gG8PMA4Sxu7ADf6AGZ6ibP7H5exTT0EkvGI+Uj/jovWzAtOV3oXNHFbinUNOQUE8Ux5ynqcmnnBGLGNNQz5QN2xDPTHOUBweQ8N27/AZLvAZJu5gGS5QK/S+c7K+Qd6+UR1uUEqMkM5xJG5RIgyh/MD30sSsVDIFwiOnt9xzDJDX7ECeUy9OQSGsxayCvoMK7JPMciyRjWPu0DR8Qs5hIm+gJQaWYoSnLkeMNPd25QcuQF5HR56AGs6AMlSuQRwMQS5zOoxHblDP/nRe/vAhfGN+kmwPQCpOosIO1nonLkLA73FQvoUQtyXSxb+gXX5gnyaWYoS/kA1d9gS+kA7eg1uOxPfidVbmtub3duIOQBYyBvZiDFNyBcIicrxjYrJ1wiJ/8DhOQLvvsBdf8Avvgr9OkiQ/8AsPUAsNpX6APR9C5JeGHkeafqFgJR6xKe5gIGdPQFYnTlG6ntG534KB81MCXlG43tAth0YeUU+v8E5vUF3XRhYuZ62dQc5S7LUXIoKSzUHuUAtexlY10pLN8txC10YeQRPl3FAvkm9+oA8TEw5gDy6QSKdGHoBIrnNLJ2b2lkIDDrFu7kNXrnBj7EC8sac+Y/gsgLyxrkZB3HGsQLyxroBfjLUn0sZe0AhWLKV8QLyz1t5kAmyAt9LHLNOWnKdsQLyznkCgDHGsQLfSxhYfcU6eQSd+oU6XRhW3JdP+YrP+QCm+QWr0blCLooxRspOmXTIlflDuIoxRspOs4cU2hhcGUocscb7RiH5wML7RiExxTKDfMBg8sP9wFtyxPzAVLLD/MBN/9caMQnxCXsevb/GNn7Kw3/OMf0ZpfrOL/lZqL/LTPFcmFhxQ7mUv7pI/rkDwb/GynoAO7zSjfkCXH/BZnNfchr6gPz8TFM5Q2R9DWHyxn/Lp3/ZxHrAVvMbfNUmOYBZ/JsQv8f1fY1ecls/zV6/zV6/1Eq5xI06B5B/1Ex/zVt/zWd/yKN8QJJ7QHC/yKb/w4h/zWH/zWH/zWHxWPvbcj/NYjEM+YZZcg4+jWN5G9F8TF5xRT/HS/+JqPuWNHIVSBlbmRlZCBiecQJ5Ait5AGA5RdGZWHFEOVY92luZyBk5HSkaXTkAL39ZG3qPLpuYSh05ALsW+V5j/UY9OQEPOQ4iuY/OOk8vus/OHL/a97ra95h60516VCUbyxcIuQDCHdy5AC861E95wq/buZQousEzOQGMF0p/yAgxitcIl3kTWJjYXTkVurtP5PkE+/2BRJu/wLW7QLW6QK+5QFN9zIj6Aow/AJ+8Dw5bW9ub+gKv+UCg+ZlxOwIA+s7lOUojek9PCAvZ+QU5nRh5lwkdTI0MuhMueYKn30saWE9WnQsb+YAr1JlZ0V4cChcIl4o5AG6xAHkax5BLVpAXSspWyBcXHJcXG5cXHRdKiTlLFPPN1tcXHUwMzAwLcUINmZdK8UnaORd5ijMPyspfChbIS3FYcQFXcQyMjAyN8YHYcQPZDdmZlxcdWY5xlBmZmZmXdFhKnzEE2Q4xhNkYsckZGPHEdc16ADe5QOvXFxcKihbXl0pLio/xA0zzR8oW14q5gEEySE0ySHtE/jESMka6gE47QE3yiBe7AC45ACn5F0ibOsB1yl7yAsg5ESL5VzraeRCk3B1dD3nCunFEuhjmc0V5XpMUmVnZXjNF2NhdGNvZGXOLMZTdM9OZdFJ6wHsaGEsXCLkQw/PV3tcIiVcIjoxNOZqIOVGW+hDJugC82XEZEPGMu8Kyc1NW3RdPWV9LORSsHjyDTzqALosZcYN6gCq6mo55A+F5BVd6H9I7A4k5AfNRU9G5AXDZXcgYSjEReREd+do+3LRVutuH+QdOuQfO+QUBOUkRCE9PfBuMlVu5l9mZWQgY+ge5OduOltl5Wthx3tuKMQR7wCGKzHoabDkQhoyXeQQVSDmEFYxNOQA0u0BK2ld6hiC6kS15AJ2IvABx+oBHegEhS3kQcRzP8V71SnpAT/uAiPzZgrka4dlbnRBdEXlMZBcIiUgxxMgaGFzIG5vIHRlcm1pbmHEQeQBKuQGxzsg5WYtIHdvdWxkIGZhaWwgYmVjYXVz5Q+Wx0DEMHRoZegG/+QFJ+VmoSAoZS5nLiAkKeVmqvoAw3MrMeYAvmxleCjmG1ZoPWnkESxjaChv6i7S5Cw2aT1o5SKI5gGdae4BmtljKSl9LHR9KORxcfwDxuYDeuQBwiYmKHQ9e30pLMkT5B9YZcUTxWZjdXLkGuvtA61idWlsdGlu7gPC5AitZlN0YWNrzRfIQOcAtck75wPryzZb5kLj9wOwYmVnaW5H5C8N7ADZz0Tnc7N9KeQDs2VuZNEwaWYo5QD3zzfnA5nwAzxiYWzkICBkIOUJYOURmmRl5GWExU86IGF0dGVtcHQgdG8gcG9wIGdsb2JhbMotOyBwbGXkYV/mAqQgxHYgYXMgYSBideVHx+sERuwAxG9wKOp00eQJYSB0KXTwEnHlWhHqAchbZV0/ZGVsZXRlxWfoAXdbZV3mApDKEMUs5QEhaGFz9QfCyzDQdnQpfHztAcjSIcRaZ2V031rTWj/MH1t05wC5yGlbdOQMGOQD+Mta5gquaWbqAQnkHfVyPeRJg+1Jm+Qvx/YB9eUvzOwBOsoiW2FdW3RdO9Y45SFd0DHWKy0xxEg96CAd5Qk88AH22jvlHtxu8gEv5C1NxFfvATYpfc8R5AbA5QQTY2E9e30sdWE9Y2HqSshw5g9Ne2NhxitwYecL8UDlLJ5vZnR35A0h8gHNe+UEf3M6dOQK1XN1bWXkDGUoMinkLu7qTfF9KSzKUnNlY29uZN9T1FPkeljWU2lmbmV4dOQG289S6ARKzEoz5C7c5BEidHVyZSjpBW7kBnrkD5npSDjEDcQQ5Asr5iat5Bjm6ACe5nrn6QCPOsoYMvsAp+QLAekSG+sAtyAqe+8BbnsjMX195AjWyT/kC9hPcuQLxf8A5eYBL+cA2PIaD+oAqu0BpOsAwu8BaeZgaWE9ezA6MCwxOjEsMjoyLDM6Myw0OjQsNTo1LDY6Niw3OjcsODo4LDk6OSxhOjEwLEHEBWI6MTEsQsQFYzoxMixDxAVkOjEzLETEBWU6MTQsRcQFZjoxNSxGOjE1fTvpAPD4Ac/lAb5wb3DlK8Ao5Azg6hjkJ+goWOQXhmU9OM8s6SEz5BdPzCkxNtgqXCJgzFTpXznFFSjONSnFJOQqXmHHMC7kAMVDb2RlQXQoMcZV5jVt5QnuylfyD2rEOWAgbWlzc+QIb2FyZ+VJNeQGL9RcMOclJ2U9MeU0fOYYv+YKGyhhPWRh5Btf5BkuKXx8YT7xCiDodXjkIJ3kcghl5W8naWdp5W/9xjvre107xFkh5HJzZGFb6gNKx2ImJm48ZTspYSo9ZSxhKz1uLOwBI+cPI+cDAeQAwnvnb5d9XCLnAmtm+BZV7ALhMeQEY+UKg+Vwe/UHu8RkZ2RlZidzIOUDWekBR+Yle2JlIGEgbWFjcm/lB63qEbzkM6zmGrHkNZfkAPfWfu5SkFwiI+YB08g+O+UBheQAoNZAKfQAtifoAYzpAKzmP5YgxizlGhTIdOYaFuU2+y9eWzEtOV3oepjpAITueczZXcVWyDTKV24rK+ROlnNlSeQz/8lU5GIVzlhB31AiIG91dOQLLeU+UCfmXZ3xARHoEUDkET9jcm/lC98oYSzoBJly6QSWbuUx3OQD9+sEMOQB6vUGUSBm5Abe5Eue6wVO3y0xzS3mCdP/BXfxApboYN/3A23neCggYWZ05AEyy2foDfblBo/lAkrpBHflALfkAmXoDj/oANztHFDSZeV7tuV5StNv5wN4Z+4DeOw2x/kA5Ogw/fMDem5ld8d+/wOA7wOAbj1h6QOA5EDLaXNEZWZpbmVkKG7lApVpJibxfRPOcOQEU+Q+bn3oC5vlDbJvIHJlZMVK5XTSK1wiOyDkDdnEPHJlyj7nO2YhxGhy02jMLMpqd2hlbukBbscW5XRq5XVDeWV0IGV4aXN0ynPOceYPMuUFvOQEVij1AXXoBDHkBGxb53Yb6AOU61X+5TwU5CZsZXhwYW5kTmV4dOgG1lwiXeUkOWzFNcRI5QaJyRI7KWgrxwvXQuQBGuQqlOQOrC9eXFxzKuUiPyvECiQv+H475wQXb2bpAgNzOuQBJmjkY9HpBGJo5kSK/wQY5wQYbukEGGHpBBhzffEEFuwBZ/QD72fmA+/wBB/uAhHaOTDwBCtwcm92aWRl3zvHO850YuhQ8lwie+0J+mXKGe4KE2xxxRVgzRVyxhUnzRVhYekKd3IgYc0bQUHLG0HNG+QCCGNvcHnnK+zHJuQXyUDmFo/lCrbFJmlyY2xlZHtjfX3FFOUIv+QV3DnuALLSTuoK18pNyCXGTMQT0xzOWcQccmVnaXN0ZXLlPGP/AKxlZMUQ6kJZIFLwALtlzGJ1MjHpWv7mYGRzY3J7Qs8j5FrxzyNF0CPoYbPKI0bPIzDoW3PKI0jPI+liTcojSdAj6GIQyiNMzyMz6GJXyiNN0EbyAIxSzyPpXArGI2ZyYWt7Q88kMO4BPMUk8ADUMjjSJFrMJFxcQmJi6iXYQmJie2vMIHhiN8kdY2RvdOVpIMk88Xj1xBHpAhVybfINcvF5FsQR3TLmeHPLMsQR3TJu5TnUJ/QCrMVyZcsMxF3kCzdub3TrAqxcIjMzOH0nzFRl5gQD31XEfD3HScwX5wMBdTIyNjDwAK7qOZzFZckbxS3XHMVp61+F+ACTxQ1pbn3tAaAvxQ7kfawxbXV9/QCuMDntAK7FEsl15wCDzB416gJw+ACTPcQN5B6xey0xZW3lAJroTDx7MC40ZW19eyTEFetGoORGm3Jvd24k/gCtNTjwAK016gCt8ACPc+QSDMhE5UcrXFxc5WcWfXv+AcLTZ+oGCt9nxmd2Zd9lxFPRZeoENt1l7gE45BEe32wyNWLRbPoF7vUA0cVYbXtkZWZ9320yNWTRbeoDAd9tzW1t32vEWdFr6iRj32tueT/fXzI1Zs9fN+loX1xccGVy7AUr5CDy7gWv5S5yeyHFD+QDDi0wLjhtdSHOUjLrBeRub3Ruac0eMzHKHnVsY29y5VFfzSHqAch1ctUh60nH1kLrZA3SQnhh6gNh6wiHyyDKYPAITspmZmXpadTbJ1xcdmRv5HKP6wFFb3LmCHN2YXLGHedPGHswcHR9ezE1cO4I03UyMutrBsdPzGFhckdhbW3qA87EZGnmCSnFGcxNxS9EZWx01S/FGdEvVGhl1i/FGdEvTGFtYmTVMMYa0TFY5C4C0S1YadEpUNUpUNIpU2ln9gEQxRnRL1Vwc2lsb+oGmMsxxxvRM1Bo9gCMaPMAtnPWK3PSK09tZWf1ALjFGc4v5XN85k6jxhHlGxJ7c3ViYeRiCn17Y30jMcQYZW5kyhbNQ+RO+uoA9ugulugHZzJtdegAhuUyunvpB5Dme3DmBGXlBAYzbXXnBHTKD8QCOsYzxE42bXXNfGJveOsLnmbkB0jlB0HsP33kCSUk7gCzaWbqA3VET1RTQsQJO8QFTG9uZ2xlZnTlA85hcnJvd8YbzT5t5Dx/6gOO0kLfPmxpZWRi6k6g0kDkAILNP+Y9BOUrVyzpa0bkA8TtBSTNGuYHMyvTFD3TFDzTFD7TFC3TFCrTFDrTFOoA7NYc6G+51R3ob8fYHedv1dgf52/j2B/lb/HZHecsqNId+wCw5XAN2FLocBvZIP4AruZwN9ge53BF1R9B5BBE1Rps7gK31iXvAtzaSuoCwdpJ3yTJSN9x9QO01iltYXBzdORj79hv3SFob29r32PFDuQMrdd/dGjlOBvZHnLkRFHVHnJlbGLneYTSHVLcHXj/ALRcXHj/AYrlA7VJzRzqBozseZfOGuZsFdY13BvdHNsdxQ/ZH+QAxFjNHHjtE9nnCWDyF5LKH+QeYOQYaeYUxkHkFvlG7Bqs6TCh5CFdeGE/ZT145DBRx3PlBaDlGeLnevAwLDQpP8xg5HGexTxq5TTp5ERF6Xc9W+c6VuQ/KuQCJV0sxiVbcl0u5RPP5B+6z00pLGXnF4t25QY6KVwi5Gyg5RW1xgnELXJicuUIAMoSfdEf5AVZyhJh5ANvzRJjZWnkArnKEWZsb+Q6fcsS5xR0yxJtb3XkCHtozkvmC0bKEWJpZ81JYmlnzhFCzyFCyiEkxhY7yB8uyAnkBqEhMO8B/vYgPyDvHJHkAaB2Yed8lWzoC3nqB5XGEyLtGhznB6j0Ge7NXOkkmMZl5BdQLOUXTmXfcM5w5BKs8ALM/wDNxDdAxjjNXscUzV/uBBzHIc8g6jMP1iDqA5jlDgbWJepxdOwA+Msl5wSYxyXketjlUZXNIELfIFjbIHTpOCDGEO8WXOQKpiMxIzPnCrXkCqAjMSMy5hHX0U3mAnfLVyt75QriLjE2NjfkEg3Nemhpbs587gD6PskYxXd7NG11zkE60m7EJHsuMuRxX89ubWVkzm06zR870kw1xkw3N/QAumPoOrDHNu4LACHQTi37AQhuZWfyAQsh0CPxAMDJWvoA9MZa8ACryTnpAOHQOGXvAI3kAgUuNWVtINAma2nrddPEDsQm9gIbcXVh6xJ1xCwx2SvSLDLYLOY5MsYM6CQtxhdAbOQwi2FsyA/lRHnQPMgWx0LLN3so5A1UKe8B+ctX7gR85URL5xtrZ2XlTlnkA+JmQOUAofAb5OdJ4OYc1sYi6SR8xBPlH5jJQOYSs+QZ0uYXC+0bAW3re53wDnLoFgPYDuUCAc0OyEZiaW7FGXJt5Cun9Q7P313UXewBS3DrALjrPl/TaeQCfjE4yU7ED98OfSgjMeQsUstu7AEncG9k5hc57ADexDs2bXUjMe8EN/8Ap/0ApzEy3w/HD+sAiCzFBSMx7wC++hYcQGJpbuQUvCMx6xTM5BgG5ADK5wO8MC41cHjkAjzJImJm8hlXxQHIZ+ct3c0hVGXqBknnGZzwAJJUyHMt5wTrxBDpF/8tLjVleH3kG9/KJjI1ZW1YfXtUZVjlAI/lCctiYT1GW1wiTWFpbuo0S11bXCJUXCLuJcNdWzFdLS43KtYvQdQv6FZn6QDX5S6//wDZe0zqALMzNu8A11wiK2LlJY/sF6DkEZYgQewA6ucFG+QA6nvFdO8BgEv/AIjlAIhLy1HwAV//AIj0AIjFdO8AiGjuBf3rBVZAxhvMDM06yRTsBbsg5hNc8gW7yU7IL+oV2sQF30HkDX1yZGluYXJ56hOd7gfUduQ4Csod6QMe6xwgb+UcHs1J7gENZGJsyEL/HHHNcNBr5gF7OecFYsop6wOTb+Yc9eYcnzIyMzd97RyhxS9lceQcpv8Aif8AieQyMi7kBHvsGP7PfTU0zn3kY+3ffclj6QEy33vXezM3yg4zZPUBBP8Ahv8BA+wAiMwcLewcfe0AlTNhygzkdOf1ARz/AJX/ARv/AJP/ASjyAJVlcXH/ArfrHa38AIv/AqvFfTU1zn1F333ffcp96AEw2HszZMoM8gMyZf8Ahsx5xwwt7QF//wEQ+gGbOfABEP8Aif8Aif8BHPgAhzEy/AEexT1hcHBy5WvT/wCZ/wNQ7QCZxlT/A0zFDDIyNDjzA0z/AJX/A1D/AJP/A0z0AJXFY3Np5A/v/wCS/wEn7QCUc2nkHuH/ASTlAJ1j8wEk/wCP/wEh/wCN/QEe7gCPdcUf6AdeyW/qB0LEIeoeROkDk8wgNTTJIOoG5c0hNctB00JhN8pC6gaqySHkCSJ0aeQS+vIIF8slxRLuCC7zANDHKGVxdWFs6hse8wC4zFHPLvUApMYk7gCA8wDuzSnOLuoFd8suxRJtaW7kGWvuAK3SJ9Ms6QbdyyzFIs578gHYzCfOLOkFDtV/6QP98wQR1THmAwrLLsURyytzaW36CgTELf8DHOsF8tVY313eXekFxs1b5gDx2lnGIN9c+QC5y17fY99j+AC/5yLK9w6x5BgkxAdp/SaYY+8MlWxp5lNLx1XpHk/sP8Qqe2zmAXIsc3Vw0T9pbvMfENY/aW5mzj9ndmVydOcLAfYA1kDJI+QA1+Qn2+8rxmzfQ1xcQMkjyEM4zkNuZ90/xR/HOzfvEMfEHHNs6EKW2T/FI9hDbN5+xB/IOzDSO99+ySPYQ3Nob3J0bWn6JrlAySPHQzI01EPkVDVsbOVg1d1IyCjITTbQTXVic2V0/gETySTHRTjwAdHkWdTfRcokyEXvAll2YXLGaPwqw0DMJshJ8iPfySPfSsknxkthY2LTS+QAt/8AlMomxkkyONtJ30rJJ8ZLYWNjzktsbOUcBeVxWNZHxAvkVj575UTW5yOh5ATsW+0JHWXmFRvpBK03ZTbwLQXmHHDfa+YoIl3PbF3LbMYiz203zW3Ff8ln6wDkzSLqCaPrAJvJIlxcbOdcD/8BGcUN6wYJ/wEdxHw5ODPwAR3fbPkBGsQP7A8R8wEeOTg0zW7EEuovsOgA5s0f6go76ACZyR9cXGRhcuoSn2Rvd27nIELMI0HLI0TVI0TMRtYjbGHlVM7KDeQefcsg5B6QySDoHp3LIHXMY3Vw0mF17ACnVdMhVcxC1CFOyR7kAX1iYntO7gHYUtAg7TD0XFxa0CDvMKhhbOU4X8kNcGjRH3N56gns0iJBbHBo7igTcm17Qc5lQvApoHJt7jKRXFxidet1D8QN7wMsQ+8o0HJte1jOQmNsdWLrC2/EDnXkUN/MI251bcoj5wER7TIB5ArObXBsZeoLDNYmRGFnZ+sVRGRkxxDLI2RpYW1vbmTKcMgR8ACW5Df46iezxQ7ldojLI0XzKgFybe4zslxcRfIBZu0yulxc5TfaymvEDu4fHWjsApDwJPrMKOwC2eRin9coSMxQ2yhoZWFy6yyGxg/wASlpbWHrdupJ7gxxaW5m6zG6aW5m5AFUyyBJb/IBHu00iVxcaXPNQs0cS2FwcNFAS85AbPABPfMEcvABONIjTMxG1iNscv8Bp8op/wGoyXXNUtspTXXwAQXtNYhcXG5hdPQDZu8Et07RR88hT21pY3LyAvJPzibkKM3lW+/HD+4CE+0A1PcA0O0BIeVkRdIkUsxI1yRyZetVeFLvBkdl7BCI9gWoUt8kxSRo6hFP5wEQUM4ic+Upv8cj5CL7zh5l5F/fxx5TzhtwYWTrLHjGD/ADgOZsUMkM8ASlc3Vi628RxSDvEMRzdXDMIuYLYs0iVGHxAhlU7gDjdOQv1OwGk3ZhcsUUzSZ3ZWnlMivHJHfuN2Fa8waQ8AcYcmdt6wQO9w67YXJnxBUsbeQ2DdA/5Bs43z/IP2F4zj9w5A8U0T3mCezlCXzMSHvELn3lEBrmYyLNS2Js5FOKx0vmOphsb3J7IyM2NDk1ZWR95R6yzDFv5Ajp1jNmZmE1MDDSM3Bpbuov584xMDBhZtIx7Dr5zDBkZjAwM9Nh5Fht6yIwyzIyOGFlN2LUMmHqB1TKMcQX0i1wdXJw73HzyGA5ZDM4YvMBJuQBV+o8j8wyY2NmYWbzAPTEMuomM8wyODBmNtgyQ9UyNjNkOWVh1jJE1TIxMWFjY/cAyOp+S8wyMGM3Zjk50jJ0ZWFs9gD6OTRmZmY11jL2APoyNmVkZNcy9gD6MDFkMWMx1jL2APowMWE5Oddk9gD6MjA4MTf4Aob2APtiNmZmYtgz9wH2YWYyOPMAysUz9gD9NzRjZvkAmfcB+GZhYjU01zP3AflkOTIz8wKPZ29sZPYA/mZmZDBh8wIrxDL2AP1mZmJiN/QA/W9sZPYA/GZmOWMz12T2APtlMDdkMfQBLm9sZPYA+mE3NWEw8wIrcmX4APljYTn0APlyZfkA+Dg0ODLVMfcA9zk2ODXzA7hyZfgA9jg0ZPQBKHJl9wD1YmMyNjHzAJNtYXJvb/cC72ZmYmRl8wFbxjT4APs5MmM22DT2AP5lZDVmYdk09gEBY2EzMzdj2DT2AQQ5ZTAzNGXSNOYGGfYBBGRk5Fdu2DT2AQRjNmI5ZvMAnMY09gEEYWE422j2AQQ3ODU0YfMHFsY09gEENTQzYjc40jRtaW509wIGNWY5Zdcy9gEAZWRmMmTzAMzEMvcCAjBlNWPzATLkB8n3AJY2ZjdmN9Yy9wKaMGYxZvMDAsQy9wCWM2U1ZfMCmMQy9gGSZDZkOGTzB7LEMvcDmGFiZWP3AJbkV4HSMjg4OGQ5M9YyR9UyNjI2NTb0BVVyYXlI1TIzYjNlNPUGg2F56i8xzDIyMTI0MvMBwmthQvgKmzMxNDQ18wDJa2FH+QoJNzFCMzDpAfflKNF56WQt5ybG5jGjXsYJX+ox2egLN8oSbm/LFH0sd/tWnuZegPhaVOUz0uR7kENvde9WlmxleGVyzRLmLMrNE+U7Q84l5FoD9VrM51azz3PHJmZlZWTkXrPMaeQtGW1hKHVhLGXHE8ggxGRy7ACC/lbtxF3tVUHrAOHEZWzkSEjtAK3lVXdzd2l0Y2hN7lrUxz3lAIN0xCb7V0rnLfvKIij5V0rMMMggxi7mMrjMLOcA2OlXeuUBA+lK08UT5Fe55kpq6gDrxAbkX/HKNOZVJsw/LTHlVhfoUGjTdsUz6DNMy0zENOYAscl88gE2xyrkWFbmVtrJLO5XO+UBzDso51wGxTYpxSwuYXBwbHkoZSzGP+dK4lPkKjPLQuZLxTvmUDjlW2Tkb+TsALnmS+zlLbfmVpHsAMTLWuRLDspY60weZeRhW3I9MDtyPHQ7KyvoA2XtAJEo6FEIxRvrUxTlAJZ75kx570x2bsRYaT0xOzAhPT1pO+lcA9JCbuYBSHPkS6rGTHPGTCsraetTdn3MGy0tzBvoUzzHHe4wjkXmW5XlXY/kNS7mTmDqU0DkcZhu5gExLG4ucmV2ZXJz5AISZVtyXT1u6Xe4ymbnAOrbZuZdXOROZNBtKTvFV1thXX3oTMTlXkfmOJFPbmPtAyDrWgjrVN/kBBzkAILkOMrEG19nZXRF6ASMKOZ9GeZT6elQFPADSyks5VBC8wTHKyv0BN0+7QRU5HiBxXFk7wEFVG9vIG1hbnnkAQHGPnM6IOUWMWl0ZSBsb2/leM5uZWVk5E99aW5jcuVbB8lPIMdi61N55lzO5XsKci7nTdYp6gJk7AKsxBvLJSxp5E81YS5zbGljZeRVi+gEGTtpPj0wOy0taegClGHkZB/lAePmU7DnAkfoXBVp8U7DY+UYvHRlIOVizGhv5GOBIGF06l4A5AH15GLv5GbW5wMmxlsoxG4tLWld5wO5YS5zcOUAoGkrMSzrVhDwU7/nAJPvAIpOb3QgYSD1U8HGeuVP/zsoaD1hKcdp5wR4aCxbaSwy6mR5WyvGYi0x5GS26QKc7gI45WR6YeoCr+s7QPgFYOoC2OgFZOgEucpH6VBN9AT46wMDzEzlAr7sfalu5wUj6wiG5XUP5QE37ACS6wUg8wUx73ub6gClTeQB1O0FQegDQOs1F+hxe+cFVPEGleVWOu8DjOdhZSntAI7GLz5yO+cFjuwA++wA9eR5rsRLxlXrAMrpZnpl5QYF6wDEQXPkOQTyBqXsAWTFKeRiTshFP+QIuHAo9TqP5AFifSkuam9p5GK15Ham5QTS7QSW2G/tATzqBLhl6AGyZedU+FwiyEHkA0bkCRRvZuQAluUA+Ck6ZcQ75Wl95QQ9ySLpVLDlU0ct5lgZ6mKDI+Q2u+oETHLqZp0jIy9n5AqiIik7xTZuzjYrKGHkYwM7KSsrYelZBWnoCYLoCdDoCYLke/xdLHM9aeYIuDvqU2PmA3Q7Ked753MpyybnAQJv6waS6FLfb+lS32HpA6rlAqvpVRn5X2XnAXFoYXPlX7NpYfRfyeY+mNYa5ACx1Bp500rnXmBr5wwf5GbpMeR1A8RE5zye5GRnxG3HD2FjdXRl6HVNxDAwzzBgzjBncmF2zTA4yTDlLD5cIifML2TlGarKLuRoccxefs5e52oVyjA0zzA9zjDlQcLKLjbPLuQZcswu5AHZzDBjzzB2zjBjaGXkP+XKMDLPMF7OMGhh7QDsN88uLs4u7wEaYc8u5AZQyy7EC+YDbMoz5ED8zDNI5HbXLFPnAf14ZeQB+1wiYcYt6FLzeGXkAeLJF+hQMXhl5AFryRfoT5d1MDFk5nLEyRnoAZjHN+ZqQ8ce6CMcdTAxxHHKGcgwxBnNMugkbHUxZWHNaTbuALd1MWVizVLHIOgAwMQgNdMg6wCS5UGSySDoSAV4ZeQB1skX6E2S5ACQzVAy8QCQYeQB4dAg6wCQYeQBoNAg6gCQMjLNQOglU3UwMe4BueRrBu0Bcu0Al+gb7nUwMWbNcO8B93UxZecBeWLRcMQMOlwiY88yMDEw5kb5xxnoATLEGTnMGekBNDDlVTfKGcxk5gHdZM9LMWXHMscZyDJ4ZcZiZe4AlHhl5ARvyRfqAr3GRccX6QK9MWVi5gDCxxnrAg0x5gENxxnpAp8xZTHmAQ3JGfABRjHmAX/OIOkB9jAxziDpAt8w5VXGyhnqAn/kA/nJF+sCf+d2PMkZ8ACJY+YCJs4g6wJ/Y+0AifECfzHuAOnpAasxZeRPwzpcIuRtb8wZMDFmxlJn8QCLMuYAi8cZ6wPsx0vHGesBDeQoQsoZ6wJa5FCCyhnrAlrOZOsAr+cDR2jvAfwwMsd9xxnLZDLmAMjHGclkMWXnbxDHGchk5U0u5H+g8AKM5AY/yRfqAozGd8cX6wKMMs8ZzU7kAJfmAvPHIOsBqjLmAjrHGesBX+RX9soZ6wFfZOYF5McZ6gJs5gUCxxfrAV1mxjBqzjB1MDEz5gErxxnJMjFl5FlD5HRJ8QDG5wO5xxnMS+YC6WzRMuRz28oZyTIxZTPmATFtzzIxZTTGfccZ6wKiNOYGxW7RZGbmAJbHGekBrGbGSccX6wFzNOYEaMcZ6wCUNOYBEccZyHt4ZuYCOm/OeXhm5gZcxxfKd+QIqckX6wKz5wHqyRntAfF45wOAxx7pAK4xZTTmAgjJGfEBMOYBSc4gzHfUQMh35AEOzSDJGTFlNe0A9/IFLTXmAWDOIOsFLe4AmewCwe0BOekCwWbmAeDHF+sCj2TNafIFLWTtAKnyBS1k5gRFziDsB6ztAKnqAnIy5wMIyRnwATvuAQLoJGbkARvmAc1w8gE05gCLxxnKazHHMnLPMjAx5Fi2yhnrAq3OGcxL5gJoc9F9NsZkyRnQOTbmAM/HIMtrNuYAtskZ0XLmAkPHIOsBus5SyTIxZTnGUnTGGesKkecApMcZ7ACE5gDWxxnIS3hm5gR5de4A7XjnBBPHF+oDnOYF1scXy3dk5gQTyRnNTsQgzznNV8Qg5gP1ziDrAirkVbnRIOsFQDbtALDrA/43zxnwAJnnARfHIMlyMWU3zxnxAWnmAbTHIOwDnuYDh8cZ6gOezVDrBl825gM+xxnrCrM35gH9xxnrAx43xnt28QDt5C9/Olwid/ECujjGS8cZ6wPbOOYCL8cZ6wDfN80Z6wKTOOYCescZ7AKT5gIDxxnpAMgxZTjmAK94z2QxZTjmARPHGchLeGbGMHnxAMbnBkjHGeoCleYBQccXy2DnAsXHGesEseRgV8oZ6wJnN+YA3ccZ7AD2zWTsAPbNZOwBvuYCsnrxAnI35gfSxxnrA6I55gGlxxnJfTAxN+YDPccZyH145wrkQc5ieGPmCK/HF+kBJmPmApfHF+wDu+YAkMkZ7QEUeGPmASvHHuwOw81nyDDEGeYGnscZ7A7DzWnzDsPNUvMOw+0AwvMOw+YCOMcg6QN55FxIyhfsDsPNUPMOw+YElM4g7A7D5gHiziDsBxfNQOwOw+0A6fAOw+cMm8ce7A7DzXDzDsPmAOlC0XDlEftcIkPPMjDlYvXKGewOw+YDzMcZ7A7D5gCExxnMZOYB3UTPSzFlxzLHGcgyeGPmAzhF8AK9xnnHF+oCveYEKscX7A7D5gDCxxnsDcHmAQ3HGewOw+YBDckZ8AFGMeYCFs4g7A7DzSDsDsPmAOnHGeoCf80X7A7D5gEyyRnwAInnA8jOIOwOw+0AifMOw+0A6ewOw8Z5Rs8ZMDHnCkFH8QCLMuYAi8cZ7A7DxkvHGewOw8Z9xxnsDsPmAbHHGewOw81k7A7DxktI7wH8MDLHfccZy2Qy5gDIxxnJZDFlMuYCFccZyGR45wQ5Se4A+Hhj5gCrxxfqAozmBgvHF+wOw+YAkMkZzU7kAJfmAtzHIOwOw+YCI8cZ7A7D7QCC6wFf7gCE6gJs7QCC6wFd5Gf3yhnrAfMz5gErSs8yMWXHMkvxAMbnEmXHGch7xEvmA9JM0TIz5gFfxxnJMjFl5w7cTc8yMWU0xn3HGewOw+YGjk7RZGbmAJbHGekBrOcM+scX7A7D5gfpxxnsDsPmARHHGch7eOcNI0/OeXjnDYrHF8p35gKzxxfsDkzmAerJGe0B8Xhk5gX6xx7sDsPmAgjJGfEBMOYBSc4gzHfUQMh35AEOzSDJGTFlNe0A4PMOw+YBqc4g7A7D7QCZ7Asl5gGZxxnpAsHnCzzHF+wOw81p8w7D7QCp8w7D7QGS8wes7QCp7A7DzXnzDsPNIOwOw+YAy1DyATTmAIvHGcprMccyUs8yMDHkaAjKGewOw80ZzEvmAmhT0X02xmTJGdA55GkkyiDLazbmALbJGdFy5gJDxyDsDsPNUsxr5gCLVNJr5gC9xxnIMnjnDgNV7gDUeGTmBHfHF+oDg+YAkMcX7Arv5gP6yRnNTsQg5ghrziDIV8Qg5gOlziDsDqrtAJDzDqrmAbTHIOwOqs8Z8ACZ5wEXxyDJcjFl5wxqyRnwAPI27QEL7AOF5gTVxxnqA4XtAQLsDqrmAyXHGewM7OYB5McZ7A6qxntW8QDtOOYDsFfvAOYxZTjGS8cZ7A6q5gIvxxnsDqrNGewNtOYCs8cZ6whSOOYAlljPSzFlOOYBSscZyDJ4ZOYGwVnxAK3nFMLHGesCJecBzMcZy2LnBqjHGewOk81L7A6T5gDGxxnsAN/mAY7HGesDWecQ81rxAkLnEDjHGewOeuYBdccZyWQwMecRBccZymQzYeYBQ8UMYucER8lqMWbnAhHNH+oBzGbnHK3NH+oC0WbnDgnNH+oCtzPkWK/JHzXSfOYBSs0fyXwwM+cOhsYf5wXQzD7mAk7NH8w+5gl5xh850j7mAa3NH8s+5wwMzR/qAsoz5wGHzx/QZOcG69QmyWsxZucHYc0m6wFj5wdQzR/rAWPnCvvGH+ca7OwA5+YCxs0fyXwwM+cLUMYM8wGh6wEGyB/MPuYCdM0f6wEl7AIdyh/QZOceuNQmyWsxZuceTM0m6wEl5w+ozR/sASXrAkpj8wIM6wFEyB/JfDAz5wO/xQxh8gEl5xz6zR/LPucfP80f6gRnZucaaM0f7ADZ6wHAyB/rANnnEu3GH/IA2ecQiM0fMOQhe037Ly/sLd/sLsZn5UH09i7ZzBXpPu5EZXB0aM0bbuknscwWxWpcIuQiG1wizWzkJRh35C6a5y85xCroLXLvL1TPdjD8Lw3mK2bvfhppZijmAJU9PT1l5WNRITDHbGZl5Hij5il55Cgc8CvCxU9l5nsadOR7GiwgZ290xg/QQMQf6ADmxxgpO2XnLrTnKpDmKOTHDfEvI+oBReQm9MQqxUjzKUnEIOct9sk1JibmJ/PKRusBcfJ5pecBAsku/zAV5zAV7AHFyy/oLvLkeaXxANfHLuwwKu4B6i7lMklJ5SiG5E7ScucBNcc563nQ5ALy5k8M6kAW6TKK6Cwj6C0f5ACNRXhwcmVz5S0GITHpJ0LoKNhlY8RT5Sd75wCTx3PqMKYs5TEIz0zqAOPlMoPoJ+9hPVtd5Cqh6ALy6DDE5AE77gII7S9E5wGp5wI06SiX5QCGT2bKdukocW7nK/rmL+PkLQcmJsYU5X31yRdlJiZpYVvGGl3MDC7kLYF4xynmKKnqATNBdG9tKHLnfN/HJGHmKI5p6CpEXCLESPUA4mZvcm1MaWdh5CvT5SwexRZoYW5kbGVJxHdOb2TFGeQBWNAX9jCPLHI9LTEs5CmzYTx06Cs4YSsr5inLbj1WdCh0W2FdLFwi5QDY532c5iv/5ini7wPYb25seSBvbuRlkmZpeCDoP9IgcGVyIOh7R27mLmcpO3I9YSxlPeQwB+UqCldpdGh9fclaJiZl5gCHaSxzLGg9dOcuXDAscinlfR3GD3Ir6gJ9aT3kfb1o632nb3Jkx3bEGeV9rnlwZT/ECjp7xAvkHaDJJCzkAW066QF3LOQuVTpofSxzxVhs2FhsyVjECt9YyVhsfSxb5gNnxAFhYm92ZWZy5Ap55AVMP8UtY2FsbEbqAxBbaSx0W3JdLHNdLFtdKcZQ0iPGHup9teoCDVN1cFN1YuZdzOsDaOYBZectQecDKyzlMA3kKy/uBWTsA1blAtPmA8xl5H3DdC5TVVBTVUJfR1JFRURJTkVTUyznBrPHByEw5gL8bvgGDeUBMCBh5C7q5QYK5F6C5AX6cukB4+UFTeQDCWF0VeROz3BvcnRlZENt7iuF9DNv6ALecisrKectyOgBquQA6W9y5EG95QGpxhHkBnHkKWDkAXPnahdhPcwy9wHYZX3nAKzILOgFVM8txRfGEOkFrmXkLwflBajGTOUyuugFJeQEPvIt2yxy5H+17wGQXCJhdG/kQ2whMSzkBtEs5i3w9ARc6C395i1b5AVk/wVO7AVO5gLA6DhVPeQtu8RifHzGGeo4cMkb5wPS5ARZYSxcIm/kRMPESukyH9dTO2kuxhQ9cyxpLmFsd2F5c0jrAtY9ITDpND0hKMtg6kRS5C6AfHwh1D7vApBMxGog5GxMcm9scyBtdXN0IGZv5GOyIGEg5AaB6QTY5ATO5zH5/wC6dHM9aH3vCLHqNVReyzHlBV1l7wCTRG91YmxlIORGbHLmA8LGe+cv2/ID4eQvoswtzG5f0G7wBcbJbsdNxmznBCPXbMkrxmrEV+UDveUv0es3OP8A3cxx5AFYbO0DdOsDpuoDSustB3ByaeQB6X0sbT1bbF3qMgLqBMHlAJToAwHsCmU7KW3mBBZs5wdZzDTmAaDRNCYmxzT/AYXGDuQCgSxl6QDQ/wYgbeo0GWV8fHI/yDfkSGLlSLPQNWFzZTph5FavOmUsc3ViOnJ9OuU0P+UEGOgGJO0LweQJYus4a+gF/G7nN3UsaT3kCNnlNa4haegEKeQEUOk2z+kBJOUEZyHkB7VpLuRDhmRpbmVzczzxCCBHb3Qg6Q075AXjbuQF4yB3aXRoIG7qN7xz5DH35G3GIGFzIFwiK+QA+eQKSmH5BMgmJuUD2mxvd2VkSW7kCvDPekNhbid0IHVzZfQAgGluIMRT5Gc75D29yGf0Cm0h5AgMy2vkbN/fa9BrxFfLa+w5rOUF6egBBShuLGkpLGg9cy5hcmdzLGw9cy5vcHTkMoztC2/tCARuLGgsbCxh6DrqyxvvAfssYSxu6AWO5Q7OTmFtZTp0LOUAg+YGmSzlCag6YSzlA7pPbuUMzuQBWzpu5AkVaWFbdOUCHXMmJugC/uk5BckRKGnEbuQ1ce43TeoBHMcpIGZvcuQB7OsM8ekBCu8OeOYIsWXoOH4rxQpPcMQhYWzEEuQAluQOlegAj+RKlXM6W10s5wFAOltdfek0TGE9ZesCtCznO0zlNEYwO3M8cjtz6AsRaD1l5AGLVHlwZXPkNg7IDFtzXeQBnjzxAIgsbT1zPjAmJiFsfHzkAJBzxAvkCkHyAlosY/AHx09mxF3kB83oOG50b+oPMFwi5wHqbeYJVWPlBcpsKXtp5gST5AORKTvkBsVpbnVl6zds/Qly9Q9sfShsP2k6buY9TChj6Ayr5gFVbukBVGnqCKzrAMD1AnfmDuDkCnxjYXNl6QkkOsZZ5Ddr9AiG5gCWxWHlCSXFZuQNUcZFc2l65BJ230TKRFNpeucJMMlDdXLkc5jtOZDEKlVybMcp5AaXxivmAcI6xg3mBJDSOcY2dOUA9+cLBWXKQ2hi5F6LOvAOJ9M1yGLEPMdlaeoGEnR5bOU0H+YGE2nrBkVbaV0sxB/qCrR9OmnHfnJh5HbA5A3P9wEqcuQCqeY+JPEG+u0GDvAEwVPlOBvoCovFaCxy6Av+c8c76AC+xh/uC3nmOFw65jeyfe8EO+kCvHJhd+kOVO0CsOcA4W9yaWdpbuRQwuUBpuUArMYK5gFW/wGv7Qy7bik7ZGVmYXVsdDruAI5Vbmtub3du5wNJ5ADU5waz5xHR6QNE/0B5cig75UBz9gib7wo56ANn6wFp9wfZ5AdEW+UU0eR9C27FEOR2z+U/4iznAnbrC9Jp6BOxYecKh+8H9uUCFOg5UsYtJiYvW157fVtcXF1d5z1Bxhkp7TwL6ggraeUUaOcCMeQB+eYOZecU0+gNfMQT5xJJYSnpBaxoLGzkC2kiLG3uCLRjPTAsdT1t5D1+zBjpFIBufHxyJiZjPjA76QR9aMUc6ASC5QDU8QHc5gCBZWToPm3pQNjlAeFtLuVQVih1LGznAnUgYTpjKys75grqxRFuOmMtLX1sKz0odT1o5gCP7wpf7T3/xnEobuxEs3PNaekB/VJlZ2V48gH87Q/P9wFe6gb7LO4N1SxpPW4s5Q2F5HgG6AHoKO4KIegK/OQ8juQ/LivnQaQ7KXMrPShp5D7/8wDn5w4w5T/z8T/k5j9W5Anp5H+B5gku7BX76gT36gDNcuRCQeUBF2ks5kV67wYa+D0I8wSk6A+k5g8oIe4C98Q7cj0vXigjW2EtZjAtOV17M318Iz/JDjZ9fFthLXpdKykkL2kuZXhlYyhl5wETxE7wCwToAO/FdeYA7cYv5wDtZelBkFswXecA+C9eWzAtOWEtZsRuxGblAXth5HrGYT3mPSdh5Dy06xBzLeUJvvgQeWHqB63pBwj0EF49ITHlAMXkRVbkD9j3BhDmErHzAVrmB5UsdOcSsO8CuigvXlstK10/ICooPzokfFxcZCvFBeQ7MlxkKnzHCCkgKuUBYXswLDJ9ICokLyzIWSnpBGXlAat0fHzkRQLmAU/nEfJ8fOcBjj1cIjDlDlty5Bin5wFkLyjlAIEpICooxHkoPzrIdD/HfivEHMZ/Mn0pL/IB4GH3AeDkAKL6Ad9uPXvmQj06Kyhh5HJMYVsyXSksdW5pdDphWzNdfcVcQeQEDNdgxSvFYG4uxAzKYO4HYucBg+8CB3ZhbHVlOm4saXNCbGFuazpy6gIR6Ajv7wRYxTznF8fmSBtzZXRDYXRj5BinXCIlXCIsMTPmAN3nBH/zAhDlCWIsdOgIDt9UxVQ0KSwh6QxY6QOS6BSi6kBI5BABKFsjJCUmfl9ee31dKeVAVyTkdQDvARLmAIXvARF1cmzsAxbvAQLkCrtuLOUWi+YDHGzrBWJz5wlC6xm3cyks6ElW9BNMbegL7+gFeXU9Y+cSL2YocuYHtT09PXXmB7nECugTVeUZ7eoWfXXuE7HHX3DoGOTlAMZbdV3mBgXzGjDFL2T4GdgscCksZu4IJewGp3D5Gdxt/xDn5AFxbG9jOmHnBcNjLGYp5gqzZCxzZW1pc2nkRfXoP73vAPN8fOYJln3pEtRyKW3lG9rpSKfEDT09KOcIJu0RA+UOkW4pfHzKG1N5bWJvbCgpKeQI3sRyxmhbMF0mJiHyQW11KepEkekVvOUDpE9u5UTK7wOxVW5k5kIq6BRUIHNlcXVlbmNlOuQG9HUsYyk76AjQ8xbbKHXwEpLoCDPzAnhsKSxt6Bck6Rot9xcd6AUiLTHnFyVl5kqU5xXt5BhsaegUxlwiLeUBFWnkASPGC3RbcisxXcUfJibkGYk8Zc4dMsYdPyh06Ed5ciwz6QalxBv0F3bsAhdu5BjyK+QFGMQdOlwiLS0t5Xq1ZS09Mik6zFky31nUWTHMWchYMSnkSxzmFLrlAO5gxgt8fOsA8cYR/wCA/wCA6wCAaStpyH3rB5jlApb3SqPoBDjoSqDkBDgvXuVCymVyYlteYS16QS1a6AuRZSn1BCfkEUTmG0c15BP3XCIq5QG8cuV46uV45sRX5B8Acj1yxyrkAR/kThXkAjk8Mnx8yy3lRfLGJi0x8Aa26ACbIGFzc2Vy5RH5ZmFpbGVkIC0tXFxuINMBcGzlSrJyZeQDCyB3aGHkC3vkC4FjYXVz5ErXaGlzIGJ163zz6AGDxGnxAYDlBF/rAMksLTEpLOR4kDpufX1T8QPmZVswXSkmJiFq5k7wxExdW8QVXeggEOkD/OQOsGN09hHY6AOjyCzmAM5Ob27GNeQHE25p5Abv5BNZ5hRP5APJ5HGTQWPkbXdlZCBVxiLmFKTkAW9hY+QRsVwiJyvkAJErJ1wi5BRvZO0UXScsdOQCH1Nh5gC1K2Uu5BeldHLkAcLmHpsscz1zYecI0OYPnCYmKOQ+JOVLPWXkAh3FMmluZygwLHPmHyYpKT/kDEnkIxkx5zsCasUx5iIBxhrlccopKSzuATxd71JU/wE4xEt4YzfkKKMwxAVl5D7HxA9mZVwi6R+zZSk+PTD/AWX8AWVMYXRpbi0xL/8BZPoBZOYZ/yxsPe8A7S7lBrIsbT3oA/TmCi9X8AJobOdKyGM9bDto6Qc35xvB7wczZmFtaWx5OmPlBExt5gQ8ZecHB8g8bNA1zSw7aT1o6xsqZe581T49MTI47wtT9QGyKE3QOyk//wL+/wGZ8QGZ/wGR+gGR7x1V1HPlEbTmBWDGa3JlY29nbml66wNt13MoJyvvAPorXCIp5Qzj5A8//wYF7QYF5FAa5wHC8hlR6k95dT0wO3U8c+QgZucexHXoFpFwPcQX5Ang5AHOa2FbcF3xCHzmEqBh5QRMICfkCHFw6BXl6An+xTnrAr7FTvBQcOYEjshAIHXqCKToERHIQMQf5xjf5AL06gLUxUL+Cgl0KSxsYWJlbDpkLGlzU3Ry5AbneTohMcQOaGlmdHnkVs/lGuxp6RsgaeZK/DtNYfAj2T1b5hLp5gZ/ZW7pCovJEckM5ScJxQ4mXCJdLMhM5gwHe+gTRl3FInvpE0LyCqHnCrTKbOQoOvIhGz0x5QF8eusoVegnUyH0TV50fHztT4PmDVbsB2XkF23lCn4oXCLlf4wgY2FuIOUjkeUITyDGVOUUpGTkUjXnASToJd3mVtVN5Sg75BTu5VF0cu8mK2N1cnJlbnTnIrpkZkB0YWdcIl3pDZLFauYR7dA75E54zjfmC0chZS5kaXNwbGF55AP68wg2dGFnIHdvcmtz5gDNaW4gxzAg5HbA5AE75GQdO8lw5VgVz2osYT1b6QObxBL0CBxhLHRhZzrpAMV96SNFYX0sQe4BqeQVYuYP1kNvbnRlbuQQXVwi5wEHQuQBRHIpLnRv5CV7KCk75VIJZW5kQ2hpbGTkJaE75ASF5wwV5Ape5wHlZG9j5Rnp5Ab8Q1NTMeRrt+RMWSE9PcgbLuRTD2F05AEr5Qet1EfkBEVvbGUmJscJLndhcuRQL1dhcm7kF1gg5gIfZG9lc+QcqeQBXOQBVnF1aeQBZeQBGS4gTWFr5B+ScmUgeW91ciB3ZWJz5FRXaGFzIGEg5GdFYeQfs2RvY8R0LuQBYuwBIuQH6ewBx99xZMVC5yNmVPIBauUCTuwNYXx8Ie5Skm/oAwp0xURhPUTkAnhr5A91bihbXCJrYXRleC3lI2DkA95b5VJ1KGUpXekUWWHkBjJBdHRyaWJ1dOQQfHRpdOVlP3QudG/mA27kKdvRJ+UZX+UECuYTWVwiK3LrI8nlU8RC8APm6gNwdeQJe3RyecUTYT165gI76ACVQmUoYSzEEX1jYecbMccaVGHkWM/EGn0sQ2E9e+RQt2lvbjpcIjAuMTEu5CzRcmVuZGVyOkFhxwpU5wDHOu4AjMhrxHpl5AK1TWFya+ZaR1DlEBHkAMw6byxfX+UDGM8+7wDKx03nAMd9LF9fyHxEb21UcmVlOkJhyxVIVE1MxRbdVeQBH8dZ9hjm5CsnLEFlKHIp5AzH9AH75QH1YeoB7lTkDYNyKX0o5wCqLOQoV/0BZV9fc2V0Rm9udE1l5AhIc+8As0ZbdF09ZcQn5gOQ5ghdOiTJEeVT5zpw5AD+ZOcBC3vkAKM6TixBbmNob3I6SSzGNeQENTpFLFN2Z8UKTCxQYXRoxQtILExpbmXFC1B9fTtlLucalD1DYX1dKcgOfSk7In0seyJyZWYiOiJjYXBoLWRvY3MvY29yZS/mAwlub2ZvbnRzLm1pbi5jc3MiLCLkEJplbnQiOiIuxSN7xCE6buQQj2wgMS4yMWVt5gQ3X01haW4sVGltZXMgTmV3IFJvbWFuLHNlcmlmO2xpbmUtaGXkB0o6MS4yO+QFIC3kC6ludDowxg7mAfrkAoZhdXRvfcZtICp7LW1zLWhpZ2gt5REjYXN0LWFkanVz5ACDbmUhaW3kCGrkd9PHMcYHLegC9uUewXvnAMTrAwTPL+QKJ21se3Bvc2nkAbo6YWJzb2x1dGU7Y2xpcDpy5BLTMXB4LMsEKTtwYWRk5ACvMDtib3LkA1AwO+gA4nB4O3dpZHRoxQpvdmVyZmxvdzpoaWRkZW7PeuR0mz4ubmV35AEje+cGwDpibG9ja8kq5AjW6gCc5FdYdGl2ZTt3aGl0ZS1z5BQ+Om5vd3JhcMd2bWlu5QEuZesBF8RELMgNc3RydXTJbWluxHwtznTkAZRiZuUB7S135gDXNzAwzR9pdMYf5h5IaXRhbGljzSFybcYh5wyd6gImzSZzx2bNJlNhbnNT5AI7zSt0x3LNK+QI33dyaXRlcsks5AHP5wL00zHkDEw7+gC6xD3oANvPOGlu3zjoAPLGIeYDJc0h6AFT11nzAWpib2xkc+UD/9U66ADLyjr7AKNhbXNybekCBuZvd8kP5QHyYtNlQU1TyULENGNh9ACLQ2FsaWdyYXBoy3DELmZyYWvNZMQR00BGcmFrdHXuAcT/AfDNLHNjcs1nc2Ny0z1T5Sdxzjlmzjj/Ao/LOuUBm84+xhPcQvkB6cRSaXTPUMQR3076ApBpbvkDgsw47wKndmxpc3Qt8QQf5QnYO8UGLWxheW91dDpmaXhlZM84csk4xityb3fOIs8gY2XkGbfkE/hjYWwt5AJEbjpib3R0b2078QTyzkk+c3Bhbu4FMugFgTDfPMY8zkH1BQbLLS5w5gU27wXP5wVz6gHHxTMtdDJ7bWFyZ2luLeUOPzotMnB4zyNz/wEK6wEK5gGt5Bw26gZbMnB4O+QF6ckOyV9t5ioK5VgGx0jkNdHKIOQwT+sBAsso5RRX6wNYxCogLsQGLe0GoOwBLegG6zAwJecHCi3mALfnAl9zb2xp6gImaGRhc2jEPekC584O0HPJGeQBeMQRygrOIHJ1bMoN5Az9xy7JC8Uve+QBM+oHp+sBNOQHR/4CDWNsYXDJYmzMDXJsYXB75wIJ+wJ7xEE+LmlubmXqBKvESNAUxE/HFPIIk89OZml4z0zMEsZKZml4/gDa6wCFe+YCsOoC0PQAtewAoeQCW9Yv5gJe5wMHxSctNTAlO+0DGDUwJck75AHC9gJi6AlhIOUCTPsBYu4CTP8CM/sCJv8C6P8C6O0C6N9M1kzEPesFW3NxcnQ+LnJvb3TtAU8uMjfFAThlbe4BVi0uNcYBNmVtyUXlC9lpemUtZW7kD7/kX2hzZeYEVzEuxQbqCiBpemluZ9Ih5wjd5QSJ31rNOTLfWmUyzFouMt9czTsz31xlM81cNN9czTs031xlNM1c/wFuzjs131xlNc1cON9czTs231xlNstc/wFuzjk331plN8xa/wFuzzs431xlOM1cOP8BE848Od9dZTnLXTMuNP8DO889MTDfX2UxMMtgNC4xNP8Avs8+/wOcxCLNYDk3/wDAyD4y/wP7yCHLXi44M8YB32LNQfsEA8ch/wRd2Vr7BAHHIcxaLjE2xQE332PNQvsECMchzWPnAR//ASDOQvsED8chzWM131zNO/sED8chzVzmASH/ASLPQvsEGMch/wRy2Vr7BBbHIf8Ecttc+wQVxyH/BHLcXfwEFMgiy1/lBHT/AXjTZf8DuvEEGTE032XNZTP/BB7IIctjLjcxNDI4NTf/A8TOQfsEHschzGLEXjQyOP8E4s5B+wQmxyH/BIDZWvsEHcchzFou5wEe/wKozkL7BB3HIc1jxmEyOd9jzUL7BCTHIc1j5wDF/wTjzkL7BCTHIc1j/wJI1WP7BC3HIctjMi4w/wJJ1GP7BDTHIc1jNDb/ASnTY/wEOsgizWU5Nv8CVNRl/wPW7wQ6My41Nf8BkM1lNP8EOsghy2MuNjL/BtfOPPsENcchzF0331zOO/sEL8chzFw4313PPPsEMsch/wSM2Vr7BCnHIcxaLjH/AXHPPfsEJMchzV7fXc88+wQexyH/CQHbXPsEF8ch/w1s21z7BBDHIctcMi4x/wRtzjz8BArIIs1fNTn/AXbQP/8DovEEBjH/ApDIPTX/BADIIctd/xC11mL7BAXHIcxi/wrb1WL7BAvHIcxi5hGS5BGT32LLQfsEEMchzGI4xgH/B97OQfsEGMch/wRy2Vr7BBTHIcxaLjHHAd9jzUL7BBrHIf8Nft9j/gQhxyH/EenbXPsEIcchzVw5/w0ezjz8BCHIIstfMi4zMDTFAd9lzkP/A8fvBCUyLjc232XNZTb/BCvIIctj/wX/zzr7BCTHIcxb/wHdzjr7BB3HIcxb/wR4zjr7BBbHIcxb/wRxzjr7BA/HIcxb/wRqzjr7BBDHIf8Eatla+wQHxyHMWi7/A0fOO/sEAMchzVz/AtrPPPsEAcchzV03Mv8BzM49/AQCyCLLYDIuMDf/AL7PPv8DmfED/TT/ESfJPjf/A/jIIcteLjTmE7//A0nOQfsD/8ch/wRa2lv7A//HIc1b5xU532LNQfsEBsch/wjg32L9BA3HIf8NR9tc+wQOxyHMXP8WWNVi+wQWxyH/BHDZWvsEFMch/wRw21z7BBPHIf8EcNxd/AQSyCLNXzcy5gF632XOQ/8DuPEEFzA3/wHdzWU4/wQcyCHLYy4zNDcyxAHfYs1B+wQcxyH/BH7fYv0EI8chzWI4Nv8LINJi+wQjxyH/DWXfYv0EI8ch/xHH3F37BCTHIc1dOf8KW9Ni+wQkxyH/BIbfYv0ELMch/wSG2Vr7BCrHIf8Ehttc/AQpyCLNXjQ0MOQgc/8H4M9D/wPF7wQp5ASO/w9CzWU5/wQpyCHLYy4yODkzNTE4/wKmzkH7BCnHIf8Ei99i/QQpxyHMYjQwNTA5MjX/C5zOQfsEKcchzWI2MjnEA99izUH7BCnHIcxiNTIw5QNt32LNQfsELschzWI3ODcwM/8FsM5A+wQtxyH/BI/fYv0ELcch/wSP32L9BDXHIf8Ej9la/AQzyCLMXC4yMOR3EP8g7tBD/wPP8QQzNDM5ODE0OP8AyshDMTD/BDTJIstlLjI0MTA4MDD/AerPQvwk+ccizWQ4OTI5NjD/BJnPQvwlAccizGQzMzc1MTLfZNBC/CUJxyLNZDg1NzI4MP8EO89C/CURxyLMZDQzMzk0NDD/A9zPQvwlGccizWQ4MjE2MDD/Ar3PQvwlI8cizGQ1Nzg1OTIw/wXJz0L8JSvHIsxkNjk0MzEwNf8DIM9C/CUyxyLMZDgzMzE3MjbfZM9C/SU4yCP/BKzbXv8D4/IESTE5OTYxNDL/AlXJRP8pOMoiy2XkBRI5NjQ2/wXRz0L8BEnyKUPkBK0xNTf/C+XQQvwESfIpSy4yODEzNTD/BdrQQvwESfIpUy4zMjE1NDM0/wH3z0L8BEnyKVsuMzYxNzM2/wdh0EL8BEnyKWMuNDAxOTI5Mv8BkM9C/ARJ8ilt5AStMzE1/w470EL8BEnyKXXlCVA3OP8gadBC/ARJ8il85AStNTMz/yjA0EL9BEnzKYLkBK82MDH/IyTRQ/8D6/EEUcteZGVsaW3HNsUpxijuM9fEGNky5wPi0TIy2TLnA7DRMjPZMucDftEyNNUybXVsdMcS5gEE5i/z1kP2ANnQQzTcQ+oAhuREgsU15DYI/C9jLjHsDYXFM+Yy5ekBym9wLec3YPowWMkkLnNtYWxsLW9w/wDlzDNsYXJnZdoz6gG/b3At5mASPuk1hXT5M5zmQzTfKssqyAgt5EDS+wDr0y46bm90KMgRZuRaP+gy7ck25TFhYXn3OsFt5kAVLuk03nNlcGHlYSj2AbvqNNjtM6THRmFycmF5Y29sc2Vw1T/RMWNv5zVQLWP/ATDXN2zVN+41VdE1ctU15TGhyTZzdmfGGNhYc3Zn7zbj8jyk6zJM5zTaaW5oZXJpdDtmaeRY2eZDmuVAdTtzdHJva2XOFMQmLeQzfeQ9U3plcm/GEm9wYWNpdHk6Mcc16AGSyA/kAXFjYXA6YnV0dMwUam9pbjrlA5jIFsUN5QLaOjTIFOQy4uUBycR1ZcwWb2Zmc2XkN8THFOkAiOsBFCBwYXRoe8YhxUHIHGltZ3vnM1HoON1uZesCUDDFDOk4J21heMcZxihheMgczFXkPTDlRm/nAvflAWv3AZbpPZ74PffITOY+m+oGUMgXYmVmb3Jl6z6z6z6taGlk5DmJaWzsAInfe8t7aGFsZmFycm935TQ/8z7uxBc6MOcCUTUwLjIl30zETOUC0tNNxRjfTshOYnJhY2X/AJbGSDI1LjHfSC3mA9DYSjI1JcdM5DaO3kr/ANz/AJTGSngt5gEocGFke+lANCDtHGhtxDzpAgtt5TaNyQ/HQPsEsWJveM9d7QrNYm/qOBFm5USMYm94e2JveOQHccQx6TaCeOg3ai7kEOjmN27JSGPkRVJs8ADH7AdexyLkOQ3tN/bEJfA2ocw4c291dOgDtvI3U+83IecH1+sPlS3nA4vvBSnGceQJhCDnQmPzAT3IPD7GD89D0TbzQXTWSccH5UHf+AXB7wd720I+LnRhZ/oCh89BLmxlcW5v2UfnA0/GPOtDbMk/ZsRAxzjxBphcblxuIn1d", {inputEncoding: 'Base64'}));



class ResourcesLoader{

  plugins = {};
  mathMacros = {};
  components = {};
  loadPlugins = async ()=>console.log('caph.loadPlugins not set. No plugins were loaded');
  _attachments=[];
  _loadStatus = {};

  setReady;
  _ready = new Promise((setter, _)=>this.setReady=setter);
  ready = ()=>this._ready;

  _required = [
    {ref: 'caph-docs/core/core.css',},
    {ref: 'caph-docs/core/menu.js',},
    {ref: 'caph-docs/core/katex.min.js',},
    {ref: 'caph-docs/core/katex-nofonts.min.css',},
  ];
  
  constructor(required_attachments){
    for(let a of required_attachments) this.attach(a);

    this.div = document.getElementById('core-sources');
    if(!this.div){
      this.div = MyDocument.createElement('div', {
        id: 'core-sources',
        parent: document.head,
        where: 'beforeend',
      });
    }
    (async()=>{
      for(let s of this._required){
        await this.load(s.ref, {
          parent:this.div,
          afterReady: false,
        });
      }
      this.setReady();
    })();
  }

  getAttachment(ref){
    for(let e of this._attachments) if(e.ref==ref) return e.content;
    return null;
  }
  attach(...attachments){
    for(let s of attachments){
      if(this.getAttachment(s.ref)===null) this._attachments.push(s);
      else this._attachments.forEach(a=>{
        if(a.ref==s.ref) a.content=s.content;
      });
    }
  }

  async load(ref, {attrs={}, parent=null, where='beforeend',
      auto_attrs=true, afterReady=true}={}){
    // Load an external script or style by inserting relative to parent
    if(afterReady) await this.ready();
    if(parent==null) parent=this.div;
    const ext = ref.split('.').pop();
    let tag = ext=='js'? 'script': ext=='css'? 'link' : null;
    if(tag==null) throw new Error('Only .js and .css files can be _sources. Got: '+ext+' '+ref);
    let defaults = {};
    if(auto_attrs && tag=='link') defaults={rel:'stylesheet', type:'text/css'};
    Object.keys(attrs).forEach(k=>defaults[k]=attrs[k]);
    let content = this.getAttachment(ref);
    if(content && tag=='link') tag = 'style';
    attrs = defaults;
    if(content){
      delete attrs.src;
      delete attrs.href;
    } else {
      if(tag=='script') attrs.src = ref;
      if(tag=='link') attrs.href = ref;
    }
    try{
      await this._load_elem(ref, tag, attrs, parent, where, content);
    } catch(err){
      console.log(err);
      throw err;
    }
  }

  async _load_elem(ref, tag, attrs, parent, where, content){
    // Handle concurrent calls to load_elem(...) about the same ref
    if(!this._loadStatus[ref]){
      this._loadStatus[ref]=1;
      try{
        await this.__load_elem(ref, tag, attrs, parent, where, content);
        this._loadStatus[ref]=2;
      } catch(err){
        this._loadStatus[ref]=0;
        throw err;
      }
    }
    while(this._loadStatus[ref]==1){ // If being loaded in other thread...
      await sleep(80);
    }
  }

  __load_elem(ref, tag, attrs, parent, where, content){
    return new Promise((_ok, _err)=>{
      let e = document.createElement(tag);
      let done = false;
      e.onload = ()=>{if(!done){ done=true; _ok(); }};
      e.onerror = (x)=>{if(!done){ done=true; _err(x); }}; // HTTP errors only
      Object.keys(attrs).map(key => e.setAttribute(key, attrs[key]));
      if(content){
        let r = window._loaded_resources||{};
        window._loaded_resources = r;
        r[ref] = false;
        content += `\nwindow._loaded_resources['${ref}']=true;\n`;
        e.innerHTML = content;
        if(tag=='script'){
          (async()=>{
            while(!r[ref]) await sleep(100);
            done=true; _ok();
          })();
        } else if(tag=='style'){
          let ms = 10;
          setTimeout(()=>{done=true, _ok()}, ms);
        }
      }
      parent.insertAdjacentElement(where, e);
      setTimeout(()=>done||_err(['Timeout (3s) loading source:', e]), 3000);
    });
  };

  async render(){
    await this.ready();
    let promise;
    await (promise=this.loadPlugins());
    if(Promise.resolve(promise) != promise){
      let msg = 'caph.loadPlugin must be an asynchronous function!';
      window.alert('Error: '+msg);
      throw msg;
    }
    this.loadMathMacros();

    let rootElement = document.querySelector('#caph-root');
    if(rootElement) rootElement.removeAttribute('id');
    else{
      rootElement = document.body;
      console.warn("No element with id 'caph-root'. Using body.");
    }
    function hDataTag(type, props, ...children) {
      let tag = props&&props['data-tag'];
      let component = tag&&caph.components[tag];
      if(tag && !component) console.warn(`Found undefined tag "${tag}".`);
      if(component){
        for(let k in props) if(k.startsWith('data-')){
          let value = props[k];
          delete props[k];
          props[k.slice(5)] = value.length?value:'true';
        }
        delete props['tag'];
        type = component;
      }
      return preact.h(type, props, children);
    }
    let dataParser = htm.bind(hDataTag);
    let dom = dataParser([rootElement.innerHTML]);
    preact.render(dom, rootElement);
  }

  loadMathMacros(){
    // Load this.mathMacros to KaTeX.__defineMacro and MathJax.tex.macros
    window.MathJax = MyObject.deep_assign({
      tex: {inlineMath: [['$', '$'], ['\\(', '\\)']], macros:{}},
      svg: {fontCache: 'local', exFactor: 1.0, scale: 0.9,},
    }, window.MathJax||{});
    
    for(let key in this.mathMacros){
      let s = this.mathMacros[key];
      katex.__defineMacro(`\\${key}`, s);
      let n = 1; while(s.indexOf(`#${n}`)!=-1) n+=1;
      window.MathJax.tex.macros[key] = n==1?s : [s, n-1];
    }
  }

  makePlugin({component, loader=null, post_loader=null}){
    return function(){
      const [ready, setReady] = preact.useState(false);
      const [error, setError] = preact.useState(null);
      const _load = async ()=>{
        try{
          if(loader) await loader(...arguments);
          setReady(true);
          if(post_loader) await post_loader(...arguments);
        } catch(err){ setError(err); console.error(err); }
      };
      preact.useEffect(()=>{_load();}, []);
      return html`${
        error? html`<div>Error</div>`
        : (
          ready? component.apply(this, arguments)
          : html`
            <div class="hbox align-center space-around flex"
                style="width:100%;height:100%">
              <div class="plugin-loading"/>
            </div>`
        )
      }`;
    }
  }
}

window.caph_requirements = window.caph_requirements||[];
var caph = new ResourcesLoader(window.caph_requirements);
delete window.caph_requirements;
