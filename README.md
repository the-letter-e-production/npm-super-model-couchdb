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
        function(user){ //callback once user is retrieved
            var email = user.get('email');
        })
```
