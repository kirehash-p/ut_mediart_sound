// p5jsを用いてwebカメラの映像を取得して、それをcanvasに描画する

let w = window.innerWidth;
let h = window.innerHeight;
let capture;
let prevImg;
let currentImg;
let sx, sy, sWidth, sHeight;
let rosc, gosc, bosc;

// 最初に実行される関数
function setup() {
    frameRate(20);
    rosc = new p5.Oscillator();
    rosc.setType('sine');
    rosc.amp(0);
    rosc.start();
    gosc = new p5.Oscillator();
    gosc.setType('triangle');
    gosc.amp(0);
    gosc.start();
    bosc = new p5.Oscillator();
    bosc.setType('sawtooth');
    bosc.amp(0);
    bosc.start();
    createCanvas(w, h);
    capture = createCapture(VIDEO);
    capture.size(128, 128);
    capture.hide();
    [sx, sy, sWidth, sHeight] = calcCrop(w, h, capture); // helper.js
    prevImg = cropImg(capture.get(), sx, sy, sWidth, sHeight); // helper.js
}

// ブラウザのウィンドウサイズが変更されたときに呼び出される関数
function windowResized() {
    // ウィンドウサイズを取得して、キャンバスのサイズを変更する
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h)
    [sx, sy, sWidth, sHeight] = calcCrop(w, h, capture); // helper.js
}

function draw() {
    background(255);
    currentImg = cropImg(capture.get(), sx, sy, sWidth, sHeight); // helper.js
    diff = getImageDiff(prevImg, currentImg); // helper.js
    image(diff, 0, 0, w - 10, h - 10);
    [r, g, b] = rgb_ratio(diff); // helper.js
    rgbToSound(r, g, b);
    // rgbの表示
    fill(255);
    textSize(20);
    text(`R: ${r}`, 10, 30);
    text(`G: ${g}`, 10, 60);
    text(`B: ${b}`, 10, 90);

    prevImg = currentImg;
}

function rgbToSound(r, g, b) {
    // ここに音を鳴らす処理を書く
    // r, g, b はそれぞれ0~255の値を取る
    // 例えば、rが大きいほど高い音を鳴らす、など
    // この関数は、draw関数の中で呼び出される
    let amp = map((r + g + b) / 3, 0, 255, 0, 1);
    rosc.freq(map(r, 0, 255, 100, 3000));
    gosc.freq(map(g, 0, 255, 100, 3000));
    bosc.freq(map(b, 0, 255, 100, 3000));
    rosc.amp(amp);
    gosc.amp(amp);
    bosc.amp(amp);
}

