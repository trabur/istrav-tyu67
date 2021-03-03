
export default function createImage(string, width, height, fontSize) {

  let drawing = document.createElement("canvas");

  drawing.width = width || '150'
  drawing.height = height || '250'

  let ctx = drawing.getContext("2d");

  ctx.fillStyle = "transparent";
  //ctx.fillRect(0, 0, 150, 150);
  ctx.beginPath();
  ctx.arc(75, 75, 20, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize || '20pt'} arial`;
  ctx.textAlign = "center";
  ctx.fillText(string, drawing.width / 2, 85);
  // ctx.strokeText("Canvas Rocks!", 5, 130);

  return drawing.toDataURL("image/png");
}