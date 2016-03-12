var crypto = require('crypto')
var hash = crypto.createHash('sha256')
var mongoose = require('mongoose'),
	User = mongoose.model('User');


exports.signup = function(req,res){
	var user = new User({username:req.body.username})
	user.set('hashed_password',req.body.password)
	user.set('email',req.body.email)
	user.save(function(err){
		if(err){
			console.log("there is an error here")
			res.session.error = err
			res.redirect('/signup')
		}else{
			req.session.user = user.id;
			req.session.username = user.username;
			req.session.msg = 'authenticated as ' + user.username;
			res.redirect('/');
		}
	})
}

exports.login = function(req,res){
	User.findOne({username:req.body.username}).exec(function(err,user){
		if(!user){
			err = "user not found"
		}else if(user.hashed_password === req.body.password){
			req.session.regenerate(function(){
				req.session.user = user.id
				req.session.username = user.username
				req.session.msg = 'Authenticated as ' + user.username;
				res.redirect('/')
			})
		}
	})
}

exports.getUserProfile = function(req,res){
	User.findOne({_id: req.session.user}).exec(function(err,user){
		if(!user){
			res.status(404).json({err:'User Not Found'})
		}else{
			res.json(user)
		}
	})
}

exports.updateUser = function(req,res){
	User.findOne({_id: req.session.user}).exec(function(err,user){
		user.set('email',req.body.email)
		user.set('color',req.body.color)
		user.save(function(err){
			if(err){
				res.session.error = err
			}else{
				req.session.msg = 'User updated';
			}
			res.redirect('/user')
		})
	})
}

exports.deleteUser = function(req,res){
	User.findOne({_id: req.session.user}).exec(function(err,user){
		if(user){
			user.remove(function(err){
				if(err){
					req.session.msg = err
				}
				req.session.destroy(function(){
					res.redirect('/login')
				})
			})
		}else{
			req.session.msg = "User Not Found"
			req.session.destroy(function(){
				res.redirect('/login')
			})
		}
	})
}