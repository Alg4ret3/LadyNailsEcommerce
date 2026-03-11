import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260311143428 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "shipping" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_deleted_at" ON "shipping" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "shipping" cascade;`);
  }

}
