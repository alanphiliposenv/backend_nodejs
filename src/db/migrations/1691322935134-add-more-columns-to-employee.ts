import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreColumnsToEmployee1691322935134 implements MigrationInterface {
    name = 'AddMoreColumnsToEmployee1691322935134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "joining_date" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "experience" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "experience"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "joining_date"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "email" character varying NOT NULL`);
    }

}
