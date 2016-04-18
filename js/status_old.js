
function updateCarStatus(cars, w99_parameters) {
  var n = cars.length;
  if (n <= 0) {return}

  for (var i = 0; i < n; i++) {
    car = cars[i]
    if (!jQuery.isEmptyObject(car.status)){
      var canvas_status = document.getElementById('status' +  (i+1).toString());
      plotStatus(canvas_status, car, i+1, w99_parameters);
    }
  }
}
