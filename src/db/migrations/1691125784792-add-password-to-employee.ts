import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToEmployee1691125784792 implements MigrationInterface {
    name = 'AddPasswordToEmployee1691125784792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "password"`);
    }

}
