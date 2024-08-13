import { MigrationInterface, QueryRunner } from 'typeorm';

export class V11723512030883 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(
        //     `ALTER TABLE \`article\` ADD \`content1\` text NULL`,
        // );
        // await queryRunner.query(
        //     `ALTER TABLE article RENAME COLUMN content1 to content`,
        // );
        await queryRunner.renameColumn('article', 'content', 'content1');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('article', 'content1', 'content');
    }
}
