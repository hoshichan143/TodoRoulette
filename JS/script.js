//SVG要素の取得
const SVGRouletteBase = document.getElementById("svgRouletteBase");
const SVGRouletteCircle = document.getElementById("svgRouletteCircle");
//ulリスト要素の取得
const UlTodoList = document.getElementById("ulTodoList");
//回すボタンの取得
const RouletteBtn = document.getElementById("rouletteBtn");
//増やすボタンの取得
const AddListBtn = document.getElementById("addListBtn");

//DOM読み込み後に実行
document.addEventListener("DOMContentLoaded", function () {
  //テキストボックスを生成する関数を五回実行する(初期表示時のもの　数値は自由にメンテOK)
  for (let i = 0; i <= 4; i++) {
    createTxtBox();
  }
});

//回すボタンクリック
RouletteBtn.addEventListener("click", () => {
  console.log("回すボタンが押されました");
  //テキストボックス内の「Todo」を配列内へ格納し、回収する
  //
  var todoTxtAry = []; //テキストボックス値格納用の配列
  var todoBoxes = document.getElementsByClassName("todoBox"); //テキストボックスたちを取得
  for (let i = 0; i < todoBoxes.length; i++) {
    let todoStr = todoBoxes[i].value.trim();
    if (todoStr !== "" && todoStr !== null) {
      todoTxtAry.push(todoStr); //テキストボックス内が空でない場合、値を配列に格納する
    }
  }
  if (todoTxtAry.length < 1) return; //値が何も取得されなかった場合関数を抜ける
  todoTxtAry.forEach((txt) => console.log(txt));

  //配列に格納した値をもとにルーレット盤を生成する
  //
  var base = SVGRouletteBase;
  base.style.visibility = "visible";
  base.style.opacity = 1;
  //配列の長さを取得して、円盤を何分割するか、そしてその際の角度を算出する
  var sectDeg = Number(360 / todoTxtAry.length);
  //配色用パレットを作成する
  var colorCodes = [];
  makeColorPallete(colorCodes, todoTxtAry.length);
  //扇形を項目数分生成する
  for (let i = 0; i < todoTxtAry.length; i++) {
    createRouletteSector(sectDeg, i, base, colorCodes); //領域生成
    createText(base, sectDeg, i, todoTxtAry[i]); //Todoの項目を載せる
  }
});

//ルーレットの扇形領域を生成する
function createRouletteSector(deg, count, base, palette) {
  var newSect = document.createElementNS("http://www.w3.org/2000/svg", "path");
  //盤の中心座標や半径といった情報を取得
  var circle = SVGRouletteCircle;
  var cx = Number(circle.getAttribute("cx"));
  var cy = Number(circle.getAttribute("cy"));
  var r = Number(circle.getAttribute("r"));
  //角度計算に必要な値を算出
  var startDeg = deg * count;
  var endDeg = deg * (count + 1);
  var startRad = degToRad(90 - startDeg);
  var endRad = degToRad(90 - endDeg);
  //三角関数で始点と終点の座標を求める
  var sx = cx + r * Math.cos(startRad);
  var sy = cy + r * Math.sin(startRad);
  var ex = cx + r * Math.cos(endRad);
  var ey = cy + r * Math.sin(endRad);
  //pathのd属性を設定する
  var pathStr = `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 0 0 ${ex} ${ey} Z`;
  newSect.setAttribute("d", pathStr);
  //扇型領域の色を決定する
  sectColor(newSect, palette, count);
  //扇型領域を盤の上に追加する
  base.appendChild(newSect);
}

//度をラジアンへと変換する（主に三角関数の引数用）
function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

//扇形領域の色を決める
function sectColor(newSect, palette, count) {
  newSect.style.fill = palette[count];
}

//項目数に応じて配色用パレットの中身を決定する
function makeColorPallete(emptyColorCodeAry, todoLength) {
  var paletteA = [
    "#E9546B",
    "#F6AD3C",
    "#FFF33F",
    "#AACF52",
    "#00AFEC",
    "#187FC4",
    "#A64A97",
  ]; //基本の七色
  var paletteB = ["#EA5532", "#00ADA9", "#E85298"]; //追加用の色
  if (todoLength <= 7) {
    emptyColorCodeAry.push(...paletteA.slice(0, todoLength));
  } else if (todoLength == 8) {
    emptyColorCodeAry.push(...paletteA.slice(0, 7));
    emptyColorCodeAry.unshift(paletteB[0]);
  } else if (todoLength == 9) {
    emptyColorCodeAry.push(...paletteA.slice(0, 7));
    emptyColorCodeAry.unshift(paletteB[0]);
    emptyColorCodeAry.splice(5, 0, paletteB[1]);
  } else if (todoLength == 10) {
    emptyColorCodeAry.push(...paletteA.slice(0, 7));
    emptyColorCodeAry.unshift(paletteB[0]);
    emptyColorCodeAry.splice(5, 0, paletteB[1]);
    emptyColorCodeAry.push(paletteB[2]);
  }
}

function createText(base, deg, count, todoStr) {
  var newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  //取得したTodoを値に設定
  var todoTxt = document.createTextNode(todoStr);
  console.log(todoTxt);
  newText.appendChild(todoTxt);
  //座標設定
  //
  //盤の中心座標や半径といった情報を取得
  var circle = SVGRouletteCircle;
  var cx = Number(circle.getAttribute("cx"));
  var cy = Number(circle.getAttribute("cy"));
  var r = Number(circle.getAttribute("r"));
  //角度計算に必要な値を算出
  var r = r * 0.95; //文字の開始地点が円周より内側になるようにする
  var startDeg = deg * (count + 0.5); //各領域の円弧の中点から文字が始まるようにする
  var startRad = degToRad(90 - startDeg);
  //三角関数で始点の座標を求める
  var sx = cx + r * Math.cos(startRad);
  var sy = cy + r * Math.sin(startRad);

  newText.setAttribute("x", sx);
  newText.setAttribute("y", sy);
  newText.setAttribute("font-size", "50%");
  //縦書き指定にする
  newText.setAttribute("writing-mode", "vertical-rl");
  console.log(`${deg},${startDeg}`);
  //文章が円の中心に向かうように回転させる
  newText.setAttribute(
    "transform",
    `rotate(${(Math.atan2(sy - cy, sx - cx) * 180) / Math.PI} ${sx} ${sy})`, //???ここぜんぜんわからん
  );

  //扇形領域に載せる
  base.appendChild(newText);
}

//増やすボタンクリック
AddListBtn.addEventListener("click", () => {
  var listsCount = $("#ulTodoList li").length;
  //画面内のテキストボックスが10個になるまでは生成可能
  if (listsCount >= 10) {
    alert("項目は10個までにしてね!");
    return;
  }
  //テキストボックスを生成する
  createTxtBox();
});

//テキストボックスを生成しulリスト内に追加する
function createTxtBox() {
  //テキストボックスを生成
  var newTxtBox = document.createElement("input");
  newTxtBox.type = "text";
  newTxtBox.className = "todoBox";
  newTxtBox.maxLength = 15;
  //リストを生成
  var newli = document.createElement("li");
  //リスト内に追加
  newli.appendChild(newTxtBox);
  //ulリスト内に追加
  UlTodoList.appendChild(newli);
}
