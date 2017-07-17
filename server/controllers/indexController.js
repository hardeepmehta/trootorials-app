module.exports = function( app, passport ) {
    app.get('/', function( req, res ) {

      res.render('main',
      {
        videos: [{
          name: 'Aashi1',
          size: '15MB'
        },{
          name: 'Aashi2',
          size: '15MB'
        },{
          name: 'Aashi3',
          size: '15MB'
        }]
      });
    });
};
