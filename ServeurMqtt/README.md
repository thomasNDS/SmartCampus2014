MQQT server
==============

Install
-----------

sudo npm install mqtt express mongodb mongoose mongoose-schema-extend express-restify-mongoose mers

Launch
-----------

sudo service mongodb start
nodejs serveur.js


API
=====

you could then access it at
    listing.
    
    http://localhost:4242/api/building/
    http://localhost:4242/api/building/$id
    http://localhost:4242/api/building/$id/items
    http://localhost:4242/api/building/$id/items/$id
    http://localhost:4242/api/building/$id/items/0
    http://localhost:4242/api/building/finder/findTitleLike/term
    
    
###Pagination
Pagination is also supported via skip= and limit= query params.

    http://localhost:4242/api/building/$id?skip=10&limit=10

###Population
Mongoose populate is supported, but this will be changing shortly to allow for more
fine grained controll over population.  Currently you can do

    http://localhost:4242/api/building?populate=items

or to specify particular fields.

    http://localhost:4242/api/building?skip=10&populate[items]=title,date



###Filter
Filtering is available for strings. To find all the blog posts with C in the title.

    http://localhost:4242/api/building?filter[title]=C

Also you can and or nor the filters by using + (and) - (nor)  or nothing or
    http://localhost:4242/api/building?filter[-title]=C
    http://localhost:4242/api/building?filter[+title]=C&filter[-body]=A



To filter all String fields that have a C in them

    http://localhost:4242/api/building?filter=C


###Sorting
Sorting is supported 1 ascending -1 ascending.

  http://localhost:4242/api/building?sort=title:1,date:-1

###Transformer
Transformers can be registered on startup.  A simple TransformerFactory is
included.  Something that takes security into account could be added.  Currently
this is only supported on the get operations.   May change the responses to post
to send location, though I find that pretty inconvient.


```javascript

app.use('/api', require('mers').rest({
    mongoose:mongoose,
    transformers:{
           renameid:function(Model, label){
            //do some setup but return function.
              return function(obj){
                obj.id = obj._id;
                delete obj._id;
                //don't forget to return the object.  Null will filter it from the results.
                return obj;
              }
           }
      }
    }));
}
```

to get results transformered just add

     http://localhost:4242/api/building?transform=renameid



It handles  get/put/post/delete I'll add some docs on that some day, but pretty much as you expect, or I expect anyways.
see tests/routes-mocha.js for examples.

###Static Finders
It should also be able to be used with Class finders. Now handles class finders. Note: They must return  a query object.
They are passed the query object and the rest of the url. All of the populate's, filters, transforms should work.

```javascript

/**
 * Note this must return a query object.
 * @param q
 * @param term
 */
BlogPostSchema.statics.findTitleLike = function findTitleLike(q, term) {
    return this.find({'title':new RegExp(q.title || term, 'i')});
}

```

So you can get the url

    http://localhost:4242/api/building/finder/findTitleLike?title=term

or

    http://localhost:4242/api/building/finder/findTitleLike/term

### [Error Handling][error]
To create a custom error handler

```javascript

   app.use('/rest, rest({
         error : function(err, req, res, next){
               res.send({
                   status:1,
                   error:err && err.message
               });
           }).rest());

```

### Custom Transformers
You can transform your results by adding a custom transformer and or adding a new TransformerFactory

```javascript

   app.use('/rest, rest({
         transformers :{
          cooltranform:function(Model, label){
             return function(obj){
                    obj.id = obj._id;
                    delete obj._id;
                    return obj; //returning null removes it from the output
             }
          } }).rest());

```

### Selecting
Selecting support is upcoming, but for now you can do it in finders

```javascript
 var User = new Schema({
   username:String,
   birthdate:Date
 });
 User.statics.selectJustIdAndUsername  = function(){
  this.find({}).select('_id username');
 }

```