
const GuideService = {
    getAllGuides(knex) {
        return knex.select("*").from("guide")
    },

    addGuide(knex, newGuide) {
        return knex
            .insert(newGuide)
            .into("guide")
            .returning("*")
            .then((rows) => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from("guide")
            .select("*")
            .where("id", id)
            .first()
    },

    deleteGuide(knex, id) {
        return knex("guide")
            .where({id}).delete()
    },

    updateGuide(knex, id) {
        return knex("guide")
            .where({id})
            .update(newGuideFields)
    }
}

module.exports = GuideService