
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  //ここでpassportモジュールを宣言
  , passport = require("passport")
  //Facebook認証用モジュールのstrategyを利用するための宣言
  , FacebookStrategy = require("passport-facebook").Strategy
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  //設定を追加する。
  //expressでのsessionを有効にするのでcookiePaserを有効にする
  app.use(express.cookieParser());
  //expressのsessionミドルウェアを有効にしてsecretを設定
  app.use(express.session({secret: "secret"}));
  //passportの初期化
  app.use(passport.initialize());
  //passportでのログイン状態を保持するpassport sessionミドルウェアを有効にする
  app.use(passport.session());

});

//facebookの認証のときのメソッド
passport.use(new FacebookStrategy({
  
  //FacebookアプリのID
  clientID: "351894894906777",
  //FacebookアプリのSecret
  clientSecret: "36e483fdc41a4afbc443a5f84e3df71b",
  //認証後のリダイレクト先URL 
  callbackURL: "http://localhost:3000/oauth/callback" },

  function(accessToken, refreshToken, profile, done){
      // 認証後返されるaccessTokenをセッションに持たせておく
      passport.session.accessToken = accessToken;
      //Facebookから返されるProfileをそのままユーザ情報としてセッションで保持するようにしておく
      process.nextTick(function(){
         done(null ,profile);
  });


}));



app.configure('development', function(){
  app.use(express.errorHandler());
});


//ここからルーティング設定
app.get('/', routes.index);
app.get('/users', user.list);
//localhost:3000/authで、Facebookにリダイレクトして認証を行う。
app.get('/oauth', passport.authenticate('facebook'));



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
