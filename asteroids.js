function Triangle() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 480;
  context.beginPath();
  context.moveTo(canvas.width/2, canvas.height/2);
  context.lineTo(canvas.width/2+10,canvas.height/2+30);
  context.lineTo(canvas.width/2-10, canvas.height/2+30);
  context.lineTo(canvas.width/2, canvas.height/2);
  context.stroke();
}
window.onload = Triangle;