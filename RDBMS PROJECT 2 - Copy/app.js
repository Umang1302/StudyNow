var express        = require("express"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Article        = require("./models/article"),
    User           = require("./models/user"),
    methodOverride = require("method-override"),
    app            = express();

mongoose.connect('mongodb://localhost:27017/StudyNow', {useNewUrlParser: true, useUnifiedTopology: true});



app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());


app.use(require("express-session")({
    secret: "U just login!!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 

app.use(function(req,res,next){
 res.locals.currentUser = req.user;
 next();
});


app.get("/",function(req,res){
   
   res.redirect("/article");
});

app.get("/article",function(req,res){
  req.user
   Article.find({},function(err,article){
      if(err){
      	console.log("Error!!");
      }else{
      	res.render("index",{article:article,currentUser: req.user});
      }
   });
});

app.get("/article/new",isLoggedIn,function(req,res){
   res.render("new");
});

app.post("/article",function(req,res){
   
  req.body.article.body =req.sanitize(req.body.article.body);
   Article.create(req.body.article,function(err,newarticle){
       if(err){
       	res.render("new");
       }else{
          res.redirect("/article");
       }
   })
});


app.get("/article/:id",function(req,res){
	Article.findById(req.params.id,function(err,foundArticle){
           if(err){
           	res.redirect("/article");
           }else{
                res.render("show",{article:foundArticle});
           }

	});
});

app.get("/article/:id/edit",isLoggedIn,function(req,res){
 Article.findById(req.params.id,function(err,foundArticle){
    if(err){
           res.redirect("/article");
    }else{
          res.render("edit",{article: foundArticle});
    }
 });
});

app.put("/article/:id",isLoggedIn,function(req,res){
   req.body.article.body =req.sanitize(req.body.article.body);
   Article.findByIdAndUpdate(req.params.id,req.body.article,function(err,updatedArticle){
    if(err){
      res.redirect("/article");
    }else{
      res.redirect("/article/" + req.params.id);
    }
   });
});

app.delete("/article/:id",isLoggedIn,function(req,res){
   Article.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/article");
    }else{
      res.redirect("/article");
    }
   });
});


app.get("/register",function(req,res){
   res.render("register");
});

app.post("/register",function(req,res){
   User.register(new User({username: req.body.username}),req.body.password,function(err,user){
    if(err){
      console.log(err);
     return res.render("/register");
    }
    passport.authenticate("local")(req,res,function(){
       res.redirect("/article");
    });
   });
});

app.get("/login",function(req,res){
   res.render("login");
});

app.post("/login", passport.authenticate("local",
  {successRedirect:"/article",
  failureRedirect: "/login"

}),function(req,res){
    
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/article");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.get("/about",function(req,res){
   res.render("about");
});

app.listen(3000,function(){
    console.log("SERVER IS LIVE NOW!!!!");
});  