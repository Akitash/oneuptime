process.env.PORT = 3020;
const expect = require('chai').expect;
const userData = require('./data/user');
const chai = require('chai');
chai.use(require('chai-http'));

const request = chai.request.agent(app);
const UserService = require('../backend/services/userService');
const ProjectService = require('../backend/services/projectService');
const app = require('../server');

// eslint-disable-next-line
let token, projectId, anotherUser, log = obj => console.log(obj);

describe('Slack API', function() {
    this.timeout(20000);

    before(function(done) {
        this.timeout(30000);
        GlobalConfig.initTestConfig().then(function() {
            request
                .post('/user/signup')
                .send(userData.user)
                .end(function(err, res) {
                    projectId = res.body.projectId;
                    request
                        .post('/user/login')
                        .send({
                            email: userData.user.email,
                            password: userData.user.password,
                        })
                        .end(function(err, res) {
                            token = res.body.tokens.jwtAccessToken;
                            done();
                        });
                });
        });
    });

    after(async function() {
        await GlobalConfig.removeTestConfig();
        await ProjectService.deleteProject(projectId);
        await UserService.removeUserByEmail([
            userData.user.email,
            'noreply@fyipe.com',
        ]);
    });

    // 'post /slack/:projectId/monitor'
    it('The purchase', function(done) {
        request
            .get(`/team/${projectId}/team`)
            .send({
                name: 'New Schedule',
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('The purchase', function(done) {
        const authorization = `Basic ${token}`;
        request
            .get(`/slack/${projectId}/:teamId`)
            .set('Authorization', authorization)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});