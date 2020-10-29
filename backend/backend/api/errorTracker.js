/**
 *
 * Copyright HackerBay, Inc.
 *
 */

const express = require('express');

const router = express.Router();
const getUser = require('../middlewares/user').getUser;
const { isAuthorized } = require('../middlewares/authorization');
const isUserAdmin = require('../middlewares/project').isUserAdmin;

const sendErrorResponse = require('../middlewares/response').sendErrorResponse;
const sendItemResponse = require('../middlewares/response').sendItemResponse;

const UserService = require('../services/userService');
const ComponentService = require('../services/componentService');
const NotificationService = require('../services/notificationService');
const RealTimeService = require('../services/realTimeService');
const ErrorTrackerService = require('../services/errorTrackerService');
// Route
// Description: Adding a new error tracker to a component.
// Params:
// Param 1: req.params-> {componentId}; req.body -> {[_id], name}
// Returns: response status, error message
router.post(
    '/:projectId/:componentId/create',
    getUser,
    isAuthorized,
    isUserAdmin,
    async function(req, res) {
        try {
            const data = req.body;
            const componentId = req.params.componentId;
            if (!data) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: "values can't be null",
                });
            }
            data.createdById = req.user ? req.user.id : null;
            if (!data.name) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Error Tracker Name is required.',
                });
            }
            if (
                data.resourceCategory &&
                typeof data.resourceCategory !== 'string'
            ) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Resource Category ID is not of string type.',
                });
            }

            data.componentId = componentId;

            const errorTracker = await ErrorTrackerService.create(data);
            const component = await ComponentService.findOneBy({
                _id: componentId,
            });

            const user = await UserService.findOneBy({ _id: req.user.id });

            await NotificationService.create(
                component.projectId._id,
                `A New Error Tracker was Created with name ${errorTracker.name} by ${user.name}`,
                user._id,
                'errortrackeraddremove'
            );
            await RealTimeService.sendErrorTrackerCreated(errorTracker);
            return sendItemResponse(req, res, errorTracker);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);
module.exports = router;
