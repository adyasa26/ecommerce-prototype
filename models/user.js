let monggose = require('mongoose')
let Schema = monggose.Schema;
let bcrypt = require('bcrypt-nodejs')

let userSchema = new Schema({
    nickname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validPassword = (password)=>{
    if(this.password != null) {
        return bcrypt.compareSync(password, this.password);
    } else {
        return false;
    }
} 

let User = module.exports = monggose.model('User', userSchema);

module.exports.getUserById = (id, cb)=>{
    User.findById(id,cb);
}

module.exports.getUserByEmail = (email, cb)=>{
    User.findOne({email:email},cb);
}

module.exports.createUser = (newUser, cb)=>{
        bcrypt.genSalt(10,(err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save(cb);
            })
        })
}

module.exports.comparePassword = (myPassword, hash, cb)=>{
    bcrypt.compare(myPassword, hash,(err, isMatch)=>{
        if(err) throw err;
        cb(null, isMatch);
    })
}