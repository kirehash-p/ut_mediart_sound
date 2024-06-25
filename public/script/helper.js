// キャンバスのサイズに合わせて、Webカメラの映像をクロップする
function calcCrop(w, h, capture) {
    let aspectRatio = capture.width / capture.height;
    let windowAspectRatio = w / h;
    let sx, sy, sWidth, sHeight;

    // sx, sy はクロップの始点座標、sWidth, sHeight はクロップの幅と高さ
    if (aspectRatio > windowAspectRatio) {
        // Webカメラの映像の方が幅広の場合
        sWidth = parseInt(capture.height * windowAspectRatio);
        sHeight = capture.height;
        sx = parseInt((capture.width - sWidth) / 2);
        sy = 0;
    } else {
        // Webカメラの映像の方が縦長の場合
        sWidth = capture.width;
        sHeight = parseInt(capture.width / windowAspectRatio);
        sx = 0;
        sy = parseInt((capture.height - sHeight) / 2);
    }
    return [sx, sy, sWidth, sHeight];
}

// cropImg: 画像をクロップする
function cropImg(img, sx, sy, sWidth, sHeight) {
    let croppedImg = createImage(sWidth, sHeight);
    croppedImg.copy(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
    return croppedImg;
}

// 画像の差分を計算する
function getImageDiff(img1, img2) {
    let diff = createImage(img1.width, img1.height);
    diff.loadPixels();
    img1.loadPixels();
    img2.loadPixels();
    for (let y = 0; y < img1.height; y++) {
        for (let x = 0; x < img1.width; x++) {
            let index = (x + y * img1.width) * 4;
            let r1 = img1.pixels[index];
            let g1 = img1.pixels[index + 1];
            let b1 = img1.pixels[index + 2];
            let r2 = img2.pixels[index];
            let g2 = img2.pixels[index + 1];
            let b2 = img2.pixels[index + 2];
            let d = dist(r1, g1, b1, r2, g2, b2);
            if (d < 100) {
                diff.pixels[index] = 0;
                diff.pixels[index + 1] = 0;
                diff.pixels[index + 2] = 0;
            } else {
                diff.pixels[index] = img2.pixels[index];
                diff.pixels[index + 1] = img2.pixels[index + 1];
                diff.pixels[index + 2] = img2.pixels[index + 2];
            }
            diff.pixels[index + 3] = 255;
        }
    }
    diff.updatePixels();
    return diff;
}

// 画像からrgbの含有割合を取得する
function rgb_ratio(img) {
    // 画像に含まれるRGBの割合を取得する
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    img.loadPixels();
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let index = (x + y * img.width) * 4;
            if (img.pixels[index] == 0 && img.pixels[index + 1] == 0 && img.pixels[index + 2] == 0) {
                continue;
            } else {
                count++;
                r += img.pixels[index];
                g += img.pixels[index + 1];
                b += img.pixels[index + 2];
            }
        }
    }
    if (count == 0) {
        return [0, 0, 0];
    } 
    r /= count;
    g /= count;
    b /= count;
    return [r, g, b];
}