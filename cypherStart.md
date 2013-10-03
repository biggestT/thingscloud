
Cypher (version 1.9.x) queries for Thingscloud
#####################################


Initialize a new test database for thingscloud
----------------------------


CREATE (root),(tor { name:'Tor' }),(emil { name:'Emil' }),(alexander { name:'Alexander'}),

(tag1{tag:'lamp'}), (tag2{tag:'yellow'}), (tag3 { tag:'vintage' }), (tag4 { tag: 'painting' }), (tag5 { tag:'table'}), (tag6 {tag: 'box'}), (tag7 {tag: 'projector'}), (tag8 {tag: 'electronics'}),

(photo1 { url:'https://dl.dropbox.com/s/a3icq9omjlbd3sm/IMG_20130727_122036.jpg'}), 
(photo2 { url:'https://dl.dropbox.com/s/7m1gz9nyx5dcntq/IMG_20130727_121945.jpg'}), 
(photo3 { url:'https://dl.dropbox.com/s/00fy4fu8ufpvzh7/IMG_20130727_121845.jpg'}),


(thing3 { visibility:'private' }), 
(thing1 {visibility:'public'}), 
(thing2 {visibility:'private'}),
(thing4 {visibility: 'public'}),
(thing5 {visibility: 'public'}),

thing4-[:IS]->tag3, thing4-[:IS]->tag6, 
photo3-[:PHOTO_OF]->thing4,
thing2-[:IS]->tag3, thing2-[:IS]->tag4, 
photo2-[:PHOTO_OF]->thing2,
thing1-[:IS]->tag1,  thing1-[:IS]->tag2, thing1-[:IS]->tag3, 
photo1-[:PHOTO_OF]->thing1, 
thing3-[:IS]->tag3,  thing3-[:IS]->tag5,
thing5-[:IS]->tag7, thing5-[:IS]->tag8,

root-[:ROOT]->tor, 
tor-[:FRIENDS {since:'2009-08-25'}]->emil,
tor-[:FRIENDS {since:'2009-08-20'}]->alexander,
emil-[:FRIENDS {since:'2009-08-16'}]->alexander,

tor-[:OWNS {since: '2010-04-10'}]->thing1, 
tor-[:OWNS {since: '2010-09-20'}]->thing2, 
tor-[:OWNS {since: '2012-09-01'}]->thing4,

tor-[:OWNS {since: '2010-09-10' }]->thing5,
alexander-[:OWNS {since: '2010-09-10' }]->thing5,
tor-[:USES {since: '2013-07-10' }]->thing5,

emil-[:OWNS {since: '2010-01-10'}]->thing3





Get a list of all things owned by a certain user
---------------------------------------

# x = users name

START user=node(*) MATCH user-[:OWNS]->thing WHERE user.name='x'  RETURN thing