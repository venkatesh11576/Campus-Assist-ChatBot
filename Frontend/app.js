var express = require('express');
var bodyParser = require('body-parser');
var Cloudant = require('cloudant');
var cors = require('cors');
var nodemailer = require('nodemailer');
var smtp = require('nodemailer-smtp-transport');
var me = 'ramachandrar143';
var password = 'Dqcrg.123';
var cloudant = Cloudant({account:me, password:password});
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(__dirname+'/public'));
app.get('/ExamSchedules',function(req,res){
	res.sendFile(__dirname+'/public/'+'admin.html');
})
app.post('/insert',function(req,res){
    var ExamType = req.body.ExamType;
    var  data = req.body;
          console.log(data);
console.log(data.Dept);
     var db = cloudant.db.use(data.Dept);
    db.insert({_id:ExamType,data},function(err,data){
			if(err){
				
				var error = err.name;
				if(error == "Error")
				{
					var resp = {
					"result":"error"
				}
				res.json(resp)
				}
				else{
				var resp = {
					"result":"err"
				}
				res.json(resp)
				}
			}
			else{
				var resp = {
					"result":"success"
				}
				res.json(resp);
			}
	 });	 
 });
 app.get('/signUp', function (req, res) {
    res.sendFile(__dirname + '/public/'+ 'untit.html');
});
app.post('/data', function (req, res) {
	console.log("Dataa");
	var name = req.body.firstname + req.body.lname;
    var data = req.body;
	var email = req.body.email;
	console.log(email);
	var db = cloudant.db.use('admin');
	db.insert({_id:name,data},function(err,data){
			if(err){
				
				var error = err.name;
				if(error == "Error")
				{
					var resp = {
					"result":"error"
				}
				res.json(resp)
				}
				else{
				var resp = {
					"result":"err"
				}
				res.json(resp)
				}
			}
			else{
				console.log(res);
				var transport = nodemailer.createTransport(smtp( {
				service: 'gmail',
				auth: {
				user: "guruharish004@gmail.com",
				pass: "9003148876"
					}
				}));
			var message = {
				from: 'guruharish004@gmail.com',
				to: email,
				subject: 'Joining Order', 
				text: 'Dear' + req.body.firstname+ ' '+req.body.lname+'\n Thanks for choosing Miracle. Your Application was recieved and we\'ll get back to you soon'
			};
				transport.sendMail(message, function(error){
			if(error){
			console.log('Error occured');
			console.log(error.message);
			return;
			}
			console.log('Message sent successfully!');
			});
				var resp = {
					"result":"success"
				}
				res.json(resp);
			}
	})
})
app.get('/LibraryData',function(req,res){
	res.sendFile(__dirname+ '/public/'+ 'lib.html');
})
app.post('/insertlib',function(req,res){
    var ISBN = req.body.ISBN;
    var  data = req.body;
          console.log(data);
console.log(data.Dept);
     var db = cloudant.db.use(data.Dept);
    db.insert({_id:ISBN,data},function(err,data){
			if(err){
				var resp = {
					"result":"error"
				}
				res.json(resp)
				}
			else{
				var resp = {
					"result":"success"
				}
				res.json(resp);
			}
	 });	 
 });
 
app.get('/RetrieveLib',function(req,res){
	res.sendFile(__dirname+ '/public/'+ 'libretrieve.html');
})
app.post('/getlibdata', function(req, res) {
	console.log("data searching");
	var dept = req.body.Dept;
	var year = req.body.Year;
	var sem = req.body.Sem;
	console.log(dept +" "+ year +""+ sem);
	var data = req.body;
	console.log(data.Dept);
	var db = cloudant.db.use(data.Dept);
	
	//console.log(db);

	db.find({
		selector : {
			'data.Dept' :dept,
			'data.Year' : year,
			'data.Sem': sem
		}
	}, function(er, result) {
		if(er){
			console.log("error")
		}
		else{
		console.log("data into result loop, "+JSON.stringify(result.docs));

	   var dataa = {
			foundService : []
		};

		console.log('Found %d documents ', result.docs.length);
		for (var i = 0; i < result.docs.length; i++) {
			console.log(' details: %s' ,result.docs[i].dept +" "+ result.docs[i].year +" "+ result.docs[i].sem);
			dataa.foundService.push(result.docs[i]);
			console.log('dataa');

		}
		if (result.docs.length === 0) {
			res.send("Oops");
		} else {
			console.log(dataa);
			res.send(dataa);
		}
		}
	});
	
});

app.listen(process.env.PORT||3000);
 console.log("Listening at 3000");