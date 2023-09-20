import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2'
import UserManager from '../DAO/mongo/managers/users.js';
import { createHash, isValidPassword } from '../utils.js';

const localStrategy = local.Strategy
const userManager = new UserManager()

export const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;

            try {
                let user = await userManager.getUsersByEmail(username);
                if (user) {
                    console.log("User already exists");
                    return done(null, false, { message: 'User already exists' });
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }

                const checkUser = Object.values(newUser).every(property => property)
                if (!checkUser) return res.send({ status: 'error', message: 'User Incomplete' })

                const result = await userManager.createUser(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.use(
        'login',
        new localStrategy(
            { usernameField: 'email' },

            async (email, password, done) => {

                try {
                    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                        const user = {
                            first_name: 'admin',
                            last_name: 'coder',
                            email: 'adminCoder@coder.com',
                            role: 'admin'
                        }
                        return done(null, user);

                    }

                    const userDB = await userManager.validateUser(email)


                    if (!userDB) return done(null, false, { status: 'error', message: 'User not found, please try again or password not valid' })

                    if (!isValidPassword(userDB, password)) return done(null, false, { status: 'error', message: 'password not valid' })
                    delete userDB.password

                    const user = {
                        id: userDB._id,
                        first_name: userDB.first_name,
                        last_name: userDB.last_name,
                        email: userDB.email,
                        role: userDB.role
                    }

                    return done(null, user, { status: 'success', message: 'User log' })
                } catch (error) {
                    return done(error)
                }


            }
        )
    );

    passport.serializeUser((user, done) => {
        try {
            done(null, user.id)
        } catch (error) {
            if (error) return done(error)
        }
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userManager.getUsersById(id)
        done(null, user)
    })
}

export const initializePassportGitHub = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.713428912077cf21',
        clientSecret: 'b29d9be41be615a3907e70746a18ed7f084b5786',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'


    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            let emailGitHub = `${profile._json.login}@github.com`
            let user = await userManager.getUsersByEmail(emailGitHub);
            console.log(user);
            if (!user) {
                let userGitHub = {
                    first_name: profile._json.login,
                    last_name: profile._json.node_id,
                    email: emailGitHub,
                    age: 20,
                    password: ''
                }
                const result = await userManager.createUser(userGitHub);
                return done(null, result);
            }
            else {
                done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }
    ))

    passport.serializeUser((user, done) => {
        try {
            done(null, user.id)
        } catch (error) {
            if (error) return done(error)
        }
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userManager.getUsersById(id)
        done(null, user)
    })
}

export default {
    initializePassport,
    initializePassportGitHub
};