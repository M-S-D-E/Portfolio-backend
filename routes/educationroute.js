import { Router } from "express";
import { addEducation,deleteEducation, getEducations, getEducation, updateEducation } from "../controllers/educationcontroller.js";

export const educationRouter = Router()

educationRouter.post('/education', addEducation)

educationRouter.get('/education',getEducations)

educationRouter.get('/education/:id',getEducation)

educationRouter.patch('/education/:id:educationStatus',updateEducation)

educationRouter.delete('/education/:id',deleteEducation)