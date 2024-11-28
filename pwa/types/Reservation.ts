import { Item } from './item'

export class Reservation implements Item {
  public '@id'?: string

  constructor (
    _id?: string,
    public seats?: any,
    public email?: string,
    public total?: string,
    public token?: string,
    public showing?: string
  ) {
    this['@id'] = _id
  }
}
