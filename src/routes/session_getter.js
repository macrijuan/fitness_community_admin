const { Router } = require("express");
const router = Router();
const { redisClient, cachedSessions } = require("../session.js");
const { no_session, custom_error } = require("../errors.js");

router.use(
  async( req, res, next ) => {
    try{
      if( req.cookies.sid ){
        const cachedSession = cachedSessions().get( req.cookies.sid );
        console.log( "cachedSession:" );
        console.log( cachedSession );
        if( cachedSession ){
          req.session = cachedSession;
        }else{
          const redisSession = await redisClient.get( req.cookies.sid );
          req.session = JSON.parse( redisSession );
        };
        if( !req.session ) return res.json( no_session );
        if( req.session.expires > Date.now() ){
          cachedSessions().set( req.cookies.sid, req.session );
          next();
        }else if( !req.session.expires ){
          res.status( 500 ).json( custom_error( "session_err", ["There was an error with the session data. In case the error persists, we'd appreciate you contact the software team."] ) );
        }else{
          console.log( "SESSION HAS EXPIRED" );
          await redisClient.del( req.cookies.sid );
          cachedSessions().delete( req.cookies.sid );
          res.json( no_session );
        };
      }else{
        console.log( "NO SESSION COOKIE RECIVED" );
        res.status( 500 ).json( custom_error( "session_err", ["There was an error with the session data. In case the error persists, we'd appreciate you contact the software team."] ) );
      };
    }catch(err){
      next( err );
    };
  }
);

module.exports = router;