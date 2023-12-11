module.exports = function(app, shopData) {
    // Redirect Login
    const redirectLogin = (req,res,next) => {
        if (!req.session.userId) {
            res.redirect('./login')
        } else {next ();}
    }

const { check, validationResult } = require ('express-validator');

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });                                                                                                 
    app.post('/registered', [check('email').isEmail()], function (req,res) {
        // saving data in database
       // res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);
        const errors = validationResult(req);
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;
        if(!errors.isEmpty()) {
            res.redirect('./register');
        }
        else {
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
                if (err) {
                  return console.error(err.message)
                }
                let sqlquery = "INSERT INTO users (firstname,lastname,email,username,hashedpassword) VALUES (?,?,?,?,?)";
                let newrecord = [req.sanitize(req.body.first),req.body.last,req.body.email,req.body.username,hashedPassword];
      
                db.query(sqlquery,newrecord, (err, result) => {
                  if(err) {
                      return console.error(err.message);
                  }
                  else {
                      result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
                      result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                      res.send(result);
      
      
                  }
                })
      
      
              })
        } 
        
    });
  
    //Login Page
    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);                                                                     
    }); 

    app.post('/loggedin', function (req,res) {

        const bcrypt = require('bcrypt');

        let sqlquery = "SELECT hashedpassword FROM users WHERE username =?";
        
        let userdata = req.body.username;//SELECT hashedpassword FROM userdetails WHERE username = "abc"

        db.query(sqlquery, userdata, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                //hashedPassword = result[0].hashedpassword;
                //console.log(hashedpassword);
                console.log(req.body.password);
                console.log(result);
                bcrypt.compare(req.body.password, result[0].hashedpassword, function(err, result) {
                    if (err) {
                      // TODO: Handle error
                      res.send( 'There is an error');
                    }
                    else if (result == true) {

                      req.session.userId = req.body.username;
                      res.send('That is the correct password');
                      //<a href=' + '/' + '>HOME</a>'
                    
                    }
                    else {
                      // TODO: Send message
                      res.send('That is the wrong password');
                    }
                  });
            }
        })
    })

    app.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('./')
            }
            res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    })   

        // hashedPassword = sqlquery

        // bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
        //     if (err) {
        //       // TODO: Handle error
        //       res.send( 'There is an error')
        //     }
        //     else if (result == true) {
        //       // TODO: Send message
        //       res.send('That is the correct password')
        //     }
        //     else {
        //       // TODO: Send message
        //       res.send('That is the wrong password')
        //     }
        //   });
      
    

    
    app.post('/delete', function (req,res) {
        let sqlquery = 'DELETE FROM users WHERE username = "' + req.body.username +'"'
        let DeleteUsername = req.body.username

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.send('there was an error')
            }
            else {
                if(result.affectedRows == 0) {
                    res.send("No user with that username")
                }
                else{
                    res.send("User " + DeleteUsername + "delete successfully!")
                }
            }
    })
})

    
    
    //Delete Page
    app.get('/deleteuser', function (req,res) {
        res.render('deleteuser.ejs', shopData);                                                                     
    }); 

    //List of Users
    app.get('/listusers', function(req, res) {
        let sqlquery = "SELECT firstname, lastname, email, username FROM users"; // query database to get all users
        // exxecute sql query
        db.query(sqlquery, (err, result) => {
            if(err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableusers: result});
            console.log(newData)
            res.render("listusers.ejs", newData)

        })
    })


    // Weather Forecast
    app.get('/weather', function(req,res) {
        const request = require('request');

        let apiKey = '4066b0791a9932795eb1fe9004cb04f7';
        let city = 'london';
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

        request(url, function (err,response, body) {
            if(err){
                console.log('error:', error);
            } else {
                // res.send(body);
                var weather = JSON.parse(body)
                if (weather!==undefined && weather.main!== undefined) {
                var wmsg = 'It is ' + weather.main.temp + ' degrees in ' + weather.name +  ' The maximum temp is ' + weather.main.temp_max + ' And the minimum temp is ' + weather.main.temp_min + '! <br> The humidity now is: ' + weather.main.humidity +  '! <br> The pressure now is: ' + weather.main.pressure;
                res.send(wmsg);
                }
                else {
                    res.send("No data found");
                }
            }
        });
    })

        // Food API 
        app.get('/Recepies', function(req,res) {
            const http = require('https');
            const options = {
                method: 'GET',
                hostname: 'edamam-recipe-search.p.rapidapi.com',
                port: null,
                path: '/api/recipes/v2?type=public&co2EmissionsClass=A%2B&field%5B0%5D=uri&beta=true&random=true&cuisineType%5B0%5D=American&imageSize%5B0%5D=LARGE&mealType%5B0%5D=Breakfast&health%5B0%5D=alcohol-cocktail&diet%5B0%5D=balanced&dishType%5B0%5D=Biscuits%20and%20cookies',
                headers: {
                    'Accept-Language': 'en',
                    'X-RapidAPI-Key': '9486a8821emsh667b5b1a47716a6p1fd922jsn3342ab69a8ca',
                    'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
                }
            };
            const apiRequest = http.request(options, function (apiResponse) {
                const chunks = [];
        
                apiResponse.on('data', function (chunk) {
                    chunks.push(chunk);
                });
        
                apiResponse.on('end', function () {
                    const body = Buffer.concat(chunks);
                    console.log(body.toString());
                    // Assuming you want to send the response to the client
                    res.send(body.toString());
                });
            });
        //Handle errors
        apiRequest.on('error', function(error) {
            console.error(error);
            // Handle error
            res.status(500).send('Internal Server Error');
        });
        apiRequest.end();
        
        });

        

// DONT FORGET THE redirectLogin
    //List of Starters, Mains And Desserts

    app.get('/MenuList', function(req, res) {

        let sqlquery = "SELECT * FROM starters"; //query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, resultStarters) => {
            if (err) {
                return res.redirect('/');
            }

            let allmains = "SELECT * FROM mains"; //query database to get all the books
            // execute sql query
            db.query(allmains, (err, resultMains) => {
                if (err) {
                    return res.redirect('/');
                }
                let alldesserts = "SELECT * FROM desserts"; //query database to get all the books
                // execute sql query
                db.query(alldesserts, (err, resultDesserts) => {
                    if (err) {
                        return res.redirect('/');
                    }
                let food = Object.assign({}, shopData, {availableStarters: resultStarters, availableMains: resultMains, availableDesserts: resultDesserts});
                res.render("MenuList.ejs", food)
                });
            });
        });
    });


    app.get('/Order', function(req, res) {

        let sqlquery = "SELECT * FROM starters"; //query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, resultStarters) => {
            if (err) {
                return res.redirect('/');
            }

            let allmains = "SELECT * FROM mains"; //query database to get all the books
            // execute sql query
            db.query(allmains, (err, resultMains) => {
                if (err) {
                    return res.redirect('/');
                }
                let alldesserts = "SELECT * FROM desserts"; //query database to get all the books
                // execute sql query
                db.query(alldesserts, (err, resultDesserts) => {
                    if (err) {
                        return res.redirect('/');
                    }
                let food = Object.assign({}, shopData, {availableStarters: resultStarters, availableMains: resultMains, availableDesserts: resultDesserts});
                res.render("Order.ejs", food)
                });
            });
        });
    });

    app.post('/getOrder', function (req,res) {
        const numericArray = req.body.Order.map(Number);
        const resultString = `(${numericArray.join(",")})`;
        console.log(resultString)
        
        // res.send(resultString)
        let sqlquerystarter = 'SELECT starter_name FROM starters WHERE starter_id IN ' + resultString ;
        
        db.query(sqlquerystarter, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else{
                var allresults = ""
                for (i=0; i < result.length; i++) {
                    allresults += result[i].starter_name;
                }
            res.send(" Here are your Starters: " + allresults)
                
            }
        })
        let sqlquery = "";
        // execute sql query
        let newrecord = [];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
        })

    })
    /

    app.get('/addstarter', function (req,res) {
        //Adding starter
        res.render('addstarter.ejs', shopData);
    })

    app.post('/starteradded', function (req,res) {
        // saving data in database
        if(req.body.price >= 4.99) {
        let sqlquery = "INSERT INTO starters (starter_name, starter_price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
        res.send(' This starter is added to database, name: '+ req.body.name + ' price '+ req.body.price);
        });
        }
        else {
            res.send('The minimum price for a starter is £4.99')
        }
    });


    app.get('/addstarter', function (req,res) {
        //Adding starter
        res.render('addstarter.ejs', shopData);
    })

    app.post('/starteradded', function (req,res) {
        // saving data in database
        if(req.body.price >= 5.99) {
        let sqlquery = "INSERT INTO starters (starter_name, starter_price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
        res.send(' This starter is added to database, name: '+ req.body.name + ' price '+ req.body.price);
        });
        }
        else {
            res.send('The minimum price for a starter is £5.99')
        }
    });


    app.get('/addmain', function (req,res) {
        //Adding Main
        res.render('addmain.ejs', shopData);
    })

    app.post('/mainadded', function (req,res) {
        // saving data in database
        if(req.body.price >= 10.99) {
        let sqlquery = "INSERT INTO mains (main_name, main_price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
        res.send(' This main is added to database, name: '+ req.body.name + ' price '+ req.body.price);
        });
        }
        else {
            res.send('The minimum price for a starter is £10.99')
        }
    });

    app.get('/adddessert', function (req,res) {
        //Adding starter
        res.render('adddessert.ejs', shopData);
    })

    app.post('/dessertadded', function (req,res) {
        // saving data in database
        if(req.body.price >= 4.99) {
        let sqlquery = "INSERT INTO desserts (dessert_name, dessert_price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
        res.send(' This dessert is added to database, name: '+ req.body.name + ' price '+ req.body.price);
        });
        }
        else {
            res.send('The minimum price for a starter is £4.99')
        }
    });

}


// 1 -  sql query - Select hashed password from userdetails where username = ? 
// 2 - bcrypt compare the password to the userdetails hashed password
//req.session.userId = req.body.username