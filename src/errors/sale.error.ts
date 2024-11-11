import ErrorFactory from './error.factory'

export const IDSaleNotFoundError = ErrorFactory('Sale not found', 'The Sale could not be found in the system. Make sure the idSale is correct.')
export const IDSaleCustomerNotFoundError = ErrorFactory('Customer not found', 'The Customer could not be found in the system. Make sure the idCustomer is correct.')
export const IDSaleBranchNotFoundError = ErrorFactory('Branch not found', 'The Branch could not be found in the system. Make sure the idBranch is correct.')
export const CreateSaleError = ErrorFactory('Sale creation failed', 'The sale could not be created.')
export const CreateSaleDetailError = ErrorFactory('Sale detail creation failed', 'The sale detail could not be created.')
export const GetSaleCreatedDetailError = ErrorFactory('Get sale created failed', 'The sale could not be found.')
export const SaleProductNotFoundError = ErrorFactory('Product(s) not found to create sale',
  'One or more products could not be found, and as a result, the sale could not be completed. Please check the product list and try again.')
export const CreateSaleMissingProductError = ErrorFactory('Missing products in sale',
  'One or more products could not be added. This may be because one or more products are no longer available or an error occurred. Please check the sale in history.')
