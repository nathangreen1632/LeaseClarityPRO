'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('leases', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            filePath: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            originalFileName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('leases');
    },
};
