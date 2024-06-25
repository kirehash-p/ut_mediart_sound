// p5jsを用いてwebカメラの映像を取得して、それをcanvasに描画する

const fr = 20;
const max_dulation = 1;

let w = window.innerWidth;
let h = window.innerHeight;
let capture;
let prevImg;
let sx, sy, sWidth, sHeight;
let freq_his = new Array(20).fill(0);
let amp_his = new Array(20).fill(0);
let audioStarted = false;

// 最初に実行される関数
function setup() {
    textAlign(CENTER);
    getAudioContext().suspend();
    frameRate(fr);
    createCanvas(w, h);
    capture = createCapture(VIDEO);
    capture.size(256, 256);
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

// 毎フレーム実行される関数
function draw() {
    if (audioStarted) {
        let r, g, b, H, S, V;
        let currentImg = cropImg(capture.get(), sx, sy, sWidth, sHeight); // helper.js
        background(255, 10);
        diff = getImageDiff(prevImg, currentImg); // helper.js
        image(diff, 0, 0, w - 10, h - 10);
        [r, g, b] = rgb_ratio(diff); // helper.js
        [H, S, V] = rgbToHsv(r, g, b); // helper.js
        hsvToSound(H, S, V);
        // hsvの表示
        drawHsv(H, S, V);
        prevImg = currentImg;
    } else {
        // 画面の中央にテキストを表示する
        textSize(60);
        fill(0);
        text('Click to start', w / 2, h / 2);
    }
}

function hsvToSound(h, s, v) {
    // ここに音を鳴らす処理を書く
    freq = map(h, 0, 360, 100, 1000);
    amp = s
    duration = map(v, 0, 255, 0, max_dulation);
    generateSound(freq, amp, duration);
}

function generateSound(freq, amp, duration) {
    let osc = new p5.Oscillator('sine');
    osc.freq(freq);
    osc.amp(amp);
    osc.start();
    osc.amp(0, duration);
    setTimeout(() => {
        osc.stop();
        osc.dispose();
    }, duration * 1000);
    setTimeout(() => {
        osc = null;
    }, (duration + 1) * 1000);
}

function drawHsv(h, s, v) {
    // hsvの表示
    // 10,20 から 60,60 の範囲をまず塗りつぶす
    fill(255);
    stroke(0);
    rect(0, 0, 75, 70);
    fill(0);
    textSize(20);
    text("H: " + Math.round(h), 10, 20);
    text("S: " + Math.round(s*100), 10, 40);
    text("V: " + Math.round(v), 10, 60);
}

// マウスがクリックされたときに呼び出される関数。
function mousePressed() {
    // クリックされることで音声の再生を開始する
    if (!audioStarted) {
        userStartAudio();
        audioStarted = true;
        textAlign(LEFT);
    }
}
