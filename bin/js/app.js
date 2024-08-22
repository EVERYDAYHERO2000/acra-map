var APP = {
  data: [],
  map: null
};


$(function () {

  const D = {
    raw : [],
    id : {},
    name : {},
    postalCode : {},
    lat : {},
    lon : {},
    ssic : {},
    registrationDate : {},
    point : {}
  }
  
  APP.data = D;
  
  
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
  }
  
  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };
  


  function pushData(a, t) {

      if (Array.isArray(a)) {
        var el = a;
        el[el.length] = t;
        return el;
      } else {
        return [t]
      }

  }  
  



  var map = L.map("map");
  APP.map = map;
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png").addTo(map);
  map.setView([1.3585563850639484, 103.79559874534608], 12);
  

  var myRenderer = L.canvas({
    padding: 0.5
  });
 
  $.ajax({
    type: "GET",
    url: "../data/all.csv",
    dataType: "text",
    success: function (response) {
      
      data = $.csv.toArrays(response);

      data = data.slice(1, data.length - 1);
      
      //console.log(data)
      
      var length = data.length;
      
      for (var i = length; i--;){
        
        let temp = {
          id                : data[i][0] * 1,
          name              : data[i][1],
          postalCode        : data[i][2],
          address           : data[i][3],
          ssic_1            : data[i][4],
          ssic_2            : data[i][5],
          registrationDate  : data[i][6],
          lat               : data[i][7] * 1,
          lon               : data[i][8] * 1
        }
        
          if (!temp.lat) continue;
        
          D.raw.push(temp);
        
          D.id[temp.id] = pushData(D.id[temp.id], temp);

          D.name[temp.name] = pushData(D.name[temp.name], temp);

          D.postalCode[temp.postalCode] = pushData(D.postalCode[temp.postalCode], temp);

          D.lat[temp.lat] = pushData(D.lat[temp.lat], temp);

          D.lon[temp.lon] = pushData(D.lon[temp.lon], temp);
        
          D.registrationDate[temp.registrationDate] = pushData(D.registrationDate[temp.registrationDate], temp);
        
          D.point[temp.lat + ' ' + temp.lon] = pushData(D.point[temp.lat + ' ' + temp.lon], temp);
          
          D.ssic[temp.ssic_1] = pushData(D.ssic[temp.ssic_1], temp);
          
          if (data[i][5]){
            D.ssic[temp.ssic_2] = pushData(D.ssic[temp.ssic_2], temp);
          }
        
      }
      
      
      //console.log(length)
      
      var myCustomCanvasDraw = function(){
              this.onLayerDidMount = function (){      
                console.log('mount')
                 // -- prepare custom drawing    
              };
              this.onLayerWillUnmount  = function(){
                console.log('cleanup')
                 // -- custom cleanup    
              };
              this.setData = function (data){
                console.log('set data')
                // -- custom data set
                this.needRedraw(); // -- call to drawLayer
              };
              this.onDrawLayer = function (viewInfo){
              // -- custom  draw
                //console.log('redraw')
                
                var ctx = viewInfo.canvas.getContext('2d');
                ctx.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
                
                
                
                var points = APP.data.point;
                
                for (var k in points) {
                  var point = points[k];

                  if (viewInfo.bounds.contains([point[0].lat, point[0].lon])) {

                    for (var l = point.length; l--;) {

                      if (point[l].ssic_1 == 70201) {
                        //Management consultancy services (general)
                        ctx.fillStyle = "rgba(0, 98, 255, 0.5)";
                        break;
                      } else if (point[l].ssic_1 == 62019) {
                        //Development of other software and programming activities n.e.c.
                        ctx.fillStyle = "rgba(0, 255, 118, 0.5)";
                        break;
                      } else if (point[l].ssic_1 == 46900) {
                        //Wholesale trade of a variety of goods without a dominant product
                        ctx.fillStyle = "rgba(245, 0, 255, 0.5)";
                        break;  
                      } else if (point[l].ssic_1.search(/^56/g) > -1) {

                        ctx.fillStyle = "rgba(255, 186, 0, 0.8)";
                        break;  
                      } else {
                        //
                        ctx.fillStyle = "rgba(255,116,0, 0.1)";
                      }
                      
                      if (point[l].ssic_2 == 70201) {
                        //Management consultancy services (general)
                        ctx.fillStyle = "rgba(0, 98, 255, 0.5)";
                        break;
                      } else if (point[l].ssic_2 == 62019) {
                        //Development of other software and programming activities n.e.c.
                        ctx.fillStyle = "rgba(0, 255, 118, 0.5)";
                        break;
                      } else if (point[l].ssic_2 == 46900) {
                        //Wholesale trade of a variety of goods without a dominant product
                        ctx.fillStyle = "rgba(245, 0, 255, 0.5)";
                        break;  
                      } else if (point[l].ssic_2.search(/^56/g) > -1) {

                        ctx.fillStyle = "rgba(255, 186, 0, 0.8)";
                        break;  
                      } else {
                        //
                        ctx.fillStyle = "rgba(255,116,0, 0.1)";
                      }

                    }
                    //console.log(point[l],point[l].lat)
                    dot = viewInfo.layer._map.latLngToContainerPoint([point[0].lat, point[0].lon]);
                    ctx.beginPath();

                    
                    ctx.arc(dot.x, dot.y, size[APP.map._zoom].s, 0, Math.PI * 2);

                    ctx.fill();
                    
                  }

                }
                ctx.closePath();
                //console.log(APP.map._zoom)
                
                /*
                for (var i = length; i--;) {
                    
                    var d = data[i];
                  
                    var lat = d[7]*1;
                    var lon = d[8]*1;
                    
                    
                    
                    
                  
                    if (d[4] == 70201){
                      //Management consultancy services (general)
                      ctx.fillStyle = "rgba(0, 98, 255, 0.5)";
                    } else if (d[4] == 62019) {
                      //Development of other software and programming activities n.e.c.
                      ctx.fillStyle = "rgba(0, 255, 118, 0.5)";  
                    } else if (d[4] == 46900){ 
                      //Wholesale trade of a variety of goods without a dominant product
                      ctx.fillStyle = "rgba(245, 0, 255, 0.5)"; 
                    } else {
                      //
                      ctx.fillStyle = "rgba(255,116,0, 0.2)";
                    }
                  
                    
                  if (lat && lon){
                    
                    
                    
                    if (viewInfo.bounds.contains([lat, lon])) {
                        
                        dot = viewInfo.layer._map.latLngToContainerPoint([lat, lon]);
                        ctx.beginPath();
                        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.closePath();
                    }
                  }
                  if (i === 0) break;
                }
                */
                //console.log(data)
                
              }
              
          }
          
          myCustomCanvasDraw.prototype = new L.CanvasLayer(); // -- setup prototype 
          
          var myLayer = new myCustomCanvasDraw();
          myLayer.addTo(map);
      
      /*
      L.canvasLayer()
            .delegate(this) // -- if we do not inherit from L.CanvasLayer we can setup a delegate to receive events from L.CanvasLayer
            .addTo(APP.map);
      
      function onDrawLayer(info) {
            var ctx = info.canvas.getContext('2d');
            ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
            ctx.fillStyle = "rgba(255,116,0, 0.2)";
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                if (info.bounds.contains([d[0], d[1]])) {
                    dot = info.layer._map.latLngToContainerPoint([d[0], d[1]]);
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        };*/
      
      
      
      /*
      for (var i=0; i < 10000; i++){
        
        var lat = data[i][7];
        var lon = data[i][8];   
        
        L.circleMarker([lat,lon], {
  	     renderer: myRenderer
        }).addTo(map);
        
      }
      console.log(i)*/
      //console.log(data)
      
      
      
    }

  });


});
