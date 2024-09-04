export interface DataMppt {
  mpptId: number
  mpptMinU: number
  mpptMaxU: number
  mpptI: number
  mpptP: number
  pvs?: []
}

export interface DataWr {
  wrId?: number | null
  wrName: string
  wrNameShort: string
  wrMinU: number | null
  wrMaxU: number | null
  wrI: number | null
  wrP: number | null
  wrMppts: number | null
  wrInUse: boolean
  mppts: DataMppt[]
}

export type SortKey = keyof DataWr
