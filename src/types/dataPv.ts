export interface DataPv {
  pvId: null | number
  pvName: string
  pvWp: null | number
  pvVmp: null | number
  pvImp: null | number
  pvVoc: null | number
  pvIk: null | number
  pvInUse: boolean
}

export type SortKey = keyof DataPv
