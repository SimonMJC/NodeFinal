const express = require('express');
var mysql = require('mysql')
var db = mysql.createConnection({
    host: 'localhost',
    port: 8001,
    users: 'root',
    password: 'root',
    database: 'nodejs'
});

db.connect();




// db.end();
// const passport = require('passport');
const bcrypt = require('bcrypt');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
// const User = require('../models/user');

const router = express.Router();

router.post('/join', async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        let sql1 = 'SELECT * from users where email=?;'
        db.query(sql1, [email], function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            if (results[0]) {
                return res.send('이미 존재하는 사용자입니다.');
            } else {
                let sql2 = 'INSERT INTO user (userid, password, name) values (?,?,?);'
                db.query(sql2, [email, nick, password], function (error, results, fields) {
                    if (error) throw error;
                    console.log('Insert result is:', results.affectedRows);
                });
                db.commit();
                return res.redirect('/');
            }
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    try {
        let sql1 = 'SELECT * from users where email=? and password=?;'
        db.query(sql1, [email, password], function (error, results, fields) {
            if (error) throw error;
            console.log('Users are: ', results);
            if (results[0]) {
                return res.send('로그인 성공');
            } else {
                return res.send('회원 정보가 없거나 암호가 틀렸습니다.');
            }
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// })

//         if (!user) {
//             return res.redirect(`/?loginError=${info.message}`);
//         }
//         return req.login(user, (loginError) => {
//             if (loginError) {
//                 console.error(loginError);
//                 return next(loginError);
//             }
//             return res.redirect('/');
//         });
//     })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
// });

// router.get('/logout', (req, res) => {
//     req.logout();
//     req.session.destroy();
//     res.redirect('/');
// });

// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/kakao/callback', passport.authenticate('kakao', {
//     failureRedirect: '/',
// }), (req, res) => {
//     res.redirect('/');
// });

module.exports = router;