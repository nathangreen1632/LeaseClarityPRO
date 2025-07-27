'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('otp_requests', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            hashed_otp: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('otp_requests');
    },
};
