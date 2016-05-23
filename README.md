# Super Model Data Source
## CouchDB

This plugin provides basic CouchDB access to Super Model

### Example

```
/**
 * Require Super Model
 */
var sm = require('super-model');
 
/**
 * Add a data source
 */
sm.addDataSource(require('super-model-couchdb')({
    protocol: 'http',
    host: 'localhost',
    port: '5984'
}));
 
/**
 * Create your instance of a User Model
 */
var User = sm.clone({
    mapping: { //used to normalize imported keys to model values
        em: 'email',
        fn: 'first_name',
        ln: 'last_name',
        ps: 'password'
    },
    filters: { //used to filter values at set time
        email: function(val){
            //do email validation
            return val;
        },
        password: function(val){
            //hash your password
            return md5(val); //pseudo code
        }
    }
}, 'couchdb', {
    database: 'user_database'
});
 
/**
 * Now use your new data source access methods!
 */
var user = new User;
    user.find(1, //find user with id == 1
        function(){ //callback once user is retrieved
            var email = this.get('email');
            console.log(email); //check email returned
            this.set('email', 'newemail@host.com'); //set email to new value
            this.save(function(){ //save the record
                console.log('saved', this.export()); //shows updated data and new revision
            });
        });

/**
 * Or user promises!
 */
    user.find(1).then(function(){
        console.log(this.export()); //got your user info!!
        this.set('email', 'newemail@host.com');
        this.save().then(function(){
            console.log('User saved!');
        }, function(err){
            console.log('Error saving your user!', err);
        });
    }, function(err){
        console.log('Failed to find that user!', err);
    });
```
