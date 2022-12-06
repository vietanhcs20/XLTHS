var humiGraph = [];
var tempGraph = [];
var ch4Graph = [];
var gasGraph = [];
var coGraph = [];
var dateGraph = [];

function exportData(con, io) {
    var tempData;
    var humiData;
    var ch4Data;
    var gasData;
    var coData;
    var datetime;
    var query = 'SELECT * FROM sensors ORDER BY ID DESC LIMIT 1';

    con.query(query, function (err, result, fields) {
        if (err) throw err;
        console.log("data selected");
        result.forEach(function (value) {
            datetime = value.Time.toString().slice(4, 24);
            tempData = value.Temp;
            humiData = value.Humi;
            ch4Data = value.CH4;
            gasData = value.Gas;
            coData = value.CO;

            io.sockets.emit('server-update-data', {
                id: value.ID,
                time: datetime,
                temp: value.Temp,
                humi: value.Humi,
                ch4: value.CH4,
                gas: value.Gas,
                co: value.CO,
            })
        })

        if (humiGraph.length < 10) {
            humiGraph.push(humiData);
        }
        else {
            for (a = 0; a < 9; a++) {
                humiGraph[a] = humiGraph[a + 1];
            }
            humiGraph[9] = humiData;
        }

        if (tempGraph.length < 10) {
            tempGraph.push(tempData);
        }
        else {
            for (b = 0; b < 9; b++) {
                tempGraph[b] = tempGraph[b + 1];
            }
            tempGraph[9] = tempData;
        }

        if (dateGraph.length < 10) {
            dateGraph.push(datetime);
        }
        else {
            for (c = 0; c < 9; c++) {
                dateGraph[c] = dateGraph[c + 1];
            }
            dateGraph[9] = datetime;
        }

        if (ch4Graph.length < 10) {
            ch4Graph.push(ch4Data);
        }
        else {
            for (d = 0; d < 9; d++) {
                ch4Graph[d] = ch4Graph[d + 1];
            }
            ch4Graph[9] = ch4Data;
        }

        if (gasGraph.length < 10) {
            gasGraph.push(gasData);
        }
        else {
            for (e = 0; e < 9; e++) {
                gasGraph[e] = gasGraph[e + 1];
            }
            gasGraph[9] = gasData;
        }

        if (coGraph.length < 10) {
            coGraph.push(coData);
        }
        else {
            for (f = 0; f < 9; f++) {
                coGraph[f] = coGraph[f + 1];
            }
            coGraph[9] = coData;
        }

        io.sockets.emit("server-send-humi-graph", humiGraph);
        io.sockets.emit("server-send-temp-graph", tempGraph);
        io.sockets.emit("server-send-ch4-graph", +ch4Graph);
        io.sockets.emit("server-send-gas-graph", +gasGraph);
        io.sockets.emit("server-send-co-graph", +coGraph);
        io.sockets.emit("server-send-date-graph", dateGraph);
    });
};

module.exports = exportData;