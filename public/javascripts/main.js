var socket = io("http://localhost:3000");
const message = document.querySelector('.message')
const submitBtn = document.querySelector('.submit')
const form = document.querySelector('#form')
//client receive data from server
let prevDate = 0



socket.on("server-update-data", function (data) {
    $('#currentTemp').html(data.temp);
    $('#currentHumi').html(data.humi);
    $('#currentCH4').html(data.ch4);
    $('#currentGas').html(data.gas);
    $('#currentCO').html(data.co);

    let date = new Date()

    if (+data.co > 1 && date.getTime() - prevDate > 60) {
        console.log(date.getTime() - prevDate);
        prevDate = date.getTime()
        message.value = `
        Nhiệt độ: ${data.temp}
        Độ ẩm: ${data.humi}
        CO: ${data.co}
        CH4: ${data.ch4}
        GAS: ${data.gas}`
        // submitBtn.click()

    };
});