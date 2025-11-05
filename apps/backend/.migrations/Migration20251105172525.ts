import { Migration } from '@mikro-orm/migrations';

export class Migration20251105172525 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" text not null, "password" text not null, "name" text not null, "avatar_url" text null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`create index "user_email_index" on "user" ("email");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
