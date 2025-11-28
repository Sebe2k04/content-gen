import { Migration } from '@mikro-orm/migrations';

export class Migration20251119015327 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "portfolio";`);
    this.addSql(`create table "portfolio"."theme" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "key" text not null, "display_name" text not null, "settings" jsonb null, constraint "theme_pkey" primary key ("id"));`);

    this.addSql(`create table "portfolio"."portfolio" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" text not null, "name" text not null, "headline" text null, "bio" text null, "avatar_url" text null, "resume_id" text null, "theme_id" text null, constraint "portfolio_pkey" primary key ("id"));`);

    this.addSql(`create table "portfolio"."skill" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "portfolio_id" text not null, "name" text not null, "level" text check ("level" in ('beginner', 'intermediate', 'advanced', 'expert')) not null, "tags" jsonb null, constraint "skill_pkey" primary key ("id"));`);

    this.addSql(`create table "portfolio"."resume" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "portfolio_id" text not null, "filename" text not null, "media_type" text check ("media_type" in ('image', 'video', 'pdf', 'document')) not null, "url" text not null, "extracted_data" jsonb null, constraint "resume_pkey" primary key ("id"));`);

    this.addSql(`create table "portfolio"."project" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "portfolio_id" text not null, "title" text not null, "description" text null, "repo_url" text null, "demo_url" text null, "technologies" text[] not null, "highlight" text null, constraint "project_pkey" primary key ("id"));`);

    this.addSql(`create table "portfolio"."integration" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "portfolio_id" text not null, "provider" text check ("provider" in ('github', 'gitlab', 'linkedin', 'medium', 'devto', 'dribbble', 'behance', 'leetcode', 'hackerrank', 'codeforces', 'codepen', 'stackoverflow', 'youtube', 'hashnode', 'twitter')) not null, "profile_url" text not null, "username" text null, "meta" jsonb null, "encrypted_credentials" text null, constraint "integration_pkey" primary key ("id"));`);

    this.addSql(`alter table "portfolio"."portfolio" add constraint "portfolio_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "portfolio"."portfolio" add constraint "portfolio_resume_id_foreign" foreign key ("resume_id") references "portfolio"."resume" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "portfolio"."portfolio" add constraint "portfolio_theme_id_foreign" foreign key ("theme_id") references "portfolio"."theme" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "portfolio"."skill" add constraint "skill_portfolio_id_foreign" foreign key ("portfolio_id") references "portfolio"."portfolio" ("id") on update cascade;`);

    this.addSql(`alter table "portfolio"."resume" add constraint "resume_portfolio_id_foreign" foreign key ("portfolio_id") references "portfolio"."portfolio" ("id") on update cascade;`);

    this.addSql(`alter table "portfolio"."project" add constraint "project_portfolio_id_foreign" foreign key ("portfolio_id") references "portfolio"."portfolio" ("id") on update cascade;`);

    this.addSql(`alter table "portfolio"."integration" add constraint "integration_portfolio_id_foreign" foreign key ("portfolio_id") references "portfolio"."portfolio" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "portfolio"."portfolio" drop constraint "portfolio_theme_id_foreign";`);

    this.addSql(`alter table "portfolio"."skill" drop constraint "skill_portfolio_id_foreign";`);

    this.addSql(`alter table "portfolio"."resume" drop constraint "resume_portfolio_id_foreign";`);

    this.addSql(`alter table "portfolio"."project" drop constraint "project_portfolio_id_foreign";`);

    this.addSql(`alter table "portfolio"."integration" drop constraint "integration_portfolio_id_foreign";`);

    this.addSql(`alter table "portfolio"."portfolio" drop constraint "portfolio_resume_id_foreign";`);

    this.addSql(`drop table if exists "portfolio"."theme" cascade;`);

    this.addSql(`drop table if exists "portfolio"."portfolio" cascade;`);

    this.addSql(`drop table if exists "portfolio"."skill" cascade;`);

    this.addSql(`drop table if exists "portfolio"."resume" cascade;`);

    this.addSql(`drop table if exists "portfolio"."project" cascade;`);

    this.addSql(`drop table if exists "portfolio"."integration" cascade;`);

    this.addSql(`drop schema if exists "portfolio";`);
  }

}
