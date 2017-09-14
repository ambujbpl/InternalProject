
var express      = require('express');
var router       = express.Router();
var leavesobj    = require('../projects/leaves.js');
var attendanceobj    = require('../projects/attendance.js');
var validate = require('../validator');
var notify = require('../projects/notifications.js');

//router.use(validate);
router.post('/getEmailLists',leavesobj.getEmailLists);
router.post('/sendemail',leavesobj.sendemail);
router.post('/leaveStatus',leavesobj.leaveStatus);
router.post('/changeleaveStatus',leavesobj.changeleaveStatus);
router.post('/receiveEmail',leavesobj.receiveEmail);
router.get('/csv',attendanceobj.csv);
router.post('/attendance',attendanceobj.attendance);
router.post('/empAttendance',attendanceobj.empAttendance);
router.post('/empAttendanceStats',attendanceobj.empAttendanceStats);
router.post('/avgAttendance',attendanceobj.avgAttendance);
router.post('/uploadFile',attendanceobj.uploadFile);
router.post('/downloads',attendanceobj.downloads);
router.post('/editTime',attendanceobj.editTime);
router.post('/holidays',notify.holidays);
router.post('/b_days',notify.b_days);


module.exports = router;
