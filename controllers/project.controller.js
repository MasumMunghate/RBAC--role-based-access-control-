const catchAsync = require("../utils/catchAsync");
const db = require("../db/models");
const authuser = require("../db/models/user");
const AppError = require("../utils/appError");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.authuser.id;
  const newProject = await db.project.create({
    title: body.title,
    // isFeatured:body.isFeatured,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    productUrl: body.productUrl,
    category: body.category,
    tags: body.tags,
    createdBy: userId,
  });
  res.status(200).json({
    status: "success",
    message: newProject,
  });
});

const projectAll = catchAsync(async (req, res) => {
  const userId = req.authuser.id;
  const allUser = db.project.findAll({
    include: authuser,
    where: { createdBy: userId },
  });
  return res.json({
    status: "success",
    data: allUser,
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const projectId = req.params.id;
  const allUser = db.project.findByPk(projectId, { include: authuser });
  if (!allUser) {
    return next(new AppError("Invalid Project Id", 400));
  }
  return res.json({
    status: "success",
    data: allUser,
  });
});

const updateProject = catchAsync(async (req, res, next) => {
  const userId = req.authuser.id;
  const projectId = req.params.id;
  const result = await db.project.findOne({
    wheere: { id: projectId, createdBy: userId },
  }); // jo create kya vhi update krega
  if (!result) {
    return next(new AppError("Invalid Project id ", 400));
  }
  (result.tile = body.title),
    result.productImgebody.productImage,
    result.prcebody.price,
    result.shortDescriptonbody.shortDescription,
    result.descriptonbody.description,
    result.productrlbody.productUrl,
    result.categrybody.category,
    result.tgsbody.tags,
    result.createByuserId;
  const updateProject = await result.save();
  return res.json({
    status: "success",
    data: updateProject,
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const userId = req.authuser.id;
  const projectId = req.params.id;
  const result = await db.project.findOne({
    wheere: { id: projectId, createdBy: userId },
  }); // jo create kya vhi update krega
  if (!result) {
    return next(new AppError("Invalid Project id ", 400));
  }
  await result.destroy();
  return res.json({
    status: "success",
    message: "recode deleted successfully",
  });
});
module.exports = {
  createProject,
  projectAll,
  getProjectById,
  updateProject,
  deleteProject,
};
