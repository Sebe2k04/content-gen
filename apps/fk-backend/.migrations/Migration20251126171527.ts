import { Migration } from '@mikro-orm/migrations';

export class Migration20251126171527 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "portfolio"."portfolio" drop constraint "portfolio_resume_id_foreign";`);

    this.addSql(`drop table if exists "portfolio"."resume" cascade;`);

    this.addSql(`alter table "portfolio"."portfolio" drop column "resume_id";`);

    this.addSql(`alter table "portfolio"."portfolio" add column "about" text null, add column "roles" text[] not null default '{}', add column "resume_url" text null;`);

    this.addSql(`alter table "portfolio"."project" rename column "demo_url" to "website_url";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "portfolio"."resume" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "portfolio_id" text not null, "filename" text not null, "media_type" text check ("media_type" in ('image', 'video', 'pdf', 'document')) not null, "url" text not null, "extracted_data" jsonb null, constraint "resume_pkey" primary key ("id"));`);

    this.addSql(`alter table "portfolio"."resume" add constraint "resume_portfolio_id_foreign" foreign key ("portfolio_id") references "portfolio"."portfolio" ("id") on update cascade;`);

    this.addSql(`alter table "portfolio"."portfolio" drop column "about", drop column "roles", drop column "resume_url";`);

    this.addSql(`alter table "portfolio"."portfolio" add column "resume_id" text null;`);
    this.addSql(`alter table "portfolio"."portfolio" add constraint "portfolio_resume_id_foreign" foreign key ("resume_id") references "portfolio"."resume" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "portfolio"."project" rename column "website_url" to "demo_url";`);
  }

}
