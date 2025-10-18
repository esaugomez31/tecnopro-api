import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings, ICountry, IDepartment, IMunicipality } from "."

export enum BranchPermEnum {
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
}

// Main branch model
export interface IBranch {
  idBranch?: number
  uuid?: string | null
  name: string
  description?: string | null
  phoneNumber?: string | null
  email?: string | null
  address?: string | null
  vatEnabled?: boolean
  idCountry: number
  idDepartment: number
  idMunicipality: number
  country?: ICountry
  department?: IDepartment
  municipality?: IMunicipality
  dteActive?: boolean
  dteEnvironment?: "01" | "00"
  dteApiJwt?: string | null
  dteApiJwtDate?: Date | null
  dteSenderNit?: string | null
  dteSenderNrc?: string | null
  dteSenderEmail?: string | null
  dteSenderPhone?: string | null
  dteActivityCode?: string | null
  dteActivityDesc?: string | null
  dteSenderName?: string | null
  dteSenderTradeName?: string | null
  dteEstablishment?: "01" | "02" | "04" | "07"
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

export interface IBranchResponse {
  idBranch?: number
  name?: string
  description?: string | null
  phoneNumber?: string | null
  email?: string | null
  address?: string | null
  idCountry?: number
  idDepartment?: number
  idMunicipality?: number
  vatEnabled?: boolean
  dte: {
    dteActive?: boolean
    dteEnvironment?: string
    dteSenderNit?: string | null
    dteSenderNrc?: string | null
    dteSenderEmail?: string | null
    dteSenderPhone?: string | null
    dteActivityCode?: string | null
    dteActivityDesc?: string | null
    dteSenderName?: string | null
    dteSenderTradeName?: string | null
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
