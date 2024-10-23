const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const port = process.env.PORT || 3001;

var mysql = require('mysql');

const app = express();

app.use(cors())
app.use(bodyParser.json());

var con = mysql.createConnection({
  host: "127.0.0.1", 
  user:"root", 
  password:"Nikhilgolla76",
  database: "my_flask_app_db"
});
 
// make to connection to the database.
con.connect(function(err) {
  if (err) console.log(err)
  // if connection is successful
  con.query("select * from UserTable where Name='trimath'", function (err, result, fields) {
    // if any error while executing above query, throw error
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      console.log('ITS OK');
    // if there is no error, you have the fields object
    // iterate for all th
  });
});


app.get('/',(req,res)=>{res.json('avc')});	

app.get('/COST',(req,res)=>{
  con.query("call totalrevenue()", function (err, result, fields) {
    
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      
    var resx=[];
      Object.keys(result).forEach(function(key) {
      resx.push((result[key]));
    });
      console.log(resx)
      res.json(JSON.stringify(resx));
  });


})

app.get('/BusStops',(req,res)=>{
  
  con.query("select distinct IntermediateStops from BusStops", function (err, result, fields) {
    
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      
    var resx=[];
      Object.keys(result).forEach(function(key) {
      resx.push((result[key]).IntermediateStops);
    });
      res.json(JSON.stringify(resx));
  });


});	

app.get('/RouteId',(req,res)=>{
  
  con.query("select distinct RouteId from RouteDetails", function (err, result, fields) {
    
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      
    var resx=[];
      Object.keys(result).forEach(function(key) {
      resx.push((result[key].RouteId.toString()));
    });
      console.log(resx);
      res.json(JSON.stringify(resx));
  });


});	

app.get('/Buses',(req,res)=>{
  
  var from=req.query.from;
  var to=req.query.to;
  
  con.query("select distinct RouteId from RouteDetails", function (err, result, fields) {
    
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      
    var resx=[];
      Object.keys(result).forEach(function(key) {
      resx.push((result[key].RouteId.toString()));
    });
      console.log(resx);
      res.json(JSON.stringify(resx));
  });


});	


app.get('/Agencies',(req,res)=>{
  
  con.query("select distinct AgencyName from AgencyDetails", function (err, result, fields) {
    
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      
    var resx=[];
      Object.keys(result).forEach(function(key) {
      resx.push((result[key].AgencyName.toString()));
    });
      console.log(resx);
      res.json(JSON.stringify(resx));
  });


}); 


app.get('/fetchBuses/:id', (req, res) => {
  const routeID = req.params.id;

  console.log(`Fetching buses for RouteID: ${routeID}`);

  const query = `SELECT * FROM BusSchedule NATURAL JOIN BusInfo WHERE RouteID = ?`;

  con.query(query, [routeID], (err, result) => {
    if (err) {
      console.log('Error fetching buses:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.length === 0) {
      console.log(`No buses found for RouteID: ${routeID}`);
      return res.status(404).json({ error: 'No buses found for this route' });
    }

    console.log(`Buses found for RouteID ${routeID}:`, result);

    // Send the result directly as JSON (no need to JSON.stringify)
    return res.json(result);
  });
});




app.post('/BookedSeats', (req, res) => {
  const travelDate = req.body.traveldate;
  
  if (!travelDate || isNaN(new Date(travelDate))) {
    console.log('Invalid traveldate received');
    return res.status(400).json({ error: 'Invalid traveldate' });
  }

  const tdate = new Date(travelDate);
  const dd = String(tdate.getUTCDate()).padStart(2, '0');
  const mm = String(tdate.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = tdate.getUTCFullYear();
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  const busRegNo = req.body.busregnno;

  console.log(`Selecting booked seats for travel date ${formattedDate} and bus ${busRegNo}`);

  con.query(`SELECT BookedSeats FROM Ticket NATURAL JOIN SeatsBooked WHERE TravelDate='${formattedDate}' AND BusRegnNo='${busRegNo}'`, (err, result) => {
    if (err) {
      console.log('Error fetching booked seats:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const bookedSeats = result.map(row => row.BookedSeats.toString());
    console.log(bookedSeats);
    res.json(bookedSeats);
  });
});


app.post('/Tickets', (req, res) => {
  let travelDate = req.body.traveldate;

  // If travelDate is invalid, use a default date at least 3 days after the booking date
  const bookingDate = new Date();
  const bdd = String(bookingDate.getUTCDate()).padStart(2, '0');
  const bmm = String(bookingDate.getUTCMonth() + 1).padStart(2, '0');
  const byyyy = bookingDate.getUTCFullYear();
  const bookingFormattedDate = `${byyyy}-${bmm}-${bdd}`;

  if (!travelDate || isNaN(new Date(travelDate))) {
    console.log('Invalid or missing traveldate. Using default date 3 days after booking date.');
    const defaultTravelDate = new Date(bookingDate);
    defaultTravelDate.setDate(defaultTravelDate.getUTCDate() + 3); // Set travel date to 3 days later
    const dd = String(defaultTravelDate.getUTCDate()).padStart(2, '0');
    const mm = String(defaultTravelDate.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = defaultTravelDate.getUTCFullYear();
    travelDate = `${yyyy}-${mm}-${dd}`;
  } else {
    const tdate = new Date(travelDate);
    const dd = String(tdate.getUTCDate()).padStart(2, '0');
    const mm = String(tdate.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = tdate.getUTCFullYear();
    travelDate = `${yyyy}-${mm}-${dd}`;
  }

  const regn = req.body.busregnno;

  console.log(`Insert into Ticket (BusRegnNo, BookingDate, TravelDate) values ('${regn}', '${bookingFormattedDate}', '${travelDate}')`);

  con.query(`INSERT INTO Ticket (BusRegnNo, BookingDate, TravelDate) VALUES ('${regn}', '${bookingFormattedDate}', '${travelDate}')`, function (err, result) {
    if (err) {
      console.log('Error inserting into Ticket:', err);
      return res.status(500).json({ error: 'Error inserting into Ticket' });
    }
    
    con.query(`SELECT MAX(TicketPNR) AS TicketPNR FROM Ticket`, function (err, res2) {
      if (err) {
        console.log('Error fetching TicketPNR:', err);
        return res.status(500).json({ error: 'Error fetching TicketPNR' });
      }

      const pnr = res2[0].TicketPNR;
      console.log('Generated TicketPNR:', pnr);
      res.json({ pnr });
    });
  });
});



app.post('/Through',(req,res)=>{

var rid=req.body.routeid;
var did=req.body.driverid;
var regn=req.body.busregnno
var pnr=req.body.pnr;
var st=req.body.starttime

    console.log(st)

        console.log(`insert into Through values(${rid},${did},${st},'${regn}',${pnr})`)
         
       con.query(`insert into Through values(${rid},${did},${st},'${regn}',${pnr})`, function (err, result, fields) {

              if (err) 
              {
                console.log('error in Through');
                console.log(err)
              }
              else
              {
                  console.log("Insert done")
              }

           var abc={
                res:result,
                error:err
              }
              res.json(JSON.stringify(abc));
          });
      
   

}
)



app.post('/SeatsBooking',(req,res)=>{

var pnr=req.body.pnr;
var filled=req.body.seatsbooked;
var f=0;
  for(var i=0;i<filled.length;i++)
  {
  console.log(`insert into SeatsBooked values(${pnr},${filled[i]})`);
  con.query(`insert into SeatsBooked values(${pnr},${filled[i]})`, function (err, result, fields) {

      if (err) 
      {
        f=1;
        console.log('error in SeatsBooked');
        console.log(err)

      }

  });
}
var abc;
 f==1? abc={ res:"",error:"Some error"}: abc={ res:"",error:null}
   res.json(JSON.stringify(abc));

}); 



app.get('/BusRegnNo',(req,res)=>{
  
  con.query("select distinct BusRegnNo from BusInfo", function (err, result, fields) {
    
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      
    var resx=[];
      Object.keys(result).forEach(function(key) {
      resx.push((result[key]).BusRegnNo);
    });
      console.log(resx);
      res.json(JSON.stringify(resx));
  });
});	

app.get('/Drivers',(req,res)=>{
  con.query("select distinct DriverID from DriverDetails", function (err, result, fields) {
    
    if (err) 
      {
        console.log('error');
        console.log(err)

      }
      
    var resx=[];
      Object.keys(result).forEach(function(key) {
      resx.push((result[key]).DriverID.toString());
    });
      console.log(resx);
      res.json(JSON.stringify(resx));
  });


});	


app.post('/login', async (req, res) => {
   

   var user = req.body.email;
   var pass = req.body.password;

var q="select * from UserTable where email='"+user+"' and Password='"+pass+"' and userType='N'"
console.log(q)
 
 	 con.query(q, function (err, result, fields) {
    if (err) console.log(err)
    	if(result.length == 1)
    	{
    		var abc={
    			error:'',
    			response:'success'
    		}
    	}
    	else
    	{
    		var abc={
    			error:'No Such User Exists. Please Register first',
    			response:'fail'
    		}

    	}
    	res.json(JSON.stringify(abc));

  });
    
});

var Id;
app.post('/signup', async (req, res) => {
   
   var email = req.body.email;
   var address = req.body.address;
   var gender = req.body.gender;
   var phone = req.body.phone;
   var user = req.body.username;
   var pass = req.body.pass;
   var gender = "Male";
   var UserType="NA";
   
   console.log(req.body);
con.query("select count(*) as count from UserTable", function (err, result, fields) {
if(err) console.log(err)

    Object.keys(result).forEach(function(key) {
      var res = result[key];
		var	Id=(res.count+1);
			var q= "insert into UserTable (Id, email,Name, Password,UserType) values (?,?,?,?,?);"

			console.log(q);

			con.query(q, [Id,email,user,pass,address, phone, gender], function (err, result, fields) {
			if (err) console.log(err)
			
			else
			{
			var q1="insert into NonAdmin (Id, Gender, Phone, Address ) values (?,?,?,?)"
			con.query(q1, [Id, gender, phone, address], function (err, result, fields) {
									const abc={
							  			error:err,
							  			result:result
							  		}
							  		
			});

    		}
		});
});

    const abc={
	  			error:err,
	  			result:result
	  		}
	  		
    res.json(JSON.stringify(abc));	



          });
        
});

app.post('/adminLogin', async (req, res) => {
   
   var user = req.body.username;
   var pass = req.body.password;

var q="select * from UserTable where email='"+user+"' and Password='"+pass+"'"+" and Usertype='A'";
console.log(q)
      con.query(q, function (err, result, fields) {
        if (err) console.log(err)
			

			if(result.length >= 1)
		    	{
		    		var abc={
		    			error:'',
		    			response:'success'
		    		}
		    			
		    
		    	}
		    	else
		    	{
		    		var abc={
		    			error:'No Such User Exists',
		    			response:'fail'
		    		}

		    
		    	}
		    	res.json(JSON.stringify(abc));
		      }

      );
    
    
});

app.post('/CheckRoute', async (req, res) => {
  const fromP = req.body.fromSelect;
  const toP = req.body.toSelect;

  console.log(`Received source: ${fromP}, destination: ${toP}`);

  const query = `
    SELECT DISTINCT RouteId 
    FROM BusStops 
    WHERE IntermediateStops = ? 
    AND RouteId IN (
      SELECT RouteId FROM BusStops WHERE IntermediateStops = ?
    );
  `;

  con.query(query, [fromP, toP], function (err, result) {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log("Query result:", result);

    if (result.length > 0) {
      const routeIds = result.map(row => row.RouteId);
      console.log('RouteIds found:', routeIds);
      // Return the response object without stringifying it
      return res.json({ error: '', response: routeIds });
    } else {
      console.log('No such route exists');
      return res.json({ error: 'No Such Route Exists', response: 'fail' });
    }
  });
});


app.post('/busSchedule', async (req, res) => {
  
   	var routeid = req.body.routeid;
    var driverid = req.body.driverid;
    var starttime = req.body.starttime;
    var esttraveltime = req.body.esttraveltime;
    var reservedseats = req.body.reservedseats;
    var busregnno = req.body.busregnno;
	var fare = req.body.fare;

starttime=(starttime/60/60);

     console.log(`insert into BusSchedule (BusRegnNo, RouteID, DriverID, StartTime, fare, ReservedSeats, TravelTime) values (${busregnno},${routeid},${driverid},${starttime},${fare},${reservedseats},${esttraveltime})`);

      con.query("insert into BusSchedule (BusRegnNo, RouteID, DriverID, StartTime, fare, ReservedSeats, TravelTime) values (?,?,?,?,?,?,?);", [busregnno, routeid, driverid, starttime, fare,reservedseats,esttraveltime], function (err, result, fields) {
        if (err) console.log(err);
        if(result.length === 1){
          console.log('Invalid credentials');
        }
        else{
            
          console.log('Successful');
          }
        });

            console.log('Insertion Done into BusSchedule');

	    		var abc={
	    			error:'',
	    			response:''
	    		}

		    	res.json(JSON.stringify(abc));
    
});

app.post('/bus', async (req, res) => {
   
   	var busregno = req.body.busregnno;
	var agencyname = req.body.agencyname;
	var capacity = req.body.capacity;
	var ac = req.body.ac;
	var LocationName=""
	var Latitude=""
	var Longitude=""
	
	console.log(busregno+" "+agencyname+" "+capacity+" "+ac+" "+LocationName+" "+Latitude+" "+Longitude);

	con.query("insert into BusInfo (BusRegnNo, AgencyName, TotalSeats, AC,LocationName,Latitude,Longitude) values (?,?,?,?,?,?,?);", [busregno, agencyname,capacity, ac,LocationName, Latitude,Longitude], function (err, result, fields) {
        if (err) console.log(err);
        if(result.length === 1){
          console.log('Invalid credentials');

        }
        else{
          console.log('Successful');
        }
      });
    
  	    		var abc={
		    			error:'',
		    			response:''
		    		}

		    	console.log(abc);
		    	res.json(JSON.stringify(abc));
    			

});

app.post('/driver', async (req, res) => {
   
   	var driverid = req.body.driverid;
	var drivername = req.body.drivername;
	var driverphone = req.body.driverphone;
  var age=req.body.age;
  var date_of_join = req.body.date_of_join;

console.log(drivername+" "+driverphone+" "+age+" "+date_of_join)

   con.query("insert into DriverDetails (drivername, driverphone, age , date_of_join) values (?,?,?,?);", [drivername, driverphone,age,date_of_join], function (err, result, fields) {
        if (err) console.log(err)
        if(result.length){
          console.log('Successful');
        }
        else{
          console.log('Invalid credentials');
        }
      });
        var abc={
              error:'',
              response:''
            }

          console.log(abc);
          res.json(JSON.stringify(abc));


    });
    


app.listen(port, () => console.log(`Listening on port ${port}`));