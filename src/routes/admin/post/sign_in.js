const { Router } = require("express");
const router = Router();
const { redisClient, cachedSessions } = require("../../../session.js");
const { verify } = require("argon2");
const { randomBytes } = require("crypto");
const { sign_in_not_found, not_found, custom_error } = require("../../../errors.js");
const { Admin, User } = require("../../../db.js");

const createSessionID = () => {
  return randomBytes( 45 ).toString( 'base64' );
};

router.post("/admin/sign_in",
  async( req, res, next )=>{
    try{
      const admin = await Admin.findOne({
        where:{
          email:req.body.email,
        },
        raw:true
      });
      if(admin){
        const match = await verify("$argon2i$v=19$m=65536,t=3,p=4$"+admin.password, req.body.password);
        if(match){
          let sid = createSessionID();
          const sessionData = {
            cookie:{
              expires: ( Date.now() + 72000000 ),// 2hs (in ms) starting from log in time
            },
            user:{
              id:admin.id,
              email:admin.email,
            },
            csrf_token:'token'
          };
          let existingSession = await redisClient.get( sid );
          while( existingSession ){
            sid = createSessionID();
            existingSession = await redisClient.get( sid );
          };
          if( admin.super_admin ) sessionData.user.super_admin = true;
          redisClient.set( req.cookies.sid, JSON.stringify(sessionData), 'EX', 72000, ( err ) => {
            if ( err ) {
              next( err );
            };
          } );
          cachedSessions().set( sid, JSON.stringify( sessionData ) );
          res.cookie(
            "sid", sid,
            {
              // maxAge: 900000,
              httpOnly: true,
              secure: true
            }
          );
          res.setHeader('X-Csrf-Token', sessionData.user.csrf_token);
          res.setHeader('Access-Control-Expose-Headers', 'X-Csrf-Token');
          delete admin.password;
          delete admin.reset_token;
          res.json( admin );
        }else{
          res.status(404).json( sign_in_not_found("administrator") );
        };
      }else{
        res.status(404).json( not_found( "Administrator" ) );
      };
    }catch(err){
      next( err );
    };
  }
);

// router.get( "/test",
//   async( req, res, next ) => {
//     try {
//       const key1 = await redisClient.get("fhueGBTd2JuJiKHgTmB39j7rJqLD5yxZ");
//       console.log( key1 );
//       res.json( { value: JSON.parse( key1 ) } );
//     } catch (err) {
//       next( err );
//     } finally {
//       redisClient.quit();
//     };
//   }
// );

module.exports = router;