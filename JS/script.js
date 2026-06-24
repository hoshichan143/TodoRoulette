//ulリスト要素の取得
const UlTodoList = document.getElementById("ulTodoList");
//回すボタンの取得
const RouletteBtn = document.getElementById("rouletteBtn");
//増やすボタンの取得
const AddListBtn = document.getElementById("addListBtn");

//DOM読み込み後に実行
document.addEventListener("DOMContentLoaded", function () {
  //テキストボックスを生成する関数を五回実行する
  for (let i = 0; i <= 4; i++) {
    createTxtBox();
  }
});

//回すボタンクリック
RouletteBtn.addEventListener("click", () => {
  console.log("回すボタンが押されました");
  var todoTxtAry = []; //テキストボックス値格納用の配列
  var todoBoxes = document.getElementsByClassName("todoBox"); //テキストボックスたちを取得
  for (i = 0; i < todoBoxes.length; i++) {
    let todoStr = todoBoxes[i].value.trim();
    if (todoStr !== "" && todoStr !== null) {
      todoTxtAry.push(todoStr); //テキストボックス内が空でない場合、値を配列に格納する
    }
  }
  if (todoTxtAry.length < 1) return; //値が何も取得されなかった場合関数を抜ける
  todoTxtAry.forEach((txt) => console.log(txt));
});

//増やすボタンクリック
AddListBtn.addEventListener("click", () => {
  var listsCount = $("#ulTodoList li").length;
  //画面内のテキストボックスが10個になるまでは生成可能
  if (listsCount > 10) {
    alert("項目は10個までにしてね!");
    return;
  }
  createTxtBox();
});

//テキストボックスを生成しリスト内に追加する
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
