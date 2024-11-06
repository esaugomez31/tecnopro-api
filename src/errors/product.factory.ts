import ErrorFactory from './error.factory'

export const IDProductNotFoundError = ErrorFactory('Product not found', 'The Product could not be found in the system. Make sure the idProduct is correct.')
export const IDProdBrandNotFoundError = ErrorFactory('Brand not found', 'The Brand could not be found in the system. Make sure the idBrand is correct.')
export const IDProdCategoryNotFoundError = ErrorFactory('Category not found', 'The Category could not be found in the system. Make sure the idCategory is correct.')
export const IDProdBranchNotFoundError = ErrorFactory('Branch not found', 'The Branch could not be found in the system. Make sure the idBranch is correct.')
export const IDProdUserNotFoundError = ErrorFactory('User not found', 'The User could not be found in the system. Make sure the idUser is correct.')
export const ProdUpdatePriceError = ErrorFactory('You do not have permission to update price', 'Your user does not have permissions to update price')
export const ProdUpdatePurchaseDataError = ErrorFactory('You do not have permission to update purchase data', 'Your user does not have permissions to update purchasePrice or purchasedBy')
export const ProdUpdateCommissionsError = ErrorFactory('You do not have permission to update commissions', 'Your user does not have permissions to update userCommissionPercent or branchCommissionPercent')
export const ProdUpdateStockError = ErrorFactory('You do not have permission to update stock', 'Your user does not have permissions to update stock')
