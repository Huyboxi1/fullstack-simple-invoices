import {MigrationInterface, QueryRunner} from "typeorm";

export class InitiazeDatabase1782650035878 implements MigrationInterface {
    name = 'InitiazeDatabase1782650035878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "fullname" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "invoices_status_enum" AS ENUM('Draft', 'Pending', 'Paid')`);
        await queryRunner.query(`CREATE TABLE "invoices" ("invoiceId" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceNumber" character varying NOT NULL, "invoiceReference" character varying, "invoiceDate" date NOT NULL, "dueDate" date NOT NULL, "currency" character varying NOT NULL, "currency_symbol" character varying NOT NULL, "description" text, "status" "invoices_status_enum" NOT NULL DEFAULT 'Draft', "invoiceSubTotal" numeric(12,2) NOT NULL DEFAULT '0', "totalTax" numeric(12,2) NOT NULL DEFAULT '0', "totalDiscount" numeric(12,2) NOT NULL DEFAULT '0', "totalAmount" numeric(12,2) NOT NULL DEFAULT '0', "totalPaid" numeric(12,2) NOT NULL DEFAULT '0', "balanceAmount" numeric(12,2) NOT NULL DEFAULT '0', "customer_fullname" character varying NOT NULL, "customer_email" character varying NOT NULL, "customer_mobile_number" character varying, "customer_address" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, CONSTRAINT "UQ_bf8e0f9dd4558ef209ec111782d" UNIQUE ("invoiceNumber"), CONSTRAINT "PK_08f5378a442d3a5ef489d43eb3c" PRIMARY KEY ("invoiceId"))`);
        await queryRunner.query(`CREATE TABLE "invoice_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "quantity" integer NOT NULL, "rate" numeric(12,2) NOT NULL, "invoice_id" uuid, CONSTRAINT "PK_53b99f9e0e2945e69de1a12b75a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_39a202af5d1dd1744458820ecb5" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_dc991d555664682cfe892eea2c1" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("invoiceId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_dc991d555664682cfe892eea2c1"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_39a202af5d1dd1744458820ecb5"`);
        await queryRunner.query(`DROP TABLE "invoice_items"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TYPE "invoices_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
