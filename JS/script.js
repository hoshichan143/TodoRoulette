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
AddListBtn.addEventListener("click", () => {});

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
  newTxtBox.maxLength = 15;
  //リストを生成
  var newli = document.createElement("li");
  //リスト内に追加
  newli.appendChild(newTxtBox);
  //ulリスト内に追加
  UlTodoList.appendChild(newli);
}
