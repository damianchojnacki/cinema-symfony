import { Item } from "./item";

export class Movie implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public id?: string,
    public title?: string,
    public description?: string,
    public release_date?: Date,
    public rating?: string,
    public poster_url?: string,
    public backdrop_url?: string,
  ) {
    this["@id"] = _id;
  }
}
