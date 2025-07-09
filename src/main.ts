// import { invoke } from "@tauri-apps/api/core";

let x_input: HTMLInputElement | null;
let y_input: HTMLInputElement | null;
let r_input: HTMLInputElement | null;
let theta_input: HTMLInputElement | null;

class complexNumber {
  x: number;
  y: number;
  r: number;
  theta: number; // ラジアン

  constructor() {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.theta = 0;
  }

  // 直交座標からフェーザ形式を計算
  calculate_from_xy(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.r = Math.sqrt(x**2 + y**2);
    // Math.atan2はラジアンを返す
    this.theta = Math.atan2(y, x);
  }

  // フェーザ形式から直交座標を計算
  calculate_from_rtheta(r: number, theta: number): void {
    this.r = r;
    this.theta = theta;
    this.x = r * Math.cos(theta);
    this.y = r * Math.sin(theta);
  }

  // 位相角を度数法に変換して取得
  getThetaInDegrees(): number {
    return this.theta * (180 / Math.PI);
  }

  // 度数法の位相角を設定
  setThetaFromDegrees(degrees: number): void {
    this.theta = degrees * (Math.PI / 180);
  }
}

function getNumberValueFromInput(inputElement: HTMLInputElement): number | null {
  const inputValue = inputElement.value;

  // 値が空文字列の場合はnullを返す
  if (inputValue.trim() === '') {
    return null;
  }

  try {
    // eval() を使って文字列をJavaScriptの計算式として評価する
    // ただし、eval() はセキュリティリスクがあるため注意して使用すること
    const evaluatedValue = eval(inputValue);

    // 評価結果が数値であり、かつ有限な数値であることを確認
    if (typeof evaluatedValue === 'number' && !isNaN(evaluatedValue) && isFinite(evaluatedValue)) {
      return evaluatedValue;
    } else {
      // 数値として評価できない場合はnullを返す
      return null;
    }
  } catch (e) {
    // eval() でエラーが発生した場合（例: 不正な構文の計算式）
    console.error("Evaluation error:", e);
    return null;
  }
}

const c = new complexNumber();

window.addEventListener("DOMContentLoaded", () => {
  x_input = document.querySelector("#x");
  y_input = document.querySelector("#y");
  r_input = document.querySelector("#r");
  theta_input = document.querySelector("#theta"); // このthetaは度数法の入力として扱う

  // DOM要素が確実に存在することをチェックし、存在しない場合はエラーを出す
  // 開発中に要素が見つからない場合はここで早期に気づける
  if (!x_input || !y_input || !r_input || !theta_input) {
    console.error("Required input elements not found!");
    return; // 要素が見つからない場合は以降の処理を中断
  }

  // x入力時のイベントハンドラ
  x_input.addEventListener("input", () => {
    // x_input と y_input は上で null チェックされているので、! を使用
    const x = getNumberValueFromInput(x_input!);
    const y = getNumberValueFromInput(y_input!);

    if (x !== null && y !== null) {
      c.calculate_from_xy(x, y);
      // rとthetaの値を更新
      r_input!.value = String(c.r);
      theta_input!.value = String(c.getThetaInDegrees()); // 度数法に変換して表示
    } else {
      // どちらか一方がnullの場合、対応する出力もクリアまたはエラー表示
      r_input!.value = "";
      theta_input!.value = "";
    }
  });

  // y入力時のイベントハンドラ
  y_input.addEventListener("input", () => {
    const x = getNumberValueFromInput(x_input!);
    const y = getNumberValueFromInput(y_input!);

    if (x !== null && y !== null) {
      c.calculate_from_xy(x, y);
      r_input!.value = String(c.r);
      theta_input!.value = String(c.getThetaInDegrees()); // 度数法に変換して表示
    } else {
      r_input!.value = "";
      theta_input!.value = "";
    }
  });

  // r入力時のイベントハンドラ
  r_input.addEventListener("input", () => {
    const r = getNumberValueFromInput(r_input!);
    // theta入力は度数法として受け取る
    const theta_degrees = getNumberValueFromInput(theta_input!);

    if (r !== null && theta_degrees !== null) {
      c.setThetaFromDegrees(theta_degrees); // 度数法からラジアンに変換して設定
      c.calculate_from_rtheta(r, c.theta); // complexNumber内部のラジアン値を使用
      // xとyの値を更新
      x_input!.value = String(c.x);
      y_input!.value = String(c.y);
    } else {
      // どちらか一方がnullの場合、対応する出力もクリアまたはエラー表示
      x_input!.value = "";
      y_input!.value = "";
    }
  });

  // theta入力時のイベントハンドラ
  theta_input.addEventListener("input", () => {
    const r = getNumberValueFromInput(r_input!);
    // theta入力は度数法として受け取る
    const theta_degrees = getNumberValueFromInput(theta_input!);

    if (r !== null && theta_degrees !== null) {
      c.setThetaFromDegrees(theta_degrees); // 度数法からラジアンに変換して設定
      c.calculate_from_rtheta(r, c.theta); // complexNumber内部のラジアン値を使用
      x_input!.value = String(c.x);
      y_input!.value = String(c.y);
    } else {
      x_input!.value = "";
      y_input!.value = "";
    }
  });
});