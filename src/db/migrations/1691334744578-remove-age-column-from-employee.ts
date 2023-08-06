import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAgeColumnFromEmployee1691334744578 implements MigrationInterface {
    name = 'RemoveAgeColumnFromEmployee1691334744578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "role" SET DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "role" SET DEFAULT 'Developer'`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "age" integer`);
    }

}
