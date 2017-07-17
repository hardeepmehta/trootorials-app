module.exports = function( app, passport ) {
    app.get('/api/all-videos', AllVideos )
};

function AllVideos( req, res ) {
  res.send({
    error: false,
    data: [{
      hello: 123
    }]
  });
}
