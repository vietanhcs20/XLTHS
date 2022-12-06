var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var mqtt = require('mqtt');

var indexRouter = require('./routes/index');
var exportData = require('./export');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

// mqtt
var client = mqtt.connect('mqtt://broker.emqx.io:1883', { clientID: 'ndhieu131020' });
var topic = 'ndhieu131020data';

client.on('connect', function () {
	console.log('mqtt connect: ' + client.connected);
});

client.on('error', function (error) {
	console.log('mqtt false ' + error);
	process.exit(1);
});

client.subscribe(topic);

// database
var con = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '123456',
	database: 'vietanh_database',
});

con.connect(function (err) {
	var query = ` 
		CREATE TABLE IF NOT EXISTS sensors (
			ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			Time DATETIME NOT NULL,
			Temp INT(3) NOT NULL,
			Humi INT(3) NOT NULL,
			CH4 DECIMAL(8,3) NOT NULL,
			Gas DECIMAL (8,3) NOT NULL,
			CO DECIMAL (8,3) NOT NULL
		);`

	if (err) throw err;
	console.log('database connected');

	con.query(query, function (err) {
		if (err) throw err;
	});
});

var tempData;
var humiData;
var ch4Data;
var gasData;
var coData;
var cnt_check = 0;

client.on('message', function (topic, message, packet) {
	console.log('topic: ' + topic);
	console.log('message: ' + message);
	var objData = JSON.parse(message);

	if (topic == topic) {
		cnt_check = cnt_check + 1;
		tempData = objData.Temperature;
		humiData = objData.Humidity;
		ch4Data = objData.CH4Concentration;
		gasData = objData.GasConcentration;
		coData = objData.COConcentration;
	}

	if (cnt_check == 1) {
		cnt_check = 0;
		var date = new Date();
		var month = date.getMonth() + 1;
		var date_time = date.getFullYear() + '/' + month + '/' + date.getDate() + '-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		var query =
			"INSERT INTO sensors (Time, Temp, Humi, CH4, Gas, CO) VALUES ('" +
			date_time.toString() + "', '"
			+ tempData + "', '"
			+ humiData + "', '"
			+ ch4Data + "', '"
			+ gasData + "', '"
			+ coData + "')";
		con.query(query, function (err, result) {
			if (err) throw err;
			console.log('data inserted: ' + date_time + ' Temp:' + tempData + ' Humi:' + humiData + ' CH4:' + ch4Data + ' CH:' + gasData + ' CO:' + coData);
		});
		exportData(con, io);
	};
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// static files
app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
