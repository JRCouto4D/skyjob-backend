import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

/**
 * Middlewares
 */

import authMiddleware from './app/middlewares/auth';

/**
 * Controllers
 */

import SessionController from './app/controllers/SessionControllers';
import FileController from './app/controllers/FileController';
import CompanyController from './app/controllers/CompanyController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session/companies', SessionController.store);

routes.use(authMiddleware);

/**
 * Rotas autenticadas
 */

routes.post('/files', upload.single('file'), FileController.store);
routes.post('/companies', CompanyController.store);
routes.put('/companies', CompanyController.update);

export default routes;
