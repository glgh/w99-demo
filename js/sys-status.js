function updateSystemStatus(status) {
  if (status.failed) {
    var msg = '<font color="red">Simulation FAILED due to collision!</font> Press "Reset" to continue.'
  } else {
    var msg = 'Normal'
  }
  document.getElementById("system_status_msg").innerHTML = msg;

  var v_avg = "Speed - Average: " + status.v_avg.toFixed(1) + " m/s";
  document.getElementById("system_status_v_avg").innerHTML = v_avg;

  var v_sdv =  "Speed - Standard Deviation: " + status.v_sdv.toFixed(1) + " m/s";
  document.getElementById("system_status_v_sdv").innerHTML = v_sdv;


}
