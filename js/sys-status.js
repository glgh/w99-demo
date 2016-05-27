function drawSystemStatus(systemStatus) {
  var text_area = document.getElementById("status_system");
  if (systemStatus.failed) {
    var message = '<font color="red">Failed!</font>'
  } else {
    var message = 'Normal'
  }
  text_area.innerHTML = message;
}
