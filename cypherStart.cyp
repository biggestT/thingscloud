
// Cypher (version 1.9.x) queries for Thingscloud

CREATE (root),(tor { name:'tor' }),(emil { name:'emil' }),(alexander { name:'alexander'}),

(tag1{tag:'lamp'}), (tag2{tag:'yellow'}), (tag3 { tag:'vintage' }), (tag4 { tag: 'painting' }), (tag5 { tag:'table'}), (tag6 {tag: 'box'}), (tag7 {tag: 'projector'}), (tag8 {tag: 'electronics'}),

(photo1 { mediumPhoto:'https://photos-3.dropbox.com/t/0/AACg7uN8QDZwOzAIV39VL8FZ1Fmad2JSfdeUyduFi5AF0g/12/113599483/jpeg/200x200/1/_/0/4/IMG_20130727_122036.jpg/ljtg1shwk4cca4v/AwUmJ-qUnc/IMG_20130727_122036.jpg'}), 
(photo2 { mediumPhoto:'https://photos-3.dropbox.com/t/0/AABucp9ZOW1d0BJ1bvh1EIDrKsqCo-eY_C7qTViNAtmq0Q/12/113599483/jpeg/200x200/1/_/0/4/IMG_20130727_121945.jpg/no07wumhqmylgv0/G44MjYtmkF/IMG_20130727_121945.jpg'}), 
(photo3 { mediumPhoto:'https://photos-2.dropbox.com/t/0/AABLCVXbh8-FbFJW8XvvZXWKnqNAX5OB7C3tb_La2XU4zg/12/113599483/jpeg/200x200/1/_/0/4/IMG_20130727_121845.jpg/ol6mcoebteoc6dh/pv2Zo7lBDF/IMG_20130727_121845.jpg'}),


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

// Insert a new thing beloning to a certain user (@TODO: avoid inserting duplicates)

START me=node(*) 
WHERE has(me.uid) AND me.uid ={uid} 
CREATE 
(thing { visibility:{vis} }), 
(photo { url: {url}, path: {path} }), 
photo-[:PHOTO_OF]->thing, 
me-[:OWNS { since: {date} }]->thing


// Create a new user

CREATE (user {name: {dbName}, uid: {uid} })

// Set all names to lowercase

START n=node(*) 
WHERE HAS (n.name) 
SET n.name = LOWER(n.name)


// Get a list of all things owned by a certain user

START me=node(*) 
MATCH me-[r:OWNS]->t 
WHERE me.name? ="tor"
WITH t AS thing, r.since AS ownedSince 
MATCH photo-[:PHOTO_OF]->thing
WITH thing, ownedSince, photo.mediumPhoto AS mediumPhoto
MATCH tag<-[:IS]-thing 
WITH thing.visibility AS visibility, COLLECT(tag.tag) AS tags, ownedSince, mediumPhoto
RETURN tags, mediumPhoto, visibility, ownedSince
ORDER BY ownedSince DESC

// Clear the whole graph

START n = node(*) MATCH n-[r?]-() WHERE ID(n)>0 DELETE n, r;