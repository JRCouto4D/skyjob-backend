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

/**
 * Controllers admin
 */

import ContractController from './app/controllers/Admin/Contracts/ContractController';
import CompanyControllerAdmin from './app/controllers/Admin/CompanyControllerAdmin';
import StartContract from './app/controllers/Admin/Contracts/StartContract';
import CancelContract from './app/controllers/Admin/Contracts/CancelContract';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session/companies', SessionController.store);

routes.use(authMiddleware);

/**
 * Rotas autenticadas
 */

routes.post('/files', upload.single('file'), FileController.store);
routes.put('/companies', CompanyController.update);

/**
 * Rotas autenticadas de nível admin
 */

routes.post('/skyjob/companies', CompanyControllerAdmin.store);
routes.put('/skyjob/companies/:company_id', CompanyControllerAdmin.update);
routes.delete('/skyjob/companies/:company_id', CompanyControllerAdmin.delete);
routes.get('/skyjob/companies', CompanyControllerAdmin.index);

routes.post('/skyjob/contracts/start', StartContract.store);
routes.put('/skyjob/contracts/:contract_id/cancel', CancelContract.update);
routes.delete(
  '/skyjob/contracts/:contract_id/delete',
  ContractController.delete
);
routes.get('/skyjob/contracts/list', ContractController.index);

export default routes;
