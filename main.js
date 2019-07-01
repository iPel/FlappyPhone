~function() {
    var output = document.getElementById('output');
    var data = [];
    function print(content) {
        console.log(content);
        data.push('>' + content);
        if (data.length > 200) {
            data.splice(0, data.length - 200)
        }
        output.innerText = data.join('\n');
        output.scrollTo(0, data.length * 16);
    }

    function abs(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    }

    function cal(t) {
        var t1 = t * 0.0005;
        var s = .5 * 9.8 * t1 * t1;
        // print('stop after ' + duration + 'ms, height ' + s + 'm');
        var rate = (-0.09889 / s + 1.08889) * 100;
        print('你的手机飞了' + s.toFixed(3) + '米高，打败了全球' + rate.toFixed(1) + '%用户！');
        setTimeout(function() {
            document.getElementById('retry').style.display = 'block';
        }, 2000);
    }

    function main() {
        print('免责声明：访问本页面导致手机摔坏的，均与作者无关，请自行承担风险，若不同意请立即关闭退出，继续阅读和（或）操作表示同意。');
        // print('DeviceOrientationEvent: ' + (!!window.DeviceOrientationEvent));
        print('DeviceMotionEvent: ' + (!!window.DeviceMotionEvent));
        // window.addEventListener("deviceorientation", function(e) {
        //     // print('deviceorientation: ' + e.absolute + ' ' + e.alpha + ' ' + e.beta + ' ' + e.gamma);
        // }, true);
        var state = 0; // 0 not ready，1 ready，2 flying，3 landed
        setTimeout(function() {
            if (state == 0) {
                print('你的浏览器似乎不支持加速度传感器。');
            }
        }, 2000);
        var start = 0;
        window.addEventListener("devicemotion", function(e) {
            var a = abs(e.accelerationIncludingGravity);
            if (state == 0) {
                // print('onDeviceMotionEvent ' + a);
                if (e.accelerationIncludingGravity && a > 0) {
                    print('ready');
                    state = 1;
                }
                return;
            }
            if (state == 1) {
                if (a < 2) {
                    state = 2;
                    start = Date.now();
                    print('go');
                }
                return;
            }
            if (state == 2) {
                if (a > 2) {
                    var totalTime = Date.now() - start;
                    state = 3;
                    print('landed');
                    cal(totalTime);
                    return;
                }
            }
        }, true);
        var retryEl = document.getElementById('retry');
        retryEl.addEventListener('click', function(e) {
            e.preventDefault();
            state = 0;
            retryEl.style.display = 'none';
        }, false);
    }

    main();
}();