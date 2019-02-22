
function createMap(id, options, query, css){
  
  window.APP = window.APP || {
       data: {
         points: {},
         acra: [],
         ssic: {},
         years: []
       },
       hash: {
         regdates: {},
         timeline: {},
         ssic: {},
         points: {}
       },
       status : false 
     };
  
  const size = {
    0: {
      s: 0.5
    },
    1: {
      s: 0.5
    },
    2: {
      s: 0.5
    },
    3: {
      s: 0.5
    },
    4: {
      s: 0.5
    },
    5: {
      s: 0.5
    },
    6: {
      s: 0.5
    },
    7: {
      s: 0.5
    },
    8: {
      s: 0.5
    },
    9: {
      s: 0.5
    },
    10: {
      s: 1
    },
    11: {
      s: 1
    },
    12: {
      s: 2
    },
    13: {
      s: 3
    },
    14: {
      s: 3
    },
    15: {
      s: 5
    },
    16: {
      s: 5
    },
    17: {
      s: 8
    },
    18: {
      s: 12
    }
  };
  const colors = [
    "#F44336","#E91E63","#9C27B0",
    "#673AB7","#3F51B5","#2196F3",
    "#039BE5","#00ACC1","#00897B",
    "#4CAF50","#8BC34A","#CDDC39",
    "#FFEB3B","#FF8F00","#E65100"];
  var queryRegex;
  var mapQuery = [];
  

  
  var container = (function(id,css){
    css = css || {};
    var $map = $(`<div class="map"></div>`).css(css);
    $('#'+id).addClass('map-app').append($map);
    return $('#'+id).find('.map')[0];
  })(id,css);
  
  var map = L.map(container);
  APP.map = APP.map || [];
  APP.map.push(map);
  L.tileLayer("https://{s}.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZ2xlYWZsZXQiLCJhIjoiY2lxdWxoODl0MDA0M2h4bTNlZ2I1Z3gycyJ9.vrEWCC2nwsGfAYKZ7c4HZA").addTo(map);
  map.setView([options.lat, options.lon], options.zoom);

  map.attributionControl.setPosition('bottomleft').addAttribution('osome');
  


  var myCustomCanvasDraw = function () {
    this.onLayerDidMount = function () {
      $('#'+id).append(`<div class="spinner"></div>`);
      console.log('mount')
      
      if (options.controls){
        createUI(id, query);
      }
      // -- prepare custom drawing    
    };
    this.onLayerWillUnmount = function () {
      console.log('cleanup')
      // -- custom cleanup    
    };
    this.setData = function (data) {
      console.log('set data')
      // -- custom data set
      this.needRedraw(); // -- call to drawLayer
    };
    this.onDrawLayer = function (viewInfo) {
      
      //drawPoint(viewInfo);
      drawQuery(mapQuery, viewInfo);
    };
    map.myCustomCanvasDraw = this;
  };
  


  myCustomCanvasDraw.prototype = new L.CanvasLayer(); // -- setup prototype 

  var myLayer = new myCustomCanvasDraw();
  myLayer.addTo(map);

  loadData(function(){
    setQuery(query);
  });

  function drawPoint(viewInfo) {
    var ctx = viewInfo.canvas.getContext('2d');
    ctx.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);



    var points = APP.data.points;

    for (var k in points) {
      var point = points[k];

      if (viewInfo.bounds.contains([point.lat, point.lon])) {

        ctx.fillStyle = "rgba(0, 118, 255, 0.36)";

        //console.log(point[l],point[l].lat)
        
        dot = viewInfo.layer._map.latLngToContainerPoint([point.lat, point.lon]);
        ctx.beginPath();


        ctx.arc(dot.x, dot.y, size[map._zoom].s, 0, Math.PI * 2);

        ctx.fill();

      }

    }
    ctx.closePath();
  }
  
  //Draw point collection on map 
  function drawQuery(mapQuery, viewInfo){
    var ctx = viewInfo.canvas.getContext('2d');
    ctx.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
    
    for (var i = mapQuery.length; i--;){
      for (var p in mapQuery[i].points){
        var point = mapQuery[i].points[p];
        if (viewInfo.bounds.contains([point.lat, point.lon])) {
          
          var opacity = (map._zoom < 14) ? (map._zoom < 5) ? 0.3 : 0.5 : 0.8;
          
          /*
          var rad = ('0.0000'+(''+(i*3)))*1;
          var offset = (function(x,y,r,i){
            
            return {
              x: x + r * Math.sin(i * 2 * Math.PI / 100),
              y: y + r * Math.cos(i * 2 * Math.PI / 100)
            }
            
          })(point.lat, point.lon, rad, i);
          
          var rnd = getRandomInt(4, 8)
          var rad = (map._zoom < 12)? (i*rnd)*0.0001 : (i*5)*0.00001;
          var offset = 50;
          var s = (i*offset * Math.PI / 100);
          
          var lat = point.lat + rad * Math.sin(s);
		      var lon = point.lon + rad * Math.cos(s);
          */
          
          ctx.fillStyle = RgbToRgba( mapQuery[i].color, opacity );
          var dot = viewInfo.layer._map.latLngToContainerPoint([point.lat, point.lon]);
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size[map._zoom].s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
         
    ctx.closePath();
    /*
    var filter = new MedianFilter();
    var imageData = ctx.getImageData(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
    ctx.putImageData( filter.convertImage( imageData,viewInfo.canvas.width ,viewInfo.canvas.height),10,2);
    */
    
  }

  //Create query hash collection
  function setQuery(e){
   
    e = e || query;
    
    var ssic = APP.hash.ssic;
    var tempRegex = [];
    var tempQuery = [];
    
    for(var q=0; q < e.length; q++){
      var r = '^' + e[q].q + '+';
      tempRegex.push(r);
      tempQuery.push({
        q: e[q].q,
        regex: r,
        color: e[q].color,
        points: {}
      });
    }
    
    

    var regex = new RegExp( tempRegex.join('|'), 'g');
    queryRegex = regex;
    
    for(var code in ssic){
      if ( code.search(regex) + 1 ){
        for (var i=0; i < tempQuery.length; i++){
          var r = new RegExp( tempQuery[i].regex );
          if ( code.search(r) + 1 ){
            for(var p=0; p < ssic[code].length; p++){
              tempQuery[i].points[ ssic[code][p].point.id ] = ssic[code][p].point;
            }
            //tempQuery[i].points = tempQuery[i].points.concat(ssic[code]);
          }
        }
        
      }
    }
    //console.log(tempQuery)
    mapQuery = tempQuery;
    map.myCustomCanvasDraw.needRedraw();
  }
  
  map.setQuery = setQuery;
  
  //Create interface
  function createUI(id, query){
    
    var $target = $('#'+id);
        
    var SSICcontrol = 
        `<div class="ssic-control">
            <div class="ssic-control__color">
              <div></div>
            </div>
            <div class="ssic-control__code">
              <input class="ssic-control__input" type="text" placeholder="SSIC code" />
            </div>
            <div class="ssic-control__remove">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1">
                <path style=" " d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z " class="cross" />
              </svg>
            </div>
        </div>`;
    
    var colorselect = (function(colors){
      var colorsarr = [];
      for (var c=0; c < colors.length; c++){
        colorsarr.push(`<input type="radio" name="colors" value="${colors[c]}" style="background:${colors[c]}" />`);
      }
      return `<div class="colorselect">${colorsarr.join('')}</div>`;
    })(colors);  
    
   
    //add ssic-control to controls (default state)
    //query -> <div class="ssic-control">
    var SSICControlsByQuery = (function(query){
      var elems = [];
        for(var i=0; i < query.length; i++){
          var $proto = $(SSICcontrol);
          $proto.find('.ssic-control__color div').css({'background-color':query[i].color});
          $proto.find('.ssic-control__input').val(query[i].q).attr('value',query[i].q);
          elems.push($proto[0].outerHTML);
        }
      return elems.join('');
    })(query);
    
    $target.append(
      `<div class="controls">
        <div class="controls__list">${SSICControlsByQuery}</div>
        <div class="ssic-new-query">Add New Filter</div>
      </div>`);
    
    

    
    //update query and map on element focusOut
    //.ssic-control__input -> focusout
    $('#'+id).on('focusout','.ssic-control__input', function(e){
      collectQuerys(id);
    });
    
    //update query and map on Enter keyUp
    //.ssic-control__input -> keyup
    $('#'+id).on('keyup', '.ssic-control__input', function(e){
      var code = e.which;
      if(code==13)e.preventDefault();
      if(code==13){
        collectQuerys(id);
      }
    });
    
    //add new query
    //.ssic-new-query -> click
    $('#'+id).on('click', '.ssic-new-query',function(e){
        var $proto = $(SSICcontrol);
        var color = colors[ getRandomInt(0,colors.length - 1) ];
        $proto.find('.ssic-control__color div').css({
          'background-color' : color
        });
        $('#'+id).find('.controls__list').append($proto);
    });
    
    //remove query
    //.ssic-control__remove -> click
    $('#'+id).on('click','.ssic-control__remove',function(e){
      $(this).parent().remove();
      collectQuerys(id);
    });
    
    //show color palette 
    //.ssic-control__color -> click
    $('#'+id).on('click','.ssic-control__color',function(e){
       var color = $(this).find('div').css('background-color');
         
       var $colorselect = $(colorselect);
      
       $colorselect.find('input').each(function(i,e){
         if ($(e).attr('value') == color){
           $(e).attr('checked','checked');
         }
       });
       
       $(this).parent().append($colorselect);
      
    });
    
    //hide color palette
    //.colorselect -> mouseleave
    $('#'+id).on('mouseleave','.colorselect',function(e){
      collectQuerys(id);
      $(this).remove();
    });
    
    //change color
    //.colorselect input -> change
    $('#'+id).on('change','.colorselect input',function(e){
      $(this).parents('.ssic-control').find('.ssic-control__color div').css({'background-color': $(this).val()});
      collectQuerys(id); 
      $(this).parent().remove();
    });
    
    
    

    
  }
                 
      function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}           
                 
  
      //collect all query from inputs
      function collectQuerys(id) {
        var q = [];
        $('#' + id).find('.ssic-control__input').each(function (i, e) {
          if ($(e).val()) {
            q.push({
              q: $(e).val(),
              color: $(e).parents('.ssic-control').find('.ssic-control__color div').css('background-color')
            });
          }

        });

        setQuery(q);

      }

      //rgb to rgba
      function RgbToRgba(rgb, alpha) {
        alpha = alpha || 1;
        
        return rgb.replace(/\)+/g, ',' + alpha + ')').replace(/rgb\(+/g,'rgba(');
      }
  
  //
  //
  //
  //
  //
  //
  //loading Data
   function loadData(onLoad){
     
     
     
    if (!APP.status){ 
    APP.status = true;
    if (!APP.data.years.length){
  
    dataRequest('../data/acra-years.csv', function(_years) {
        console.log('Years loaded');
        csvToObject(_years, function (a) {
          APP.data.years.push(a.year);
          APP.hash.regdates[a.year] = {};
          APP.hash.timeline[a.year] = {};
        }, function () {
          APP.data.years.sort();
          console.log('Years built');
        });
    });
    
  }
  
  if (!Object.keys(APP.data.points).length){
    
  dataRequest('../data/points.csv', function(_points) {
      console.log('Points loaded');
      csvToObject(_points, function (a) {
        a.id *= 1;
        a.lat *= 1;
        a.lon *= 1;
        APP.data.points[a.id] = a;
        APP.hash.points[a.id] = [];
      }, function () {
        console.log('Points built');
      });
  });
  
  }
  
  if (!Object.keys(APP.data.ssic).length){
  
  dataRequest('../data/ssic.csv', function(_ssic) {
    console.log('SSIC loaded');
      csvToObject(_ssic, function (a) {
        a.id *= 1;
        APP.data.ssic[a.id] = a;
        APP.hash.ssic[a.ssic] = [];
      }, function () {
        console.log('SSIC built');
      });
  });
  
  }
  
  if (!Object.keys(APP.data.acra).length){
  
  dataRequest('../data/acra-live.csv', function(_acra) {
      console.log('Acra loaded');
      csvToObject(_acra, function (a) {
        //a.local = (a.local) ? 1 : 0;
        a.ssic_1 = (a.ssic_1 in APP.data.ssic) ? APP.data.ssic[a.ssic_1] : null;
        a.ssic_2 = (a.ssic_2 in APP.data.ssic) ? APP.data.ssic[a.ssic_2] : null;
        a.point = APP.data.points[a.point];
        APP.data.acra.push(a);

        
        //hashing
        
        APP.hash.timeline[a.reg_date][a.point.id] = a;
        APP.hash.regdates[a.reg_date][a.point.id] = a;
        
        for (y in APP.hash.timeline){
          if ( y*1 > a.reg_date*1 ){  
            APP.hash.timeline[y][a.point.id] = a;
          }  
        }
        
        APP.hash.points[a.point.id].push(a); 

        
        if (a.ssic_1) APP.hash.ssic[a.ssic_1.ssic].push(a);
        if (a.ssic_2) APP.hash.ssic[a.ssic_2.ssic].push(a);
        //if (a.ssic_1) APP.hash.ssic[a.ssic_1.ssic] = pushData(APP.hash.ssic[a.ssic_1.ssic], a);
        //if (a.ssic_2) APP.hash.ssic[a.ssic_2.ssic] = pushData(APP.hash.ssic[a.ssic_2.ssic], a);
        
      }, function () {
        console.log('Acra built');
        
        
        
        onLoad();
        
        for(var i =0; i<APP.map.length;i++){
          APP.map[i].setQuery();
        }
        
        $('.spinner').remove();
      });
  });
  }
    
  } else {
    
    onLoad();
    
    
    
    
  } 


  function dataRequest(url, callback){
    
    if (window.fetch){
      fetch(url)
      .then(response => response.text())
      .then(function(data) {
        callback(data);
      });
      
    } else {
      $.ajax({
      type: 'GET',
      url: url,
      dataType: 'text',
      success: function (data) {
          callback(data);
        }
      });
    }
    
  }
  
  function csvToObject(csv, step, callback){
    let tempObject=[];
    const div = ';'

    csv = csv.split(/\n/);
    
    let headers = csv.slice(0,1)[0].split(div),
        hLength = headers.length,
        csvLength = csv.length - 1;
    
    for (var i = csvLength; i--;){
      let line = csv[i].split(div);
      let temp = {};
      for (var h = 0; h < hLength; h++ ){
        temp[ headers[h] ] = line[h];     
      }
      if (i > 0){
        if (step) step(temp);
        tempObject.push(temp);
      }
    }
    
    tempObject.pop();
    
    if (callback) callback(tempObject);
    return tempObject;  
  }
  
  
  function pushData(a, t) {

    if (Array.isArray(a)) {
      var el = a;
      el[el.length] = t;
      return el;
    } else {
      return [t]
    }
  }
      
   
  
   }
  ///
}
