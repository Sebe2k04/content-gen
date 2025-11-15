import { Migration } from '@mikro-orm/migrations';

export class Migration20251115052504 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "auth";`);
    this.addSql(`create table "auth"."email_verification_otp" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" text not null, "otp" text not null, "is_used" boolean not null, "expires_at" timestamptz not null, constraint "email_verification_otp_pkey" primary key ("id"));`);

    this.addSql(`create table "auth"."login_otp" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" text not null, "otp" text not null, "is_used" boolean not null, "expires_at" timestamptz not null, constraint "login_otp_pkey" primary key ("id"));`);

    this.addSql(`alter table "auth"."login_otp" add constraint "login_otp_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "auth"."email_verification_otp" cascade;`);

    this.addSql(`drop table if exists "auth"."login_otp" cascade;`);

    this.addSql(`drop schema if exists "auth";`);
  }

}
