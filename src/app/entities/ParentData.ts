export class ParentData {
  constructor(parentType: ParentType, parentRoute: string, parentId: number, editDialog: boolean = false) {
    this.parentType = parentType
    this.parentRoute = parentRoute
    this.parentId = parentId
    this.editDialog = editDialog
  }

  parentType: ParentType
  parentRoute: string
  parentId: number
  editDialog: boolean
}

export enum ParentType {
  Modifier,
  Counter,
}