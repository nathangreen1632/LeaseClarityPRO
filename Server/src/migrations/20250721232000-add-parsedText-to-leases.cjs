'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Leases', 'parsedText', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Leases', 'parsedText');
    },
};
