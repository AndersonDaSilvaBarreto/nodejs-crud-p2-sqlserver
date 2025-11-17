import * as UserController from "../controllers/userController.js";
import * as AuthController from "../controllers/authController.js";
import * as AircraftController from "../controllers/aircraftController.js";
import * as PassengerController from "../controllers/passengerController.js";
import * as FlightController from "../controllers/flightController.js";
import * as BoardingPassController from "../controllers/boardingPassController.js";
import * as ReportController from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const apiRouter = Router();

apiRouter.post("/login", AuthController.login);

apiRouter.post(
  "/sys_user",
  authMiddleware,
  adminMiddleware,
  UserController.create
);

apiRouter.put("/sys_user/:id", authMiddleware, UserController.update);

apiRouter.delete(
  "/sys_user/:id",
  authMiddleware,
  adminMiddleware,
  UserController.deleteUser
);

apiRouter.get(
  "/sys_user",
  authMiddleware,
  adminMiddleware,
  UserController.getAll
);

apiRouter.get(
  "/sys_user/:id",
  authMiddleware,
  adminMiddleware,
  UserController.getById
);

apiRouter.get("/aircraft", AircraftController.getAll);

apiRouter.get("/aircraft/:id", AircraftController.getById);

apiRouter.get("/passenger", PassengerController.getAll);
apiRouter.get("/passenger/:id", PassengerController.getById);

apiRouter.get("/flight", FlightController.getAll);
apiRouter.get("/flight/:id", FlightController.getById);

apiRouter.get("/boarding_pass", BoardingPassController.getAll);
apiRouter.get("/boarding_pass/:id", BoardingPassController.getById);

apiRouter.get("/report/full-join", ReportController.getFullReport);
export default apiRouter;
