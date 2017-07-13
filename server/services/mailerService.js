var mailUtil = module.exports;

var nodemailer = require("nodemailer");

mailUtil.NoReply = function( req, res, to, subject, html ) {

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Godaddy",
        auth: {
            user: "contact@aimcomely.com",
            pass: "thisissparta"
        }
    });

    var mailOptions={
        to : to,
        from: 'Moneysquare <no-reply@moneysquare.in>',
        subject : subject,
        html : html
    };


    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }
    });

};

mailUtil.Gmail = function( to, subject, html ) {

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "aimgroup993@gmail.com",
            pass: "thisissparta"
        }
    });

    var mailOptions={
        to : to,
        subject : subject,
        html : html
    };


    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{

            console.log('SENT');

        }
    });

};