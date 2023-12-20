import BaseRouter from "./Router.js";
import { passportCall } from '../middleware/auth.js';


import sessionsController from "../controllers/sessions.controller.js";

export default class SessionsRouter extends BaseRouter {
    init() {
        this.get('/github', ['GITHUB'], passportCall('github', { strategyType: "github" }), (req, res) => { });

        this.get('/githubcallback', ['GITHUB'], passportCall('github', { strategyType: "github" }), sessionsController.gitHubCallBack)

        this.get('/current', ['AUTH', 'ADMIN'], passportCall('jwt', { strategyType: "locals" }), sessionsController.currentSession);
        
        this.get('/mail', ['AUTH', "USER"], passportCall('jwt', {strategyType: 'jwt'}), sessionsController.getMail) //USER
        
        this.post('/logout', ['USER', 'ADMIN'], sessionsController.postLogOut)

        this.post('/login', ['NO_AUTH', 'ADMIN'], passportCall('login', { strategyType: "locals" }), sessionsController.loginPost)

        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: "locals" }), sessionsController.registerPost)

        this.post('/restoreRequest', ['NO_AUTH'], passportCall('jwt', { strategyType: "jwt" }), sessionsController.restoreRequest)

        this.post('/restorePassword', ['PUBLIC'], passportCall('jwt', { strategyType: "jwt" }), sessionsController.restorePassword)

    }

}