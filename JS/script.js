//SVG要素の取得
const SVGRouletteBase = document.getElementById("svgRouletteBase");
const SVGRouletteBoard = document.getElementById("svgRouletteBoard");
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
  var board = SVGRouletteBoard;
  for (let i = 0; i < todoTxtAry.length; i++) {
    createRouletteSector(sectDeg, i, board, colorCodes); //領域生成
    createText(board, sectDeg, i, todoTxtAry[i]); //Todoの項目を載せる
  }
  //gタグでまとめた要素ごと回転アニメを行わせる
  SpinWheel(board);
});

//ルーレットの扇形領域を生成する
function createRouletteSector(deg, count, board, palette) {
  var newSect = document.createElementNS("http://www.w3.org/2000/svg", "path");
  //盤の中心座標や半径といった情報を取得
  var circle = SVGRouletteCircle;
  var cx = Number(circle.getAttribute("cx"));
  var cy = Number(circle.getAttribute("cy"));
  var r = Number(circle.getAttribute("r"));
  //角度計算に必要な値を算出
  var startDeg = -90 + deg * count; //12時方向から描画開始させるように-90する
  var endDeg = -90 + deg * (count + 1);
  var startRad = degToRad(startDeg);
  var endRad = degToRad(endDeg);
  console.log(`${startDeg}${endDeg}`);
  //三角関数で始点と終点の座標を求める
  var sx = cx + r * Math.cos(startRad);
  var sy = cy + r * Math.sin(startRad);
  var ex = cx + r * Math.cos(endRad);
  var ey = cy + r * Math.sin(endRad);
  //pathのd属性を設定する
  var largeArcFlag = deg > 180 ? 1 : 0;
  var pathStr = `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${largeArcFlag} 1 ${ex} ${ey} Z`; //時計周りに描画
  newSect.setAttribute("d", pathStr);
  //扇型領域の色を決定する
  sectColor(newSect, palette, count);
  //扇型領域を盤の上に追加する
  board.appendChild(newSect);
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

function createText(board, deg, count, todoStr) {
  //座標設定
  //
  //盤の中心座標や半径といった情報を取得
  var circle = SVGRouletteCircle;
  var cx = Number(circle.getAttribute("cx"));
  var cy = Number(circle.getAttribute("cy"));
  var r = Number(circle.getAttribute("r"));
  //角度計算に必要な値を算出
  var r = r * 0.95; //文字の開始地点が円周より内側になるようにする
  var startDeg = -90 + deg * (count + 0.5); //各領域の円弧の中点から文字が始まるようにする
  var startRad = degToRad(startDeg);
  //三角関数で始点の座標を求める
  var sx = cx + r * Math.cos(startRad);
  var sy = cy + r * Math.sin(startRad);

  //円周から中心に向かって伸びるpathを作成
  var newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var pathId = `textPath${count}`;
  newPath.setAttribute("id", pathId); //パスにIDをセットする
  newPath.setAttribute("d", `M ${sx} ${sy} L ${cx} ${cy}`); // M(スタート) から L(ゴール：中心) への直線
  board.appendChild(newPath); // 盤に追加
  //text要素と、パスに沿わせるための textPath要素を作る
  var newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  var newTextPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "textPath",
  );
  // テキスト内容をtextPathに入れる
  newTextPath.textContent = todoStr;
  // PathのIDを紐付ける
  newTextPath.setAttribute("href", `#${pathId}`);
  newText.setAttribute("font-size", "40%");
  //縦書き指定にする
  newText.setAttribute("writing-mode", "vertical-rl");
  // textの中にtextPathを入れ、それを盤に追加する
  newText.appendChild(newTextPath);
  board.appendChild(newText);
}

//ルーレットを回転させる
function SpinWheel(board) {
  board.animate(
    // 途中の状態を表す配列
    [
      { transform: "rotate(0deg)" }, // 開始時の状態（0度）
      { transform: "rotate(360deg)" }, // 終了時の状態（360度）
    ],
    // タイミングに関する設定
    {
      fill: "backwards", // 再生前後の状態（再生前、開始時の状態を適用）
      duration: 1000, // 再生時間（1000ミリ秒）
      iterations: Infinity, // アニメーションの繰り返し回数（ずっと繰り返す）
    },
  );
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
