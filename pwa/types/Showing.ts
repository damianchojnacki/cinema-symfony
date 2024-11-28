import { Item } from './item'

export class Showing implements Item {
  public '@id'?: string

  constructor (
    _id?: string,
    public id?: number,
    public starts_at?: Date,
    public rows?: number,
    public columns?: number,
    public movie?: string,
    public reservations?: any,
    public seats_taken?: any
  ) {
    this['@id'] = _id
  }
}
