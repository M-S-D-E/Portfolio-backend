import { Router } from "express";
import { addEducation,deleteEducation, getAllEducation, getEducation, updateEducation } from "../controllers/educationcontroller.js";

export const educationRouter = Router()

educationRouter.post('/education',addEducation)

educationRouter.get('/education',getAllEducation)

educationRouter.get('/education/:id',getEducation)

educationRouter.patch('/education/:educationId', updateEducation);

educationRouter.delete('/education/:educationId', deleteEducation);
