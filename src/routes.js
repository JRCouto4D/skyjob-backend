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
import UserLevel1Controller from './app/controllers/Companies/AccessLevel_1/UserController';
import UserLevel2Controller from './app/controllers/Companies/AccessLevel_2/UserController';
import UnitController from './app/controllers/Companies/AccessLevel_2/UnitController';
import CategoryController from './app/controllers/Companies/AccessLevel_2/CategoryController';
import ProviderController from './app/controllers/Companies/AccessLevel_2/ProviderController';
import ProductController from './app/controllers/Companies/AccessLevel_2/ProductController';
import CashController from './app/controllers/Companies/AccessLevel_2/CashController';
import CustomerController from './app/controllers/Companies/AccessLevel_2/CustomerController';
import StartInvoice from './app/controllers/Companies/AccessLevel_2/Invoices/Start_Invoice';
import Item_invoiceController from './app/controllers/Companies/AccessLevel_2/Invoices/Itens_Invoice/Item_invoiceControllers';
import IncludeInvoice from './app/controllers/Companies/AccessLevel_2/Invoices/IncludeInvoice';
import ReversedInvoice from './app/controllers/Companies/AccessLevel_2/Invoices/ReverseInvoice';
import ListInvoice from './app/controllers/Companies/AccessLevel_2/Invoices/ListInvoice';
import DeleteInvoice from './app/controllers/Companies/AccessLevel_2/Invoices/DeleteInvoice';
import Permission from './app/controllers/Permission';

/**
 * Controllers Point_sales
 */

import Start_point_sale from './app/controllers/Point_sales/Start_point_sale';
import Close_point_sale from './app/controllers/Point_sales/Close_point_sale';
import ReinforcementController from './app/controllers/Companies/AccessLevel_2/ReinforcementController';
import BleedController from './app/controllers/Companies/AccessLevel_2/BleedController';
import SearchPDV from './app/controllers/Point_sales/Search_point_sale';

import StartSale from './app/controllers/Sales/Start_sale';
import CompleteSale from './app/controllers/Sales/Complete_sale';
import AddItem from './app/controllers/Sales/Itens/AddItem';
import UpdateItem from './app/controllers/Sales/Itens/UpdateItem';
import RemoveItem from './app/controllers/Sales/Itens/RemoveItem';
import ItensList from './app/controllers/Sales/Itens/ItensList';
import ListSales from './app/controllers/Sales/List_sales';

import ReturnController from './app/controllers/Sales/ReturnController';
import ResetSale from './app/controllers/Sales/Reset_sales';
import SearchSale from './app/controllers/Sales/SearchSale';

/**
 * Controllers admin
 */

import SessionAdminController from './app/controllers/Admin/SessionAdminControllers';
import ContractController from './app/controllers/Admin/Contracts/ContractController';
import CompanyControllerAdmin from './app/controllers/Admin/CompanyControllerAdmin';
import StartContract from './app/controllers/Admin/Contracts/StartContract';
import CancelContract from './app/controllers/Admin/Contracts/CancelContract';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session/admin', SessionAdminController.store);
routes.post('/session/companies', SessionController.store);

routes.use(authMiddleware);

/**
 * Rotas autenticadas
 */

routes.post('/files', upload.single('file'), FileController.store);
routes.put('/companies', CompanyController.update);

/**
 * Rotas autenticadas com nível de acesso 2
 */

/**
 * Users
 */

routes.post('/users', UserLevel2Controller.store);
routes.put('/users/:user_id/update', UserLevel2Controller.update);
routes.delete('/users/:user_id/delete', UserLevel2Controller.delete);
routes.get('/users/company/:company_id', UserLevel2Controller.index);
routes.get('/users/company/:company_id/list', UserLevel2Controller.show);

/**
 * Companies/units
 */
routes.post('/company/:company_id/units', UnitController.store);
routes.put('/company/:company_id/units/:unit_id/update', UnitController.update);
routes.delete(
  '/company/:company_id/units/:unit_id/delete',
  UnitController.delete
);
routes.get('/company/:company_id/units', UnitController.index);

/**
 * Categories
 */

routes.post('/company/:company_id/categories', CategoryController.store);
routes.put(
  '/company/:company_id/categories/:category_id/update',
  CategoryController.update
);
routes.delete(
  '/company/:company_id/categories/:category_id/delete',
  CategoryController.delete
);
routes.get('/company/:company_id/categories', CategoryController.index);
routes.get('/company/:company_id/categories/list', CategoryController.show);

/**
 * Providers
 */

routes.post('/company/:company_id/providers', ProviderController.store);
routes.put(
  '/company/:company_id/providers/:provider_id/update',
  ProviderController.update
);
routes.delete(
  '/company/:company_id/providers/:provider_id/delete',
  ProviderController.delete
);
routes.get('/company/:company_id/providers', ProviderController.index);
routes.get('/company/:company_id/providers/list', ProviderController.show);

/**
 * Products
 */

routes.post('/company/:company_id/products', ProductController.store);
routes.put(
  '/company/:company_id/products/:product_id/update',
  ProductController.update
);
routes.delete(
  '/company/:company_id/products/:product_id/delete',
  ProductController.delete
);
routes.get('/company/:company_id/products', ProductController.index);
routes.get('/company/:company_id/products/list', ProductController.show);

/**
 * Invoices
 */

routes.post('/company/:company_id/invoices/start', StartInvoice.store);
routes.put('/invoice/:invoice_id/include', IncludeInvoice.update);
routes.put('/invoice/:invoice_id/reverse', ReversedInvoice.update);
routes.delete('/invoice/:invoice_id/delete', DeleteInvoice.delete);
routes.get('/company/:company_id/invoice/list', ListInvoice.index);
routes.get('/company/:company_id/invoice/filter', ListInvoice.show);

routes.post(
  '/addItem/invoice/:invoice_id/product/:product_id',
  Item_invoiceController.store
);
routes.put(
  '/invoice/:invoice_id/item/:item_id/update',
  Item_invoiceController.update
);
routes.delete(
  '/invoice/:invoice_id/item/:item_id/delete',
  Item_invoiceController.delete
);
routes.get('/invoice/:invoice_id/item/list', Item_invoiceController.show);

/**
 * Customers
 */

routes.post('/company/:company_id/customers', CustomerController.store);
routes.put(
  '/company/:company_id/customers/:customer_id',
  CustomerController.update
);
routes.delete(
  '/company/:company_id/customers/:customer_id',
  CustomerController.delete
);
routes.get('/company/:company_id/customers', CustomerController.index);
routes.get('/company/:company_id/customers/list', CustomerController.show);

/**
 * Cash_registers
 */

routes.post('/company/:company_id/cash_registers', CashController.store);
routes.put(
  '/company/:company_id/cash_registers/:cash_register_id/update',
  CashController.update
);
routes.delete(
  '/company/:company_id/cash_registers/:cash_register_id/delete',
  CashController.delete
);
routes.get('/company/:company_id/cash_registers', CashController.index);

/**
 * Rotas relacionadas ao point_sale
 */

routes.post('/point_sales/start', Start_point_sale.store);

routes.put('/point_sales/:point_sale_id/close', Close_point_sale.update);
routes.post('/point_sales/reinforcement', ReinforcementController.store);
routes.post('/point_sales/bleed', BleedController.store);
routes.get('/point_sales/:pdv_id', SearchPDV.index);

routes.post('/point_sales/:point_sale_id/sale/start', StartSale.store);
routes.put('/sale/:sale_id/complete', CompleteSale.update);
routes.post('/addItem/sale/:sale_id/product/:product_id', AddItem.store);
routes.put('/updateItem/:item_id', UpdateItem.update);
routes.delete('/removeItem/:item_id', RemoveItem.delete);
routes.get('/point_sales/:point_sale_id/sales', ListSales.index);
routes.get('/point_sales/:point_sale_id/sales-list', ListSales.show);

routes.post(
  '/point_sales/:point_sale_id/return/sales/:sale_id',
  ReturnController.store
);
routes.get('/company/:company_id/returns/list', ReturnController.index);
routes.delete(
  '/company/:company_id/point_sales/:point_sale_id',
  ResetSale.delete
);

routes.get('/search/sale/:sale_id', SearchSale.show);
routes.get('/sale/:sale_id/itens/list', ItensList.show);

/**
 * Rotas autenticadas com nível de acesso 1
 */

routes.put('/users/update', UserLevel1Controller.update);

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

routes.get('/search/users', Permission.index);
routes.get('/permission', Permission.show);

export default routes;
