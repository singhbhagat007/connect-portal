function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	 if (charCode == 8)
        return true;
    if ((charCode < 48 || charCode > 57))
        return false;
	return true;
}
function isvalidateEmail(email){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
    return true;
    }else{
     return false;
    }
}
function openToast(){
    toastr.success('Link copied');
    //toastr.clear();
}


//-----------------------------OPENTOK DYNAMIC SCREEN VIDEO CONFERENCING START------------------------------//

var arrange = function arrange(children, Width, Height, offsetLeft, offsetTop, fixedRatio,minRatio, maxRatio, animate) {
    var count = children.length,
        dimensions;
    var getBestDimensions = function getBestDimensions(minRatio, maxRatio) {
        var maxArea,
            targetCols,
            targetRows,
            targetHeight,
            targetWidth,
            tWidth,
            tHeight,
            tRatio;
        // Iterate through every possible combination of rows and columns
        // and see which one has the least amount of whitespace
        for (var i=1; i <= count; i++) {
            var cols = i;
            var rows = Math.ceil(count / cols);  // (.97)=> 1

            // Try taking up the whole height and width
            tHeight = Math.floor( Height/rows ); // (10.96)=>10
            tWidth = Math.floor(Width/cols);

            tRatio = tHeight/tWidth;
            if (tRatio > maxRatio) {
                // We went over decrease the height
                tRatio = maxRatio;
                tHeight = tWidth * tRatio;
            } else if (tRatio < minRatio) {
                // We went under decrease the width
                tRatio = minRatio;
                tWidth = tHeight / tRatio;
            }

            var area = (tWidth*tHeight) * count;

            // If this width and height takes up the most space then we're going with that
            if (maxArea === undefined || (area > maxArea)) {
                maxArea = area;
                targetHeight = tHeight;
                targetWidth = tWidth;
                targetCols = cols;
                targetRows = rows;
            }
        }
        return {
            maxArea: maxArea,
            targetCols: targetCols,
            targetRows: targetRows,
            targetHeight: targetHeight,
            targetWidth: targetWidth,
            ratio: targetHeight / targetWidth
        };
    };

    if (!fixedRatio) {
        dimensions = getBestDimensions(minRatio, maxRatio);
        //console.log(dimensions);

    } else {
        // Use the ratio of the first video element we find to approximate
        var ratio = getVideoRatio(children.length > 0 ? children[0] : null);
        dimensions = getBestDimensions(ratio, ratio);
    }
    // Loop through each stream in the container and place it inside
    var x = 0,
    y = 0,
    rows = [],
    row;
    // Iterate through the children and create an array with a new item for each row
    // and calculate the width of each row so that we know if we go over the size and need
    // to adjust
    for (var i=0; i < children.length; i++) {
        if (i % dimensions.targetCols === 0) {
        // This is a new row
            row = {
                children: [],
                width: 0,
                height: 0
            };
            rows.push(row);
        }
        var elem = children[i];
        row.children.push(elem);
        var targetWidth = dimensions.targetWidth;
        var targetHeight = dimensions.targetHeight;
        // If we're using a fixedRatio then we need to set the correct ratio for this element
        if (fixedRatio) {
            targetWidth = targetHeight / getVideoRatio(elem);
        }
        row.width += targetWidth;
        row.height = targetHeight;
    }
    // Calculate total row height adjusting if we go too wide
    var totalRowHeight = 0;
    var remainingShortRows = 0;
    for (i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row.width > Width) {
            // Went over on the width, need to adjust the height proportionally
            row.height = Math.floor(row.height * (Width / row.width));
            row.width = Width;
        } else if (row.width < Width) {
            remainingShortRows += 1;
        }
        totalRowHeight += row.height;
    }
    if (totalRowHeight < Height && remainingShortRows > 0) {
        // We can grow some of the rows, we're not taking up the whole height
        var remainingHeightDiff = Height - totalRowHeight;
        totalRowHeight = 0;
        for (i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.width < Width) {
                // Evenly distribute the extra height between the short rows
                var extraHeight = remainingHeightDiff / remainingShortRows;
                if ((extraHeight / row.height) > ((Width - row.width) / row.width)) {
                    // We can't go that big or we'll go too wide
                    extraHeight = Math.floor(((Width - row.width) / row.width) * row.height);
                }
                row.width += Math.floor((extraHeight / row.height) * row.width);
                row.height += extraHeight;
                remainingHeightDiff -= extraHeight;
                remainingShortRows -= 1;
            }
            totalRowHeight += row.height;
        }
    }
    // vertical centering
    y = ((Height - (totalRowHeight)) / 2);
    // Iterate through each row and place each child
    for (i = 0; i < rows.length; i++) {
        var row = rows[i];
        // center the row
        var rowMarginLeft = ((Width - row.width) / 2);
        x = rowMarginLeft;
        for (var j = 0; j < row.children.length; j++) {
            var elem = row.children[j];
            var targetWidth = dimensions.targetWidth;
            var targetHeight = row.height;
            // If we're using a fixedRatio then we need to set the correct ratio for this element
            if (fixedRatio) {
              targetWidth = Math.floor(targetHeight / getVideoRatio(elem));
            }
            // NOTE: internal OT.$ API
            elem.style.position = 'absolute';
            //OT.$.css(elem, 'position', 'absolute');
            var actualWidth = targetWidth - getCSSNumber(elem, 'paddingLeft') - getCSSNumber(elem, 'paddingRight') - getCSSNumber(elem, 'marginLeft') - getCSSNumber(elem, 'marginRight') - getCSSNumber(elem, 'borderLeft') - getCSSNumber(elem, 'borderRight');
            var actualHeight = targetHeight - getCSSNumber(elem, 'paddingTop') - getCSSNumber(elem, 'paddingBottom') - getCSSNumber(elem, 'marginTop') - getCSSNumber(elem, 'marginBottom') - getCSSNumber(elem, 'borderTop') - getCSSNumber(elem, 'borderBottom');
            positionElement(elem, x+offsetLeft, y+offsetTop, actualWidth, actualHeight, animate);
            x += targetWidth;
        }
        y += targetHeight;
    }
};

var positionElement = function positionElement(elem, x, y, width, height, animate) {
    var targetPosition = {
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px'
    };

    var fixAspectRatio = function () {
        var sub = elem.querySelector('.OT_root');
        if (sub) {
            // If this is the parent of a subscriber or publisher then we need
            // to force the mutation observer on the publisher or subscriber to
            // trigger to get it to fix it's layout
            var oldWidth = sub.style.width;
            sub.style.width = width + 'px';
            // sub.style.height = height + 'px';
            sub.style.width = oldWidth || '';
        }
    };

    if (animate && $) {
        $(elem).stop();
        $(elem).animate(targetPosition, animate.duration || 200, animate.easing || 'swing',
        function () {
            fixAspectRatio();
            if (animate.complete) animate.complete.call(this);
        });
    } else {
        console.log(targetPosition);
        // NOTE: internal OT.$ API
        elem.style.marginLeft = targetPosition.left;
        elem.style.marginTop = targetPosition.top;
        elem.style.width = targetPosition.width;
        elem.style.height = targetPosition.height;
        elem.style.zIndex = '-1';
        //OT.$.css(elem, targetPosition);
    }
    fixAspectRatio();
};



var getHeight = function (elem) {
    // NOTE: internal OT.$ API
    var heightStr =  elem.style.height; //OT.$.height(elem);
    return heightStr ? parseInt(heightStr, 10) : 0;
};        
var getWidth = function (elem) {
    // NOTE: internal OT.$ API
    var widthStr = elem.style.width; // OT.$.width(elem);
    return widthStr ? parseInt(widthStr, 10) : 0;
};
var getCSSNumber = function (elem, prop) {
    // NOTE: internal OT.$ API
    var cssStr = elem.style.prop;  // OT.$.css(elem, prop);
    return cssStr ? parseInt(cssStr, 10) : 0;
};


var createLayout = function(container, opts){
    var id = container.getAttribute('id');
    
    var strPattern = window.location.href;
    var pattPattern = new RegExp("room");
    if(pattPattern.test(strPattern)){
        container.style.width = window.innerWidth+'px';    
        
    }else{
        container.style.width = (window.innerWidth/2)+'px';    
    }
    container.style.height =   ((window.innerHeight/100)*75)+'px';
    var filterDisplayNone = function (element) {
        // NOTE: internal OT.$ API
        return element.style.display !== 'none';
        //return OT.$.css(element, 'display') !== 'none';
    };



    var getVideoRatio = function(elem) {
        if (!elem) {
            return 3 / 4;
        }
        var video = elem.querySelector('video');
        if (video && video.videoHeight && video.videoWidth) {
            return video.videoHeight / video.videoWidth;
        } else if (elem.videoHeight && elem.videoWidth) {
            return elem.videoHeight / elem.videoWidth;
        }
        return 3 / 4;
    }

    var getCSSNumber = function (elem, prop) {
        // NOTE: internal OT.$ API
        var cssStr = OT.$.css(elem, prop);
        return cssStr ? parseInt(cssStr, 10) : 0;
    };
    var Height = getHeight(container) - getCSSNumber(container, 'borderTop') - getCSSNumber(container, 'borderBottom'),
    Width = getWidth(container) - getCSSNumber(container, 'borderLeft') - getCSSNumber(container, 'borderRight'),
    availableRatio = Height/Width,
    offsetLeft = 0,
    offsetTop = 0,
    bigOffsetTop = 0,
    bigOffsetLeft = 0,
    bigOnes = Array.prototype.filter.call(container.querySelectorAll('#' + id + '>.' + opts.bigClass),filterDisplayNone),
    smallOnes = Array.prototype.filter.call(container.querySelectorAll('#' + id + '>*:not(.' + opts.bigClass + ')'),filterDisplayNone);

    if (bigOnes.length > 0 && smallOnes.length > 0) {
        var bigWidth, bigHeight;
        if (availableRatio > getVideoRatio(bigOnes[0])) {
            // We are tall, going to take up the whole width and arrange small
            // guys at the bottom
            bigWidth = Width;
            bigHeight = Math.floor(Height * opts.bigPercentage);
            offsetTop = bigHeight;
            bigOffsetTop = Height - offsetTop;
        } else {
            // We are wide, going to take up the whole height and arrange the small
            // guys on the right
            bigHeight = Height;
            bigWidth = Math.floor(Width * opts.bigPercentage);
            offsetLeft = bigWidth;
            bigOffsetLeft = Width - offsetLeft;
        }
        if (opts.bigFirst) {
          arrange(bigOnes, bigWidth, bigHeight, 0, 0, opts.bigFixedRatio, opts.bigMinRatio,opts.bigMaxRatio, opts.animate);
          arrange(smallOnes, Width - offsetLeft, Height - offsetTop, offsetLeft, offsetTop,opts.fixedRatio, opts.minRatio, opts.maxRatio, opts.animate);
        } else {
          arrange(smallOnes, Width - offsetLeft, Height - offsetTop, 0, 0, opts.fixedRatio,opts.minRatio, opts.maxRatio, opts.animate);
          arrange(bigOnes, bigWidth, bigHeight, bigOffsetLeft, bigOffsetTop,
            opts.bigFixedRatio, opts.bigMinRatio, opts.bigMaxRatio, opts.animate);
        }
    } else if (bigOnes.length > 0 && smallOnes.length === 0) {
        // We only have one bigOne just center it
        arrange(bigOnes, Width, Height, 0, 0, opts.bigFixedRatio, opts.bigMinRatio,opts.bigMaxRatio, opts.animate);
    } else {
        arrange(smallOnes, Width - offsetLeft, Height - offsetTop, offsetLeft, offsetTop,opts.fixedRatio, opts.minRatio, opts.maxRatio, opts.animate);
    }
}


//-----------------------------OPENTOK DYNAMIC SCREEN VIDEO CONFERENCING END------------------------------//


//-----------------------------OPENTOK NETWORK SIGNAL STRENGTH START------------------------------//


var callbackInitPublisher = function(role,callback){



    let publisher = OT.initPublisher('',{width:0.1, height:0.1}, function(err){
        if(!err){
            callback({a:1,publisher : OT.initPublisher()});            
        }else{
            callback({b:1});        
        }
    });

    if(role == 'pcpDoctor'){
        

        localStorage.setItem('pcpDoctorPublisher',publisher);

    }

    // if(publisher){
    //     callback({a:1,publisher : publisher });        
    // }else{
    //     callback({b:1 });        
    // }
    // OT.initPublisher(function(err){
    //     if(err){
    //         callback({b:1 });        
    //     }else{
    //         callback({a:1,publisher : OT.initPublisher() });        
    //     }
    // })
}

var callbackConnectSession = function(session,token,callback){
    session.connect(token,function(){
        callback({b:1});
    })
}

var callbackPublishSession = function(session,publisher,callback){
    session.publish(publisher, function(){
        callback({c:1});    
    });
}

var callbackSubscribeSession = function(session,stream,callback){
    var subscriber = session.subscribe(stream,'',{audioVolume: 0,testNetwork: true},function(){
        callback({d:1,subscriber:subscriber});    
    });
}

var testStreamingCapability = function(subscriber, callback) {
  performQualityTest({subscriber: subscriber, timeout: 15000}, function(error, results) {
    //console.log('Test concluded', results);
    // If we tried to set video constraints, but no video data was found
    if (!results.video) {
      var audioSupported = results.audio.bitsPerSecond > 25000 &&
          results.audio.packetLossRatioPerSecond < 0.05;

      if (audioSupported) {
        return callback(false, {
          text: 'You can\'t do video because no camera was found, ' +
            'but your bandwidth can support an audio-only stream',
          icon: 'assets/icon_warning.svg'
        });
      }

      return callback(false, {
          text: 'You can\'t do video because no camera was found, ' +
            'and your bandwidth is too low for an audio-only stream',
        icon: 'assets/icon_warning.svg'
      });
    }

    var audioVideoSupported = results.video.bitsPerSecond > 250000 &&
      results.video.packetLossRatioPerSecond < 0.03 &&
      results.audio.bitsPerSecond > 25000 &&
      results.audio.packetLossRatioPerSecond < 0.05;

    if (audioVideoSupported) {
            
      return callback(false, {
        code : 2001,  
        text: 'You\'re all set!',
        icon: 'assets/icon_tick.svg'
      });
    }else{
        
      return callback(false, {
        code : 2003,  
        text: 'low bandwidth',
        icon: 'assets/icon_tick.svg'
      });  
    }

    if (results.audio.packetLossRatioPerSecond < 0.05) {
      return callback(false, {
        text: 'Your bandwidth can support audio only',
        icon: 'assets/icon_warning.svg'
      });
    }

    // try audio only to see if it reduces the packet loss
    setText(
      statusMessageEl,
     'Trying audio only'
   );

    publisher.publishVideo(false);

    performQualityTest({subscriber: subscriber, timeout: 5000}, function(error, results) {
      var audioSupported = results.audio.bitsPerSecond > 25000 &&
          results.audio.packetLossRatioPerSecond < 0.05;

      if (audioSupported) {
        return callback(false, {
          text: 'Your bandwidth can support audio only',
          icon: 'assets/icon_warning.svg'
        });
      }

      return callback(false, {
        text: 'Your bandwidth is too low for audio',
        icon: 'assets/icon_error.svg'
      });
    });
  });
};


function performQualityTest(config, callback) {
  var startMs = new Date().getTime();
  var testTimeout;
  var currentStats;

  var bandwidthCalculator = bandwidthCalculatorObj({
    subscriber: config.subscriber
  });

  var cleanupAndReport = function() {
    currentStats.elapsedTimeMs = new Date().getTime() - startMs;
    callback(undefined, currentStats);

    window.clearTimeout(testTimeout);
    bandwidthCalculator.stop();

    callback = function() {};
  };

  // bail out of the test after 30 seconds
  window.setTimeout(cleanupAndReport, config.timeout);

  bandwidthCalculator.start(function(stats) {
    //console.log(stats);

    // you could do something smart here like determine if the bandwidth is
    // stable or acceptable and exit early
    currentStats = stats;
  });
}

function bandwidthCalculatorObj(config) {
  var intervalId;

  config.pollingInterval = config.pollingInterval || 500;
  config.windowSize = config.windowSize || 2000;
  config.subscriber = config.subscriber || undefined;

  return {
    start: function(reportFunction) {
      var statsBuffer = [];
      var last = {
        audio: {},
        video: {}
      };

      intervalId = window.setInterval(function() {
        config.subscriber.getStats(function(error, stats) {
          var activeMediaTypes = Object.keys(stats)
          .filter(function(key) {
            return key !== 'timestamp';
          });
          var snapshot = {};
          var nowMs = new Date().getTime();
          var sampleWindowSize;

          activeMediaTypes.forEach(function(type) {
            snapshot[type] = Object.keys(stats[type]).reduce(function(result, key) {
              result[key] = stats[type][key] - (last[type][key] || 0);
              last[type][key] = stats[type][key];
              return result;
            }, {});
          });

          // get a snapshot of now, and keep the last values for next round
          snapshot.timestamp = stats.timestamp;

          statsBuffer.push(snapshot);
          statsBuffer = statsBuffer.filter(function(value) {
            return nowMs - value.timestamp < config.windowSize;
          });

          sampleWindowSize = getSampleWindowSize(statsBuffer);

          if (sampleWindowSize !== 0) {
            reportFunction(calculatePerSecondStats(
              statsBuffer,
              sampleWindowSize + (config.pollingInterval / 1000)
            ));
          }
        });
      }, config.pollingInterval);
    },

    stop: function() {
      window.clearInterval(intervalId);
    }
  };
}

function getSampleWindowSize(samples) {
  var times = pluck(samples, 'timestamp');
  return (max(times) - min(times)) / 1000;
}

function pluck(arr, propertName) {
  return arr.map(function(value) {
    return value[propertName];
  });
}

function max(arr) {
  return Math.max.apply(undefined, arr);
}
function min(arr) {
  return Math.min.apply(undefined, arr);
}

function calculatePerSecondStats(statsBuffer, seconds) {
  var stats = {};
  var activeMediaTypes = Object.keys(statsBuffer[0] || {})
    .filter(function(key) {
      return key !== 'timestamp';
    });

  activeMediaTypes.forEach(function(type) {
    stats[type] = {
      packetsPerSecond: sum(pluck(statsBuffer, type), 'packetsReceived') / seconds,
      bitsPerSecond: (sum(pluck(statsBuffer, type), 'bytesReceived') * 8) / seconds,
      packetsLostPerSecond: sum(pluck(statsBuffer, type), 'packetsLost') / seconds
    };
    stats[type].packetLossRatioPerSecond = (
      stats[type].packetsLostPerSecond / stats[type].packetsPerSecond
    );
  });

  stats.windowSize = seconds;
  return stats;
}

function getSampleWindowSize(samples) {
  var times = pluck(samples, 'timestamp');
  return (max(times) - min(times)) / 1000;
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn, scope) {
    for (var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  };
}

function sum(arr, propertyName) {
  if (typeof propertyName !== 'undefined') {
    arr = pluck(arr, propertyName);
  }

  return arr.reduce(function(previous, current) {
    return previous + current;
  }, 0);
}

// document.addEventListener('DOMContentLoaded', function() {
//   var container = document.createElement('div');
//   container.className = 'container';

//   container.appendChild(publisherEl);
//   container.appendChild(subscriberEl);
//   document.body.appendChild(container);

//   // This publisher uses the default resolution (640x480 pixels) and frame rate (30fps).
//   // For other resoultions you may need to adjust the bandwidth conditions in
//   // testStreamingCapability().

//   publisher = OT.initPublisher(publisherEl, {}, callbacks.onInitPublisher);

//   session = OT.initSession(API_KEY, SESSION_ID);
//   session.connect(TOKEN, callbacks.onConnect);
//   statusContainerEl = document.getElementById('status_container');
//   statusMessageEl = statusContainerEl.querySelector('p');
//   statusIconEl = statusContainerEl.querySelector('img');
// });