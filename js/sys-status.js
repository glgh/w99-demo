function updateSystemStatus(status) {
  if (status.failed) {
    var msg = '<font color="red">Failed!</font>'
  } else {
    var msg = 'Normal'
  }
  document.getElementById("system_status_msg").innerHTML = msg;

  var v_avg = "Average Speed: " + status.v_avg.toFixed(1) + " m/s";
  document.getElementById("system_status_v_avg").innerHTML = v_avg;
}
