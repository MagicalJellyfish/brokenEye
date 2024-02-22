import { CharacterTemplate } from "../../Characters/CharacterTemplate"
import { EffectTemplate } from "../../Effects/EffectTemplate"
import { Roll } from "../Roll"
import { TargetType } from "./TargetType"

export interface AbilityTemplate {
  id: number
  name: string
  description: string

  targetType?: TargetType

  canInjure: boolean
  self?: string
  target?: string
  damage?: string

  range?: string

  rollsIds: number[]
  rolls: Roll[]

  effectTemplatesIds: number[]
  effectTemplates: EffectTemplate[]

  characterTemplatesIds: number[]
  characterTemplates: CharacterTemplate[]
}