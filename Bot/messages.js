/**
*
*Importing Required Modules
*/
require('dotenv').config();
var twilio = require('twilio');
var cors = require('cors');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var Cloudant = require('cloudant');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(cors());
/**
 * Global Varibles
 */
var flag = 0;
var db;
var ExamType,RegdNum;
/**
*
*Application Credentials
*/
var sample=[];
var twilioSid = process.env.TWILIO_SID;
var twilioToken = process.env.TWILIO_TOKEN;
var me = process.env.CLOUDANT_USER;
var password = process.env.CLOUDANT_PASS;
var cloudant = Cloudant({account:me, password:password});
var transport=cloudant.db.use('transportation');
var library=cloudant.db.use('library');
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
var port = (process.env.VCAP_APP_PORT || 3001);
var contextw={}; // Context variable
 //Static files
 app.use(express.static(__dirname+'/public'));
 //Serving HTML file to send Message to Watson
 app.get('/',function(req,res){
 res.sendFile(__dirname+'/index.html');
});
// '/message' API call for all Watson Conversation and Twilio SMS Through HTML
var json1={};
 app.post('/message', function(req, res) {  
		var data = req.body;
		console.log(data);
		
		var Num = req.body.From;
		var Msg = req.body.Body;
		var client = twilio(twilioSid,twilioToken);
			sendToWatson(contextw, Msg, function(response) {
				//forward Action
		    if(response.output.text[0].action ==="forward"){
					client.messages.create({
		            to:Num,
		            from:'+13237451396',
		            body: response.output.text[0]
			              }, function(err,data) {
				        if (err){
				        response = {
				        "result":"err"
				                   }
		   res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); //sends JSON response to HTML
			}
		});
				}
//Transport module starts		
else if(response.output.text[0] ==="transport"){
	var document = cloudant.db.use('context')
                      data.context=response.context;
                      var rev=data.rev_id;
                      id=data._id;
console.log("document inserted");

				document.insert(data, req.body.From, rev, id, function(err, body, header) {
           if (err) {
                  return console.log('[alice.insert] ', err.message);
            }
             });
	
	//This module is used After selecting the Bus it Asks for the Fare select yes or no	
	var json1={};
	if(response.entities[0].value=='yes'){
	 json1.sample1=response.context.from;
	 console.log(json1);
	 console.log(json1.sample1);
	 var query1=
	{
      "selector": {
      "name": {
      "$eq":json1.sample1
              }
   },
  "fields": [
    "_id",
    "_rev","fees","name"
  ]
}
//This module used for find the fees iformation
var json={};
transport.find(query1,function(err,x){
	if(err)
		console.log(err);
	else{
		
		json.sample=x.docs[0].fees;
		console.log(json);
	}
	  client.messages.create({
		to:Num,
		from:'+13237451396',
		body: json.sample
			}, function(err,data) {
				if (err){
				response = {
				"result":"err"
				}
		res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); //sends JSON response to HTML
			}
		}); });


}
//This module is used for directly we asks Bus Fare
else if(response.entities[0].value=='fare'){
	console.log(response.entities);
	console.log(response);
	console.log(response.entities[1].value);
	 json1.sample3=response.entities[1].value;
	 
	console.log(json1);
	
	  var query1=
	{
  "selector": {
    "name": {
      "$eq":json1.sample3
    }
  },
  "fields": [
    "_id",
    "_rev","fees"
  ]
}
//This module is used for get fare from database
var json={};
transport.find(query1,function(err,x){
	if(err)
		console.log(err);
	else{
		
		json.sample=x.docs[0].fees;
		console.log(json);
	}
	
	  client.messages.create({
		to:Num,
		from:'+13237451396',
		body: json.sample
			}, function(err,data) {
				if (err){
				response = {
				"result":"err"
				}
		res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); //sends JSON response to HTML
			}
		}); });
	 
	
}
//This module is used to know the available  buses from particular Location.
else{
	 json1.sample2=response.entities[0].value;
	console.log(json1);
	
	 var query1=
	{
  "selector": {
    "name": {
      "$eq":json1.sample2
    }
  },
  "fields": [
    "_id",
    "_rev","Availability","name"
  ]
}
//This module is used for get the availability of information from database
var json={};
transport.find(query1,function(err,x){
	if(err)
		console.log(err);
	else{
		
		json.sample=x.docs[0].Availability;
		console.log(json);
	}
  client.messages.create({
		to:Num,
		from:'+13237451396',
		body: json.sample
			}, function(err,data) {
				if (err){
				response = {
				"result":"err"
				}
		res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); //sends JSON response to HTML
			}
		}); });
	
}		 
}
//Libraray Module	
else{
	var document = cloudant.db.use('context1')
                      data.context=response.context;
                      var rev=data.rev_id;
                      id=data._id;
console.log("document inserted");

				document.insert(data, req.body.From, rev, id, function(err, body, header) {
           if (err) {
                  return console.log('[alice.insert] ', err.message);
            }
			
             });
			 
			 if(response.entities[0].entity=="Department"){
				 //After giving the book it asks for department.
				 var json1={};
				 console.log(response)
				 console.log(response.entities[0].value);	 
	             json1.sample1=response.entities[0].value;
	             console.log("anusha")
	             console.log(response.context.AboutLibrary)
	 
	 var query1=
	{
  "selector": {
    "Department": {
      "$eq":json1.sample1
    },
	"bookname":{
		"$eq":response.context.AboutLibrary
	}
  },
  "fields": [
    "_id",
    "_rev","Department","bookname","information"
  ]
}
//This module is used for get the book information from database
var json={};
library.find(query1,function(err,x){
	if(err)
		console.log(err);
	else{
		console.log(x);
		json.sample=x.docs[0].information;
		console.log(json);
	}
	client.messages.create({
		to:Num,
		from:'+13237451396',
		body: json.sample
			}, function(err,data) {
				if (err){
				response = {
				"result":"err"
				}
		res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); 
			}
		}); });

}
else if(response.entities[0].entity=="Department" && response.entities[1].entity=="AboutLibrary"){
	//If we gave both the department and the Book 
	var json1={};
	 json1.sample3=response.entities[0].value;
	 json1.sample4=response.entities[1].value;
	 console.log(json1); 
	 var query1=
	{
  "selector": {
    "Department": {
      "$eq":json1.sample3
    },
	"bookname":{
		"$eq":json1.sample4
	}
  },
  "fields": [
    "_id",
    "_rev","Department","bookname","information"
  ]
}
//This module is used for get the books information from database
var json={};
library.find(query1,function(err,x){
	if(err)
		console.log(err);
	else{
		console.log(x);
		json.sample=x.docs[0].information;
		console.log(json);
	}
	  client.messages.create({
		to:Num,
		from:'+13237451396',
		body: json.sample
			}, function(err,data) {
				if (err){
				response = {
				"result":"err"
				}
		res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); //sends JSON response to HTML
			}
		}); });

}
else if(response.entities[0].entity=="AboutLibrary"){
	//Move to the Library Intent asks  any available book in libraray
	var json={};
	json.sample=response.output.text[0];
	client.messages.create({
		to:Num,
		from:'+13237451396',
		body: json.sample
			}, function(err,data) {
				if (err){
				response = {
				"result":"err"
				}
		res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); 
			}
		}); 
}
 else {
	 
	 console.log(response.output.text[0]);
	var json={};
	json.sample=response.output.text[0];
	
	  client.messages.create({
		to:Num,
		from:'+13237451396',
		body: json.sample
			}, function(err,data) {
				if (err){
				response = {
				"result":"err"
				}
		res.json(response);
	}
	else{
		console.log("Response from Twilio message service" + data);
		console.log("\n SMS sent to :"+Num+" Body is : "+ response.output.text[0] );
			response = {
				"result":"msg"
				}
				res.json(response); 
			}
		}); 
} 
	
}				
	});
  })
  // Sending User message to Watson to process it
		function sendToWatson(cont, inp, callback) {
			var payload = {
				workspace_id:'d6cfd960-8136-4d1a-a8af-aefe64c3d43b',
				context: cont,
				input: {
				"text": inp
					}
		};
 
		var conversation = new ConversationV1({
			username:'302deeb7-a5aa-4fe2-9841-5d80b87e56cf',
			password: 'ihCvjboyI8qD',
		version_date: '2017-06-01'
	});
//Conversation Starts
		conversation.message(payload, function(err, data1) {
			if (err) {
				console.log("err during conversation payload" + err)
			}
			else{
			contextw = data1.context;  //Updating Context Variable
			var data = JSON.stringify(data1)
			console.log("Data is: \n "+JSON.stringify(data1.output));
			var node = data1.output.nodes_visited[0];
  /**
  *
  *Taking Student Branch to find in Database
  */
  
  //data1.context.TypeOfExam != null || data1.context.RegdNum != null
	var node = data1.output.nodes_visited[0];
		if(node == 'Exams' || node == 'RegNum' || node == 'ExamType'){
			flag = 0;
		if( data1.context.TypeOfExam != null){
			ExamType = data1.context.TypeOfExam;
		}
		if(data1.context.RegdNum != null){    
			var RollNum = data1.context.RegdNum;
				if((RollNum != null))
		{
			console.log(RollNum);
			var roll = RollNum.charAt(7);
				if(roll == '5'){
					db = "cse";
				} else
			if(roll == '1'){
				db = "civil";
				}else
			if(roll == '2'){
				db = "eee";
				}else 
			if(roll = '3'){
				db = "mech";
				}else
			if(roll = '4'){
				db = "ece";
				}
				console.log(db);
			}
		}
	}
     }
  
    if(ExamType!=null ){
        if(RollNum != null){
        console.log("All data recieved" );
               flag = 1;
        var dba = cloudant.db.use(db);
        dba.get(ExamType,function(err,dataBase){
            if(err){
                console.log("Error occured : "+err);
            }
            else{
                 var dataa = dataBase.data;
			   var data = {
				   output:{
					   text:["Hey, your "+ dataa.ExamType +"Examination will be Starts from "+dataa.startDate+" And Schedule is as follows :"+dataa.sub1+"-"+dataa.date1+","+dataa.sub2+"-"+dataa.date2+","+dataa.sub3+"-"+dataa.date3]
				   }
			   }	
               ExamType = null;
               RegdNum = null;	
			   flag = 0;    
			callback(data)
            }
        })
    }
}
if(flag == 0){
    console.log("Output : "+data1.output.text[0]);
    callback(data1);
}
  })
}

/**
 * Starting Server in localhost
 */
	var server = app.listen(port, function () {
		console.log('Miracle Assistance Bot started at localhost:3001');
	});