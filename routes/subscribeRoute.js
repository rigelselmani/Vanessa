const express = require("express"),
      request = require('request'),
      router  = express.Router();

//Subscribtion logic get the users email.
router.post("/",function (req,res){
    var email=req.body.subscribe
    var data={
        members: [
            {email_address: email,
            status:"subscribed"
         }
        ]
    }

    var jsonData=JSON.stringify(data);

    var options = {
        url:'https://us4.api.mailchimp.com/3.0/lists/d12bda5c1d',
        method:"POST",
        headers: {
            "Authorization":"rigel1 4bc43a983fa50f8683b911e3b3e782b3-us4"
        },
        body: jsonData
    }
    request(options, function(error, response, body){
        if(error){
            res.sendFile(__dirname + "/failure.html");
            console.log("subscription not successful")
        }else{
            if(response.statusCode === 200){
                res.redirect("/nails");
                console.log("subscriptionsuccessful")
            }else{
                res.redirect("/nails")
                console.log("subscriptionsuccessful")
            }
        }
       });
})

module.exports = router;