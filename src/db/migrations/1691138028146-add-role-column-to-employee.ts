import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumnToEmployee1691138028146 implements MigrationInterface {
    name = 'AddRoleColumnToEmployee1691138028146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD "role" character varying NOT NULL DEFAULT 'Developer'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "role"`);
    }

}
