import { Router } from 'express';
import multer from 'multer';

import FileController from './app/controllers/FileController';
import CompanyController from './app/controllers/CompanyController';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.json({ message: 'Hello word!!' });
});

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/companies', CompanyController.store);

export default routes;
