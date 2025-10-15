import { FindOperator } from "typeorm"
import { Request } from "express"
import { ParsedQs } from "qs"

import { IFilterSettings, ICountry, IDepartment, IMunicipality } from "."

export enum BranchPermEnum {
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
}

// Main branch model
export interface IBranch {
  idBranch?: number
  uuid: string
  name: string
  description?: string
  phoneNumber?: string
  email?: string
  address?: string
  vatEnabled?: boolean
  idCountry: number
  idDepartment: number
  idMunicipality: number
  country?: ICountry
  department?: IDepartment
  municipality?: IMunicipality
  dteActive?: boolean
  dteEnvironment?: "01" | "00" // 01: PRODUCTION, 00: TEST
  dteApiJwt?: string
  dteApiJwtDate?: Date
  dteSenderNit?: string
  dteSenderNrc?: string
  dteSenderEmail?: string
  dteSenderPhone?: string
  dteActivityCode?: string
  dteActivityDesc?: string
  dteSenderName?: string
  dteSenderTradeName?: string
  dteEstablishment?: "01" | "02" | "03" | "04" // 01: SUCURSAL, 02: CASA MATRIZ, 03: BODEGA, 04: PATIO
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

export interface IBranchResponse {
  idBranch?: number
  name?: string
  description?: string
  phoneNumber?: string
  email?: string
  address?: string
  idCountry?: number
  idDepartment?: number
  idMunicipality?: number
  vatEnabled?: boolean
  dte: {
    dteActive?: boolean
    dteEnvironment?: string
    dteSenderNit?: string
    dteSenderNrc?: string
    dteSenderEmail?: string
    dteSenderPhone?: string
    dteActivityCode?: string
    dteActivityDesc?: string
    dteSenderName?: string
    dteSenderTradeName?: string
    dteEstablishment?: string
  }
}

// Allow filter params from API
export interface IBranchFilters {
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
export interface IBranchQueryParams
  extends Omit<IBranchFilters, "name" | "description" | "phoneNumber" | "email"> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
  phoneNumber?: FindOperator<string> | string
  email?: FindOperator<string> | string
}

// Multi branches response interface
export interface IGetBranchesResponse {
  data: IBranchResponse[]
  total: number
  page: number
  totalPages: number
}

// Unique branch response
export interface IGetBranchByIdResponse {
  data: IBranchResponse | null
}

// Custom request to type branches get controllers
export interface IBranchGetCustomRequest extends Request {
  query: IBranchFilters & IFilterSettings & ParsedQs
}

type BranchDtefields =
  | "dteActive"
  | "dteEnvironment"
  | "dteApiJwt"
  | "dteApiJwtDate"
  | "dteSenderNit"
  | "dteSenderNrc"
  | "dteSenderEmail"
  | "dteSenderPhone"
  | "dteActivityCode"
  | "dteActivityDesc"
  | "dteSenderName"
  | "dteSenderTradeName"
  | "dteEstablishment"

export interface IBranchCommonBody extends Omit<IBranch, BranchDtefields> {
  dte: Pick<IBranch, BranchDtefields>
}

// Custom request to type branches create controllers
export interface IBranchCommonRequest extends Request {
  body: IBranchCommonBody & ParsedQs
}
