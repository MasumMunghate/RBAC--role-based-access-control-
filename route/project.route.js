const { authentication, restriTo } = require('../controllers/auth.controller');
const {createProject, projectAll, getProjectById, updateProject, deleteProject} = require('../controllers/project.controller');

const routes = require('express').Router();


routes.post('/',authentication,restriTo('1'),createProject)
routes.get('/',authentication,restriTo('1'),projectAll)
routes.get('/:id',authentication,restriTo('1'),getProjectById)
routes.patch('/:id',authentication,updateProject)
routes.delete('/:id',authentication,restriTo('1'),deleteProject)

module.exports = routes