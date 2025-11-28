import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";

@Entity({schema:"portfolio"})
export class Theme extends BaseEntity {
  @Property({})
  key: string;

  @Property({})
  displayName: string;

  @Property({
    type: "json",
    nullable: true,
  })
  settings: Record<string, any> | null;

  constructor({
    key,
    displayName,
    settings,
  }: {
    key: string;
    displayName: string;
    settings?: Record<string, any> | null;
  }) {
    super();
    this.key = key;
    this.displayName = displayName;
    this.settings = settings || null;
  }
}
