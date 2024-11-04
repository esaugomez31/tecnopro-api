import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { BranchModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
import { OrmOperationAttributes } from './orm.interfaces'

export enum BranchPermEnum {
  CREATE = 'create',
  UPDATE = 'update',
  UPDATESTATUS = 'update_status',
}

// Allow filter params from API
export interface iBranchFilters {
  name?: string
  uuid?: string
  description?: string
  phoneNumber?: string
  email?: string
  idCountry?: number
  idDepartment?: number
  idMunicipality?: number
  status?: boolean
}

// Filter options to branch in typeorm
export interface iBranchQueryParams extends Omit<iBranchFilters, 'name' | 'description' | 'phoneNumber' | 'email'> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
  phoneNumber?: FindOperator<string> | string
  email?: FindOperator<string> | string
}

// Multi branches response interface
export interface iGetBranchesResponse {
  data: BranchModel[]
  total: number
  page: number
  totalPages: number
}

// Unique branch response
export interface iGetBranchByIdResponse {
  data: BranchModel | {}
}

// Custom request to type branches get controllers
export interface iBranchGetCustomRequest extends Request {
  query: iBranchFilters & iFilterSettings & ParsedQs
}

// type branchDtefields = 'dteActive' |
// 'dteEnvironment' |
// 'dteApiJwt' |
// 'dteApiJwtDate' |
// 'dteSenderNit' |
// 'dteSenderNrc' |
// 'dteSenderEmail' |
// 'dteSenderPhone' |
// 'dteActivityCode' |
// 'dteActivityDesc' |
// 'dteSenderName' |
// 'dteSenderTradeName' |
// 'dteEstablishment'

// interface iBranchCommonBody extends Omit<BranchModel, OrmOperationAttributes | branchDtefields> {
//   dte: Pick<BranchModel, branchDtefields>
// }

// Custom request to type branches create controllers
export interface iBranchCommonRequest extends Request {
  body: Omit<BranchModel, OrmOperationAttributes> & ParsedQs
}
