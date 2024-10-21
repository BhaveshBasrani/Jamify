// models/TicketSetup.js
const mongoose = require('mongoose');

const ticketSetupSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    categories: { type: [String], required: true },
    prefix: { type: String, required: true },
    panelEmbedDescription: { type: String, required: true },
    managementPanelEmbedDescription: { type: String, required: true },
    emojis: { type: String, required: false },
    categoryId: { type: String, required: true},
    adminRoleId: { type: String, required: true}
});

const TicketSetup = mongoose.model('TicketSetup', ticketSetupSchema);

module.exports = TicketSetup;