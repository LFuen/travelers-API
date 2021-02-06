const express = require('express')
const path = require('path')
const xss = require('xss')
const GuideService = require('./guide-service')
const { requireAuth } = require('../middleware/jwt-auth')
const parse = express.json()

const guideRouter = express.Router()

const serializeGuide = (guide) => ({
    id: guide.id,
    guide_type: guide.guide_type,
    city: xss(guide.city),
    recommendation: xss(guide.recommendation),
    comments: xss(guide.comments)
})


guideRouter
  .route("/")
  .get(async (req, res, next) => {
    GuideService.getAllGuides(req.app.get("db"))
      .then(async (guides) => {
        if(guides.length !== 0) {
          return guides.map((guide, i) => ({
            id: guide.id,
            guide_type: guide.guide_type,
            city: xss(guide.city),
            recommendation: xss(guide.recommendation),
            comments: xss(guide.comments)
          }))
        }
      })
      .then((guides) => {return res.json(guides || [])
      })
      .catch(next);
  })
  .post(parse, requireAuth, (req, res, next) => {
    const { city, recommendation, comments } = req.body;
    const newGuide = { city, recommendation, comments };

    for (const [key, value] of Object.entries(newGuide)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in the request body.` },
        });
      }
    }

    newGuide = {
      city: xss(city), 
      recommendation: xss(recommendation), 
      comments: xss(comments)
    }

    GuideService.addGuide(req.app.get("db"), newGuide)
      .then((guide) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${guide.id}`))
          .json(serializeGuide(guide));
      })
      .catch(next);
  });

guideRouter
  .route("/:guide_id")
  .all(requireAuth)
  .all((req, res, next) => {
      GuideService.getById(req.app.get("db"), req.params.guide_id)
        .then((guide) => {
            if(!guide) {
                return res.status(400).json({
                    error: {message: `Sorry, you've been misGUIDEed!`}
                })
            }
            res.json(guide)
            next()
        })
        .catch(next)
  })
  .get((req, res, next) => {
      res.json(serializeGuide(res.guide))
  })
  .delete((req, res, next) => {
      GuideService.deleteGuide(req.app.get("db"), req.params.guide_id)
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
  })
  .patch(parse, (req, res, next) => {
    const {guide_type, city, recommendation, comments } = req.body;
    const guideUpdate = {guide_type, city, recommendation, comments } 

    const numVal = Objects.values(guideUpdate).filter(Boolean).length
        if(numVal === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain either 'guide_type', 'city', 'recommendation', or 'comments'`}
            })
        }

        GuideService.updateGuide(
            req.app.get("db"),
            req.params.guide_id,
            guideUpdate
        )
        .then((numRowsAffected) => {
            res.status(204).end()
        })
        .catch(next)
  })


  module.exports = guideRouter