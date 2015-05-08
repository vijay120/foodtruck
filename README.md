Food trucks near you
====================

Total Time spent: 3.5 hrs

Hosted here: https://secret-eyrie-5566.herokuapp.com/

Problem
-------
The user is hungry and wants a seamless way of finding food trucks near him/her.

Solution
--------
Food trucks near you is a service built under the assumption that the user wants 
to quickly find food trucks near their current location. The service geolocates
the user and based on their location information finds food trucks near them.

Solution focus
--------------
Food trucks near you is a full-stack, jack of all trades solution.

Architecture
------------
The app is built in express/socket.io with ejs used as the templating engine. Mocha
is used for testing and Heroku is used for hosting. The google maps v3 js API is used
for map related rendering. 

Why sockets?
------------
This application has an interface that does not expose to the user how geolocation is 
done. For example, one could very well make an interface such that / would be redirected
to /lat=x&long=y upon user agreement to track data. However, this exposes the internals 
of how the service is working to the user. 

A more cleaner user experience would be to get location data, submit that to the server
and then render an updated map based on the results in the same page, making the 
application single page. 

There are two ways on can do this:

1. Ajax: This solution is a request/response solution where the routes to the results
page has to be handled. 

2. Socket.io: This solution uses a bi-directional pipe between the server/client, as 
opposed to the single direction request/response

We used socket.io for its event-driven paradigm, which works well with Node constructs
like emit and on. This make for a more intuitive system than a traditional restful
application in node.

Things to improve on
--------------------

1. Update results based on user actions like map zooming, panning etc. I would like to 
hook into these actions and customize my results based on that. This would work well
with socket.io since such events can be registered by the server for further processing.

2. Make the ADJUSTABLEZOOM variable in latLongToUrlConverter.js more adaptive based on
zoom values in the map. The first answer here provides a decent way to do it:
http://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds

3. Better layouts for the map infowindows. So apparently one cannot add a stylesheet to these
infowindows. Google has a special way of providing fields to manipulate infowindow styles,
which is super antithetical to webdev. 


Other code that I am particular proud of
----------------------------------------
This is a loaded question since all my side projects are mostly about learning new languages
or building an idea that I thought was cool. Though I do very much care about the health
of my code, and actively practice it in my workplace code, I do relax my rules around
testing and linting around playful code.

That said, I do love this project: https://github.com/vijay120/boxdrop

I do because people use it (its a google extension) and it learnt the internals of the OAuth2.0 
code flow.

Resume
------
https://cloud.box.com/s/ou0vvszmwb81nhghxj2majq35nu6axsp





