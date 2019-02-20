APP = {
  data: {
    points: {},
    acra: [],
    ssic: {},
    years: []
  },
  hash : {
    regdates : {},
    timeline : {},
    ssic : {},
    points : {}
  }
};

$(function () {
  
  
  
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
        
        for(var i=0; i<APP.map.length;i++){
          APP.map[i].myCustomCanvasDraw.needRedraw();
        }
        
        $('.spinner').remove();
      });
  });
    
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
      
   
  
});