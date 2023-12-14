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
                // Sanatize first name and last name
                let sqlquery = "INSERT INTO users (firstname,lastname,email,username,hashedpassword) VALUES (?,?,?,?,?)";
                let newrecord = [req.sanitize(req.body.first),req.sanitize(req.body.last),req.body.email,req.body.username,hashedPassword];
      
                db.query(sqlquery,newrecord, (err, result) => {
                  if(err) {
                      return console.error(err.message);
                  }
                  else {
                      result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.body.email;
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

        let sqlquery = "SELECT hashedpassword, user_id FROM users WHERE username =?";
        
        let userdata = req.body.username;//SELECT hashedpassword FROM userdetails WHERE username = "abc"

        db.query(sqlquery, userdata, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                //hashedPassword = result[0].hashedpassword;
                //console.log(hashedpassword);
                const user_id = result[0].user_id
                console.log(req.body.password);
                console.log(result);
                bcrypt.compare(req.body.password, result[0].hashedpassword, function(err, result) {
                    if (err) {
                      // TODO: Handle error
                      res.send( 'There is an error');
                    }
                    else if (result == true) {

                      req.session.userId = user_id//req.body.username;
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
    //Logout
    app.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('./')
            }
            res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    })   

    // Delete a user
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
        let sqlquery = "SELECT user_id,firstname, lastname, email, username FROM users"; // query database to get all users
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
    //List of Orders
    app.get('/listorders', function(req, res) {
        let sqlquery = "SELECT * from vw_order_details"; // query database to get all orders
        // exxecute sql query
        db.query(sqlquery, (err, result) => {
            if(err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableorders: result});
            console.log(newData)
            res.render("listorders.ejs", newData)

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


        //Food Recepies
        app.get('/Recipes', function (req,res) {
            const https = require('https');
            const options = {
                method: 'GET',
	            hostname: 'food-recipes-with-images.p.rapidapi.com',
	            port: null,
	            path: '/?q=chicken%20soup',
	            headers: {
		            'X-RapidAPI-Key': '9486a8821emsh667b5b1a47716a6p1fd922jsn3342ab69a8ca',
		            'X-RapidAPI-Host': 'food-recipes-with-images.p.rapidapi.com'
	            }
            };
            const recipeReq = https.request(options, function(apiRes) {
                const chunks = [];

                apiRes.on('data', function (chunk) {
                    chunks.push(chunk);
                })

                apiRes.on('end', function () {
                    const body = Buffer.concat(chunks);
                    var Recipes = JSON.parse(body)
                    // const recipeDetails = Recipes.d.map(recipe => ({
                    //     title: recipe.Title,
                    //     ingredients: recipe.Ingredients,
                    //     instructions: recipe.Instructions
                    // }));
     

                    // for (i=0; i <Recipes.d.length; i++) {
                    //     res.send(JSON.stringify(Recipes.d[i]))
                    // }
                    // res.send(JSON.stringify(recipeDetails))
                    // res.send(JSON.stringify(Recipes.d[0].Ingredients) + "" + Recipes.d[0].Title)
                    res.send("<p>"+"<h2>"+"Title: " + "</h2>" +Recipes.d[0].Title+ "</p>" 
                    + "<p>"+ "<h2>"+"Ingredients: " +"</h2>"+ JSON.stringify(Recipes.d[0].Ingredients) + "</p>" 
                    + "<p>" + "<h2>"+"Instructions: " + "</h2>"+JSON.stringify(Recipes.d[0].Instructions)+ "</p>"
                    +"<p>"+"<h2>"+"Title: " + "</h2>" +Recipes.d[1].Title+ "</p>" 
                    + "<p>"+ "<h2>"+"Ingredients: " +"</h2>"+ JSON.stringify(Recipes.d[1].Ingredients) + "</p>" 
                    + "<p>" + "<h2>"+"Instructions: " + "</h2>"+JSON.stringify(Recipes.d[1].Instructions)+ "</p>"
                    +"<p>"+"<h2>"+"Title: " + "</h2>" +Recipes.d[2].Title+ "</p>" 
                    + "<p>"+ "<h2>"+"Ingredients: " +"</h2>"+ JSON.stringify(Recipes.d[2].Ingredients) + "</p>" 
                    + "<p>" + "<h2>"+"Instructions: " + "</h2>"+JSON.stringify(Recipes.d[2].Instructions)+ "</p>"
                    +"<p>"+"<h2>"+"Title: " + "</h2>" +Recipes.d[3].Title+ "</p>" 
                    + "<p>"+ "<h2>"+"Ingredients: " +"</h2>"+ JSON.stringify(Recipes.d[3].Ingredients) + "</p>" 
                    + "<p>" + "<h2>"+"Instructions: " + "</h2>"+JSON.stringify(Recipes.d[3].Instructions)+ "</p>"
                    +"<p>"+"<h2>"+"Title: " + "</h2>" +Recipes.d[4].Title+ "</p>" 
                    + "<p>"+ "<h2>"+"Ingredients: " +"</h2>"+ JSON.stringify(Recipes.d[4].Ingredients) + "</p>" 
                    + "<p>" + "<h2>"+"Instructions: " + "</h2>"+JSON.stringify(Recipes.d[4].Instructions)+ "</p>"
                    )

                    // res.send(JSON.parse(body));
                });
            });

            recipeReq.end();
        });
        
        //API
        app.get('/api', function (req,res) {
            let sqlquery = "SELECT * FROM starters"; //query database to get all the starters
            // execute sql query
            db.query(sqlquery, (err, resultStarters) => {
                if (err) {
                    return res.redirect('/');
                }
    
                let allmains = "SELECT * FROM mains"; //query database to get all the mains
                // execute sql query
                db.query(allmains, (err, resultMains) => {
                    if (err) {
                        return res.redirect('/');
                    }
                    let alldesserts = "SELECT * FROM desserts"; //query database to get all the desserts
                    // execute sql query
                    db.query(alldesserts, (err, resultDesserts) => {
                        if (err) {
                            return res.redirect('/');
                        }
                    let food = Object.assign({}, shopData, {availableStarters: resultStarters, availableMains: resultMains, availableDesserts: resultDesserts});
                // Return results as a JSON object
                res.json(food);
                    });
            });
        });
        });

// DONT FORGET THE redirectLogin
    //List of Starters, Mains And Desserts

    app.get('/MenuList', function(req, res) {

        let sqlquery = "SELECT * FROM starters"; //query database to get all the starters
        // execute sql query
        db.query(sqlquery, (err, resultStarters) => {
            if (err) {
                return res.redirect('/');
            }

            let allmains = "SELECT * FROM mains"; //query database to get all the mains
            // execute sql query
            db.query(allmains, (err, resultMains) => {
                if (err) {
                    return res.redirect('/');
                }
                let alldesserts = "SELECT * FROM desserts"; //query database to get all the desserts
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

    app.get('/Order',redirectLogin, function(req, res) {

        let sqlquery = "SELECT * FROM starters"; //query database to get all the starters
        // execute sql query
        db.query(sqlquery, (err, resultStarters) => {
            if (err) {
                return res.redirect('/');
            }

            let allmains = "SELECT * FROM mains"; //query database to get all the mains
            // execute sql query
            db.query(allmains, (err, resultMains) => {
                if (err) {
                    return res.redirect('/');
                }
                let alldesserts = "SELECT * FROM desserts"; //query database to get all the desserts
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
    // Get customer order
    app.post('/getOrder', function (req,res) {
        // Get starter results
        let numericStarterArray = null
        if(typeof(req.body.Order) == "string") 
            numericStarterArray = [Number(req.body.Order)]
        else 
            numericStarterArray = req.body.Order.map(Number);
        const StarterresultString = `${numericStarterArray.join(",")}`;
        console.log(StarterresultString)
        
        // // Get main results
        let numericMainArray = null
        if(typeof(req.body.Order_two) == "string") 
            numericMainArray = [Number(req.body.Order_two)]
        else
            numericMainArray = req.body.Order_two.map(Number);
        const MainresultString = `${numericMainArray.join(",")}`;
        console.log(MainresultString)
        
        // // Get dessert results
        let numericDessertArray = null
        if(typeof(req.body.Order_three) == "string") 
            numericDessertArray = [Number(req.body.Order_three)]
        else
            numericDessertArray = req.body.Order_three.map(Number);
        const DessertresultString = `${numericDessertArray.join(",")}`;
        console.log(DessertresultString)

        // SQL query
        let sqlquery = 'CALL sp_insert_orderx(?,?,?,?) ' 
        
        params = [StarterresultString,MainresultString,DessertresultString,req.session.userId];

        db.query(sqlquery, params, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else{
        }})

        //Display what the customer has ordered after they selected what they want to eat
        
        // SQL query
        let sqlquerystarter = 'SELECT starter_name,starter_price FROM starters WHERE starter_id IN (' + StarterresultString +')' ;
        
        db.query(sqlquerystarter, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else{
                var allStarterresults = ""
                for (i=0; i < result.length; i++) {
                    allStarterresults += result[i].starter_name + ",";
                    prices += result[i].starter_price
                }

            let sqlquerymain = 'SELECT main_name,main_price FROM mains WHERE main_id IN (' + MainresultString +')';
        
            db.query(sqlquerymain, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else{
                    var allresults = ""
                    for (i=0; i < result.length; i++) {
                        allresults += result[i].main_name + ",";
                        prices += result[i].main_price
                    }

                let sqlquerydessert = 'SELECT dessert_name,dessert_price FROM desserts WHERE dessert_id IN (' + DessertresultString +')';
        
                db.query(sqlquerydessert, (err, result) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    else{
                        var allresultsDesserts = ""
                        for (i=0; i < result.length; i++) {
                            allresultsDesserts += result[i].dessert_name + ",";
                            prices += result[i].dessert_price
                        }
                    res.send("<p>Here are your Starters: " + allStarterresults + "</p>" + "<p>Here are your Mains: " + allresults + "</p>" + "Here are your Desserts: " + allresultsDesserts)
                    
                    }
                    
                })
                }
            })
            }
        })
        

    })
    

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