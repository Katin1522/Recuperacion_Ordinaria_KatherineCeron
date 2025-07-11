import express from "express";
import estudiantesController from "../controllers/estudiantesController.js";

const router = express.Router();

router.route("/")
    .get(estudiantesController.getEstudiantes)
    .post(estudiantesController.createEstudiantes);

router.route("/:id")
    .get(estudiantesController.getEstudiantesById)  
    .delete(estudiantesController.deleteEstudiantes)
    .put(estudiantesController.updateEstudiantes);

export default router;