
// Cypher (version 1.9.x) queries for Thingscloud

CREATE (root),(tor { name:'tor' }),(emil { name:'emil' }),(alexander { name:'alexander'}),

(tag1{tag:'lamp'}), (tag2{tag:'yellow'}), (tag3 { tag:'vintage' }), (tag4 { tag: 'painting' }), (tag5 { tag:'table'}), (tag6 {tag: 'box'}), (tag7 {tag: 'projector'}), (tag8 {tag: 'electronics'}),

(photo1 { mediumPhoto:'https://photos-3.dropbox.com/t/0/AACg7uN8QDZwOzAIV39VL8FZ1Fmad2JSfdeUyduFi5AF0g/12/113599483/jpeg/200x200/1/_/0/4/IMG_20130727_122036.jpg/ljtg1shwk4cca4v/AwUmJ-qUnc/IMG_20130727_122036.jpg'}), 
(photo2 { mediumPhoto:'https://photos-3.dropbox.com/t/0/AABucp9ZOW1d0BJ1bvh1EIDrKsqCo-eY_C7qTViNAtmq0Q/12/113599483/jpeg/200x200/1/_/0/4/IMG_20130727_121945.jpg/no07wumhqmylgv0/G44MjYtmkF/IMG_20130727_121945.jpg'}), 
(photo3 { mediumPhoto:'https://photos-2.dropbox.com/t/0/AABLCVXbh8-FbFJW8XvvZXWKnqNAX5OB7C3tb_La2XU4zg/12/113599483/jpeg/200x200/1/_/0/4/IMG_20130727_121845.jpg/ol6mcoebteoc6dh/pv2Zo7lBDF/IMG_20130 727_121845.jpg'}),


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

START me=node:node_auto_index(name='Tor Nilsson Ohrn') 
MATCH me-[r:OWNS]->t 
WHERE me.uid=113599483
WITH t AS thing, r.since AS ownedSince 
MATCH photo-[?:PHOTO_OF]->thing 
WITH thing, ownedSince, photo.url AS photo 
MATCH tag<-[?:IS]-thing 
WITH thing.visibility AS visibility, COLLECT(tag.tag) AS tags, ownedSince, photo 
RETURN tags, photo, visibility, ownedSince ORDER BY ownedSince DESC


// TEST DELETE THING WITH AUTOINDEXING
START me=node:node_auto_index(name='Tor Nilsson Ohrn') 
MATCH me-[r:OWNS]->t 
WHERE me.uid=113599483 AND t.tId='6YLvy4ZQK' 
WITH t AS thing 
MATCH photo-[r?:PHOTO_OF]->thing 
WITH thing, r AS photoRelation, photo
MATCH tag<-[taggedRelation?:IS]-thing 
DELETE thing, photo, photoRelation, taggedRelation 
RETURN photo.path

// TEST DELETE THING WITHOUT AUTOINDEXING
START t=node(*)
MATCH 
o-[ro:OWNS]->t,
p-[rp?:PHOTO_OF]->t,
t-[rt?:IS]->()
WHERE o.uid=113599483 AND t.tId! = "3DjWp1TzGnrVb"
WITH t.tId AS tId, ro, rp, rt, t, p
DELETE ro, rp, rt, t, p
RETURN tId




// I. Create new unique tags if needed
START tag=node(*)
WHERE tag.tagName! IN ["teest", "test2", "test3"] 
WITH COLLECT(tag.tagName) AS existingTags
FOREACH(newTag in filter(oldTag in ["teest", "test2", "test3"] WHERE NOT(oldTag in existingTags))  : 
	CREATE (tag{tagName:newTag})
)

// II. Connect the thing with the tags if they exists
START thing=node(*), tag=node(*)
WHERE thing.tId! ="3DjWp1TzGnrVb"
AND tag.tagName! IN ["teest", "test2", "test3"] 
CREATE UNIQUE
thing-[r:IS]->tag
return r

// Attempt to combine I and II
START tag=node(*)
WHERE tag.tagName! IN ["teest", "test2", "test3"] 
WITH COLLECT(tag.tagName) AS existingTags
FOREACH(newTag in filter(oldTag in ["teest", "test2", "test3"] WHERE NOT(oldTag in existingTags))  : 
	CREATE (tag{tagName:newTag})
)
WITH existingTags
START thing=node(*), tag=node(*)
WHERE thing.tId! ="3DjWp1TzGnrVb"
AND tag.tagName! IN ["teest", "test2", "test3"] 
CREATE UNIQUE
thing-[r:IS]->tag
return tag


match me-[:OWNS]->t where t.tId="LYjJ02hDEg8g1" and me.uid=113599483 return t.tId;
